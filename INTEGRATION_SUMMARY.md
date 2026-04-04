# Frontend-Backend Integration Complete

## Services Running

| Service | Port | Status | URL |
|---------|------|--------|-----|
| **Frontend** (Static Server) | 3001 | ✅ Running | http://localhost:3001 |
| **Backend API** | 3000 | ✅ Running | http://localhost:3000 |
| **PostgreSQL** | 5432 | ✅ Running | postgres://navuser:navpassword@localhost:5432/navdb |
| **OSRM Car** | 5000 | ⚠️ Requires Map Data | http://localhost:5000 |
| **OSRM Foot** | 5001 | ⚠️ Requires Map Data | http://localhost:5001 |

## What Was Done

### 1. **Frontend Setup**
- Created `/Frontend/config.js` - API configuration file
- Created `/Frontend/api-client.js` - Reusable API client class with all endpoints
- Updated `/Frontend/Dockerfile` - Serves static files via http-server
- Updated `/Frontend/package.json` - Removed backend scripts

### 2. **Unified Docker Compose**
- Created root-level `docker-compose.yml` with all services
- All services connected via `nav_network`
- Frontend and API can communicate:
  - Frontend → API: `http://nav_api:3000` (internal)
  - Browser → API: `http://localhost:3000` (external)

### 3. **API Client Library**
Use the pre-built `navigationAPI` object in any HTML/JS file:

```html
<script src="config.js"></script>
<script src="api-client.js"></script>
<script>
  // Login
  await navigationAPI.login('user@example.com', 'password');
  
  // Calculate route
  const route = await navigationAPI.calculateRoute(
    { lat: 36.8065, lng: 10.1815 },
    { lat: 36.8190, lng: 10.1658 },
    'car'
  );
  
  // Report hazard
  await navigationAPI.reportHazard('pothole', 36.81, 10.18, 'medium');
</script>
```

## Accessing the Application

```bash
# Start all services
docker compose up --build

# Frontend (HTML pages)
http://localhost:3001

# Backend API
http://localhost:3000/api/health

# PostgreSQL (for admins)
psql -h localhost -U navuser -d navdb
```

## How Frontend Calls Backend

All HTML files should include:
```html
<script src="config.js"></script>
<script src="api-client.js"></script>
```

Then use the global `navigationAPI` object:
```javascript
// Auth
navigationAPI.login(email, password)
navigationAPI.signup(name, email, password)
navigationAPI.getMe()
navigationAPI.logout()

// Routes
navigationAPI.calculateRoute(origin, destination, mode, options)
navigationAPI.snapPoint(lng, lat, mode)
navigationAPI.getNearbyTransitStops(lng, lat, radius)

// Hazards
navigationAPI.reportHazard(type, lat, lng, severity, description)
navigationAPI.getHazards(minLng, minLat, maxLng, maxLat)
navigationAPI.confirmHazard(hazardId)
```

Token is automatically stored/retrieved from localStorage.

## Environment Variables

Set in `.env` file:
```
DB_NAME=navdb
DB_USER=navuser
DB_PASSWORD=navpassword
JWT_SECRET=your-secret-key
CORS_ORIGIN=*
PORT=3000
```

## OSRM Data (Optional)

OSRM routing requires map data file at `./Backend/osrm-data/map.osrm`

To disable OSRM containers temporarily:
```bash
docker compose up --build --no-deps -d api frontend postgres
```

## File Structure

```
FastTRack Proj/
├── docker-compose.yml          (NEW - orchestrates all services)
├── Frontend/
│   ├── Dockerfile             (UPDATED)
│   ├── package.json           (UPDATED)
│   ├── config.js              (NEW - API config)
│   ├── api-client.js          (NEW - reusable API client)
│   ├── login1.html
│   ├── home page.html
│   └── ... (all static files)
├── Backend/
│   ├── Dockerfile             (unchanged)
│   ├── package.json           (unchanged)
│   ├── src/                   (API routes)
│   ├── scripts/               (database migrations)
│   ├── osrm-data/             (map files - optional)
│   └── docker-compose.yml     (old - now superseded)
```

## Next Steps

1. **Test the integration**: Open http://localhost:3001 and test login/signup
2. **Update HTML files**: Include config.js and api-client.js in pages that need API calls
3. **Handle responses**: Catch errors and display user feedback
4. **Add OSRM data**: Download/prepare map data for routing (or disable services)
5. **Configure CORS**: Update `CORS_ORIGIN` env var for production domain
6. **Secure JWT_SECRET**: Change from default in production
