Write-Host "=== Florida Panther Data Processor ===" -ForegroundColor Green

function Convert-UTMToLatLon {
    param([double]$easting, [double]$northing, [int]$zone = 17)
    $k0 = 0.9996; $a = 6378137.0; $e = 0.081819191; $e1sq = 0.006739497
    $x = $easting - 500000.0; $y = $northing; $M = $y / $k0
    $mu = $M / ($a * (1 - [Math]::Pow($e, 2) / 4 - 3 * [Math]::Pow($e, 4) / 64 - 5 * [Math]::Pow($e, 6) / 256))
    $phi1 = $mu + (3 * $e1sq / 2 - 27 * [Math]::Pow($e1sq, 3) / 32) * [Math]::Sin(2 * $mu) + (21 * [Math]::Pow($e1sq, 2) / 16 - 55 * [Math]::Pow($e1sq, 4) / 32) * [Math]::Sin(4 * $mu) + (151 * [Math]::Pow($e1sq, 3) / 96) * [Math]::Sin(6 * $mu)
    $C1 = $e1sq * [Math]::Pow([Math]::Cos($phi1), 2); $T1 = [Math]::Pow([Math]::Tan($phi1), 2)
    $N1 = $a / [Math]::Sqrt(1 - [Math]::Pow($e * [Math]::Sin($phi1), 2))
    $R1 = $a * (1 - [Math]::Pow($e, 2)) / [Math]::Pow(1 - [Math]::Pow($e * [Math]::Sin($phi1), 2), 1.5)
    $D = $x / ($N1 * $k0)
    $lat = $phi1 - ($N1 * [Math]::Tan($phi1) / $R1) * ([Math]::Pow($D, 2) / 2 - (5 + 3 * $T1 + 10 * $C1 - 4 * [Math]::Pow($C1, 2) - 9 * $e1sq) * [Math]::Pow($D, 4) / 24 + (61 + 90 * $T1 + 298 * $C1 + 45 * [Math]::Pow($T1, 2) - 252 * $e1sq - 3 * [Math]::Pow($C1, 2)) * [Math]::Pow($D, 6) / 720)
    $lon = ($D - (1 + 2 * $T1 + $C1) * [Math]::Pow($D, 3) / 6 + (5 - 2 * $C1 + 28 * $T1 - 3 * [Math]::Pow($C1, 2) + 8 * $e1sq + 24 * [Math]::Pow($T1, 2)) * [Math]::Pow($D, 5) / 120) / [Math]::Cos($phi1)
    $lat = $lat * 180 / [Math]::PI; $lon = $lon * 180 / [Math]::PI + (($zone - 1) * 6 - 180 + 3)
    return @{latitude = [Math]::Round($lat, 6); longitude = [Math]::Round($lon, 6)}
}

function Convert-StatePlaneToLatLon {
    param([double]$x_ft, [double]$y_ft)
    
    # Use Python's pyproj library for accurate coordinate transformation
    # EPSG:2236 (State Plane Florida East in feet) -> EPSG:4326 (WGS84 lat/lon)
    $result = python convert_coordinates.py $x_ft $y_ft
    
    if ($LASTEXITCODE -eq 0) {
        $coords = $result.Split(',')
        return @{
            latitude = [Math]::Round([double]$coords[0], 6)
            longitude = [Math]::Round([double]$coords[1], 6)
        }
    } else {
        Write-Warning "Failed to convert coordinates: X=$x_ft, Y=$y_ft"
        return $null
    }
}

$telemetryData = Import-Csv "Florida_Panther_Telemetry.csv"
$mortalityData = Import-Csv "Florida_Panther_Mortality.csv"

$panthers = @{}
foreach ($row in $mortalityData) {
    if ($row.PANTHERID -and -not $panthers.ContainsKey($row.PANTHERID)) {
        $age = $row.AGE; if ($age -and [decimal]$age -ge 999) { $age = "" }
        $panthers[$row.PANTHERID] = @{panther_id = $row.PANTHERID; sex = $row.SEX; age = $age; age_unit = $row.AGE_UNITS}
    }
}
foreach ($row in $telemetryData) {
    if ($row.CATNUMBER -and -not $panthers.ContainsKey($row.CATNUMBER)) {
        $panthers[$row.CATNUMBER] = @{panther_id = $row.CATNUMBER; sex = ""; age = ""; age_unit = ""}
    }
}

Write-Host "Creating panther CSV..."
$pantherList = $panthers.Values | ForEach-Object { [PSCustomObject]@{panther_id = $_.panther_id; sex = $_.sex; age = $_.age; age_unit = $_.age_unit} } | Sort-Object panther_id
$pantherList | Export-Csv -Path "panther_import.csv" -NoTypeInformation -Encoding UTF8
Write-Host "Created panther_import.csv - $($pantherList.Count) panthers"

Write-Host "Creating mortality CSV..."
$mortalityList = @()
foreach ($row in $mortalityData) {
    if (-not $row.PANTHERID) { continue }
    $dateFormatted = ""; if ($row.Date -match "(\d{4})/(\d{2})/(\d{2})") { $dateFormatted = "$($Matches[1])-$($Matches[2])-$($Matches[3])" }
    $coords = Convert-StatePlaneToLatLon -x_ft ([double]$row.X) -y_ft ([double]$row.Y)
    if (-not $coords) { continue }
    $mortalityList += [PSCustomObject]@{panther_id = $row.PANTHERID; cause = $row.CAUSE; cause_long = $row.LOCATION; year = $row.YEAR; date = $dateFormatted; latitude = $coords.latitude; longitude = $coords.longitude}
}
$mortalityList | Export-Csv -Path "mortality_import.csv" -NoTypeInformation -Encoding UTF8
Write-Host "Created mortality_import.csv - $($mortalityList.Count) records"

Write-Host "Creating telemetry CSV..."
$telemetryList = @(); $processed = 0; $skipped = 0
foreach ($row in $telemetryData) {
    if (-not $row.CATNUMBER -or -not $row.UTM83EAST -or -not $row.UTM83NORTH -or -not $row.FLGTDATE -or -not $row.TIME) { $skipped++; continue }
    if ($row.FLGTDATE -match "(\d{4})/(\d{2})/(\d{2})") { $dateFormatted = "$($Matches[1])-$($Matches[2])-$($Matches[3])" } else { $skipped++; continue }
    if ($row.TIME -match "^(\d{1,2}):(\d{2})") {
        $hours = [int]$Matches[1]; $minutes = [int]$Matches[2]
        if ($hours -ge 24 -or $minutes -ge 60) { $skipped++; continue }
        $timeFormatted = "$($hours.ToString().PadLeft(2, "0")):$($minutes.ToString().PadLeft(2, "0")):00"
    } else { $skipped++; continue }
    $coords = Convert-UTMToLatLon -easting ([double]$row.UTM83EAST) -northing ([double]$row.UTM83NORTH) -zone 17
    $telemetryList += [PSCustomObject]@{panther_id = $row.CATNUMBER; latitude = $coords.latitude; longitude = $coords.longitude; flgt_date = $dateFormatted; flgt_time = $timeFormatted}
    $processed++; if ($processed % 10000 -eq 0) { Write-Host "  $processed telemetry..." -ForegroundColor Gray }
}
$telemetryList | Export-Csv -Path "telemetry_import.csv" -NoTypeInformation -Encoding UTF8
Write-Host "Created telemetry_import.csv - $($telemetryList.Count) records"
Write-Host ""
Write-Host "=== Complete! ===" -ForegroundColor Green
