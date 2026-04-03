

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'citizen'CHECK (role IN ('citizen', 'admin')),
    created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    -- status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'in_progress', 'resolved')),
    category VARCHAR(50) NOT NULL CHECK (category IN ('accident', 'fighting', 'rioting', 'other')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE report_images (
    id SERIAL PRIMARY KEY,
    report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE report_geolocation (
    id SERIAL PRIMARY KEY,
    report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT NOW() + interval '7 days' 
);

create TABLE idempotency_keys (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- CREATE TABLE report_status_history (
--     id SERIAL PRIMARY KEY,
--     report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
--     status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'in_progress', 'resolved')),
--     changed_at TIMESTAMP DEFAULT NOW()
-- );

-- CREATE TABLE comments (
--     id SERIAL PRIMARY KEY,
--     report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
--     user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--     comment TEXT NOT NULL,
--     created_at TIMESTAMP DEFAULT NOW()
-- );