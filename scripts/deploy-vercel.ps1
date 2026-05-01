# Vercel Deployment Helper Script
# Run this in PowerShell to deploy your API Reseller platform to Vercel

Write-Host "🚀 Vercel Deployment Helper" -ForegroundColor Green
Write-Host "==========================" -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Vercel CLI. Please install manually:" -ForegroundColor Red
        Write-Host "   npm i -g vercel" -ForegroundColor Cyan
        exit 1
    }
}

Write-Host "✅ Vercel CLI found" -ForegroundColor Green
Write-Host ""

# Check if user is logged in
Write-Host "🔑 Checking Vercel login status..." -ForegroundColor Cyan
$loginCheck = vercel whoami 2>&1

if ($loginCheck -match "Error" -or $loginCheck -match "Not logged in") {
    Write-Host "🔐 Please login to Vercel:" -ForegroundColor Yellow
    vercel login
} else {
    Write-Host "✅ Logged in as: $loginCheck" -ForegroundColor Green
}

Write-Host ""

# Environment Variables Check
Write-Host "📋 Environment Variables Check" -ForegroundColor Cyan
Write-Host "-------------------------------" -ForegroundColor Cyan

$requiredVars = @(
    "SUPABASE_URL",
    "SUPABASE_SERVICE_KEY",
    "BINANCE_API_KEY",
    "BINANCE_SECRET_KEY",
    "BINANCE_MERCHANT_ID",
    "BINANCE_PAY_WEBHOOK_SECRET"
)

$missingVars = @()

foreach ($var in $requiredVars) {
    $value = [Environment]::GetEnvironmentVariable($var)
    if ([string]::IsNullOrEmpty($value)) {
        Write-Host "   ❌ $var - MISSING" -ForegroundColor Red
        $missingVars += $var
    } else {
        Write-Host "   ✅ $var - Set" -ForegroundColor Green
    }
}

Write-Host ""

if ($missingVars.Count -gt 0) {
    Write-Host "⚠️  Missing Environment Variables!" -ForegroundColor Yellow
    Write-Host "You'll need to add these in Vercel Dashboard after deployment." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📝 To add them now locally (for testing):" -ForegroundColor Cyan
    foreach ($var in $missingVars) {
        Write-Host "   [Environment]::SetEnvironmentVariable('$var', 'your-value', 'User')" -ForegroundColor Gray
    }
    Write-Host ""
}

# Check if .env file exists in backend
$envFile = Join-Path $PSScriptRoot "..\backend\.env"
if (Test-Path $envFile) {
    Write-Host "✅ Backend .env file found" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backend .env file not found at: $envFile" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Ready to deploy!" -ForegroundColor Green
Write-Host "====================" -ForegroundColor Green
Write-Host ""
Write-Host "Choose deployment option:" -ForegroundColor Cyan
Write-Host "   1) Deploy with wizard (recommended for first time)" -ForegroundColor White
Write-Host "   2) Deploy production (after initial setup)" -ForegroundColor White
Write-Host "   3) Preview deployment" -ForegroundColor White
Write-Host "   4) Cancel" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host "🚀 Starting Vercel deployment wizard..." -ForegroundColor Green
        vercel
    }
    "2" {
        Write-Host "🚀 Deploying to production..." -ForegroundColor Green
        vercel --prod
    }
    "3" {
        Write-Host "🚀 Creating preview deployment..." -ForegroundColor Green
        vercel
    }
    "4" {
        Write-Host "❌ Deployment cancelled" -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "Invalid choice. Running deployment wizard..." -ForegroundColor Yellow
        vercel
    }
}

Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Set environment variables in Vercel Dashboard" -ForegroundColor White
Write-Host "   2. Configure Binance webhook URL" -ForegroundColor White
Write-Host "   3. Test your deployed application" -ForegroundColor White
Write-Host ""
Write-Host "📖 Full deployment guide: DEPLOY.md" -ForegroundColor Cyan
