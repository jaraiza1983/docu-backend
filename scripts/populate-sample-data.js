const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const bcrypt = require('bcryptjs');

// Database file path
const DB_PATH = path.join(__dirname, '..', 'database.sqlite');

console.log('🚀 Starting sample data population...');

// Check if database exists
if (!fs.existsSync(DB_PATH)) {
  console.error('❌ Database file not found. Please start the app first to create the database.');
  process.exit(1);
}

console.log('✅ Database found, proceeding with sample data insertion...');

// Create sample data SQL script
console.log('📝 Creating sample data...');

const sampleDataSQL = `
-- Sample Users (password: password123)
INSERT INTO users (name, email, password, role, createdAt, updatedAt) VALUES
('Admin User', 'admin@example.com', '${bcrypt.hashSync('password123', 10)}', 'admin', datetime('now'), datetime('now')),
('John Creator', 'john@example.com', '${bcrypt.hashSync('password123', 10)}', 'creator', datetime('now'), datetime('now')),
('Jane Creator', 'jane@example.com', '${bcrypt.hashSync('password123', 10)}', 'creator', datetime('now'), datetime('now')),
('Bob Creator', 'bob@example.com', '${bcrypt.hashSync('password123', 10)}', 'creator', datetime('now'), datetime('now')),
('Alice Creator', 'alice@example.com', '${bcrypt.hashSync('password123', 10)}', 'creator', datetime('now'), datetime('now'));

-- Sample Categories
INSERT INTO categories (name, description, isActive, priority, createdAt, updatedAt) VALUES
('Technology', 'Technology related content and projects', 1, 1, datetime('now'), datetime('now')),
('Business', 'Business and management content', 1, 2, datetime('now'), datetime('now')),
('Education', 'Educational content and learning materials', 1, 3, datetime('now'), datetime('now')),
('Health', 'Health and wellness content', 1, 4, datetime('now'), datetime('now')),
('Entertainment', 'Entertainment and media content', 1, 5, datetime('now'), datetime('now'));

-- Sample Subcategories
INSERT INTO subcategories (name, description, isActive, priority, categoryId, createdAt, updatedAt) VALUES
('Programming', 'Software development and coding', 1, 1, 1, datetime('now'), datetime('now')),
('AI/ML', 'Artificial Intelligence and Machine Learning', 1, 2, 1, datetime('now'), datetime('now')),
('Web Development', 'Frontend and backend web development', 1, 3, 1, datetime('now'), datetime('now')),
('Marketing', 'Digital marketing and advertising', 1, 1, 2, datetime('now'), datetime('now')),
('Finance', 'Financial management and accounting', 1, 2, 2, datetime('now'), datetime('now')),
('Leadership', 'Leadership and team management', 1, 3, 2, datetime('now'), datetime('now')),
('Online Courses', 'E-learning and online education', 1, 1, 3, datetime('now'), datetime('now')),
('Tutorials', 'Step-by-step guides and tutorials', 1, 2, 3, datetime('now'), datetime('now')),
('Fitness', 'Physical health and exercise', 1, 1, 4, datetime('now'), datetime('now')),
('Mental Health', 'Mental wellness and psychology', 1, 2, 4, datetime('now'), datetime('now')),
('Movies', 'Film reviews and recommendations', 1, 1, 5, datetime('now'), datetime('now')),
('Gaming', 'Video games and gaming content', 1, 2, 5, datetime('now'), datetime('now'));

-- Sample Project Statuses
INSERT INTO project_statuses (name, description, isActive, priority, createdAt, updatedAt) VALUES
('Planning', 'Project is in planning phase', 1, 1, datetime('now'), datetime('now')),
('In Progress', 'Project is currently being worked on', 1, 2, datetime('now'), datetime('now')),
('Review', 'Project is under review', 1, 3, datetime('now'), datetime('now')),
('Testing', 'Project is in testing phase', 1, 4, datetime('now'), datetime('now')),
('Completed', 'Project has been completed', 1, 5, datetime('now'), datetime('now')),
('On Hold', 'Project is temporarily paused', 1, 6, datetime('now'), datetime('now')),
('Cancelled', 'Project has been cancelled', 1, 7, datetime('now'), datetime('now'));

-- Sample Project Areas
INSERT INTO project_areas (name, description, isActive, priority, createdAt, updatedAt) VALUES
('Frontend Development', 'User interface and client-side development', 1, 1, datetime('now'), datetime('now')),
('Backend Development', 'Server-side and API development', 1, 2, datetime('now'), datetime('now')),
('Database Design', 'Database architecture and optimization', 1, 3, datetime('now'), datetime('now')),
('DevOps', 'Infrastructure and deployment automation', 1, 4, datetime('now'), datetime('now')),
('Mobile Development', 'iOS and Android app development', 1, 5, datetime('now'), datetime('now')),
('UI/UX Design', 'User experience and interface design', 1, 6, datetime('now'), datetime('now')),
('Testing', 'Quality assurance and testing', 1, 7, datetime('now'), datetime('now')),
('Documentation', 'Technical writing and documentation', 1, 8, datetime('now'), datetime('now'));

-- Sample Content
INSERT INTO contents (title, description, tags, status, priority, authorId, categoryId, subcategoryId, createdAt, updatedAt) VALUES
('Getting Started with TypeScript', 'A comprehensive guide to TypeScript for beginners', 'typescript,programming,beginner', 'published', 1, 2, 1, 1, datetime('now'), datetime('now')),
('React Best Practices', 'Essential patterns and practices for React development', 'react,javascript,frontend', 'published', 2, 3, 1, 3, datetime('now'), datetime('now')),
('Node.js API Development', 'Building RESTful APIs with Node.js and Express', 'nodejs,api,backend', 'published', 3, 4, 1, 2, datetime('now'), datetime('now')),
('Machine Learning Fundamentals', 'Introduction to machine learning concepts', 'ai,ml,data-science', 'draft', 4, 5, 1, 2, datetime('now'), datetime('now')),
('Digital Marketing Strategies', 'Modern digital marketing techniques and tools', 'marketing,digital,strategy', 'published', 1, 2, 2, 4, datetime('now'), datetime('now')),
('Financial Planning Basics', 'Personal and business financial planning', 'finance,planning,business', 'published', 2, 3, 2, 5, datetime('now'), datetime('now')),
('Leadership Skills Development', 'Building effective leadership capabilities', 'leadership,management,skills', 'draft', 3, 4, 2, 6, datetime('now'), datetime('now')),
('Online Course Creation', 'How to create engaging online courses', 'education,online,courses', 'published', 1, 5, 3, 7, datetime('now'), datetime('now')),
('JavaScript Tutorial Series', 'Complete JavaScript learning path', 'javascript,tutorial,learning', 'published', 2, 2, 3, 8, datetime('now'), datetime('now')),
('Fitness Training Guide', 'Comprehensive fitness and workout plans', 'fitness,health,training', 'published', 1, 3, 4, 9, datetime('now'), datetime('now')),
('Mental Health Awareness', 'Understanding and maintaining mental wellness', 'mental-health,wellness,psychology', 'draft', 2, 4, 4, 10, datetime('now'), datetime('now')),
('Movie Review: Latest Releases', 'Reviews of recent movie releases', 'movies,reviews,entertainment', 'published', 1, 5, 5, 11, datetime('now'), datetime('now')),
('Gaming Industry Trends', 'Current trends in the gaming industry', 'gaming,trends,industry', 'published', 2, 2, 5, 12, datetime('now'), datetime('now'));

-- Sample Projects
INSERT INTO projects (title, description, target, conclusion, priority, authorId, statusId, areaId, createdAt, updatedAt) VALUES
('E-commerce Platform Development', 'Building a full-stack e-commerce platform with modern technologies', 'Create a scalable e-commerce solution with user management, product catalog, and payment processing', 'Platform successfully launched with 1000+ products', 1, 2, 5, 2, datetime('now'), datetime('now')),
('Mobile App for Fitness Tracking', 'Developing a cross-platform mobile app for fitness and health tracking', 'Create an intuitive app that tracks workouts, nutrition, and health metrics', 'App completed and ready for beta testing', 2, 3, 4, 5, datetime('now'), datetime('now')),
('AI-Powered Chatbot', 'Building an intelligent chatbot using machine learning', 'Develop a chatbot that can handle customer inquiries and provide accurate responses', 'Chatbot prototype completed with 85% accuracy', 3, 4, 3, 2, datetime('now'), datetime('now')),
('Database Migration Project', 'Migrating legacy database to modern cloud solution', 'Successfully migrate all data with zero downtime and improved performance', 'Migration completed successfully with 99.9% uptime', 4, 5, 5, 3, datetime('now'), datetime('now')),
('UI/UX Redesign', 'Redesigning user interface for better user experience', 'Improve user engagement and reduce bounce rate by 30%', 'Design phase completed, ready for development', 5, 2, 2, 6, datetime('now'), datetime('now')),
('API Documentation System', 'Creating comprehensive API documentation platform', 'Build a user-friendly documentation system for all APIs', 'Documentation system in development phase', 1, 3, 2, 8, datetime('now'), datetime('now')),
('Testing Automation Framework', 'Implementing automated testing for continuous integration', 'Reduce testing time by 70% and improve code quality', 'Framework design completed, implementation in progress', 2, 4, 2, 7, datetime('now'), datetime('now')),
('DevOps Pipeline Setup', 'Setting up CI/CD pipeline for automated deployment', 'Enable automated testing and deployment for faster releases', 'Pipeline configuration in progress', 3, 5, 1, 4, datetime('now'), datetime('now'));

-- Sample Content History (tracking changes)
INSERT INTO content_history (contentId, userId, action, changes, createdAt) VALUES
(1, 2, 'created', 'Content created: Getting Started with TypeScript', datetime('now')),
(1, 2, 'updated', 'Updated title and description', datetime('now')),
(2, 3, 'created', 'Content created: React Best Practices', datetime('now')),
(3, 4, 'created', 'Content created: Node.js API Development', datetime('now')),
(4, 5, 'created', 'Content created: Machine Learning Fundamentals', datetime('now')),
(5, 2, 'created', 'Content created: Digital Marketing Strategies', datetime('now')),
(5, 2, 'updated', 'Added new marketing techniques section', datetime('now'));

-- Sample Project History (tracking project changes)
INSERT INTO project_history (projectId, userId, action, changes, createdAt) VALUES
(1, 2, 'created', 'Project created: E-commerce Platform Development', datetime('now')),
(1, 2, 'updated', 'Updated project status to completed', datetime('now')),
(2, 3, 'created', 'Project created: Mobile App for Fitness Tracking', datetime('now')),
(2, 3, 'updated', 'Moved to testing phase', datetime('now')),
(3, 4, 'created', 'Project created: AI-Powered Chatbot', datetime('now')),
(4, 5, 'created', 'Project created: Database Migration Project', datetime('now')),
(4, 5, 'updated', 'Migration completed successfully', datetime('now'));
`;

