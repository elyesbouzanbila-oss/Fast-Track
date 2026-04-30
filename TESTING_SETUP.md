# FastTrack — Testing Setup

Your app is now ready for testing with pre-configured environment files and database seeding.

## What's Been Set Up

1. **Backend `.env`** — Pre-configured to use Dockerized OSRM by default (`nav_osrm_car` / `nav_osrm_foot`)
2. **Frontend `.env`** — API URL set to `http://localhost:3000`
3. **Docker Compose Override** — `docker-compose.test.yml` disables OSRM containers
4. **Database Seeds** — Bus stops SQL included; ready to import ~1,331 transit stops in the Greater Tunis area

## Quick Start

### Start All Services

```bash
docker compose -f docker-compose.yml -f docker-compose.test.yml up --build
```

This runs:
- PostgreSQL + PostGIS (port 5432)
- Backend API (port 3000)
- Frontend (port 3001)
- OSRM routing containers (car + foot) in Docker

### Without Docker

If you prefer local development:

```bash
# Terminal 1: Start PostgreSQL
docker run -d \
  --name nav_postgres \
  -e POSTGRES_DB=navdb \
  -e POSTGRES_USER=navuser \
  -e POSTGRES_PASSWORD=navpassword \
  -p 5432:5432 \
  postgis/postgis:15-3.4

# Terminal 2: Backend
cd Backend
npm install
npm start

# Terminal 3: Frontend
cd Frontend
npm install
npm start
```

## Database Seeding

The `bus_stops_seed.sql` is automatically loaded when PostgreSQL first starts (see `docker-compose.yml`).

To manually seed bus stops:

```bash
psql -h localhost -U navuser -d navdb -f bus_stops_seed.sql
```

Or from the container:

```bash
docker exec nav_postgres psql -U navuser -d navdb -f /docker-entrypoint-initdb.d/init.sql
```

## OSRM Setup

Dockerized OSRM is the normal routing path now. If you need to regenerate the routing data:

1. Download an OpenStreetMap `.osm.pbf` file (see `Backend/scripts/download-osm.sh`)
2. Process it with the setup script:
   ```bash
   ./Backend/scripts/setup-osrm.sh
   ```
3. Keep `docker-compose.yml` as-is so the API talks to the containerized OSRM services
4. Ensure `.env` uses:
   ```
   OSRM_CAR_URL=http://nav_osrm_car:5000
   OSRM_FOOT_URL=http://nav_osrm_foot:5000
   ```

## Stopping

```bash
docker compose down
```

To remove volumes (reset database):

```bash
docker compose down -v
```

## Files Created

- `Backend/.env` — Backend environment variables
- `Frontend/.env` — Frontend environment variables  
- `docker-compose.test.yml` — Testing override configuration
