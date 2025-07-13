# CMS API - Content Management System

A robust Content Management System (CMS) API built with NestJS, featuring user management, content management, and role-based access control.

## 🚀 Features

- **User Management**: Create and modify users with role-based permissions
- **Content Management**: Manage topics and projects with full CRUD operations
- **Authentication**: JWT-based authentication with login history tracking
- **Authorization**: Role-based access control (admin, editor, viewer)
- **History Tracking**: Complete audit trail for all content modifications
- **Categories for topics**: Hierarchical categorization system for topics
- **Categories for projects**: Hierarchical categorization system for projects
- **File Management**: Upload, download, and manage files with role-based access control
- **RESTful API**: Clean, consistent API design
- **Security Features**: JWT authentication, password hashing, SQL injection prevention, CORS support

## 🛠️ Technology Stack

- **Framework**: NestJS
- **Database**: SQLite
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: Bcrypt
- **Validation**: Class-validator
- **Documentation**: Swagger/OpenAPI 3.0
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd docu_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run start:dev
   ```

4. **Reset database with sample data**
   ```bash
   npm run reset-db
   ```

5. **Access the API documentation**
   - Swagger UI: http://localhost:3000/api
   - OpenAPI JSON: http://localhost:3000/api-json

## 🔧 Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start the application in development mode with hot reload
- `npm run build` - Build the application
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run reset-db` - Reset database to sample data
- `npm run test-api` - Run comprehensive API tests

## 👥 User Roles & Permissions

### Admin Role
- ✅ Create, modify, and view all users
- ✅ Create, modify, and view all topics and projects
- ✅ Manage categories and subcategories for topics
- ✅ Manage categories for projects
- ✅ Upload, modify, and delete files
- ✅ Full system access

### Editor Role
- ✅ Create, modify, and view topics
- ✅ Create, modify (only their own), and view projects
- ✅ Download files (public access)
- ❌ Cannot manage users
- ❌ Cannot manage categories
- ❌ Cannot upload or manage files

### Viewer Role
- ✅ View all topics and projects
- ✅ Download files (public access)
- ❌ Cannot create or modify content
- ❌ Cannot manage users
- ❌ Cannot manage categories
- ❌ Cannot upload or manage files