// Write SQL to file
const sqlFilePath = path.join(__dirname, 'sample-data.sql');
fs.writeFileSync(sqlFilePath, sampleDataSQL);

// Execute SQL script
console.log('💾 Populating database with sample data...');
try {
  execSync(`sqlite3 "${DB_PATH}" < "${sqlFilePath}"`, { stdio: 'inherit' });
  console.log('✅ Sample data inserted successfully');
} catch (error) {
  console.error('❌ Error inserting sample data:', error.message);
  process.exit(1);
}

// Clean up temporary SQL file
fs.unlinkSync(sqlFilePath);

console.log('\n🎉 Sample data population completed successfully!');
console.log('\n📋 Sample Data Summary:');
console.log('👥 Users: 5 users (admin@example.com, john@example.com, jane@example.com, bob@example.com, alice@example.com)');
console.log('🔑 Password for all users: password123');
console.log('📂 Categories: 5 categories (Technology, Business, Education, Health, Entertainment)');
console.log('📁 Subcategories: 12 subcategories across all categories');
console.log('📄 Content: 13 content items with various statuses');
console.log('📊 Projects: 8 projects with different statuses and areas');
console.log('📈 Project Statuses: 7 statuses (Planning, In Progress, Review, Testing, Completed, On Hold, Cancelled)');
console.log('🏢 Project Areas: 8 areas (Frontend, Backend, Database, DevOps, Mobile, UI/UX, Testing, Documentation)');
console.log('📝 History: Sample history records for content and project changes');
console.log('\n🚀 You can now test all endpoints with this sample data!'); 