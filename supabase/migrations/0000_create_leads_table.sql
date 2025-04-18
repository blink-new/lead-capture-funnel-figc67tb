
-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  phone TEXT,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  lead_source TEXT,
  consent BOOLEAN DEFAULT true,
  downloaded BOOLEAN DEFAULT false
);

-- Create RLS policies
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert leads
CREATE POLICY "Allow anonymous users to insert leads" ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow service role to read all leads
CREATE POLICY "Allow service role to read all leads" ON leads
  FOR SELECT
  TO service_role
  USING (true);