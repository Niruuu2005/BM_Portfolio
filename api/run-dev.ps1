# Run FastAPI from the correct working directory (api/, not api/app/).
Set-Location $PSScriptRoot
Write-Host "Starting uvicorn from $PWD" -ForegroundColor Green
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