## 🔐 Authentication

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }
}
```

### Using JWT Token
Include the token in the Authorization header:
```http
Authorization: Bearer <your-jwt-token>
```

## 📚 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `GET /auth/login-history` - Get login history (Admin only)

### Users (Admin only)
- `GET /users` - Get all users
- `POST /users` - Create new user
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `PATCH /users/:id/deactivate` - Deactivate user
- `PATCH /users/:id/activate` - Activate user
- `PATCH /users/:id/role` - Change user role

### Categories (Admin only for management)
- `GET /categories` - Get all categories
- `GET /categories/root` - Get root categories only
- `GET /categories/:parentId/subcategories` - Get subcategories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create new category (Admin only)
- `PATCH /categories/:id` - Update category (Admin only)
- `DELETE /categories/:id` - Delete category (Admin only)

### Project Categories (Admin only for management)
- `GET /project-categories` - Get all project categories
- `GET /project-categories/root` - Get root project categories only
- `GET /project-categories/:parentId/subcategories` - Get subcategories
- `GET /project-categories/:id` - Get project category by ID
- `POST /project-categories` - Create new project category (Admin only)
- `PATCH /project-categories/:id` - Update project category (Admin only)
- `DELETE /project-categories/:id` - Delete project category (Admin only)

### Topics
- `GET /topics` - Get all topics
- `GET /topics/category/:categoryId` - Get topics by category
- `GET /topics/subcategory/:subcategoryId` - Get topics by subcategory
- `GET /topics/user/:userId` - Get topics by user
- `GET /topics/:id` - Get topic by ID
- `POST /topics` - Create new topic (Admin/Editor only)
- `PATCH /topics/:id` - Update topic (Admin/Editor only)
- `DELETE /topics/:id` - Delete topic (Admin/Editor only)

### Projects
- `GET /projects` - Get all projects
- `GET /projects/category/:categoryId` - Get projects by category
- `GET /projects/user/:userId` - Get projects by user
- `GET /projects/:id` - Get project by ID
- `POST /projects` - Create new project (Admin/Editor only)
- `PATCH /projects/:id` - Update project (Admin/Editor only - own projects only)
- `DELETE /projects/:id` - Delete project (Admin/Editor only - own projects only)

### Files
- `POST /files/upload` - Upload a new file (Admin only)
- `GET /files` - Get all files with optional filters
- `GET /files/stats` - Get file upload statistics and limits
- `GET /files/:id` - Get file information by ID
- `GET /files/:id/download` - Download a file by ID (Public access - no authentication required)
- `PATCH /files/:id` - Update file information (Admin only)
- `DELETE /files/:id` - Delete a file (Admin only)

**File Filters:**
- Filter by filename: `?name=document`
- Filter by extension: `?extension=pdf`
- Filter by upload date range: `?uploadedFrom=2024-01-01T00:00:00.000Z&uploadedTo=2024-12-31T23:59:59.999Z`
- Pagination: `?page=1&limit=10`

**Supported File Types:**
- Excel files (.xlsx)
- PDF documents (.pdf)
- Video files (.mp4)
- Word documents (.docx)
- PowerPoint presentations (.pptx)

## 📊 Sample Data

The system comes with pre-loaded sample data:

### Users
- **Admin**: `admin` / `admin123`
- **Editor**: `editor` / `editor123`
- **Viewer**: `viewer` / `viewer123`

### Categories
- Technology
  - Web Development
  - Mobile Development
- Business
  - Marketing

### Project Categories
- Web Projects
- Mobile Projects
- Business Projects

### Sample Content
- 3 sample topics
- 3 sample projects
- File uploads (when created by admin users)

## 🧪 Testing

### Run API Tests
```bash
npm run test-api
```

This will:
- Reset the database to sample data
- Test all endpoints with different user roles
- Verify role-based access control
- Test authentication flows
- Print a comprehensive test report

### Test Coverage
- ✅ Login endpoints for all user roles
- ✅ User management endpoints (admin only)
- ✅ Category and subcategory endpoints
- ✅ Topic management endpoints
- ✅ Project management endpoints
- ✅ File management endpoints (upload, download, list, update, delete)
- ✅ Role-based access control verification

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password hashing with salt rounds
- **SQL Injection Prevention**: TypeORM with prepared statements
- **CORS Support**: Cross-origin request handling
- **Role-based Access Control**: Granular permissions system
- **Input Validation**: Comprehensive data validation with class-validator
- **Login History Tracking**: Audit trail for authentication attempts

## 📁 Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── entities/        # Database entities
│   ├── guards/          # Authentication guards
│   ├── strategies/      # Passport strategies
│   └── decorators/      # Custom decorators
├── users/               # User management module
├── categories/          # Topic categories module
├── project-categories/  # Project categories module
├── topics/              # Topics module
├── projects/            # Projects module
├── files/               # File management module
└── main.ts              # Application entry point
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start:prod
```

### Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
JWT_SECRET=your-secret-key-here
```

## 📝 API Documentation

### Swagger UI
Access the interactive API documentation at: http://localhost:3000/api

### OpenAPI Specification
Download the OpenAPI 3.0 specification at: http://localhost:3000/api-json

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation at http://localhost:3000/api
- Review the test files for usage examples
- Open an issue in the repository

## 🔄 Database Schema

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `firstName`
- `lastName`
- `role` (admin, editor, viewer)
- `password` (Hashed)
- `isActive`
- `createdAt`
- `updatedAt`

### Categories Table
- `id` (Primary Key)
- `name`
- `description`
- `parentId` (Foreign Key to Categories)
- `createdAt`
- `updatedAt`

### Project Categories Table
- `id` (Primary Key)
- `name`
- `description`
- `parentId` (Foreign Key to Project Categories)
- `createdAt`
- `updatedAt`

### Topics Table
- `id` (Primary Key)
- `title`
- `body`
- `categoryId` (Foreign Key to Categories)
- `subcategoryId` (Foreign Key to Categories)
- `createdById` (Foreign Key to Users)
- `updatedById` (Foreign Key to Users)
- `createdAt`
- `updatedAt`

### Projects Table
- `id` (Primary Key)
- `title`
- `body`
- `categoryId` (Foreign Key to Project Categories)
- `createdById` (Foreign Key to Users)
- `updatedById` (Foreign Key to Users)
- `createdAt`
- `updatedAt`

### Login History Table
- `id` (Primary Key)
- `userId` (Foreign Key to Users)
- `ipAddress`
- `userAgent`
- `success`
- `createdAt`

### Files Table
- `id` (Primary Key)
- `originalName` (Original filename)
- `filename` (Generated unique filename)
- `extension` (File extension: xlsx, pdf, mp4, docx, pptx)
- `size` (File size in bytes)
- `mimeType` (MIME type)
- `path` (File path in storage)
- `description` (Optional file description)
- `uploadedById` (Foreign Key to Users)
- `uploadedAt` (Upload timestamp)
- `updatedAt` (Last update timestamp)
- `isActive` (Soft delete flag) 