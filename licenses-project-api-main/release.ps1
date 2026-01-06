# Release script for GSLP
# Usage: .\release.ps1 1.0.12

param(
    [Parameter(Mandatory=$true)]
    [string]$Version
)

# CONFIGURATION - Update these values for your project
$ProjectPath = "GSLP.WebApi\GSLP.WebApi.csproj"
$OutputDir = "publish"
$ReleasesDir = "releases"
$VersionFile = "GSLP.WebApi\wwwroot\version.json"
$ZipName = "gslp-v$Version.zip"
$ZipPath = "$ReleasesDir\$ZipName"

Write-Host "Building and publishing GSLP v$Version..." -ForegroundColor Cyan

# Update version.json with the new version
$versionJson = @{ apiVersion = $Version } | ConvertTo-Json
Set-Content -Path $VersionFile -Value $versionJson
Write-Host "Updated $VersionFile to v$Version" -ForegroundColor Yellow

# Clean previous publish
if (Test-Path $OutputDir) {
    Remove-Item -Recurse -Force $OutputDir
}

# Create releases folder if not exists
if (!(Test-Path $ReleasesDir)) {
    New-Item -ItemType Directory -Path $ReleasesDir | Out-Null
}

# Publish the project
dotnet publish $ProjectPath -c Release -o $OutputDir --framework net9.0 --self-contained false

if ($LASTEXITCODE -ne 0) {
    Write-Host "Publish failed!" -ForegroundColor Red
    exit 1
}

# Remove old zip if exists
if (Test-Path $ZipPath) {
    Remove-Item $ZipPath
}

# Create zip
Compress-Archive -Path "$OutputDir\*" -DestinationPath $ZipPath

Write-Host "Release created: $ZipPath" -ForegroundColor Green

# Clean up publish folder
Remove-Item -Recurse -Force $OutputDir
Write-Host "Cleaned up $OutputDir folder" -ForegroundColor Yellow

