-- backend tables in supabase

create table public.mortality (
  id serial not null,
  panther_id text null,
  cause text null,
  cause_long text null,
  year integer null,
  date timestamp without time zone null,
  x numeric(15, 6) null,
  y numeric(15, 6) null,
  constraint mortality_pkey primary key (id),
  constraint mortality_panther_id_fkey foreign KEY (panther_id) references panther (panther_id)
) TABLESPACE pg_default;

create table public.panther (
  panther_id text not null,
  sex text null,
  age numeric(5, 2) null,
  age_unit text null,
  constraint panther_pkey primary key (panther_id)
) TABLESPACE pg_default;

create table public.telemetry (
  id serial not null,
  panther_id text null,
  x numeric(15, 6) null,
  y numeric(15, 6) null,
  flgt_date timestamp without time zone null,
  flgt_time time without time zone null,
  constraint telemetry_pkey primary key (id),
  constraint telemetry_panther_id_fkey foreign KEY (panther_id) references panther (panther_id)
) TABLESPACE pg_default;