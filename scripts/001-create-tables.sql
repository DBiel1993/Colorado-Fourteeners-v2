-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    azure_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trails table
CREATE TABLE trails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    elevation INTEGER NOT NULL,
    difficulty VARCHAR(50) CHECK (difficulty IN ('easy', 'moderate', 'hard', 'expert')),
    distance DECIMAL(5,2) NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    description TEXT,
    route_description TEXT,
    search_vector TSVECTOR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create search index
CREATE INDEX trails_search_idx ON trails USING GIN(search_vector);
CREATE INDEX trails_location_idx ON trails USING GIST(location);

-- Pending edits table
CREATE TABLE pending_edits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trail_id UUID REFERENCES trails(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    old_value TEXT NOT NULL,
    new_value TEXT NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ride shares table
CREATE TABLE ride_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    trail_id UUID REFERENCES trails(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    departure_time TIME NOT NULL,
    departure_location VARCHAR(255) NOT NULL,
    available_spots INTEGER NOT NULL CHECK (available_spots > 0),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gear shares table
CREATE TABLE gear_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    condition VARCHAR(20) CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
    price_per_day DECIMAL(8,2) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum threads table
CREATE TABLE forum_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum posts table
CREATE TABLE forum_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES forum_threads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX pending_edits_status_idx ON pending_edits(status);
CREATE INDEX ride_shares_date_idx ON ride_shares(date);
CREATE INDEX gear_shares_available_idx ON gear_shares(available);
CREATE INDEX forum_posts_thread_idx ON forum_posts(thread_id);

-- Update search vector trigger
CREATE OR REPLACE FUNCTION update_trails_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', 
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(NEW.route_description, '') || ' ' ||
        COALESCE(NEW.difficulty, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trails_search_vector_update
    BEFORE INSERT OR UPDATE ON trails
    FOR EACH ROW EXECUTE FUNCTION update_trails_search_vector();
