#!/usr/bin/env node
/**
 * import-csv-stops.js
 * ─────────────────────────────────────────────────────────────────────────
 * Imports stops from a CSV file into the transit_stops table.
 *
 * Usage:
 *   node scripts/import-csv-stops.js [path/to/stops.csv] [--dry-run] [--location-type=N]
 *
 * Supported CSV formats:
 *   - bus_stops.csv: name, latitude, longitude (or longidude)
 *   - metro_stations.csv: _id, Label_fr, Label_ar, Longitude, Latitude
 *
 * Behaviour:
 *   - Deduplicates rows by exact (lat, lng) so the same physical stop only
 *     gets one DB record even though it appears on multiple route segments.
 *   - Uses a deterministic ID (csv-<md5 of coords>) so re-running the script
 *     is safe (it upserts, never duplicates).
 *   - Inserts in batches of 200 for speed.
 */

require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');
const { initDatabase, sequelize } = require('../src/config/database');

// ── Config ─────────────────────────────────────────────────────────────────

const DEFAULT_CSV = path.resolve(__dirname, '../../bus_stops.csv');
const DRY_RUN     = process.argv.includes('--dry-run');
const CSV_PATH    = process.argv.find(a => a.endsWith('.csv')) || DEFAULT_CSV;
const BATCH_SIZE  = 200;
const LOCATION_TYPE = Number.parseInt(
  (process.argv.find(a => a.startsWith('--location-type=')) || '').split('=')[1] || '0',
  10
);

// ── CSV parser (no external dependencies) ──────────────────────────────────

function parseCsv(content) {
  const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  if (!lines.length) return [];

  const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace('longidude', 'longitude'));
  const nameIdx = header.indexOf('name');
  const labelFrIdx = header.indexOf('label_fr');
  const labelArIdx = header.indexOf('label_ar');
  const idIdx = header.indexOf('_id');
  const genericIdIdx = header.indexOf('id');
  const latIdx  = header.indexOf('latitude');
  const lngIdx  = header.indexOf('longitude');

  const resolvedNameIdx = nameIdx >= 0 ? nameIdx : labelFrIdx;
  if (resolvedNameIdx < 0 || latIdx < 0 || lngIdx < 0) {
    throw new Error(`CSV header must contain name/Label_fr, latitude/Latitude, longitude/Longitude. Got: ${lines[0]}`);
  }

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle quoted fields (e.g. "ECOLE PRIMAIRE 6,1")
    const cols = [];
    let cur = '', inQuote = false;
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === ',' && !inQuote) { cols.push(cur); cur = ''; }
      else { cur += ch; }
    }
    cols.push(cur);

    const rawName = (cols[resolvedNameIdx] || '').trim();
    const rawDescription = labelArIdx >= 0 ? (cols[labelArIdx] || '').trim() : '';
    const rawId = idIdx >= 0 ? (cols[idIdx] || '').trim() : (genericIdIdx >= 0 ? (cols[genericIdIdx] || '').trim() : '');
    const lat  = parseFloat((cols[latIdx] || '').replace(',', '.'));
    const lng  = parseFloat((cols[lngIdx] || '').replace(',', '.'));

    if (!rawName || isNaN(lat) || isNaN(lng)) continue;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) continue;

    records.push({
      id: rawId,
      name: rawName,
      description: rawDescription || null,
      lat,
      lng,
      location_type: Number.isNaN(LOCATION_TYPE) ? 0 : LOCATION_TYPE,
    });
  }
  return records;
}

// ── Deduplication ───────────────────────────────────────────────────────────

