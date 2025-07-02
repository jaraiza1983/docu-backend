# API Documentation - Content and Project Management System

## 📋 General Information

- **Base URL**: `http://localhost:3000/api`
- **Version**: 2.0.0
- **Response format**: JSON
- **Authentication**: JWT Bearer Token
- **Database**: SQLite with TypeORM
- **Sample Data**: Pre-populated with comprehensive test data

## 🔐 Authentication

### Login
- **POST** `/auth/login`
- **Description**: Login and obtain JWT token
- **Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "jwt_token_here",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
  ```

### Register (Admin Only)
- **POST** `/auth/register`
- **Authentication**: Required (ADMIN)
- **Description**: Register new user (administrators only)
- **Body**:
  ```json
  {
    "name": "New User",
    "email": "new@example.com",
    "password": "password123",
    "role": "creator"
  }
  ```

## 👥 Users

### Get All Users (Admin Only)
- **GET** `/users`
- **Authentication**: Required (ADMIN)
- **Description**: Retrieve all users in the system
- **Response**: Array of user objects

### Get User by ID (Admin Only)
- **GET** `/users/:id`
- **Authentication**: Required (ADMIN)
- **Description**: Retrieve specific user by ID

### Create User (Admin Only)
- **POST** `/users`
- **Authentication**: Required (ADMIN)
- **Body**:
  ```json
  {
    "name": "New User",
    "email": "new@example.com",
    "password": "password123",
    "role": "creator"
  }
  ```

### Update User (Admin Only)
- **PATCH** `/users/:id`
- **Authentication**: Required (ADMIN)
- **Body**: Partial user object

### Delete User (Admin Only)
- **DELETE** `/users/:id`
- **Authentication**: Required (ADMIN)

## 📄 Content Management

### Create Content
- **POST** `/content`
- **Authentication**: Required (CREATOR, ADMIN)
- **Body**:
  ```json
  {
    "title": "Article Title",
    "description": "Detailed content description",
    "tags": ["tag1", "tag2", "tag3"],
    "status": "draft",
    "categoryId": 1,
    "subcategoryId": 2,
    "priority": 85
  }
  ```

### Get Content List
- **GET** `/content`
- **Authentication**: Required (CREATOR, ADMIN)
- **Description**: Both admins and creators can see all content (collaborative viewing)
- **Query Parameters**:
  - `orderBy`: Field to sort by (`priority`, `createdAt`, `updatedAt`, `title`)
  - `orderDirection`: Sort direction (`ASC`, `DESC`)
- **Examples**:
  - `GET /content?orderBy=priority&orderDirection=DESC` - Sort by priority descending
  - `GET /content?orderBy=createdAt&orderDirection=ASC` - Sort by creation date ascending

### Get Content by ID
- **GET** `/content/:id`
- **Authentication**: Required (CREATOR, ADMIN)
- **Description**: Both admins and creators can access any content

### Update Content
- **PATCH** `/content/:id`
- **Authentication**: Required (CREATOR, ADMIN)
- **Description**: Both admins and creators can update any content (collaborative editing)
- **Body**:
  ```json
  {
    "title": "Updated Title",
    "description": "Updated description",
    "tags": ["new-tag"],
    "status": "published",
    "priority": 90
  }
  ```

### Delete Content
- **DELETE** `/content/:id`
- **Authentication**: Required (CREATOR, ADMIN)
- **Description**: Both admins and creators can delete any content

### Content History
- **GET** `/content/:id/history` - History of specific content
- **GET** `/content/history/user/:userId` - User's content history (ADMIN only)
- **GET** `/content/history/my` - My content history

## 📂 Categories

### Create Category
- **POST** `/categories`
- **Authentication**: Required (ADMIN)
- **Body**:
  ```json
  {
    "name": "New Category",
    "description": "Category description",
    "isActive": true,
    "priority": 80
  }
  ```

### Get Public Categories
- **GET** `/categories/public`
- **Authentication**: Not required
- **Description**: Retrieve all active categories for public use
- **Query Parameters**:
  - `orderBy`: Field to sort by (`priority`, `name`, `createdAt`, `updatedAt`)
  - `orderDirection`: Sort direction (`ASC`, `DESC`)
- **Examples**:
  - `GET /categories/public?orderBy=priority&orderDirection=DESC` - Sort by priority descending

### Get All Categories
- **GET** `/categories`
- **Authentication**: Required (ADMIN)
- **Description**: Retrieve all categories (including inactive)
- **Query Parameters**:
  - `active`: Filter by active status (`true`/`false`)
  - `orderBy`: Field to sort by (`priority`, `name`, `createdAt`, `updatedAt`)
  - `orderDirection`: Sort direction (`ASC`, `DESC`)

### Get Category by ID
- **GET** `/categories/:id`
- **Authentication**: Required (ADMIN)

### Update Category
- **PATCH** `/categories/:id`
- **Authentication**: Required (ADMIN)
- **Body**:
  ```json
  {
    "name": "Updated Name",
    "description": "Updated description",
    "isActive": false,
    "priority": 85
  }
  ```

### Toggle Category Status
- **PATCH** `/categories/:id/toggle`
- **Authentication**: Required (ADMIN)
- **Description**: Toggle the active status of a category

### Delete Category
- **DELETE** `/categories/:id`
- **Authentication**: Required (ADMIN)

## 📁 Subcategories

### Create Subcategory
- **POST** `/subcategories`
- **Authentication**: Required (ADMIN)
- **Body**:
  ```json
  {
    "name": "New Subcategory",
    "description": "Subcategory description",
    "categoryId": 1,
    "isActive": true,
    "priority": 75
  }
  ```

### Get Public Subcategories
- **GET** `/subcategories/public`
- **Authentication**: Not required
- **Description**: Retrieve all active subcategories for public use
- **Query Parameters**:
  - `categoryId`: Filter by category
  - `orderBy`: Field to sort by (`priority`, `name`, `createdAt`, `updatedAt`)
  - `orderDirection`: Sort direction (`ASC`, `DESC`)
- **Examples**:
  - `GET /subcategories/public?categoryId=1&orderBy=priority&orderDirection=DESC`

### Get All Subcategories
- **GET** `/subcategories`
- **Authentication**: Required (ADMIN)
- **Description**: Retrieve all subcategories (including inactive)
- **Query Parameters**:
  - `active`: Filter by active status (`true`/`false`)
  - `categoryId`: Filter by category
  - `orderBy`: Field to sort by (`priority`, `name`, `createdAt`, `updatedAt`)
  - `orderDirection`: Sort direction (`ASC`, `DESC`)

### Get Subcategory by ID
- **GET** `/subcategories/:id`
- **Authentication**: Required (ADMIN)

### Update Subcategory
- **PATCH** `/subcategories/:id`
- **Authentication**: Required (ADMIN)
- **Body**:
  ```json
  {
    "name": "Updated Name",
    "description": "Updated description",
    "categoryId": 2,
    "isActive": false,
    "priority": 80
  }
  ```

### Toggle Subcategory Status
- **PATCH** `/subcategories/:id/toggle`
- **Authentication**: Required (ADMIN)
- **Description**: Toggle the active status of a subcategory

### Delete Subcategory
- **DELETE** `/subcategories/:id`
- **Authentication**: Required (ADMIN)

## 📊 Projects

### Create Project
- **POST** `/projects`
- **Authentication**: Required (CREATOR, ADMIN)
- **Body**:
  ```json
  {
    "title": "Project Title",
    "description": "Project description",
    "target": "Project objectives and goals",
    "conclusion": "Project conclusion (optional)",
    "priority": 85,
    "statusId": 1,
    "areaId": 2
  }
  ```

### Get Projects
- **GET** `/projects`
- **Authentication**: Required (CREATOR, ADMIN)
- **Description**: Both admins and creators can see all projects (collaborative viewing)
- **Query Parameters**:
  - `orderBy`: Field to sort by (`priority`, `createdAt`, `updatedAt`, `title`)
  - `orderDirection`: Sort direction (`ASC`, `DESC`)
  - `statusId`: Filter by project status
  - `areaId`: Filter by project area

### Get Project by ID
- **GET** `/projects/:id`
- **Authentication**: Required (CREATOR, ADMIN)
- **Description**: Both admins and creators can access any project

### Update Project
- **PATCH** `/projects/:id`
- **Authentication**: Required (CREATOR, ADMIN)
- **Description**: Admins can update any project, creators can only update their own projects
- **Body**:
  ```json
  {
    "title": "Updated Title",
    "description": "Updated description",
    "target": "Updated objectives",
    "conclusion": "Project conclusion",
    "priority": 90,
    "statusId": 2,
    "areaId": 3
  }
  ```

### Delete Project
- **DELETE** `/projects/:id`
- **Authentication**: Required (CREATOR, ADMIN)
- **Description**: Admins can delete any project, creators can only delete their own projects

### Project History
- **GET** `/projects/:id/history` - History of specific project
- **GET** `/projects/history/user/:userId` - User's project history (ADMIN only)
- **GET** `/projects/history/my` - My project history

## 📈 Project Statuses

### Create Project Status
- **POST** `/project-statuses`
- **Authentication**: Required (ADMIN)
- **Body**:
  ```json
  {
    "name": "New Status",
    "description": "Status description",
    "isActive": true,
    "priority": 70
  }
  ```

### Get Public Project Statuses
- **GET** `/project-statuses/public`
- **Authentication**: Not required
- **Description**: Retrieve all active project statuses for public use

### Get All Project Statuses
- **GET** `/project-statuses`
- **Authentication**: Required (ADMIN)
- **Description**: Retrieve all project statuses (including inactive)

### Get Project Status by ID
- **GET** `/project-statuses/:id`
- **Authentication**: Required (ADMIN)

### Update Project Status
- **PATCH** `/project-statuses/:id`
- **Authentication**: Required (ADMIN)
- **Body**:
  ```json
  {
    "name": "Updated Status",
    "description": "Updated description",
    "isActive": false,
    "priority": 75
  }
  ```

### Toggle Project Status
- **PATCH** `/project-statuses/:id/toggle`
- **Authentication**: Required (ADMIN)
- **Description**: Toggle the active status of a project status

### Delete Project Status
- **DELETE** `/project-statuses/:id`
- **Authentication**: Required (ADMIN)

## 🏢 Project Areas

### Create Project Area
- **POST** `/project-areas`
- **Authentication**: Required (ADMIN)
- **Body**:
  ```json
  {
    "name": "New Area",
    "description": "Area description",
    "isActive": true,
    "priority": 65
  }
  ```

### Get Public Project Areas
- **GET** `/project-areas/public`
- **Authentication**: Not required
- **Description**: Retrieve all active project areas for public use

### Get All Project Areas
- **GET** `/project-areas`
- **Authentication**: Required (ADMIN)
- **Description**: Retrieve all project areas (including inactive)

### Get Project Area by ID
- **GET** `/project-areas/:id`
- **Authentication**: Required (ADMIN)

### Update Project Area
- **PATCH** `/project-areas/:id`
- **Authentication**: Required (ADMIN)
- **Body**:
  ```json
  {
    "name": "Updated Area",
    "description": "Updated description",
    "isActive": false,
    "priority": 70
  }
  ```

### Toggle Project Area
- **PATCH** `/project-areas/:id/toggle`
- **Authentication**: Required (ADMIN)
- **Description**: Toggle the active status of a project area

### Delete Project Area
- **DELETE** `/project-areas/:id`
- **Authentication**: Required (ADMIN)

## 📚 Documentation

### Get API Documentation
- **GET** `/docs`
- **Authentication**: Not required
- **Description**: Main documentation page

### Get API Specification
- **GET** `/docs/api-spec`
- **Authentication**: Not required
- **Description**: OpenAPI/Swagger specification

### Get Markdown Documentation
- **GET** `/docs/markdown`
- **Authentication**: Not required
- **Description**: Documentation in markdown format

### Health Check
- **GET** `/docs/health`
- **Authentication**: Not required
- **Description**: API health status
- **Response**:
  ```json
  {
    "status": "healthy",
    "timestamp": "2025-07-01T01:58:45.566Z",
    "service": "API Documentation Service",
    "version": "1.0.0",
    "files": {
      "apiSpec": true,
      "markdown": true
    }
  }
  ```

## 🔐 Authorization & Security

### Role-Based Access Control

#### Admin Role
- Full access to all endpoints
- Can manage users, categories, subcategories, project statuses, and areas
- Can view, create, update, and delete all content and projects
- Can register new users

#### Creator Role
- Can view all content and projects (from all users)
- Can create, update, and delete any content (collaborative editing)
- Can only update and delete their own projects (project ownership protection)
- Can view public categories and subcategories
- Cannot access user management or system configuration

### Authentication Headers
All protected endpoints require the JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Error Responses
Standard error response format:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Error type"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 📊 Sample Data

The system comes pre-populated with comprehensive sample data for testing:

### Users
- **Admin**: `admin@example.com` / `password123`
- **Creators**: `john@example.com`, `jane@example.com`, `bob@example.com`, `alice@example.com` / `password123`

### Categories
- Technology, Business, Education, Health, Entertainment

### Subcategories
- Programming, AI/ML, Web Development, Marketing, Finance, Leadership, Online Courses, Tutorials, Fitness, Mental Health, Movies, Gaming

### Content Items
- 13 content items with various statuses (draft, published, archived)
- Covers all categories and subcategories
- Includes tags, priorities, and author information

### Projects
- 8 projects with different statuses and areas
- Realistic project descriptions and objectives
- Complete lifecycle examples

### Project Statuses
- Planning, In Progress, Review, Testing, Completed, On Hold, Cancelled

### Project Areas
- Frontend Development, Backend Development, Database Design, DevOps, Mobile Development, UI/UX Design, Testing, Documentation

## 🧪 Testing

### Automated Testing
Run the comprehensive endpoint test suite:
```bash
npm run test-api
```

### Manual Testing Examples

#### 1. Login as Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

#### 2. Get Public Categories
```bash
curl -X GET http://localhost:3000/api/categories/public
```

#### 3. Create Content (with token)
```bash
curl -X POST http://localhost:3000/api/content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "title": "Test Article",
    "description": "Test description",
    "tags": ["test", "article"],
    "status": "draft",
    "categoryId": 1,
    "subcategoryId": 1,
    "priority": 50
  }'
```

#### 4. Get User's Content
```bash
curl -X GET http://localhost:3000/api/content \
  -H "Authorization: Bearer <your_token>"
```

## 🔧 Development

### Environment Setup
```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Populate with sample data
npm run populate

# Test endpoints
npm run test-api
```

### Database Management
```bash
# Reset database with sample data
npm run reset-db

# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run
```

## 📈 Performance Considerations

- **Pagination**: Large datasets should implement pagination
- **Caching**: Consider implementing Redis for frequently accessed data
- **Indexing**: Database indexes on frequently queried fields
- **Validation**: Input validation at both client and server levels
- **Rate Limiting**: Consider implementing rate limiting for production

## 🔄 Version History

### v2.0.0 (Current)
- Added comprehensive project management
- Enhanced content management with history tracking
- Improved role-based access control
- Added sample data and testing utilities
- Updated documentation and API specifications

### v1.0.0
- Basic authentication and user management
- Content management system
- Category and subcategory management
- Basic API documentation 