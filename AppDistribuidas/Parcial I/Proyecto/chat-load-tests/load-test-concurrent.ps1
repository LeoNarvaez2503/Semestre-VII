# PowerShell load test script - CONCURRENT version
# Simulates truly concurrent users using PowerShell jobs

param(
    [int]$Users = 50,
    [int]$MessagesPerUser = 10,
    [string]$RoomId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    [string]$BaseUrl = "http://localhost:8080",
    [string]$Pin = "1234"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Chat Seguro - Concurrent Load Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Users (Concurrent): $Users" -ForegroundColor Gray
Write-Host "Messages per user: $MessagesPerUser" -ForegroundColor Gray
Write-Host "Room ID: $RoomId" -ForegroundColor Gray
Write-Host "Base URL: $BaseUrl" -ForegroundColor Gray
Write-Host ""

$startTime = Get-Date

# Script block for each user job
$userScriptBlock = {
    param([int]$UserId, [string]$BaseUrl, [string]$RoomId, [string]$Pin, [int]$MessagesPerUser)
    
    $nickname = "LoadTest_User_$UserId"
    $userStartTime = Get-Date
    $latencies = @()
    
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
        $latencies += $joinLatency
        
        # Send messages
        for ($i = 1; $i -le $MessagesPerUser; $i++) {
            $messageBody = @{
                nickname = $nickname
                message = "Concurrent load test message $i from $nickname"
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
                $latencies += $msgLatency
            }
            catch {
                # Continue on error
            }
        }
        
        $totalLatency = ((Get-Date) - $userStartTime).TotalMilliseconds
        
        [PSCustomObject]@{
            UserId = $UserId
            Success = $true
            Latencies = $latencies
            TotalTime = $totalLatency
            AverageLatency = if ($latencies.Count -gt 0) { ($latencies | Measure-Object -Average).Average } else { 0 }
        }
    }
    catch {
        [PSCustomObject]@{
            UserId = $UserId
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

Write-Host "Starting concurrent load test..." -ForegroundColor Yellow
Write-Host "Spawning $Users concurrent users..." -ForegroundColor Gray
Write-Host ""

# Start all user jobs concurrently
$jobs = @()
for ($i = 1; $i -le $Users; $i++) {
    $job = Start-Job -ScriptBlock $userScriptBlock -ArgumentList $i, $BaseUrl, $RoomId, $Pin, $MessagesPerUser
    $jobs += $job
    
    if ($i % 10 -eq 0) {
        Write-Host "Spawned $i/$Users concurrent users..." -ForegroundColor Gray
    }
}

Write-Host "All users spawned, waiting for completion..." -ForegroundColor Yellow
Write-Host ""

# Wait for all jobs and collect results
$results = @()
$completedCount = 0
foreach ($job in $jobs) {
    $result = Receive-Job -Job $job -Wait
    $results += $result
    $completedCount++
    
    if ($completedCount % 10 -eq 0) {
        Write-Host "Progress: $completedCount/$Users users completed" -ForegroundColor Gray
    }
}

# Clean up jobs
$jobs | Remove-Job

$totalTime = ((Get-Date) - $startTime).TotalSeconds

# Calculate statistics
$successCount = ($results | Where-Object { $_.Success -eq $true }).Count
$failureCount = ($results | Where-Object { $_.Success -eq $false }).Count

$allLatencies = @()
foreach ($result in $results) {
    if ($result.Success -and $result.Latencies.Count -gt 0) {
        $allLatencies += $result.Latencies
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Concurrent Load Test Results" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total Time: ${totalTime}s" -ForegroundColor Gray
Write-Host "Successful: $successCount users" -ForegroundColor Green
Write-Host "Failed: $failureCount users" -ForegroundColor Red
Write-Host "Success Rate: $(($successCount / $Users) * 100)%" -ForegroundColor Cyan

if ($allLatencies.Count -gt 0) {
    $avgLatency = ($allLatencies | Measure-Object -Average).Average
    $maxLatency = ($allLatencies | Measure-Object -Maximum).Maximum
    $minLatency = ($allLatencies | Measure-Object -Minimum).Minimum
    
    # Calculate percentiles
    $sorted = $allLatencies | Sort-Object
    $p50Index = [math]::Floor($sorted.Count * 0.50)
    $p95Index = [math]::Floor($sorted.Count * 0.95)
    $p99Index = [math]::Floor($sorted.Count * 0.99)
    
    $p50 = if ($p50Index -lt $sorted.Count) { $sorted[$p50Index] } else { $maxLatency }
    $p95 = if ($p95Index -lt $sorted.Count) { $sorted[$p95Index] } else { $maxLatency }
    $p99 = if ($p99Index -lt $sorted.Count) { $sorted[$p99Index] } else { $maxLatency }
    
    Write-Host ""
    Write-Host "Latency Metrics ($($allLatencies.Count) requests):" -ForegroundColor Cyan
    Write-Host "  Min: $([math]::Round($minLatency, 2))ms" -ForegroundColor Gray
    Write-Host "  Avg: $([math]::Round($avgLatency, 2))ms" -ForegroundColor Gray
    Write-Host "  p50: $([math]::Round($p50, 2))ms" -ForegroundColor Gray
    Write-Host "  p95: $([math]::Round($p95, 2))ms" -ForegroundColor Gray
    Write-Host "  p99: $([math]::Round($p99, 2))ms" -ForegroundColor Gray
    Write-Host "  Max: $([math]::Round($maxLatency, 2))ms" -ForegroundColor Gray
}

$throughput = [math]::Round(($Users * $MessagesPerUser) / $totalTime, 2)
Write-Host ""
Write-Host "Throughput: $throughput requests/sec" -ForegroundColor Cyan
Write-Host "Total Requests: $($Users * $MessagesPerUser)" -ForegroundColor Gray
Write-Host ""

# Validation against requirements
$requirementsMet = $true
Write-Host "Requirements Validation:" -ForegroundColor Cyan

# Requirement 1: Support 50+ users
if ($successCount -ge 50) {
    Write-Host "  ✓ Supports 50+ users" -ForegroundColor Green
}
else {
    Write-Host "  ✗ Does NOT support 50+ users (only $successCount)" -ForegroundColor Red
    $requirementsMet = $false
}

# Requirement 2: Latency < 1 second
if ($avgLatency -lt 1000) {
    Write-Host "  ✓ Average latency < 1 second (${avgLatency}ms)" -ForegroundColor Green
}
else {
    Write-Host "  ✗ Average latency >= 1 second (${avgLatency}ms)" -ForegroundColor Red
    $requirementsMet = $false
}

# Requirement 3: 100% success rate
if ($failureCount -eq 0) {
    Write-Host "  ✓ 100% success rate" -ForegroundColor Green
}
else {
    Write-Host "  ✗ <100% success rate ($failureCount failures)" -ForegroundColor Red
    $requirementsMet = $false
}

Write-Host ""
if ($requirementsMet -and $successCount -eq $Users) {
    Write-Host "✓ All requirements met! System ready for production." -ForegroundColor Green
    exit 0
}
else {
    Write-Host "⚠ Some requirements not fully met." -ForegroundColor Yellow
    exit 1
}
