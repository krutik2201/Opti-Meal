# OptiMeal – Dev Launcher
# ========================
# Starts both Flask backend and React frontend in separate terminals.
# Run from the project root: .\start.ps1

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  OptiMeal – Starting Development Environment" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition

# ── Flask Backend ──────────────────────────────────────────────
Write-Host "[1/2] Launching Flask backend on http://localhost:5000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList `
    "-NoExit", "-Command", `
    "Set-Location '$root\backend'; python app.py"

Start-Sleep -Seconds 2

# ── React Frontend ─────────────────────────────────────────────
Write-Host "[2/2] Launching React frontend on http://localhost:3000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList `
    "-NoExit", "-Command", `
    "Set-Location '$root\frontend'; npm start"

Write-Host ""
Write-Host "Both servers are starting in new windows." -ForegroundColor Green
Write-Host "  Backend : http://localhost:5000" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "API endpoints:" -ForegroundColor Cyan
Write-Host "  Health  : GET  http://localhost:5000/health"
Write-Host "  Predict : POST http://localhost:5000/api/predict"
Write-Host "  Waste   : POST http://localhost:5000/api/waste-analysis"
Write-Host "  Data    : GET  http://localhost:5000/api/data"
Write-Host ""
