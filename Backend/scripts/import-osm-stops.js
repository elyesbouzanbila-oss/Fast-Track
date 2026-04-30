#!/usr/bin/env node
/**
 * import-osm-stops.js
 * Fetches bus/tram/metro stops from OpenStreetMap via the Overpass API
 * and imports them into the transit_stops table.
 *
 * Usage:
 *   node scripts/import-osm-stops.js [country_code] [--dry-run]
 *
 * Examples:
 *   node scripts/import-osm-stops.js          # Tunisia (default)
 *   node scripts/import-osm-stops.js TN       # Tunisia explicitly
 *   node scripts/import-osm-stops.js --dry-run # preview without inserting
 *
 * What it fetches:
 *   - All nodes tagged highway=bus_stop in the target area
 *   - All nodes tagged public_transport=stop_position
 *   - All nodes tagged railway=tram_stop or railway=station
 *   - Name comes from OSM name tag (falls back to ref tag or generated ID)
 */

require('dotenv').config();
const https  = require('https');
const { initDatabase, sequelize } = require('../src/config/database');

// ── Config ─────────────────────────────────────────────────────────────────

// Overpass relation IDs for country bounding areas
const AREAS = {
  TN: { name: 'Tunisia',   area: 3600192756 },  // OSM relation for Tunisia
  DZ: { name: 'Algeria',   area: 3600192754 },
  MA: { name: 'Morocco',   area: 3600195266 },
  LY: { name: 'Libya',     area: 3600192758 },
};

const DRY_RUN   = process.argv.includes('--dry-run');
const AREA_CODE = process.argv.find(a => AREAS[a]) || 'TN';
const AREA      = AREAS[AREA_CODE];
const OVERPASS  = 'https://overpass-api.de/api/interpreter';
const BATCH     = 500; // DB insert batch size

// ── Overpass query ──────────────────────────────────────────────────────────

function buildQuery(areaId) {
  return `
[out:json][timeout:90];
area(${areaId})->.searchArea;
(
  node["highway"="bus_stop"](area.searchArea);
  node["public_transport"="stop_position"](area.searchArea);
  node["public_transport"="platform"](area.searchArea);
  node["railway"="tram_stop"](area.searchArea);
  node["railway"="halt"](area.searchArea);
  node["amenity"="bus_station"](area.searchArea);
)->.stops;
.stops out body;
`.trim();
}

// ── HTTP helper ─────────────────────────────────────────────────────────────

function fetchOverpass(query) {
  return new Promise((resolve, reject) => {
    const body = 'data=' + encodeURIComponent(query);
    const options = {
      method:  'POST',
      headers: {
        'Content-Type':   'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
        'User-Agent':     'FastTrack-App/1.0',
      },
    };
    const req = https.request(OVERPASS, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end',  () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`Overpass returned ${res.statusCode}: ${data.slice(0, 200)}`));
        }
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Failed to parse Overpass response: ' + e.message)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── OSM → DB record transformer ─────────────────────────────────────────────

function osmNodeToStop(node) {
  const tags = node.tags || {};

  // Derive a human-readable name — priority order
  const name =
    tags.name       ||
    tags['name:ar'] ||
    tags['name:fr'] ||
    tags.ref        ||
    tags.operator   ||
    `Stop ${node.id}`;

  // Derive stop type
  let locationType = 0; // default = stop/platform
  if (tags.amenity === 'bus_station' || tags.public_transport === 'station') {
    locationType = 1; // station
  }

  return {
    id:                  `osm-${node.id}`,
    name:                name.slice(0, 255),
    description:         tags.description || tags.note || null,
    lat:                 node.lat,
    lng:                 node.lon,
    location_type:       locationType,
    wheelchair_boarding: tags.wheelchair === 'yes' ? 1 : tags.wheelchair === 'no' ? 2 : 0,
    platform_code:       tags.ref || null,
  };
}

// ── DB upsert ───────────────────────────────────────────────────────────────

async function upsertBatch(stops) {
  if (!stops.length) return 0;

  // Build parameterised multi-row INSERT ... ON CONFLICT DO UPDATE
  const cols = ['id', 'name', 'description', 'location', 'location_type',
                'wheelchair_boarding', 'platform_code'];

  const rows    = [];
  const values  = [];
  let   idx     = 1;

  for (const s of stops) {
    rows.push(
      `($${idx++}, $${idx++}, $${idx++},
        ST_SetSRID(ST_MakePoint($${idx++}, $${idx++}), 4326),
        $${idx++}, $${idx++}, $${idx++})`
    );
    values.push(
      s.id, s.name, s.description,
      s.lng, s.lat,
      s.location_type, s.wheelchair_boarding, s.platform_code
    );
  }

  const sql = `
    INSERT INTO transit_stops (${cols.join(', ')})
    VALUES ${rows.join(',\n    ')}
    ON CONFLICT (id) DO UPDATE SET
      name                = EXCLUDED.name,
      description         = EXCLUDED.description,
      location            = EXCLUDED.location,
      location_type       = EXCLUDED.location_type,
      wheelchair_boarding = EXCLUDED.wheelchair_boarding,
      platform_code       = EXCLUDED.platform_code
  `;

  await sequelize.query(sql, { bind: values });
  return stops.length;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚌  OSM Bus Stop Importer`);
  console.log(`   Country : ${AREA.name} (${AREA_CODE})`);
  console.log(`   Mode    : ${DRY_RUN ? 'DRY RUN (no DB writes)' : 'LIVE'}\n`);

  // 1. Fetch from Overpass
  console.log('📡  Querying Overpass API…  (may take 20–60 s)');
  const t0   = Date.now();
  const data = await fetchOverpass(buildQuery(AREA.area));
  console.log(`    Received ${data.elements.length} raw OSM nodes in ${((Date.now()-t0)/1000).toFixed(1)}s`);

  // 2. Transform
  const stops = data.elements
    .filter(el => el.type === 'node' && el.lat != null && el.lon != null)
    .map(osmNodeToStop)
    // Deduplicate by id (shouldn't happen but guard it)
    .filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i);

  console.log(`    After filtering/dedup: ${stops.length} stops\n`);

  if (stops.length === 0) {
    console.log('⚠️   No stops found. Check the Overpass query or the area ID.');
    return;
  }

  // 3. Preview sample
  console.log('📍  Sample stops (first 5):');
  stops.slice(0, 5).forEach(s =>
    console.log(`    [${s.id}] ${s.name.padEnd(40)} lat=${s.lat.toFixed(4)}, lng=${s.lng.toFixed(4)}`)
  );
  console.log('    …\n');

  if (DRY_RUN) {
    console.log('✅  Dry run complete — no data written.');
    return;
  }

  // 4. Connect to DB and upsert
  console.log('💾  Connecting to database…');
  await initDatabase();

  // Make sure the table exists
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
    CREATE INDEX IF NOT EXISTS transit_stops_location_gist
      ON transit_stops USING GIST (location);
    CREATE INDEX IF NOT EXISTS transit_stops_name_idx
      ON transit_stops (name);
  `);

  let total = 0;
  const batches = Math.ceil(stops.length / BATCH);

  for (let i = 0; i < batches; i++) {
    const batch   = stops.slice(i * BATCH, (i + 1) * BATCH);
    const written = await upsertBatch(batch);
    total += written;
    process.stdout.write(`\r    Inserted/updated: ${total} / ${stops.length}`);
  }

  console.log(`\n\n✅  Done! ${total} stops imported into transit_stops.\n`);

  await sequelize.close();
}

main().catch(err => {
  console.error('\n❌  Import failed:', err.message);
  console.error(err.stack);
  process.exit(1);
});
