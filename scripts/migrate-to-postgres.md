# Database Migration Guide: MySQL → PostgreSQL (Supabase)

## Step 1: Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" (free tier)
3. Create a new organization and project
4. Save your project URL and anon key

## Step 2: Get Connection Details
- Go to Project Settings → Database
- Copy the connection string (URI format)
- Save the following credentials:
  - `SUPABASE_URL`: https://xxxxx.supabase.co
  - `SUPABASE_ANON_KEY`: Your public anon key
  - `DATABASE_URL`: postgresql://postgres:[password]@[host]:5432/postgres

## Step 3: Convert Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- Create Panther table
CREATE TABLE panther (
  panther_id VARCHAR(20) PRIMARY KEY,
  sex VARCHAR(10),
  age DECIMAL(5,2),
  age_units VARCHAR(10)
);

-- Create Telemetry table
CREATE TABLE telemetry (
  id SERIAL PRIMARY KEY,
  panther_id VARCHAR(20),
  flgt_date TIMESTAMP,
  time TIME,
  x DECIMAL(15,6),
  y DECIMAL(15,6),
  FOREIGN KEY (panther_id) REFERENCES panther(panther_id)
);

-- Create Mortality table
CREATE TABLE mortality (
  id SERIAL PRIMARY KEY,
  panther_id VARCHAR(20),
  cause VARCHAR(100),
  cause_long VARCHAR(255),
  year INTEGER,
  date TIMESTAMP,
  x DECIMAL(15,6),
  y DECIMAL(15,6),
  FOREIGN KEY (panther_id) REFERENCES panther(panther_id)
);

-- Create indexes for performance
CREATE INDEX idx_telemetry_panther_id ON telemetry(panther_id);
CREATE INDEX idx_telemetry_flgt_date ON telemetry(flgt_date);
CREATE INDEX idx_telemetry_coords ON telemetry(x, y);

CREATE INDEX idx_mortality_panther_id ON mortality(panther_id);
CREATE INDEX idx_mortality_year ON mortality(year);
CREATE INDEX idx_mortality_coords ON mortality(x, y);

CREATE INDEX idx_panther_sex ON panther(sex);
CREATE INDEX idx_panther_age ON panther(age);
```

## Step 4: Convert MySQL Dump to PostgreSQL

You have two options:

### Option A: Use pgLoader (Recommended)
```bash
# Install pgLoader
# macOS: brew install pgloader
# Ubuntu: sudo apt-get install pgloader
# Windows: Download from https://pgloader.io

# Convert data
pgloader mysql://user:password@localhost/panther postgresql://postgres:password@host:5432/postgres
```

### Option B: Manual CSV Import
1. Export tables from MySQL to CSV:
```sql
-- In MySQL
SELECT * FROM panther INTO OUTFILE '/tmp/panther.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '"';
SELECT * FROM telemetry INTO OUTFILE '/tmp/telemetry.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '"';
SELECT * FROM mortality INTO OUTFILE '/tmp/mortality.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '"';
```

2. Import CSVs to Supabase (via Dashboard or SQL):
- Go to Table Editor → panther → Insert → Import data from CSV
- Repeat for telemetry and mortality

### Option C: Use SQL Backup File
1. Clean the MySQL dump file (`panther_backup.sql`):
   - Remove MySQL-specific commands (/*!... */)
   - Convert AUTO_INCREMENT to SERIAL
   - Change VARCHAR to TEXT if needed
   - Replace backticks with double quotes

2. Run the cleaned SQL in Supabase SQL Editor

## Step 5: Verify Data
```sql
-- Check row counts
SELECT COUNT(*) FROM panther;
SELECT COUNT(*) FROM telemetry;
SELECT COUNT(*) FROM mortality;

-- Test queries
SELECT * FROM panther LIMIT 10;
SELECT * FROM mortality WHERE year = 2024 ORDER BY date DESC LIMIT 10;
```

## Step 6: Update Environment Variables

Add to Vercel project:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `VITE_SUPABASE_URL`: https://xxxxx.supabase.co
   - `VITE_SUPABASE_ANON_KEY`: eyJhb... (your anon key)

## Step 7: Enable Row Level Security (Optional but Recommended)

```sql
-- Enable RLS on all tables
ALTER TABLE panther ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortality ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON panther FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON telemetry FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON mortality FOR SELECT USING (true);
```

## Troubleshooting

### Issue: Connection timeout
- Check if Supabase project is paused (free tier auto-pauses)
- Verify connection string includes port `:5432`

### Issue: Data import fails
- Check column name case sensitivity (PostgreSQL is case-sensitive)
- Verify foreign key constraints match

### Issue: Slow queries
- Ensure indexes are created (Step 3)
- Use EXPLAIN ANALYZE to debug queries

## Need Help?
- Supabase Docs: https://supabase.com/docs
- Community Discord: https://discord.supabase.com
