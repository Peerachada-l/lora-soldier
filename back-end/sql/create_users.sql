-- Users table for username/password login.
-- The `password` column must store a bcrypt hash of the plain password (never plaintext).

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_users_username ON users (username);

-- Example: user "admin" with plain password "admin123" (bcrypt hash below).
-- Generate a new hash with:
-- python -c "import bcrypt; print(bcrypt.hashpw(b'YOUR_PASSWORD', bcrypt.gensalt()).decode())"
INSERT INTO users (username, password)
VALUES (
    'admin',
    '$2b$12$znNUyT..A8oMkF6wAm6Alev8xnnx83XwDjM4tMDIEp5QYC8m8Wvvu'
)
ON CONFLICT (username) DO NOTHING;
