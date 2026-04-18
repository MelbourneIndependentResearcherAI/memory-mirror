# apply-theme.ps1
# Injects global theme import into all screens + components

$root = "C:\MemoryMirror\src"
$themeImport = '@import "../theme.css";'

# Add theme import to App.jsx
$appFile = "$root\App.jsx"
$appContent = Get-Content $appFile
if ($appContent -notmatch "theme.css") {
    $themeImport | Set-Content -Path $appFile -Encoding UTF8
    Add-Content -Path $appFile -Value "`n" + ($appContent -join "`n")
}

# Add theme import to all screens
Get-ChildItem "$root\screens" -Filter *.jsx | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file
    if ($content -notmatch "theme.css") {
        $themeImport | Set-Content -Path $file -Encoding UTF8
        Add-Content -Path $file -Value "`n" + ($content -join "`n")
    }
}

# Add theme import to components
Get-ChildItem "$root\components" -Filter *.jsx | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file
    if ($content -notmatch "theme.css") {
        $themeImport | Set-Content -Path $file -Encoding UTF8
        Add-Content -Path $file -Value "`n" + ($content -join "`n")
    }
}

Write-Host "✔ Global theme applied across all screens + components." -ForegroundColor Green
