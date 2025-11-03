-- Create users table with all constraints
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    email_lower VARCHAR(255) GENERATED ALWAYS AS (LOWER(email)) STORED UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    password_hash VARCHAR(255),
    auth_provider VARCHAR(50) NOT NULL DEFAULT 'email',
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    google_id VARCHAR(255) UNIQUE,
    activation_code VARCHAR(6),
    activation_expiry TIMESTAMP,
    reset_code VARCHAR(6),
    reset_code_expires_at TIMESTAMP,
    login_attempts INTEGER NOT NULL DEFAULT 0,
    last_login TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_auth_provider CHECK (auth_provider IN ('email', 'google')),
    CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

-- Create sessions table (for connect-pg-simple)
CREATE TABLE IF NOT EXISTS user_sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP NOT NULL
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL CHECK (LENGTH(comment) > 0),
    likes INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create review_likes table
CREATE TABLE IF NOT EXISTS review_likes (
    review_id INTEGER NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (review_id, user_id)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL CHECK (LENGTH(name) > 0),
    email VARCHAR(255) NOT NULL CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    service VARCHAR(255) NOT NULL CHECK (LENGTH(service) > 0),
    date DATE NOT NULL,
    time TIME NOT NULL,
    consultation_method VARCHAR(50) NOT NULL CHECK (consultation_method IN ('Teams', 'WhatsApp Call', 'Other')),
    whatsapp_contact VARCHAR(50),
    teams_link TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_whatsapp_required CHECK (
        (consultation_method = 'WhatsApp Call' AND whatsapp_contact IS NOT NULL) OR
        (consultation_method != 'WhatsApp Call')
    )
);

-- Create inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL CHECK (LENGTH(name) > 0),
    email VARCHAR(255) NOT NULL CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    organization VARCHAR(255),
    message TEXT NOT NULL CHECK (LENGTH(message) > 10),
    inquiry_type VARCHAR(100) NOT NULL CHECK (LENGTH(inquiry_type) > 0),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create refresh_tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    token VARCHAR(255) PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users(email_lower);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expire ON user_sessions(expire);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);