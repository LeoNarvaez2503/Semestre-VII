# PowerShell load test - Debug version
# Simulates 50 concurrent users with better error handling

param(
    [int]$Users = 5,  # Start with 5 for testing
    [int]$MessagesPerUser = 2,
    [string]$RoomId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    [string]$BaseUrl = "http://localhost:8080",
    [string]$Pin = "1234"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Chat Seguro - Load Test (Debug Mode)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$startTime = Get-Date

# Test just the join endpoint first
Write-Host "Testing with $Users users..." -ForegroundColor Yellow
Write-Host ""

$results = @()
$successCount = 0
$failureCount = 0

for ($i = 1; $i -le $Users; $i++) {
    $nickname = "LoadTest_User_$i"
    
    try {
        $joinBody = @{
            roomId = $RoomId
            pin = $Pin
            nickname = $nickname
        } | ConvertTo-Json
        
        $joinStart = Get-Date
        $response = Invoke-RestMethod `
            -Uri "$BaseUrl/api/rooms/join" `
            -Method Post `
            -ContentType "application/json" `
            -Body $joinBody `
            -TimeoutSec 10 `
            -ErrorAction Stop
        
        $joinLatency = ((Get-Date) - $joinStart).TotalMilliseconds
        $successCount++
        
        Write-Host "[✓ User $i] Join successful in ${joinLatency}ms" -ForegroundColor Green
        Write-Host "  Response: $($response | ConvertTo-Json)" -ForegroundColor Gray
        
        $results += @{
            UserId = $i
            Status = "SUCCESS"
            Latency = $joinLatency
        }
    }
    catch {
        $failureCount++
        Write-Host "[✗ User $i] Join failed" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
        if ($_.Exception.Response) {
            Write-Host "  HTTP Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Gray
        }
        
        $results += @{
            UserId = $i
            Status = "FAILURE"
            Error = $_.Exception.Message
        }
    }
}

$totalTime = ((Get-Date) - $startTime).TotalSeconds

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Results" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Total Time: ${totalTime}s" -ForegroundColor Gray
Write-Host "Successful: $successCount/$Users" -ForegroundColor Green
Write-Host "Failed: $failureCount/$Users" -ForegroundColor Red
Write-Host "Success Rate: $(($successCount / $Users) * 100)%" -ForegroundColor Cyan

if ($successCount -gt 0) {
    $latencies = $results | Where-Object { $_.Status -eq "SUCCESS" } | Select-Object -ExpandProperty Latency
    if ($latencies) {
        $avgLatency = ($latencies | Measure-Object -Average).Average
        Write-Host "Average Latency: $([math]::Round($avgLatency, 2))ms" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. If successful, increase Users to 50" -ForegroundColor Gray
Write-Host "2. Run: & '...\load-test-concurrent.ps1' -Users 50" -ForegroundColor Gray
