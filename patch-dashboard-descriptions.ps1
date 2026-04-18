# Auto‑description injector for DashboardAnimated.jsx
# Run inside C:\MemoryMirror

$dashboard = "src\screens\DashboardAnimated.jsx"
$cssFile = "src\hoverDescriptions.css"

# --- 1) Ensure CSS exists ----------------------------------------------------
if (-not (Test-Path $cssFile)) {
    Write-Host "→ Creating hoverDescriptions.css" -ForegroundColor Cyan
    Set-Content -Path $cssFile -Value @'
.feature-card {
  position: relative;
}

.feature-description {
  position: absolute;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 20, 40, 0.85);
  color: #e8f4ff;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 0.85rem;
  width: 220px;
  text-align: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s ease-in-out;
  box-shadow: 0 0 12px rgba(0, 102, 255, 0.4);
}

.feature-card:hover .feature-description {
  opacity: 1;
}
'@
}

# --- 2) Ensure import exists -------------------------------------------------
$importLine = 'import "../hoverDescriptions.css";'
$content = Get-Content $dashboard -Raw

if ($content -notmatch [regex]::Escape($importLine)) {
    Write-Host "→ Adding CSS import" -ForegroundColor Cyan
    $content = $importLine + "`r`n" + $content
}

# --- 3) Auto‑generate descriptions ------------------------------------------
Write-Host "→ Scanning tiles..." -ForegroundColor Cyan

# Extract tile labels from JSX buttons/links
$tilePattern = '<Link[^>]*>(?<label>.*?)<\/Link>'
$matches = [regex]::Matches($content, $tilePattern)

$descriptions = @{
    "Photos" = "Browse your memories in a calm, easy-to-navigate gallery."
    "Videos" = "Watch familiar moments to help with comfort and recall."
    "Music Therapy" = "Play calming music, memory songs, and soothing playlists."
    "Night Safe" = "A grounding space for late-night confusion or anxiety."
    "Calm Corner" = "Guided breathing and grounding exercises for comfort."
    "Pets Buddy" = "A friendly virtual pet companion for emotional support."
    "Legacy Builder" = "Record stories, memories, and life chapters with ease."
    "Dialpad" = "A simple, dementia-safe dialpad for calling loved ones."
    "Banking" = "A safe, simulated banking screen with no real transactions."
    "Shower Companion" = "Gentle voice guidance and reassurance during showers."
}

foreach ($m in $matches) {
    $label = $m.Groups["label"].Value.Trim()

    if (-not $descriptions.ContainsKey($label)) {
        $descriptions[$label] = "Open the $label section."
    }
}

# --- 4) Wrap tiles with descriptions ----------------------------------------
Write-Host "→ Wrapping tiles with descriptions..." -ForegroundColor Cyan

$updated = $content

foreach ($m in $matches) {
    $label = $m.Groups["label"].Value.Trim()
    $desc = $descriptions[$label]

    $original = $m.Value

    $wrapped = @"
<div className="feature-card">
  <div className="feature-description">$desc</div>
  $original
</div>
"@

    $updated = $updated.Replace($original, $wrapped)
}

Set-Content -Path $dashboard -Value $updated

Write-Host "✔ Auto-descriptions applied successfully." -ForegroundColor Green
Write-Host "✔ Dashboard tiles now have hover descriptions." -ForegroundColor Green
