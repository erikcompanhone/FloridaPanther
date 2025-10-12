-- PostgreSQL-compatible data import for Supabase
-- Run this in Supabase SQL Editor AFTER creating the schema

-- First, create the tables (if not already created)
CREATE TABLE IF NOT EXISTS panther (
  panther_id TEXT PRIMARY KEY,
  sex TEXT,
  age DECIMAL(5,2),
  age_unit TEXT
);

CREATE TABLE IF NOT EXISTS telemetry (
  id SERIAL PRIMARY KEY,
  panther_id TEXT,
  x DECIMAL(15,6),
  y DECIMAL(15,6),
  flgt_date TIMESTAMP,
  flgt_time TIME,
  FOREIGN KEY (panther_id) REFERENCES panther(panther_id)
);

CREATE TABLE IF NOT EXISTS mortality (
  id SERIAL PRIMARY KEY,
  panther_id TEXT,
  cause TEXT,
  cause_long TEXT,
  year INTEGER,
  date TIMESTAMP,
  x DECIMAL(15,6),
  y DECIMAL(15,6),
  FOREIGN KEY (panther_id) REFERENCES panther(panther_id)
);

-- Now copy and paste the INSERT statements from panther_backup.sql
-- They should work as-is after removing MySQL-specific syntax

-- NOTE: You'll need to manually extract the INSERT statements from panther_backup.sql
-- and paste them below. Look for lines that start with:
-- INSERT INTO `panther` VALUES ...
-- INSERT INTO `telemetry` VALUES ...
-- INSERT INTO `mortality` VALUES ...

-- Example (you need to copy the actual data):
-- INSERT INTO panther VALUES ('FP001', 'M', 2.5);
-- INSERT INTO panther VALUES ('FP002', 'F', 3.1);
-- ...etc