function deduplicateStops(records) {
  const seen = new Map();
  for (const r of records) {
    const key = r.id ? `id:${r.id}` : `${r.lat.toFixed(7)},${r.lng.toFixed(7)}`;
    if (!seen.has(key)) {
      const id = r.id
        ? `csv-${String(r.id).toLowerCase().replace(/[^a-z0-9_-]+/g, '-')}`
        : 'csv-' + crypto.createHash('md5').update(key).digest('hex').slice(0, 12);
      seen.set(key, {
        id,
        name: r.name.slice(0, 255),
        description: r.description ? r.description.slice(0, 500) : null,
        lat: r.lat,
        lng: r.lng,
        location_type: r.location_type,
      });
    }
  }
  return Array.from(seen.values());
}

// ── DB upsert ───────────────────────────────────────────────────────────────

async function ensureTable() {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS transit_stops (
      id                  VARCHAR(50)  PRIMARY KEY,
      name                VARCHAR(255) NOT NULL,
      description         TEXT,
      location            geometry(Point, 4326) NOT NULL,
      location_type       INTEGER DEFAULT 0,
      parent_station_id   VARCHAR(50),
      wheelchair_boarding INTEGER DEFAULT 0,
      platform_code       VARCHAR(20),
      timezone            VARCHAR(50)
    );
    CREATE INDEX IF NOT EXISTS transit_stops_location_gist ON transit_stops USING GIST (location);
    CREATE INDEX IF NOT EXISTS transit_stops_name_idx      ON transit_stops (name);
  `);
}

async function upsertBatch(stops) {
  const placeholders = [];
  const values       = [];
  let   p            = 1;

  for (const s of stops) {
    placeholders.push(`($${p++}, $${p++}, $${p++}, ST_SetSRID(ST_MakePoint($${p++}, $${p++}), 4326), $${p++}, 0)`);
    values.push(s.id, s.name, s.description, s.lng, s.lat, s.location_type);
  }

  await sequelize.query(
    `INSERT INTO transit_stops (id, name, description, location, location_type, wheelchair_boarding)
     VALUES ${placeholders.join(', ')}
     ON CONFLICT (id) DO UPDATE SET
       name          = EXCLUDED.name,
       description   = EXCLUDED.description,
       location      = EXCLUDED.location,
       location_type = EXCLUDED.location_type`,
    { bind: values }
  );
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚌  CSV Bus Stop Importer`);
  console.log(`   File  : ${CSV_PATH}`);
  console.log(`   Mode  : ${DRY_RUN ? 'DRY RUN (no DB writes)' : 'LIVE'}\n`);

  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌  File not found: ${CSV_PATH}`);
    console.error(`    Place bus_stops.csv in the project root or pass the path as an argument.`);
    process.exit(1);
  }

  // 1. Parse
  console.log('📂  Reading CSV…');
  const content = fs.readFileSync(CSV_PATH, 'utf-8');
  const raw     = parseCsv(content);
  console.log(`    ${raw.length} raw rows read`);

  // 2. Deduplicate
  const stops = deduplicateStops(raw);
  console.log(`    ${stops.length} unique stops after deduplication\n`);

  // 3. Preview
  console.log('📍  Sample stops (first 5):');
  stops.slice(0, 5).forEach(s =>
    console.log(`    [${s.id}] ${s.name.padEnd(45)} lat=${s.lat.toFixed(4)}, lng=${s.lng.toFixed(4)}`)
  );
  console.log('    …\n');

  if (DRY_RUN) {
    console.log('✅  Dry run complete — no data written.');
    return;
  }

  // 4. Connect + insert
  console.log('💾  Connecting to database…');
  await initDatabase();
  await ensureTable();

  let total   = 0;
  const count = stops.length;

  for (let i = 0; i < count; i += BATCH_SIZE) {
    const batch   = stops.slice(i, i + BATCH_SIZE);
    await upsertBatch(batch);
    total += batch.length;
    process.stdout.write(`\r    Inserted/updated: ${total} / ${count}`);
  }

  console.log(`\n\n✅  Done! ${total} stops are now in transit_stops.\n`);
  await sequelize.close();
}

main().catch(err => {
  console.error('\n❌  Import failed:', err.message);
  process.exit(1);
});
