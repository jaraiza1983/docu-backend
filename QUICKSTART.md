# 🚀 Quick Start Guide

Get your CMS API up and running in minutes!

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
Create a `.env` file in the root directory:
```bash
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 3. Reset Database with Sample Data
```bash
npm run reset-db
```

### 4. Start the Development Server
```bash
npm run start:dev
```

### 5. Access the API
- **API Documentation**: http://localhost:3000/api
- **OpenAPI JSON**: http://localhost:3000/api-json

## 🔑 Sample Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Editor | `editor` | `editor123` |
| Viewer | `viewer` | `viewer123` |

## 🧪 Testing the API

### Run All Tests
```bash
npm run test-api
```

### Test Individual Endpoints
Use the provided Postman collection: `cms_api.postman_collection.json`

## 📚 Key Endpoints

### Authentication
- `POST /auth/login` - Login with username/password

### Users (Admin Only)
- `GET /users` - Get all users
- `POST /users` - Create new user

### Categories (Admin Only for Management)
- `GET /categories` - Get all categories
- `POST /categories` - Create new category

### Topics (Admin/Editor for Management)
- `GET /topics` - Get all topics
- `POST /topics` - Create new topic

### Projects (Admin/Editor for Management)
- `GET /projects` - Get all projects
- `POST /projects` - Create new project

### Files (Admin for Upload/Management, Public for Download)
- `POST /files/upload` - Upload a new file (Admin only)
- `GET /files` - Get all files with filters
- `GET /files/:id/download` - Download a file (Public access - no authentication required)

## 🔒 Role-Based Access

- **Admin**: Full access to all features, including file management
- **Editor**: Can create/edit topics and own projects, can download files
- **Viewer**: Read-only access to content, can download files
- **Public**: Can download files without authentication

## 🆘 Need Help?

- Check the full documentation in `README.md`
- Review the API documentation at http://localhost:3000/api
- Use the Postman collection for testing
- Run `npm run test-api` to verify everything works

## 🚀 Next Steps

1. Explore the API documentation
2. Test different user roles
3. Create your own content
4. Customize the system for your needs

Happy coding! 🎉 