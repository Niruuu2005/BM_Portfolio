# Run FastAPI from the correct working directory (api/, not api/app/).
# Port: set API_PORT (e.g. 8001) if 8000 is in use or you get WinError 10013 on Windows.
Set-Location $PSScriptRoot
if (-not $env:API_PORT) { $env:API_PORT = "8000" }
Write-Host "Starting uvicorn from $PWD on port $($env:API_PORT)" -ForegroundColor Green
uvicorn app.main:app --reload --host 127.0.0.1 --port $env:API_PORT
