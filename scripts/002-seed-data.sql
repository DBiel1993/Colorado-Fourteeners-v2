-- Insert sample trails
INSERT INTO trails (name, elevation, difficulty, distance, location, description, route_description) VALUES
('Mount Elbert', 14440, 'moderate', 9.5, ST_GeogFromText('POINT(-106.4453 39.1178)'), 
 'The highest peak in Colorado and second highest in the contiguous United States.',
 'Standard Northeast Ridge route via East Ridge Trail. Well-marked trail with steady elevation gain.'),

('Mount Massive', 14428, 'moderate', 13.0, ST_GeogFromText('POINT(-106.4757 39.1875)'),
 'Second highest peak in Colorado with expansive summit plateau.',
 'East Slopes route via Halfmoon Creek. Long approach with moderate difficulty.'),

('Mount Harvard', 14421, 'hard', 13.5, ST_GeogFromText('POINT(-106.3208 38.9244)'),
 'Remote peak in the Collegiate Peaks Wilderness.',
 'North Slopes route requires navigation skills and creek crossings.'),

('Blanca Peak', 14351, 'expert', 11.0, ST_GeogFromText('POINT(-105.4856 37.5775)'),
 'Highest peak in the Sangre de Cristo Range with technical sections.',
 'Lake Como route involves 4WD access and Class 3 scrambling near summit.'),

('La Plata Peak', 14343, 'moderate', 9.0, ST_GeogFromText('POINT(-106.4729 39.0294)'),
 'Popular peak with excellent views of the Sawatch Range.',
 'Southwest Ridge route via Winfield. Steady climb on good trail.'),

('Uncompahgre Peak', 14321, 'moderate', 7.5, ST_GeogFromText('POINT(-107.4621 38.0717)'),
 'Highest peak in the San Juan Mountains.',
 'Standard route via Nellie Creek. Short but steep approach.'),

('Crestone Peak', 14300, 'expert', 13.0, ST_GeogFromText('POINT(-105.5851 37.9669)'),
 'Technical peak requiring Class 3-4 scrambling.',
 'South Face route involves exposed scrambling and route-finding.'),

('Mount Lincoln', 14293, 'moderate', 6.0, ST_GeogFromText('POINT(-106.1065 39.3515)'),
 'Accessible peak near Alma with mining history.',
 'East Ridge route from Kite Lake. Short hike with great views.');
