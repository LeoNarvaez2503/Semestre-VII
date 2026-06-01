# Chat Seguro Load Tests - Setup Script (PowerShell)
# This script automates the creation of a test room and prepares the environment

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Chat Seguro - Load Test Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$BASE_URL = "http://localhost:8080"
$ADMIN_USER = "admin"
$ADMIN_PASS = "admin123"
$ROOM_NAME = "LoadTest-Room"
$ROOM_PIN = "1234"
$ROOM_TYPE = "TEXT"
$MAX_USERS = "100"

# Step 1: Check if backend is running
Write-Host "Step 1: Checking if backend is running..." -ForegroundColor Yellow

try {
    $testConnection = Invoke-RestMethod -Uri "$BASE_URL/api/rooms/info" -TimeoutSec 5 -ErrorAction SilentlyContinue
    Write-Host "✓ Backend is running at $BASE_URL" -ForegroundColor Green
}
catch {
    Write-Host "✗ Backend is NOT running at $BASE_URL" -ForegroundColor Red
    Write-Host "Start it with: cd ChatSeguroSpring && docker-compose up -d && mvn spring-boot:run" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Step 2: Login and get admin token
Write-Host "Step 2: Authenticating admin user..." -ForegroundColor Yellow

try {
    $loginBody = @{
        username = $ADMIN_USER
        password = $ADMIN_PASS
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$BASE_URL/api/admin/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody

    $ADMIN_TOKEN = $loginResponse.token

    if ([string]::IsNullOrEmpty($ADMIN_TOKEN)) {
        Write-Host "✗ Login failed. Response: $loginResponse" -ForegroundColor Red
        exit 1
    }

    Write-Host "✓ Admin authenticated" -ForegroundColor Green
    Write-Host "  Token: $($ADMIN_TOKEN.Substring(0, [Math]::Min(20, $ADMIN_TOKEN.Length)))..." -ForegroundColor Gray
}
catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Create test room
Write-Host "Step 3: Creating test room..." -ForegroundColor Yellow

try {
    $roomBody = @{
        roomName = $ROOM_NAME
        roomType = $ROOM_TYPE
        pin = $ROOM_PIN
        maxUsers = [int]$MAX_USERS
    } | ConvertTo-Json

    $roomResponse = Invoke-RestMethod -Uri "$BASE_URL/api/rooms/create" `
        -Method Post `
        -ContentType "application/json" `
        -Headers @{ "Cookie" = "admin_token=$ADMIN_TOKEN" } `
        -Body $roomBody

    $ROOM_ID = $roomResponse.id

    if ([string]::IsNullOrEmpty($ROOM_ID)) {
        Write-Host "✗ Room creation failed. Response: $roomResponse" -ForegroundColor Red
        exit 1
    }

    Write-Host "✓ Test room created" -ForegroundColor Green
    Write-Host "  Room Name: $ROOM_NAME" -ForegroundColor Gray
    Write-Host "  Room ID: $ROOM_ID" -ForegroundColor Gray
    Write-Host "  PIN: $ROOM_PIN" -ForegroundColor Gray
}
catch {
    Write-Host "✗ Room creation failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 4: Display instructions
Write-Host "Step 4: Next steps..." -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Update ChatLoadSimulation.scala with the Room ID:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   val TEST_ROOM_ID = ""$ROOM_ID""" -ForegroundColor Green
Write-Host ""
Write-Host "2. Run load tests:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   cd chat-load-tests" -ForegroundColor Gray
Write-Host "   mvn gatling:test -Dgatling.simulationClass=ChatLoadSimulation" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Open the generated report (after test completes):" -ForegroundColor Cyan
Write-Host ""
Write-Host "   target/gatling/chat-load-test-results-*/index.html" -ForegroundColor Gray
Write-Host ""

Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host ""

# Copy Room ID to clipboard for convenience
[System.Windows.Forms.SendKeys]::SendWait("^c")
Write-Host "Room ID copied to clipboard!" -ForegroundColor Green
