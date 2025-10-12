-- Florida Panther Database Schema
-- Final version with latitude/longitude coordinates

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS public.telemetry CASCADE;
DROP TABLE IF EXISTS public.mortality CASCADE;
DROP TABLE IF EXISTS public.panther CASCADE;

-- Create panther table (must be first due to foreign key references)
CREATE TABLE public.panther (
  panther_id text NOT NULL,
  sex text NULL,
  age numeric(5, 2) NULL,
  age_unit text NULL,
  CONSTRAINT panther_pkey PRIMARY KEY (panther_id)
) TABLESPACE pg_default;

-- Create mortality table
CREATE TABLE public.mortality (
  id serial NOT NULL,
  panther_id text NULL,
  cause text NULL,
  cause_long text NULL,
  year integer NULL,
  date timestamp without time zone NULL,
  latitude numeric(10, 6) NULL,
  longitude numeric(10, 6) NULL,
  CONSTRAINT mortality_pkey PRIMARY KEY (id),
  CONSTRAINT mortality_panther_id_fkey FOREIGN KEY (panther_id) 
    REFERENCES panther (panther_id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create telemetry table
CREATE TABLE public.telemetry (
  id serial NOT NULL,
  panther_id text NULL,
  latitude numeric(10, 6) NULL,
  longitude numeric(10, 6) NULL,
  flgt_date timestamp without time zone NULL,
  flgt_time time without time zone NULL,
  CONSTRAINT telemetry_pkey PRIMARY KEY (id),
  CONSTRAINT telemetry_panther_id_fkey FOREIGN KEY (panther_id) 
    REFERENCES panther (panther_id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX idx_telemetry_panther_id ON public.telemetry (panther_id);
CREATE INDEX idx_telemetry_date ON public.telemetry (flgt_date);
CREATE INDEX idx_telemetry_coords ON public.telemetry (latitude, longitude);

CREATE INDEX idx_mortality_panther_id ON public.mortality (panther_id);
CREATE INDEX idx_mortality_year ON public.mortality (year);
CREATE INDEX idx_mortality_coords ON public.mortality (latitude, longitude);

CREATE INDEX idx_panther_sex ON public.panther (sex);

-- Add comments for documentation
COMMENT ON TABLE public.panther IS 'Florida Panther individuals with basic demographic data';
COMMENT ON TABLE public.mortality IS 'Mortality events for Florida Panthers with location and cause';
COMMENT ON TABLE public.telemetry IS 'GPS telemetry tracking data for Florida Panthers';

COMMENT ON COLUMN public.telemetry.latitude IS 'Latitude in decimal degrees (WGS84)';
COMMENT ON COLUMN public.telemetry.longitude IS 'Longitude in decimal degrees (WGS84)';
COMMENT ON COLUMN public.mortality.latitude IS 'Latitude in decimal degrees (WGS84)';
COMMENT ON COLUMN public.mortality.longitude IS 'Longitude in decimal degrees (WGS84)';

-- Verify tables were created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('panther', 'mortality', 'telemetry')
ORDER BY table_name;
