@echo off
echo Testing Backend Connection...
echo.

echo 1. Testing Health Endpoint...
curl -X GET http://localhost:8000/health
echo.
echo.

echo 2. Testing Root Endpoint...
curl -X GET http://localhost:8000/
echo.
echo.

echo 3. Testing Login Endpoint...
curl -X POST http://localhost:8000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"sagar@example.com\",\"password\":\"Sagar@269\"}" ^
  -c cookies.txt -v
echo.
echo.

echo 4. Testing Auth Me Endpoint (with cookies)...
curl -X GET http://localhost:8000/auth/me ^
  -b cookies.txt -v
echo.
echo.

echo Test Complete!
pause
