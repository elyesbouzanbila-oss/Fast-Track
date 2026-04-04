# How to Fix OSRM Routing Issue

OSRM (Open Source Routing Machine) requires map data to work. Here are 3 solutions, ranked by ease:

---

## ✅ Option 1: Use Public Demo Server (EASIEST)

**What:** Use the free public OSRM server instead of local containers.

**Pros:** 
- No setup needed
- Works immediately
- No local resource overhead

**Cons:**
- Rate-limited
- Depends on external service
- Slower latency

**Implementation:**

Edit `Backend/src/config/osrm.js` and change the URLs:

```javascript
const osrmConfig = {
  car: {
    url: process.env.OSRM_CAR_URL || 'https://router.project-osrm.org',
    profile: 'car',
  },
  foot: {
    url: process.env.OSRM_FOOT_URL || 'https://router.project-osrm.org',
    profile: 'foot',
  },
  bike: {
    url: process.env.OSRM_BIKE_URL || 'https://router.project-osrm.org',
    profile: 'bike',
  },
};
```

**Then restart:**
```bash
docker compose restart api
```

**That's it!** Routing should work now (covers entire world, not just Tunisia).

---

## 🟡 Option 2: Pre-Process Local Map Data (RECOMMENDED FOR PRODUCTION)

**What:** Download Tunisia OSM data and process it with OSRM tools.

**Pros:**
- Fast (local service)
- No external dependencies
- No rate limits
- Production-ready

**Cons:**
- ~30-45 min setup
- Requires disk space (~2-3GB)
- Need OSRM tools installed

**Steps:**

### Step 1: Download Tunisia OSM data
```bash
# Go to Backend/osrm-data/
cd Backend/osrm-data

# Download Tunisia polygon (small file ~3MB extracted)
wget https://download.geofabrik.de/africa/tunisia-latest.osm.pbf

# Or use curl
curl -O https://download.geofabrik.de/africa/tunisia-latest.osm.pbf
```

### Step 2: Process with OSRM

**Option A: Using Docker (Recommended)**
```bash
cd Backend/osrm-data

# Process for car routing
docker run -t -v "${PWD}:/data" osrm/osrm-backend:latest osrm-extract \
  -p /opt/car.lua /data/tunisia-latest.osm.pbf

docker run -t -v "${PWD}:/data" osrm/osrm-backend:latest osrm-partition \
  /data/tunisia-latest.osrm

docker run -t -v "${PWD}:/data" osrm/osrm-backend:latest osrm-customize \
  /data/tunisia-latest.osrm
```

**Option B: Manually build container**
Create `Backend/osrm-data/Dockerfile`:
```dockerfile
FROM osrm/osrm-backend:latest
RUN apt-get update && apt-get install -y wget
WORKDIR /data
RUN wget https://download.geofabrik.de/africa/tunisia-latest.osm.pbf && \
    osrm-extract -p /opt/car.lua tunisia-latest.osm.pbf && \
    osrm-partition tunisia-latest.osrm && \
    osrm-customize tunisia-latest.osrm
```

Then:
```bash
docker build -t osrm-tunisia Backend/osrm-data
docker run -v Backend/osrm-data:/data osrm-tunisia
```

### Step 3: Update docker-compose

In `docker-compose.yml`, change OSRM to use the processed file:

```yaml
osrm-car:
  image: osrm/osrm-backend:latest
  volumes:
    - ./Backend/osrm-data:/data
  command: osrm-routed --algorithm mld /data/tunisia-latest.osrm --max-table-size 10000
```

### Step 4: Restart
```bash
docker compose up osrm-car -d
```

---

## 🔵 Option 3: Disable OSRM (Quick Workaround)

**What:** Fall back to demo routes (works but not realistic).

**Pros:**
- No setup
- Works immediately
- No errors

**Cons:**
- Routes are straight lines (not real roads)
- Demo mode only

**Implementation:**

Add to `.env`:
```
SKIP_OSRM=true
```

The code already has fallbacks for demo routes.

---

## 📋 Comparison Table

| Feature | Option 1 (Public) | Option 2 (Local) | Option 3 (Demo) |
|---------|-------------------|------------------|-----------------|
| **Setup Time** | 1 min | 30 min | 1 min |
| **Coverage** | World-wide | Tunisia only | N/A |
| **Speed** | Slow (remote) | Fast (local) | Instant |
| **Accuracy** | Real routes | Real routes | Fake lines |
| **Rate Limit** | Yes | No | N/A |
| **Production Ready** | No | Yes | No |
| **Cost** | Free | Free | Free |

---

## ✅ Recommended: Option 1 (for now)

Quick fix to pass all tests immediately:

```bash
# 1. Edit file
nano Backend/src/config/osrm.js

# 2. Change localhost:5000 → router.project-osrm.org

# 3. Restart
docker compose restart api

# 4. Test
# All 9 tests should now PASS ✅
```

**Then later, implement Option 2 for production.**

---

## Testing After Fix

Run tests again:
```
http://localhost:3001/TEST_CONSOLE.html → Run All Tests
```

**Expected:**
```
✅ signup: PASSED
✅ login: PASSED
✅ getMe: PASSED
✅ reportHazard: PASSED
✅ getHazards: PASSED
✅ calculateRoute: PASSED  ← NOW WORKS
✅ snapPoint: PASSED       ← NOW WORKS
✅ nearbyStops: PASSED
✅ logout: PASSED

TOTAL: 9/9 PASSED
```

---

## Troubleshooting

### Still getting 504 timeout
- Verify `osrm.js` URLs changed correctly
- Check API restarted: `docker logs nav_api | grep OSRM`
- Test public OSRM directly: `curl https://router.project-osrm.org/nearest/v1/car/10.18,36.80`

### Getting 403/429 (rate limited)
- Using public OSRM too much
- Implement Option 2 (local processing)

### Processing map data hangs
- Increase Docker memory: Settings → Resources → 6GB RAM
- Use smaller region (Tunisia is fine)
- Try different OSRM version tag

