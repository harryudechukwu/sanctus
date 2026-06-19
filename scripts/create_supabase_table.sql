-- Create the saints table
CREATE TABLE saints (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'saint',
  feast_day TEXT,
  patronage JSONB DEFAULT '[]',
  short_bio TEXT,
  full_bio TEXT,
  symbols JSONB DEFAULT '[]',
  image_url TEXT,
  death_year INTEGER,
  origin_country TEXT
);

-- Enable Row Level Security
ALTER TABLE saints ENABLE ROW LEVEL SECURITY;

-- Allow anon read access
CREATE POLICY "anon can read saints"
  ON saints FOR SELECT
  TO anon
  USING (true);

-- Allow anon insert (for import)
CREATE POLICY "anon can insert saints"
  ON saints FOR INSERT
  TO anon
  WITH CHECK (true);
