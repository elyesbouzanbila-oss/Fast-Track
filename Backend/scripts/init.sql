-- init.sql
-- Runs automatically when the PostGIS Docker container first starts.
-- Enables required extensions.

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Grant permissions to the app user (handle both navdb and navdb_test)
DO $$
BEGIN
  -- Try to grant on navdb (production)
  IF EXISTS (SELECT 1 FROM pg_database WHERE datname = 'navdb') THEN
    EXECUTE 'GRANT ALL PRIVILEGES ON DATABASE navdb TO navuser';
  END IF;
  -- navdb_test is created and permissions are implicit via owner
END $$;
