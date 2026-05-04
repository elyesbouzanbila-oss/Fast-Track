# FastTrack — Frontend

## Folder Structure

```
Frontend/
├── pages/          ← Live application pages (open in browser)
│   ├── home page.html    — Dashboard & live map
│   ├── login1.html       — Login
│   ├── crcount.html      — Sign up
│   ├── reclamation.html  — Report a hazard
│   ├── map.html          — Route finder map
│   └── TEST_CONSOLE.html — Integration test UI
│
├── css/            ← All stylesheets
│   ├── enhanced.css      — Polish layer (loaded last on every page)
│   ├── test.css          — Global base styles (dark/gold theme)
│   └── …
│
├── js/             ← All JavaScript
│   ├── config.js         — API base URL (auto-patched by Dockerfile)
│   ├── api-client.js     — Backend API client (NavigationAPI class)
│   ├── bus-stops-layer.js— Leaflet bus stop toggle layer
│   ├── map.js            — Home page live map module
│   ├── filter.js         — Route table filtering
│   └── …
│
├── assets/         ← Images (logo, photos)
├── dev/            ← Prototypes & scratch files (not served in production)
├── docs/           ← Integration guides & reports
├── index.html      ← Root redirect → pages/home page.html
├── Dockerfile      ← Serves /app on port 3001 via http-server
└── package.json
```

## Running locally (without Docker)

```bash
cd Frontend
npm install
npx http-server . -p 3001 --cors
# Open http://localhost:3001
```

## Running with Docker

```bash
docker compose up --build
# Open http://localhost:3001
```

The `API_URL` environment variable is injected into `js/config.js` at container
start so you can point at any backend without rebuilding.
