@echo off
REM Complete Frontend-Backend-Database Verification Script (Windows)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   FASTTRACK INTEGRATION VERIFICATION SUITE                 ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

setlocal enabledelayedexpansion
set PASSED=0
set FAILED=0

REM ═══════════════════════════════════════════════════════════════
echo 🔍 DOCKER ^& INFRASTRUCTURE
echo ═══════════════════════════════════════════════════════════
echo.

REM Check Docker running
docker ps >nul 2>&1
if !errorlevel! equ 0 (
  echo ✅ PASS: Docker daemon running
  set /a PASSED+=1
) else (
  echo ❌ FAIL: Docker daemon not running
  set /a FAILED+=1
  exit /b 1
)

REM Check containers
for %%C in (nav_api nav_postgres nav_frontend) do (
  docker ps | find "%%C" >nul
  if !errorlevel! equ 0 (
    echo ✅ PASS: Container %%C is running
    set /a PASSED+=1
  ) else (
    echo ❌ FAIL: Container %%C is not running
    set /a FAILED+=1
  )
)

REM ═══════════════════════════════════════════════════════════════
echo.
echo 🗄️  DATABASE CONNECTIVITY
echo ═══════════════════════════════════════════════════════════
echo.

REM Test PostgreSQL connection
docker exec nav_postgres psql -U navuser -d navdb -c "SELECT 1;" >nul 2>&1
if !errorlevel! equ 0 (
  echo ✅ PASS: PostgreSQL connection
  set /a PASSED+=1
) else (
  echo ❌ FAIL: PostgreSQL connection
  set /a FAILED+=1
)

REM Check tables exist
for %%T in (users hazards transit_stops transit_routes) do (
  docker exec nav_postgres psql -U navuser -d navdb -c "\dt %%T" 2>nul | find "%%T" >nul
  if !errorlevel! equ 0 (
    echo ✅ PASS: Table '%%T' exists
    set /a PASSED+=1
  ) else (
    echo ❌ FAIL: Table '%%T' missing
    set /a FAILED+=1
  )
)

REM Count records
for /f %%U in ('docker exec nav_postgres psql -U navuser -d navdb -t -c "SELECT COUNT(*) FROM users;" 2^>nul') do set USER_COUNT=%%U
for /f %%H in ('docker exec nav_postgres psql -U navuser -d navdb -t -c "SELECT COUNT(*) FROM hazards;" 2^>nul') do set HAZARD_COUNT=%%H

if %USER_COUNT% gtr 0 (
  echo ✅ PASS: Users table has %USER_COUNT% records
  set /a PASSED+=1
) else (
  echo ❌ FAIL: Users table is empty
  set /a FAILED+=1
)

if %HAZARD_COUNT% gtr 0 (
  echo ✅ PASS: Hazards table has %HAZARD_COUNT% records
  set /a PASSED+=1
) else (
  echo ❌ FAIL: Hazards table is empty
  set /a FAILED+=1
)

REM ═══════════════════════════════════════════════════════════════
echo.
echo 🔌 API CONNECTIVITY
echo ═══════════════════════════════════════════════════════════
echo.

REM Check API is running
powershell -Command "try { (Invoke-WebRequest http://localhost:3000/api/health -UseBasicParsing).Content | Select-String 'success' >nul; exit $? } catch { exit 1 }" >nul 2>&1
if !errorlevel! equ 0 (
  echo ✅ PASS: API /health endpoint
  set /a PASSED+=1
) else (
  echo ❌ FAIL: API /health endpoint
  set /a FAILED+=1
)

REM ═══════════════════════════════════════════════════════════════
echo.
echo 🌐 FRONTEND ACCESSIBILITY
echo ═══════════════════════════════════════════════════════════
echo.

for %%P in (login1.html crcount.html "home page.html" reclamation.html map.html TEST_CONSOLE.html) do (
  powershell -Command "try { (Invoke-WebRequest http://localhost:3001/%%P -UseBasicParsing).StatusCode -eq 200; exit $? } catch { exit 1 }" >nul 2>&1
  if !errorlevel! equ 0 (
    echo ✅ PASS: Frontend page: %%P
    set /a PASSED+=1
  ) else (
    echo ❌ FAIL: Frontend page: %%P
    set /a FAILED+=1
  )
)

REM ═══════════════════════════════════════════════════════════════
echo.
echo 📝 INTEGRATION CHECKS
echo ═══════════════════════════════════════════════════════════
echo.

REM Check config files
if exist "Frontend\config.js" (
  echo ✅ PASS: Frontend config.js exists
  set /a PASSED+=1
) else (
  echo ❌ FAIL: Frontend config.js missing
  set /a FAILED+=1
)

if exist "Frontend\api-client.js" (
  echo ✅ PASS: Frontend api-client.js exists
  set /a PASSED+=1
) else (
  echo ❌ FAIL: Frontend api-client.js missing
  set /a FAILED+=1
)

if exist "Backend\src\config\osrm.js" (
  echo ✅ PASS: Backend osrm.js exists
  set /a PASSED+=1
) else (
  echo ❌ FAIL: Backend osrm.js missing
  set /a FAILED+=1
)

REM ═══════════════════════════════════════════════════════════════
echo.
echo 📊 SUMMARY
echo ═══════════════════════════════════════════════════════════
echo.

set /a TOTAL=%PASSED%+%FAILED%
if %TOTAL% equ 0 set TOTAL=1
for /f %%P in ('powershell -Command "$([math]::round((%PASSED%*100)/%TOTAL%))"') do set PERCENTAGE=%%P

echo Tests Passed:  %PASSED%
echo Tests Failed:  %FAILED%
echo Total Tests:   %TOTAL%
echo Success Rate:  %PERCENTAGE%%%
echo.

if %FAILED% equ 0 (
  echo ✅ ALL CHECKS PASSED!
  echo.
  echo Your FastTrack integration is ready:
  echo   • Frontend:  http://localhost:3001
  echo   • Backend:   http://localhost:3000
  echo   • Database:  PostgreSQL (navdb)
  echo   • Status:    100%% Operational
  exit /b 0
) else (
  echo ❌ SOME CHECKS FAILED
  echo Please review errors above and restart containers:
  echo   docker compose restart
  exit /b 1
)
