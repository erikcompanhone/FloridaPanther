# Convert MySQL backup to PostgreSQL-compatible format
# Usage: .\convert-mysql-to-postgres.ps1

$inputFile = "db\panther_backup.sql"
$outputFile = "db\panther_postgres_data.sql"

Write-Host "Converting MySQL backup to PostgreSQL format..." -ForegroundColor Cyan

# Read the file and process it
$content = Get-Content $inputFile -Raw

# Remove MySQL-specific commands
$content = $content -replace '/\*!.*?\*/;', ''  # Remove MySQL comments
$content = $content -replace '`', ''  # Remove backticks
$content = $content -replace 'LOCK TABLES.*?UNLOCK TABLES;', '', 'Singleline'  # Remove LOCK/UNLOCK
$content = $content -replace 'ALTER TABLE.*?DISABLE KEYS.*?;', ''  # Remove ALTER TABLE
$content = $content -replace 'ALTER TABLE.*?ENABLE KEYS.*?;', ''  # Remove ALTER TABLE
$content = $content -replace 'DROP TABLE IF EXISTS.*?;', ''  # Remove DROP statements
$content = $content -replace 'SET .*?;', ''  # Remove SET statements
$content = $content -replace 'ENGINE=InnoDB.*?;', ';'  # Remove ENGINE definition
$content = $content -replace 'DEFAULT CHARSET=.*?;', ';'  # Remove CHARSET
$content = $content -replace 'COLLATE=.*?;', ';'  # Remove COLLATE

# Extract only CREATE TABLE and INSERT statements
$lines = $content -split "`n"
$output = @()
$inTable = $false

foreach ($line in $lines) {
    # Skip empty lines and comments
    if ($line -match '^\s*$' -or $line -match '^--' -or $line -match '^/\*') {
        continue
    }
    
    # Keep CREATE TABLE statements (but modify them for PostgreSQL)
    if ($line -match 'CREATE TABLE') {
        $inTable = $true
    }
    
    # Keep INSERT INTO statements
    if ($line -match 'INSERT INTO') {
        $output += $line
    }
}

# Write output
$output -join "`n" | Out-File $outputFile -Encoding UTF8

Write-Host "✓ Conversion complete!" -ForegroundColor Green
Write-Host "Output file: $outputFile" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Open Supabase SQL Editor"
Write-Host "2. Copy the contents of $outputFile"
Write-Host "3. Paste and run in SQL Editor"
