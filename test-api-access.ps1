# PowerShell script to test service provider API access
$apiBase = "http://localhost:5000/api"

# Test users
$testUsers = @(
    @{ Email = "plumber@cafm.com"; Password = "Plumber123!"; Role = "Plumber" },
    @{ Email = "electrician@cafm.com"; Password = "Electric123!"; Role = "Electrician" },
    @{ Email = "cleaner@cafm.com"; Password = "Cleaner123!"; Role = "Cleaner" },
    @{ Email = "admin@cafm.com"; Password = "Admin123!"; Role = "Admin" }
)

function Test-Login {
    param($Email, $Password)
    
    $loginData = @{
        email = $Email
        password = $Password
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$apiBase/auth/login" -Method POST -Body $loginData -ContentType "application/json"
        if ($response.success) {
            return $response.token
        } else {
            Write-Host "❌ Login failed for $Email : $($response.message)" -ForegroundColor Red
            return $null
        }
    } catch {
        Write-Host "❌ Login error for $Email : $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

function Test-TicketsEndpoint {
    param($Token, $Role)
    
    $headers = @{
        "Authorization" = "Bearer $Token"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$apiBase/tickets" -Method GET -Headers $headers
        Write-Host "✅ $Role - Tickets: $($response.tickets.Count) found" -ForegroundColor Green
        
        # Show first few tickets
        $response.tickets | Select-Object -First 3 | ForEach-Object {
            Write-Host "   - Ticket $($_.id): $($_.title) (Category: $($_.categoryText), Assigned: $($_.assignedToUserName))" -ForegroundColor Gray
        }
        
        return $response.tickets.Count
    } catch {
        Write-Host "❌ $Role - Tickets error: $($_.Exception.Message)" -ForegroundColor Red
        return 0
    }
}

function Test-StatsEndpoint {
    param($Token, $Role)
    
    $headers = @{
        "Authorization" = "Bearer $Token"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$apiBase/tickets/stats" -Method GET -Headers $headers
        Write-Host "✅ $Role - Stats: Total=$($response.totalTickets), Open=$($response.openTickets), InProgress=$($response.inProgressTickets)" -ForegroundColor Green
        return $response.totalTickets
    } catch {
        Write-Host "❌ $Role - Stats error: $($_.Exception.Message)" -ForegroundColor Red
        return 0
    }
}

# Main test
Write-Host "Testing Service Provider Role-Based Access..." -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

foreach ($user in $testUsers) {
    Write-Host "`nTesting $($user.Role) ($($user.Email)):" -ForegroundColor Yellow
    Write-Host "-" * 50 -ForegroundColor Yellow
    
    # Login
    $token = Test-Login -Email $user.Email -Password $user.Password
    if (-not $token) {
        Write-Host "❌ Skipping $($user.Role) - login failed`n" -ForegroundColor Red
        continue
    }
    
    Write-Host "✅ Login successful for $($user.Role)" -ForegroundColor Green
    
    # Test endpoints
    $ticketCount = Test-TicketsEndpoint -Token $token -Role $user.Role
    $statsTotal = Test-StatsEndpoint -Token $token -Role $user.Role
    
    Write-Host "Summary for $($user.Role): Tickets=$ticketCount, Stats Total=$statsTotal" -ForegroundColor Magenta
}

Write-Host "`nTest completed!" -ForegroundColor Cyan
