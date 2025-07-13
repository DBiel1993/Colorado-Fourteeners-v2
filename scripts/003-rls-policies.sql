-- Enable Row Level Security
ALTER TABLE pending_edits ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE gear_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

-- Pending edits policies
CREATE POLICY "Users can view all pending edits" ON pending_edits
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own edit suggestions" ON pending_edits
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Admins can update pending edits" ON pending_edits
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND is_admin = true)
    );

-- Ride shares policies
CREATE POLICY "Users can view all ride shares" ON ride_shares
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own ride shares" ON ride_shares
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own ride shares" ON ride_shares
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own ride shares" ON ride_shares
    FOR DELETE USING (auth.uid()::text = user_id);

-- Gear shares policies
CREATE POLICY "Users can view available gear shares" ON gear_shares
    FOR SELECT USING (available = true OR auth.uid()::text = user_id);

CREATE POLICY "Users can create their own gear shares" ON gear_shares
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own gear shares" ON gear_shares
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Forum policies
CREATE POLICY "Users can view all forum threads" ON forum_threads
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create threads" ON forum_threads
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view all forum posts" ON forum_posts
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON forum_posts
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
