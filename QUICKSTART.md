# Quick Start Guide - Docu Backend

## 🚀 Get Started in 5 Minutes

This guide will help you get the Docu Backend up and running quickly with sample data for testing all endpoints.

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git** (for cloning)

## ⚡ Quick Setup

### 1. Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd docu-backend

# Install dependencies
npm install
```

### 2. Start the Application
```bash
# Start the development server
npm run start:dev
```

The API will be available at `http://localhost:3000/api`

### 3. Populate Sample Data
```bash
# In a new terminal, populate with sample data
npm run populate
```

### 4. Test the API
```bash
# Run comprehensive endpoint tests
npm run test-api
```

## 🔐 Quick Authentication Test

### Login as Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### Login as Creator
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## 📊 Sample Data Overview

The system comes pre-populated with comprehensive test data:

### Users (Password: `password123`)
- **Admin**: `admin@example.com`
- **Creators**: `john@example.com`, `jane@example.com`, `bob@example.com`, `alice@example.com`

### Content Structure
- **5 Categories**: Technology, Business, Education, Health, Entertainment
- **12 Subcategories**: Programming, AI/ML, Web Development, Marketing, Finance, Leadership, Online Courses, Tutorials, Fitness, Mental Health, Movies, Gaming
- **13 Content Items**: Various articles with different statuses and priorities
- **8 Projects**: Complete project lifecycle examples

### Project Management
- **7 Project Statuses**: Planning, In Progress, Review, Testing, Completed, On Hold, Cancelled
- **8 Project Areas**: Frontend, Backend, Database, DevOps, Mobile, UI/UX, Testing, Documentation

## 🧪 Testing Endpoints

### Public Endpoints (No Authentication Required)
```bash
# Get public categories
curl http://localhost:3000/api/categories/public

# Get public subcategories
curl http://localhost:3000/api/subcategories/public

# Get project statuses
curl http://localhost:3000/api/project-statuses/public

# Get project areas
curl http://localhost:3000/api/project-areas/public

# Health check
curl http://localhost:3000/api/docs/health
```

### Protected Endpoints (Authentication Required)
```bash
# First, get a token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' | \
  jq -r '.access_token')

# Get all users (Admin only)
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/users

# Get all content (Admin sees all, Creator sees own)
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/content

# Get all projects
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/projects
```

### Manual Testing
Use the sample data provided to test all endpoints:

1. **Login as Admin**:
   ```bash
   POST /api/auth/login
   {"email": "admin@example.com", "password": "password123"}
   ```

2. **Login as Creator**:
   ```bash
   POST /api/auth/login
   {"email": "jane@example.com", "password": "password123"}
   ```

3. **Access protected resources**:
   ```bash
   GET /api/users (Admin only)
   GET /api/content (Both Admin and Creator see all content)
   GET /api/projects (Both Admin and Creator see all projects)
   ```

4. **Test content collaboration**:
   ```bash
   # Creator can update any content
   PATCH /api/content/40 (Creator can update admin's content)
   
   # Creator can only update their own projects
   PATCH /api/projects/1 (Creator can only update if they own it)
   ```

## 📚 API Documentation

### Interactive Documentation
- **Main Docs**: http://localhost:3000/api/docs
- **API Spec**: http://localhost:3000/api/docs/api-spec
- **Markdown**: http://localhost:3000/api/docs/markdown
- **Health Check**: http://localhost:3000/api/docs/health

## 🔧 Available Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debug mode

# Database Management
npm run populate           # Populate with sample data
npm run reset-db           # Reset database and populate
npm run test-api           # Test all endpoints

# Production
npm run build             # Build for production
npm run start:prod        # Start production server

# Migrations
npm run migration:generate # Generate migration
npm run migration:run     # Run migrations
npm run migration:revert  # Revert last migration

# Testing
npm run test              # Run unit tests
npm run test:e2e          # Run e2e tests

# Code Quality
npm run lint              # Run linter
npm run format            # Format code
```

## 🎯 Common Use Cases

### 1. Content Management
```bash
# Create new content
curl -X POST http://localhost:3000/api/content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "My First Article",
    "description": "This is my first article",
    "tags": ["tutorial", "beginner"],
    "status": "draft",
    "categoryId": 1,
    "subcategoryId": 1,
    "priority": 50
  }'

# Get content history
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/content/history/my
```

### 2. Project Management
```bash
# Create new project
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "My First Project",
    "description": "This is my first project",
    "target": "Complete the project successfully",
    "priority": 75,
    "statusId": 1,
    "areaId": 1
  }'

# Get project history
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/projects/history/my
```

### 3. Category Management (Admin Only)
```bash
# Create new category
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "New Category",
    "description": "A new category for content",
    "isActive": true,
    "priority": 60
  }'

# Toggle category status
curl -X PATCH http://localhost:3000/api/categories/1/toggle \
  -H "Authorization: Bearer $TOKEN"
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill existing Node.js processes
taskkill /F /IM node.exe

# Or change port in .env file
PORT=3001
```

#### 2. Database Issues
```bash
# Reset database completely
npm run reset-db

# Or just populate with sample data
npm run populate
```

#### 3. Authentication Issues
- Verify the user exists in the database
- Check password is correct (`password123`)
- Ensure JWT_SECRET is set in environment

#### 4. Migration Issues
```bash
# Generate new migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run
```

### Environment Variables
Create a `.env` file if needed:
```env
# Database
DATABASE_URL=sqlite:./database.sqlite

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Server
PORT=3000
NODE_ENV=development
```

## 📈 Performance Tips

### Development
- Use `npm run start:dev` for hot reload during development
- Monitor database performance with SQLite browser
- Use the test script to verify functionality

### Production
- Use `npm run build && npm run start:prod`
- Consider PostgreSQL for better performance
- Implement caching with Redis
- Add rate limiting for public endpoints

## 🎉 Next Steps

1. **Explore the API**: Use the interactive documentation
2. **Test Endpoints**: Run the comprehensive test suite
3. **Create Content**: Add your own content and projects
4. **Customize**: Modify entities and add new features
5. **Deploy**: Follow production deployment guidelines

## 📞 Support

- **Documentation**: Check `README.md` and `API_DOCUMENTATION.md`
- **Issues**: Review `PROJECT_REVIEW.md` for known issues
- **Testing**: Use `npm run test-api` to verify functionality

---

**Quick Start Guide** - Version 2.0.0  
**Last Updated**: July 1, 2025 