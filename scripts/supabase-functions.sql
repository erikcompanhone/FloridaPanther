-- SQL Functions for Supabase API Routes
-- Run these in Supabase SQL Editor after creating tables

-- Function 1: Telemetry Query 1 - Top 100 most visited locations by sex
CREATE OR REPLACE FUNCTION telemetry_query_1(sex_param TEXT)
RETURNS TABLE (
  x DECIMAL(15,6),
  y DECIMAL(15,6),
  visit_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.x,
    t.y,
    COUNT(*) AS visit_count
  FROM telemetry t
  INNER JOIN panther p ON t.panther_id = p.panther_id
  WHERE p.sex = sex_param
  GROUP BY t.x, t.y
  ORDER BY visit_count DESC
  LIMIT 100;
END;
$$ LANGUAGE plpgsql;

-- Function 2: Telemetry Query 2 - Observation count per year by age range and sex
CREATE OR REPLACE FUNCTION telemetry_query_2(
  min_age DECIMAL,
  max_age DECIMAL,
  sex_param TEXT
)
RETURNS TABLE (
  year INTEGER,
  observation_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    EXTRACT(YEAR FROM t.flgt_date)::INTEGER AS year,
    COUNT(*) AS observation_count
  FROM telemetry t
  INNER JOIN panther p ON t.panther_id = p.panther_id
  WHERE p.sex = sex_param
    AND p.age BETWEEN min_age AND max_age
  GROUP BY year
  ORDER BY year;
END;
$$ LANGUAGE plpgsql;

-- Function 3: Mortality Query 1 - Mortality heatmap by age, sex, and year range
CREATE OR REPLACE FUNCTION mortality_query_1(
  min_age DECIMAL,
  max_age DECIMAL,
  sex_param TEXT,
  min_year INTEGER,
  max_year INTEGER
)
RETURNS TABLE (
  x DECIMAL(15,6),
  y DECIMAL(15,6)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.x,
    m.y
  FROM mortality m
  INNER JOIN panther p ON m.panther_id = p.panther_id
  WHERE p.age BETWEEN min_age AND max_age
    AND p.sex = sex_param
    AND m.year BETWEEN min_year AND max_year
    AND m.x IS NOT NULL
    AND m.y IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Function 4: Mortality Query 2 - Top mortality causes by age and sex
CREATE OR REPLACE FUNCTION mortality_query_2(
  min_age DECIMAL,
  max_age DECIMAL,
  sex_param TEXT
)
RETURNS TABLE (
  cause TEXT,
  cause_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.cause::TEXT,
    COUNT(*) AS cause_count
  FROM mortality m
  INNER JOIN panther p ON m.panther_id = p.panther_id
  WHERE p.age BETWEEN min_age AND max_age
    AND p.sex = sex_param
  GROUP BY m.cause
  ORDER BY cause_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Verify functions were created
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE '%query%'
ORDER BY routine_name;
