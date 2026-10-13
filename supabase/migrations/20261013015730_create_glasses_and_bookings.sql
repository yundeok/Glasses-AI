/*
# Create glasses catalog and tour booking tables (single-tenant, no auth)

## Overview
This migration creates two tables for a K-glasses virtual fitting and tour booking website
aimed at foreign tourists. The app has no sign-in, so all policies use `anon, authenticated`.

## New Tables

### glasses
- `id` (uuid, primary key)
- `name` (text, not null) — glasses model name
- `brand` (text, not null) — Korean eyewear brand
- `price` (integer, not null) — price in KRW
- `frame_type` (text, not null) — e.g. "round", "square", "cat-eye", "aviator", "oval"
- `face_shapes` (text[], not null) — array of face shapes this model suits
- `image_url` (text, not null) — product image URL
- `wearing_image_url` (text, not null) — image of person wearing the glasses
- `description` (text, not null) — short description
- `created_at` (timestamptz, default now)

### tour_bookings
- `id` (uuid, primary key)
- `name` (text, not null) — visitor's name
- `email` (text, not null) — visitor's email
- `phone` (text) — optional phone number
- `country` (text, not null) — visitor's country
- `preferred_date` (date, not null) — preferred tour date
- `preferred_time` (text, not null) — preferred time slot
- `party_size` (integer, not null, default 1) — number of people
- `glasses_id` (uuid, references glasses) — optional: which glasses they want to try
- `notes` (text) — optional notes
- `status` (text, not null, default 'pending') — booking status
- `created_at` (timestamptz, default now)

## Security
- RLS enabled on both tables.
- Glasses: public read, no writes (data is managed by the operator).
- Tour bookings: public insert (tourists submit bookings), public read (no auth, so anyone can see bookings — acceptable for demo; in production, auth would restrict this).
  Note: For a production app with sensitive booking data, auth would be required. This is a no-auth demo app.
*/

CREATE TABLE IF NOT EXISTS glasses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  price integer NOT NULL,
  frame_type text NOT NULL,
  face_shapes text[] NOT NULL,
  image_url text NOT NULL,
  wearing_image_url text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE glasses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_glasses" ON glasses;
CREATE POLICY "anon_read_glasses" ON glasses FOR SELECT
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS tour_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text NOT NULL,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  party_size integer NOT NULL DEFAULT 1,
  glasses_id uuid REFERENCES glasses(id) ON DELETE SET NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tour_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_bookings" ON tour_bookings;
CREATE POLICY "anon_read_bookings" ON tour_bookings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_bookings" ON tour_bookings;
CREATE POLICY "anon_insert_bookings" ON tour_bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);
