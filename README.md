# FastTrack

FastTrack is a full-stack transportation and hazard-reporting app. It combines route planning, transit stop discovery, authentication, hazard reporting, multilingual UI support, and live map views for the same city-focused workflow.

The project is split into two parts:

- `Backend/` provides the API, routing logic, database access, and spatial queries.
- `Frontend/` serves the browser UI, map pages, translations, and testing console.

## What the app does

- Lets users register, log in, and keep sessions with JWT tokens.
- Calculates routes for car, walking, transit, and multimodal use cases.
- Snaps coordinates to valid road locations before routing.
- Shows nearby bus, metro, and train stops.
- Reports hazards and supports hazard confirmation.
- Displays weather information on the map.
- Supports English, French, and Arabic UI translations.

## Main technologies

### Backend

- Node.js 18+
- Express.js for the HTTP API
- PostgreSQL 15 with PostGIS 3.4 for spatial data
- Sequelize and `pg` for database access
- JWT for authentication
- `bcryptjs` for password hashing
- `axios` and `node-fetch` for outbound API calls
- `express-validator` for request validation
- `helmet`, `cors`, `compression`, `morgan`, and `express-rate-limit` for API hardening and observability
- `winston` for structured logging

### Frontend

- Plain HTML, CSS, and JavaScript
- Leaflet for map rendering
- Leaflet.markercluster for clustered stop markers
- Choices.js for richer select inputs
- Font Awesome for icons
- i18next for translations
- Open-Meteo for weather reporting
- Browser APIs such as `fetch`, `localStorage`, and geolocation

### External open-source services and datasets

- OSRM, the Open Source Routing Machine, for routing
- OpenStreetMap / Nominatim for map and geocoding data
- GTFS transit feeds for public transport data
- PostGIS spatial functions for nearest-road and proximity queries

## Why these projects were chosen

The app leans on open-source utilities wherever possible so the stack stays flexible, inspectable, and cheap to run.

- Leaflet is lighter than full proprietary map platforms and is easier to adapt to custom pages and overlays.
- OSRM gives real turn-by-turn routing without tying the app to a paid routing API.
- PostGIS turns spatial work into SQL, which is a better fit than pushing distance and proximity logic into application code.
- Sequelize keeps database models and queries manageable without hiding SQL completely.
- i18next is a practical open-source way to support multiple languages without hardcoding separate pages.
- Choices.js and Font Awesome add UI polish without forcing a heavy frontend framework.
- Open-Meteo provides weather data through a simple public API, which keeps weather features decoupled from the rest of the backend.

## Project structure

```text
Fast-Track/
├── Backend/               API, database code, routing logic, scripts
├── Frontend/              Pages, styles, browser scripts, assets
├── bus_stops_seed.sql     Transit stop seed data used by tests and local setup
├── docker-compose.yml     Full stack Docker composition
├── docker-compose.test.yml Test override that disables OSRM containers
└── TESTING_SETUP.md       Test-specific startup notes
```

## Running with Docker

This is the fastest way to start the full app.

```bash
docker compose up --build
```

That starts:

- PostgreSQL + PostGIS on port `5432`
- Backend API on port `3000`
- Frontend static server on port `3001`
- OSRM routing services for car and foot profiles

Open the app in the browser at:

- Frontend: `http://localhost:3001`
- API: `http://localhost:3000`

## Local development

### Backend

```bash
cd Backend
npm install
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
npm start
```

The frontend serves static files on port `3001` and talks to the backend through `API_URL`.

## Testing setup

Use the test compose override when you want the app running without the OSRM containers.

```bash
docker compose -f docker-compose.yml -f docker-compose.test.yml up --build
```

For more details, see `TESTING_SETUP.md`.

## Backend scripts

The backend package includes scripts for common tasks such as:

- database migration
- transit import
- hazard seeding
- OSM stop import
- CSV stop import
- unit and integration tests

## Notes on routing and weather

- Routing is driven by OSRM for vehicle and walking paths.
- Transit and stop lookups rely on PostGIS spatial queries.
- Weather cards on the map use Open-Meteo.

## License

No explicit license file was present in the workspace at the time this README was created.