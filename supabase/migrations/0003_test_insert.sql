
-- Insert a test record
INSERT INTO leads (name, email, phone, lead_source, consent)
VALUES ('Test User', 'test@example.com', '555-123-4567', 'test', true)
RETURNING *;

-- Check if the record was inserted
SELECT * FROM leads WHERE email = 'test@example.com';