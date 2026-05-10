#!/usr/bin/env pwsh

# Script para crear sala de prueba para load tests

$BASE_URL = "http://localhost:8080"
$ADMIN_USER = "admin"
$ADMIN_PASS = "admin123"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Creando Sala de Prueba para Load Tests" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Crear session para mantener cookies
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

try {
    # Step 1: Login
    Write-Host "Paso 1: Autenticando admin..." -ForegroundColor Yellow
    $loginResp = Invoke-RestMethod `
        -Uri "$BASE_URL/api/admin/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body (@{username=$ADMIN_USER; password=$ADMIN_PASS} | ConvertTo-Json) `
        -WebSession $session `
        -ErrorAction Stop
    
    Write-Host "✓ Autenticación exitosa" -ForegroundColor Green
    Write-Host "  Cookies recibidas: $($session.Cookies.Count)"
    
    # Step 2: Create room
    Write-Host ""
    Write-Host "Paso 2: Creando sala de prueba..." -ForegroundColor Yellow
    
    $roomBody = @{
        roomName = "LoadTest-Room"
        roomType = "TEXT"
        pin = "1234"
        maxUsers = 100
    } | ConvertTo-Json
    
    Write-Host "  Request body: $roomBody"
    
    $roomResp = Invoke-RestMethod `
        -Uri "$BASE_URL/api/rooms/create" `
        -Method Post `
        -ContentType "application/json" `
        -Body $roomBody `
        -WebSession $session `
        -ErrorAction Stop
    
    Write-Host "✓ Sala creada exitosamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "Datos de la Sala:" -ForegroundColor Cyan
    Write-Host "  Room ID: $($roomResp.id)" -ForegroundColor White
    Write-Host "  PIN: 1234" -ForegroundColor White
    Write-Host ""
    Write-Host "Próximo paso:" -ForegroundColor Yellow
    Write-Host "  Actualizar en ChatLoadSimulation.scala:" -ForegroundColor Gray
    Write-Host "  val TEST_ROOM_ID = ""$($roomResp.id)""" -ForegroundColor Green
    Write-Host ""
    Write-Host "Luego ejecutar:" -ForegroundColor Gray
    Write-Host "  cd chat-load-tests" -ForegroundColor Gray
    Write-Host "  mvn gatling:test -Dgatling.simulationClass=ChatLoadSimulation" -ForegroundColor Gray
    
}
catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Detalles: $($_)" -ForegroundColor Red
    exit 1
}
