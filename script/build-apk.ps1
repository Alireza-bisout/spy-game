# ASCII only - save as UTF-8
# From project root:
#   powershell -ExecutionPolicy Bypass -File .\script\build-apk.ps1

$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

if (-not (Test-Path "android\gradlew.bat")) {
  Write-Host "Missing android folder. Run: npx cap add android"
  exit 1
}
if (-not (Test-Path "out\index.html")) {
  Write-Host "Running npm run build ..."
  npm run build
}

$Sdk = Join-Path $env:LOCALAPPDATA "Android\Sdk-cli"

Write-Host "Need JDK 17. Check with: java -version"

if (-not $env:ANDROID_HOME) {
  $env:ANDROID_HOME = $Sdk
}
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
$env:Path = "$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:ANDROID_HOME\platform-tools;$env:Path"

New-Item -ItemType Directory -Force -Path $Sdk | Out-Null

$sdkBat = Join-Path $Sdk "cmdline-tools\latest\bin\sdkmanager.bat"
if (-not (Test-Path $sdkBat)) {
  Write-Host "Downloading Android commandline tools ..."
  $zip = Join-Path $env:TEMP "cmdtools.zip"
  Invoke-WebRequest -Uri "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip" -OutFile $zip
  $tmp = Join-Path $env:TEMP "cmdtools"
  if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
  Expand-Archive $zip $tmp
  New-Item -ItemType Directory -Force -Path (Join-Path $Sdk "cmdline-tools\latest") | Out-Null
  Copy-Item -Recurse -Force (Join-Path $tmp "cmdline-tools\*") (Join-Path $Sdk "cmdline-tools\latest")
}

Write-Host "Installing Android platform and build-tools ..."
$sdkBat = Join-Path $Sdk "cmdline-tools\latest\bin\sdkmanager.bat"
$plat = "platforms;android-35"
$bt = "build-tools;35.0.0"
cmd /c "echo y | `"$sdkBat`" --sdk_root=$Sdk platform-tools `"$plat`" `"$bt`""
cmd /c "echo y | `"$sdkBat`" --sdk_root=$Sdk --licenses"

npx cap sync

Set-Location (Join-Path $Root "android")
.\gradlew.bat assembleDebug --no-daemon

$apk = Join-Path $Root "android\app\build\outputs\apk\debug\app-debug.apk"
Write-Host "APK ready:"
Write-Host $apk
