-- Insert sample categories
INSERT INTO categories (name, description, isActive) VALUES 
('Technology', 'Content related to technology and innovation', 1),
('Education', 'Educational and learning content', 1),
('Health', 'Content related to health and wellness', 1),
('Business', 'Business and entrepreneurship content', 1),
('Entertainment', 'Entertainment and leisure content', 1);

-- Insert sample subcategories
INSERT INTO subcategories (name, description, isActive, categoryId) VALUES 
('Programming', 'Software development and programming', 1, 1),
('Artificial Intelligence', 'AI, machine learning and automation', 1, 1),
('Cybersecurity', 'Computer security and data protection', 1, 1),
('Mathematics', 'Mathematical content and logic', 1, 2),
('Sciences', 'Physics, chemistry and biology', 1, 2),
('Languages', 'Language learning', 1, 2),
('Nutrition', 'Healthy eating and diets', 1, 3),
('Exercise', 'Fitness and physical activity', 1, 3),
('Mental', 'Mental health and psychological wellness', 1, 3),
('Marketing', 'Digital marketing strategies', 1, 4),
('Finance', 'Financial management and investments', 1, 4),
('Leadership', 'Leadership skills development', 1, 4),
('Movies', 'Movie reviews and analysis', 1, 5),
('Music', 'Music and artists', 1, 5),
('Video Games', 'Gaming and entertainment technology', 1, 5); 