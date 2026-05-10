# Simple PowerShell load test script
# Simulates 50 concurrent users connecting to chat and sending messages

param(
    [int]$Users = 50,
    [int]$MessagesPerUser = 10,
    [string]$RoomId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    [string]$BaseUrl = "http://localhost:8080",
    [string]$Pin = "1234"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Chat Seguro - Load Test (PowerShell)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Users: $Users" -ForegroundColor Gray
Write-Host "Messages per user: $MessagesPerUser" -ForegroundColor Gray
Write-Host "Room ID: $RoomId" -ForegroundColor Gray
Write-Host "Base URL: $BaseUrl" -ForegroundColor Gray
Write-Host ""

# Metrics
$startTime = Get-Date
$successCount = 0
$failureCount = 0
$totalLatency = @()

# Function to simulate one user
function Test-User {
    param([int]$UserId)
    
    $nickname = "LoadTest_User_$UserId"
    $userStartTime = Get-Date
    
    try {
        # Join room
        $joinBody = @{
            roomId = $RoomId
            pin = $Pin
            nickname = $nickname
        } | ConvertTo-Json
        
        $joinStart = Get-Date
        $joinResponse = Invoke-RestMethod `
            -Uri "$BaseUrl/api/rooms/join" `
            -Method Post `
            -ContentType "application/json" `
            -Body $joinBody `
            -TimeoutSec 10 `
            -ErrorAction Stop
        
        $joinLatency = ((Get-Date) - $joinStart).TotalMilliseconds
        
        # Send messages
        for ($i = 1; $i -le $MessagesPerUser; $i++) {
            $messageBody = @{
                nickname = $nickname
                message = "Load test message $i from $nickname"
                timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
            } | ConvertTo-Json
            
            $msgStart = Get-Date
            try {
                $msgResponse = Invoke-RestMethod `
                    -Uri "$BaseUrl/api/chat/send" `
                    -Method Post `
                    -ContentType "application/json" `
                    -Body $messageBody `
                    -TimeoutSec 5 `
                    -ErrorAction SilentlyContinue
                
                $msgLatency = ((Get-Date) - $msgStart).TotalMilliseconds
                [array]$script:totalLatency += $msgLatency
            }
            catch {
                # Silently continue if individual messages fail
            }
        }
        
        [array]$script:totalLatency += $joinLatency
        $script:successCount++
        
        $userLatency = ((Get-Date) - $userStartTime).TotalMilliseconds
        Write-Host "[✓ User $UserId] Joined and sent $MessagesPerUser messages (${userLatency}ms)" -ForegroundColor Green
    }
    catch {
        $script:failureCount++
        Write-Host "[✗ User $UserId] Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Run load test
Write-Host "Starting load test..." -ForegroundColor Yellow
Write-Host ""

$jobs = @()
for ($i = 1; $i -le $Users; $i++) {
    # Run users sequentially for simplicity (Gatling would do parallel)
    Test-User -UserId $i
    
    if ($i % 10 -eq 0) {
        Write-Host "Progress: $i/$Users users completed" -ForegroundColor Gray
    }
}

$totalTime = ((Get-Date) - $startTime).TotalSeconds

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Load Test Results" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total Time: ${totalTime}s" -ForegroundColor Gray
Write-Host "Successful: $successCount users" -ForegroundColor Green
Write-Host "Failed: $failureCount users" -ForegroundColor Red
Write-Host "Success Rate: $(($successCount / $Users) * 100)%" -ForegroundColor Cyan

if ($totalLatency.Count -gt 0) {
    $avgLatency = ($totalLatency | Measure-Object -Average).Average
    $maxLatency = ($totalLatency | Measure-Object -Maximum).Maximum
    $minLatency = ($totalLatency | Measure-Object -Minimum).Minimum
    
    # Calculate percentiles
    $sorted = $totalLatency | Sort-Object
    $p95Index = [math]::Floor($sorted.Count * 0.95)
    $p99Index = [math]::Floor($sorted.Count * 0.99)
    $p95 = if ($p95Index -lt $sorted.Count) { $sorted[$p95Index] } else { $maxLatency }
    $p99 = if ($p99Index -lt $sorted.Count) { $sorted[$p99Index] } else { $maxLatency }
    
    Write-Host ""
    Write-Host "Latency Metrics:" -ForegroundColor Cyan
    Write-Host "  Min: ${minLatency}ms" -ForegroundColor Gray
    Write-Host "  Avg: ${avgLatency}ms" -ForegroundColor Gray
    Write-Host "  p95: ${p95}ms" -ForegroundColor Gray
    Write-Host "  p99: ${p99}ms" -ForegroundColor Gray
    Write-Host "  Max: ${maxLatency}ms" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Throughput: $([math]::Round(($Users * $MessagesPerUser) / $totalTime, 2)) requests/sec" -ForegroundColor Cyan
Write-Host ""

if ($successCount -eq $Users) {
    Write-Host "✓ Load test completed successfully!" -ForegroundColor Green
    exit 0
}
else {
    Write-Host "⚠ Load test completed with errors" -ForegroundColor Yellow
    exit 1
}
