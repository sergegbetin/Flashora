# FLASHORA - asset fetcher
# Downloads the demo photography used by the prototype from Pexels
# (Pexels License: free for commercial use, no attribution required).
# Run from anywhere:  powershell -ExecutionPolicy Bypass -File scripts/fetch-images.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$dest = Join-Path $root "public\images"
if (Test-Path $dest) { Remove-Item (Join-Path $dest "*.jpg") -Force -ErrorAction SilentlyContinue }
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$headers = @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36" }

# name, pexels photo id, requested width
$assets = @(
  # --- products --------------------------------------------------------
  @("product-phone-nova",         "32912404", 1200),
  @("product-phone-classic",      "47261",    1000),
  @("product-phone-detail",       "33210885", 1000),
  @("product-laptop-aero",        "6893890",  1200),
  @("product-laptop-mockup",      "4884110",  1200),
  @("product-laptop-gaming",      "3951449",  1200),
  @("product-watch-pulse",        "5081914",  1000),
  @("product-watch-hand",         "31406895", 1000),
  @("product-headphones-sonic",   "7772548",  1200),
  @("product-headphones-classic", "210927",   1200),
  @("product-audio-detail",       "210926",   1200),
  @("product-earbuds-airtune",    "33797659", 1200),
  @("product-earbuds-alt",        "10885667", 1000),
  @("product-speaker-boom",       "128611",   1200),
  @("product-speaker-studio",     "29271204", 1200),
  @("product-headset-arena",      "8866731",  1200),
  @("product-vr-headset",         "7561900",  1200),
  @("product-keyboard-velocity",  "9020272",  1200),
  @("product-keyboard-keys",      "18641167", 1000),
  @("product-mouse-glide",        "7151696",  1200),
  @("product-console-nova",       "7862390",  1200),
  @("product-controller-propad",  "34625035", 1200),
  @("product-controller-alt",     "39046606", 1000),
  @("product-controller-xbox",    "15822009", 1000),
  @("product-lamp-lumen",         "35392792", 1200),
  @("product-lamp-led",           "15082877", 1000),
  @("product-lamp-ambient",       "5561129",  1000),
  @("product-home-speaker",       "27662879", 1200),
  @("product-home-hub",           "22307556", 1200),
  @("product-home-theater",       "7031762",  1200),
  @("product-backpack-urban",     "9629915",  1200),
  @("product-backpack-day",       "37580640", 1000),
  @("product-gadget-pouch",       "14486283", 1200),
  @("product-fitness-dumbbells",  "35567437", 1200),
  @("product-fitness-mat",        "25596885", 1000),
  @("product-fitness-workout",    "7900680",  1000),
  @("product-gift-set",           "6087540",  1200),
  @("product-charger-fast",       "1028674",  1000),
  @("product-desk-setup",         "37811262", 1200),
  # --- categories ------------------------------------------------------
  @("category-tech",              "14713024", 1600),
  @("category-gaming",            "7862493",  1600),
  @("category-audio",             "3989380",  1600),
  @("category-home",              "6903157",  1600),
  @("category-lifestyle",         "37401695", 1600),
  # --- editorial / campaign -------------------------------------------
  @("gift-him",                   "10591429", 1200),
  @("gift-her",                   "5413308",  1200),
  @("gift-gamers",                "4101045",  1200),
  @("gift-tech",                  "16247542", 1200),
  @("editorial-listen",           "6864495",  1400),
  @("editorial-travel",           "6181059",  1400),
  @("editorial-shopping",         "5926443",  1600),
  @("editorial-flatlay",          "3216565",  1400),
  @("editorial-workout",          "4716814",  1400),
  @("mobile-mockup",              "12876446", 1000),
  @("hero-set",                   "5412270",  1600)
)

$ok = 0; $fail = 0
foreach ($a in $assets) {
  $name = $a[0]; $id = $a[1]; $w = $a[2]
  $url = "https://images.pexels.com/photos/$id/pexels-photo-$id.jpeg?auto=compress&cs=tinysrgb&w=$w"
  $out = Join-Path $dest "$name.jpg"
  try {
    Invoke-WebRequest -Uri $url -Headers $headers -OutFile $out -TimeoutSec 45 -UseBasicParsing
    $size = (Get-Item $out).Length
    if ($size -lt 5000) { throw "too small ($size bytes)" }
    $ok++
    Write-Output "OK   $name ($size bytes)"
  } catch {
    $fail++
    Write-Output "FAIL $name : $($_.Exception.Message)"
  }
}
Write-Output "---- downloaded=$ok failed=$fail"
