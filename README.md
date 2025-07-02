# Docu Backend - NestJS API

A complete backend built with NestJS that includes JWT authentication, user and content management with role-based access control, and comprehensive project management capabilities.

## 📍 Repository

**GitHub Repository**: [https://github.com/YOUR_USERNAME/docu-backend](https://github.com/YOUR_USERNAME/docu-backend)

> **Note**: Replace `YOUR_USERNAME` with your actual GitHub username after creating the repository.

## 🚀 Features

- **JWT Authentication**: User login and registration with secure token-based authentication
- **Role-based access control**: Admin and Creator roles with different permissions
- **SQLite database** with TypeORM for data persistence
- **Data validation** with class-validator and comprehensive DTOs
- **Modular and scalable** structure with clean architecture
- **Complete CRUD operations** for users, content, categories, subcategories, and projects
- **Route protection** with custom guards and role-based authorization
- **Content and Project Management**: Full lifecycle management with history tracking
- **API Documentation**: Auto-generated documentation and health checks
- **Comprehensive Testing**: Sample data and endpoint testing utilities

## 🛠️ Technologies

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **TypeORM** - Object-Relational Mapping
- **SQLite** - Lightweight database
- **JWT** - JSON Web Tokens for authentication
- **Passport.js** - Authentication middleware
- **bcryptjs** - Password hashing
- **class-validator** - Data validation
- **class-transformer** - Object transformation

## 📊 Database Schema

The application includes the following entities:

### Core Entities
- **Users**: Authentication and user management
- **Categories**: Content categorization
- **Subcategories**: Detailed content classification
- **Contents**: Main content items with rich metadata
- **Projects**: Project management with status tracking

### Supporting Entities
- **Project Statuses**: Project lifecycle states
- **Project Areas**: Project classification areas
- **Content History**: Audit trail for content changes
- **Project History**: Audit trail for project changes

### Sample Data
The database comes pre-populated with:
- **5 Users** (1 Admin, 4 Creators) - Password: `password123`
- **5 Categories** (Technology, Business, Education, Health, Entertainment)
- **12 Subcategories** across all categories
- **13 Content Items** with various statuses
- **8 Projects** with different statuses and areas
- **7 Project Statuses** (Planning, In Progress, Review, Testing, Completed, On Hold, Cancelled)
- **8 Project Areas** (Frontend, Backend, Database, DevOps, Mobile, UI/UX, Testing, Documentation)
- **History Records** for content and project changes

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/docu-backend.git
cd docu-backend
```

> **Note**: Replace `YOUR_USERNAME` with your actual GitHub username.

2. **Install dependencies**
```bash
npm install
```

3. **Setup the database and sample data**
```bash
# Start the application to create database tables
npm run start

# In a new terminal, populate with sample data
npm run populate
```

4. **Start the development server**
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api`

## 📝 Available Scripts

```bash
# Development
npm run start:dev          # Server with hot reload
npm run start:debug        # Server with debug

# Production
npm run build             # Compile TypeScript
npm run start:prod        # Run in production

# Database Management
npm run populate          # Populate database with sample data
npm run reset-db          # Reset database and populate with sample data
npm run test-api          # Test all API endpoints

# Migrations
npm run migration:generate # Generate migration
npm run migration:run     # Run migrations
npm run migration:revert  # Revert last migration

# Testing
npm run test              # Run tests
npm run test:watch        # Tests with watch
npm run test:e2e          # End-to-end tests

# Linting and formatting
npm run lint              # Linting
npm run format            # Format code

# Setup
npm run setup             # Initial setup
```

## 🔐 Authentication

### Sample Users
- **Admin**: `admin@example.com` / `password123`
- **Creator**: `john@example.com` / `password123`
- **Creator**: `jane@example.com` / `password123`
- **Creator**: `bob@example.com` / `password123`
- **Creator**: `alice@example.com` / `password123`

### Login
```bash
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Role-Based Access Control

#### Admin Role
- ✅ **Full access to all endpoints**
- ✅ **Can manage users, categories, subcategories, project statuses, and areas**
- ✅ **Can view, create, update, and delete all content and projects**
- ✅ **Can register new users**

#### Creator Role
- ✅ **Can view all content and projects** (from all users)
- ✅ **Can create, update, and delete any content** (collaborative editing)
- ✅ **Can only update and delete their own projects** (project ownership protection)
- ✅ **Can view public categories and subcategories**
- ❌ **Cannot access user management or system configuration**

## 📁 Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Authentication DTOs
│   ├── guards/          # Security guards
│   ├── strategies/      # Passport strategies
│   ├── decorators/      # Custom decorators
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/               # Users module
│   ├── dto/            # User DTOs
│   ├── entities/       # TypeORM entities
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── content/            # Content module
│   ├── dto/           # Content DTOs
│   ├── entities/      # TypeORM entities
│   ├── services/      # Content services
│   ├── content.controller.ts
│   ├── content.service.ts
│   └── content.module.ts
├── categories/         # Categories module
│   ├── dto/           # Category DTOs
│   ├── entities/      # Category entities
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── categories.module.ts
├── subcategories/      # Subcategories module
│   ├── dto/           # Subcategory DTOs
│   ├── entities/      # Subcategory entities
│   ├── subcategories.controller.ts
│   ├── subcategories.service.ts
│   └── subcategories.module.ts
├── projects/          # Projects module
│   ├── dto/           # Project DTOs
│   ├── entities/      # Project entities
│   ├── services/      # Project services
│   ├── projects.controller.ts
│   ├── projects.service.ts
│   └── projects.module.ts
├── docs/              # Documentation module
│   ├── docs.controller.ts
│   └── docs.module.ts
├── config/            # Configurations
│   └── typeorm.config.ts
├── migrations/        # Database migrations
├── app.module.ts      # Main module
└── main.ts           # Entry point
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file based on `env.example`:

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

## 📚 API Documentation

- **Interactive API Docs**: `http://localhost:3000/api/docs`
- **API Specification**: `http://localhost:3000/api/docs/api-spec`
- **Markdown Documentation**: `http://localhost:3000/api/docs/markdown`
- **Health Check**: `http://localhost:3000/api/docs/health`

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🧪 Testing

### Endpoint Testing
Run the comprehensive endpoint test suite:
```bash
npm run test-api
```

This will test:
- Authentication (Admin and Creator login)
- Public endpoints (categories, subcategories)
- Protected endpoints (users, content, projects)
- Role-based access control
- History tracking
- Health checks

### Manual Testing
Use the sample data provided to test all endpoints:

1. **Login as Admin**:
   ```bash
   POST /api/auth/login
   {"email": "admin@example.com", "password": "password123"}
   ```

2. **Access protected resources**:
   ```bash
   GET /api/users (Admin only)
   GET /api/content (Admin sees all, Creator sees own)
   GET /api/projects (Admin sees all, Creator sees own)
   ```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Role-based Authorization**: Admin and Creator roles
- **Input Validation**: Comprehensive DTO validation
- **CORS Protection**: Cross-origin resource sharing configuration
- **SQL Injection Protection**: TypeORM parameterized queries

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start:prod
```

### Environment Variables for Production
```env
NODE_ENV=production
JWT_SECRET=your-production-secret-key
DATABASE_URL=sqlite:./production-database.sqlite
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Database Connection Issues**
```bash
# Reset database
npm run reset-db
```

**Authentication Issues**
- Verify JWT_SECRET is set
- Check user credentials in database
- Ensure proper token format in Authorization header

**Migration Issues**
```bash
# Generate new migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run
```

**Port Already in Use**
```bash
# Kill existing processes
taskkill /F /IM node.exe
# Or change port in .env file
PORT=3001
```

For more detailed troubleshooting, see [QUICKSTART.md](./QUICKSTART.md) 