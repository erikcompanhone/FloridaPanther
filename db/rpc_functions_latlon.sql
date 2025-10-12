-- Florida Panther RPC Functions
-- Updated to use latitude/longitude instead of x/y

-- =============================================
-- DROP EXISTING FUNCTIONS
-- =============================================

DROP FUNCTION IF EXISTS telemetry_query_1(text);
DROP FUNCTION IF EXISTS telemetry_query_2();
DROP FUNCTION IF EXISTS telemetry_query_3();
DROP FUNCTION IF EXISTS mortality_query_1(numeric, numeric, text, integer, integer);
DROP FUNCTION IF EXISTS mortality_query_2(integer, integer);
DROP FUNCTION IF EXISTS mortality_query_3();
DROP FUNCTION IF EXISTS mortality_query_4();

-- =============================================
-- TELEMETRY QUERIES
-- =============================================

-- Query 1: Top visited locations by sex (heatmap data)
CREATE OR REPLACE FUNCTION telemetry_query_1(sex_param text)
RETURNS TABLE (
  panther_id text,
  latitude numeric,
  longitude numeric,
  visit_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.panther_id,
    t.latitude,
    t.longitude,
    COUNT(*) as visit_count
  FROM telemetry t
  JOIN panther p ON t.panther_id = p.panther_id
  WHERE p.sex = sex_param
    AND t.latitude IS NOT NULL 
    AND t.longitude IS NOT NULL
  GROUP BY t.panther_id, t.latitude, t.longitude
  ORDER BY visit_count DESC
  LIMIT 100;
END;
$$ LANGUAGE plpgsql;

-- Query 2: Observation count per year
CREATE OR REPLACE FUNCTION telemetry_query_2()
RETURNS TABLE (
  year integer,
  observation_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    EXTRACT(YEAR FROM flgt_date)::integer as year,
    COUNT(*) as observation_count
  FROM telemetry
  WHERE flgt_date IS NOT NULL
  GROUP BY year
  ORDER BY year;
END;
$$ LANGUAGE plpgsql;

-- Query 3: Average observations per panther per year
CREATE OR REPLACE FUNCTION telemetry_query_3()
RETURNS TABLE (
  year integer,
  avg_observations_per_panther numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    EXTRACT(YEAR FROM flgt_date)::integer as year,
    ROUND(COUNT(*)::numeric / COUNT(DISTINCT panther_id), 2) as avg_observations_per_panther
  FROM telemetry
  WHERE flgt_date IS NOT NULL
  GROUP BY year
  ORDER BY year;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- MORTALITY QUERIES
-- =============================================

-- Query 1: Mortality locations heatmap
CREATE OR REPLACE FUNCTION mortality_query_1(
  min_age_param numeric DEFAULT NULL,
  max_age_param numeric DEFAULT NULL,
  sex_param text DEFAULT NULL,
  min_year_param integer DEFAULT NULL,
  max_year_param integer DEFAULT NULL
)
RETURNS TABLE (
  panther_id text,
  latitude numeric,
  longitude numeric,
  cause text,
  year integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.panther_id,
    m.latitude,
    m.longitude,
    m.cause,
    m.year
  FROM mortality m
  JOIN panther p ON m.panther_id = p.panther_id
  WHERE 
    (min_age_param IS NULL OR p.age >= min_age_param)
    AND (max_age_param IS NULL OR p.age <= max_age_param)
    AND (sex_param IS NULL OR p.sex = sex_param)
    AND (min_year_param IS NULL OR m.year >= min_year_param)
    AND (max_year_param IS NULL OR m.year <= max_year_param)
    AND m.latitude IS NOT NULL
    AND m.longitude IS NOT NULL
  ORDER BY m.year DESC, m.panther_id
  LIMIT 100;
END;
$$ LANGUAGE plpgsql;

-- Query 2: Mortality counts by cause
CREATE OR REPLACE FUNCTION mortality_query_2(
  min_year_param integer DEFAULT NULL,
  max_year_param integer DEFAULT NULL
)
RETURNS TABLE (
  cause text,
  cause_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.cause,
    COUNT(*) as cause_count
  FROM mortality m
  WHERE 
    (min_year_param IS NULL OR m.year >= min_year_param)
    AND (max_year_param IS NULL OR m.year <= max_year_param)
    AND m.cause IS NOT NULL
  GROUP BY m.cause
  ORDER BY cause_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Query 3: Mortality trend by year
CREATE OR REPLACE FUNCTION mortality_query_3()
RETURNS TABLE (
  year integer,
  mortality_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.year,
    COUNT(*) as mortality_count
  FROM mortality m
  WHERE m.year IS NOT NULL
  GROUP BY m.year
  ORDER BY m.year;
END;
$$ LANGUAGE plpgsql;

-- Query 4: Average age at death by sex
CREATE OR REPLACE FUNCTION mortality_query_4()
RETURNS TABLE (
  sex text,
  avg_age numeric,
  mortality_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.sex,
    ROUND(AVG(p.age), 2) as avg_age,
    COUNT(*) as mortality_count
  FROM mortality m
  JOIN panther p ON m.panther_id = p.panther_id
  WHERE p.sex IS NOT NULL AND p.age IS NOT NULL
  GROUP BY p.sex
  ORDER BY p.sex;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- VERIFICATION
-- =============================================

-- Test the functions
SELECT 'Testing telemetry_query_1...' as test;
SELECT COUNT(*) as result_count FROM telemetry_query_1('Male');

SELECT 'Testing mortality_query_1...' as test;
SELECT COUNT(*) as result_count FROM mortality_query_1();

SELECT 'All RPC functions created successfully!' as status;
