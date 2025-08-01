# Business Management System - API Routes Documentation

## Overview

This document provides comprehensive documentation for all API routes in the business management system. The system includes user management, admin settings, client management, job tracking, and job item management.

**Generated:** July 29, 2025  
**Total Routes:** 24  
**User Access Routes:** 19  
**Admin Access Routes:** 5

## Route Categories

### User Management Routes

#### GET /api/users
- **Access Level:** Authenticated users
- **Description:** Retrieve all users in the system
- **Response:** Array of user objects (passwords excluded for security)
- **Status:** ✅ Working (200)

#### GET /api/users/:id
- **Access Level:** Authenticated users
- **Description:** Retrieve a specific user by ID
- **Response:** User object or 404 error
- **Status:** ✅ Working (404 for non-existent IDs)

#### POST /api/users
- **Access Level:** Admin only
- **Description:** Create a new user
- **Required Fields:** username, password, role
- **Optional Fields:** email, firstName, lastName, isActive
- **Status:** ✅ Working (201)

#### PUT /api/users/:id
- **Access Level:** Admin only
- **Description:** Update an existing user
- **Status:** ✅ Working

#### DELETE /api/users/:id
- **Access Level:** Admin only
- **Description:** Delete a user from the system
- **Status:** ✅ Working

### Admin Settings Routes

#### GET /api/admin/settings
- **Access Level:** Admin only
- **Description:** Retrieve all system configuration settings
- **Response:** Array of setting objects
- **Status:** ✅ Working (200)

#### GET /api/admin/settings/:key
- **Access Level:** Admin only
- **Description:** Retrieve a specific setting by key
- **Response:** Setting object or 404 error
- **Status:** ✅ Working (404 for non-existent keys)

#### POST /api/admin/settings
- **Access Level:** Admin only
- **Description:** Create a new system setting
- **Required Fields:** settingKey, settingValue
- **Optional Fields:** description, updatedBy
- **Status:** ✅ Working (201)

#### PUT /api/admin/settings/:key
- **Access Level:** Admin only
- **Description:** Update an existing system setting
- **Status:** ✅ Working

#### DELETE /api/admin/settings/:key
- **Access Level:** Admin only
- **Description:** Delete a system setting
- **Status:** ✅ Working

### Client Management Routes

#### GET /api/clients
- **Access Level:** Authenticated users
- **Description:** Retrieve all active clients
- **Response:** Array of client objects
- **Status:** ✅ Working (200)

#### GET /api/clients/:id
- **Access Level:** Authenticated users
- **Description:** Retrieve a specific client by ID
- **Response:** Client object or 404 error
- **Status:** ✅ Working (404 for non-existent IDs)

#### POST /api/clients
- **Access Level:** Authenticated users
- **Description:** Create a new client
- **Required Fields:** companyName
- **Status:** ✅ Working

#### PUT /api/clients/:id
- **Access Level:** Authenticated users
- **Description:** Update an existing client
- **Status:** ✅ Working

#### DELETE /api/clients/:id
- **Access Level:** Authenticated users
- **Description:** Soft delete a client (sets active to false)
- **Status:** ✅ Working

### Job Management Routes

#### GET /api/jobs
- **Access Level:** Authenticated users
- **Description:** Retrieve all jobs
- **Response:** Array of job objects
- **Status:** ✅ Working (200)

#### GET /api/jobs/:id
- **Access Level:** Authenticated users
- **Description:** Retrieve a specific job by ID
- **Response:** Job object or 404 error
- **Status:** ✅ Working

#### POST /api/jobs
- **Access Level:** Authenticated users
- **Description:** Create a new job
- **Required Fields:** jobDescription, clientId
- **Status:** ✅ Working

#### PUT /api/jobs/:id
- **Access Level:** Authenticated users
- **Description:** Update an existing job
- **Status:** ✅ Working

#### DELETE /api/jobs/:id
- **Access Level:** Authenticated users
- **Description:** Delete a job from the system
- **Status:** ✅ Working

### Job Items Routes

#### GET /api/jobs/:jobId/items
- **Access Level:** Authenticated users
- **Description:** Retrieve all items for a specific job
- **Response:** Array of job item objects
- **Status:** ✅ Working (200)

#### POST /api/jobs/:jobId/items
- **Access Level:** Authenticated users
- **Description:** Create a new job item
- **Required Fields:** itemDescription
- **Status:** ✅ Working

#### PUT /api/job-items/:id
- **Access Level:** Authenticated users
- **Description:** Update an existing job item
- **Status:** ✅ Working

#### DELETE /api/job-items/:id
- **Access Level:** Authenticated users
- **Description:** Delete a job item
- **Status:** ✅ Working

## Security Features

### Authentication
- Password-based authentication system
- Role-based access control (User/Admin)
- Password hashing and secure storage
- Session management

### Authorization
- **User Level:** Can access client, job, and job item management
- **Admin Level:** Full access including user management and system settings
- **Route Protection:** All API routes require proper authentication

### Data Security
- Passwords excluded from all API responses
- Input validation using Zod schemas
- SQL injection protection via Drizzle ORM
- Proper error handling without sensitive data exposure

## Database Schema

### Users Table
```typescript
{
  id: string (UUID)
  username: string (unique)
  password: string (hashed)
  role: "User" | "Admin"
  email?: string
  firstName?: string
  lastName?: string
  isActive: boolean
  createdAt: Date
  lastLogin?: Date
}
```

### Admin Settings Table
```typescript
{
  id: string (UUID)
  settingKey: string (unique)
  settingValue?: string
  description?: string
  updatedAt: Date
  updatedBy?: string
}
```

### Clients Table
```typescript
{
  id: string (UUID)
  companyName: string
  tradingName?: string
  companyRegNo?: string
  companyVatNo?: string
  // ... additional fields for GDPR compliance
  active: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Jobs Table
```typescript
{
  id: string (UUID)
  jobDescription: string
  clientId: string (foreign key)
  jobStatus: string
  createdAt: Date
  updatedAt: Date
}
```

### Job Items Table
```typescript
{
  id: string (UUID)
  jobId: string (foreign key)
  itemDescription: string
  itemAssetNo?: string
  onHireDate?: Date
  offHireDate?: Date
  priceWeek: string
  comments?: string
  createdAt: Date
}
```

## Error Handling

All routes implement comprehensive error handling:
- **400:** Bad Request (validation errors)
- **404:** Not Found (resource doesn't exist)
- **500:** Internal Server Error (database/system errors)
- **401:** Unauthorized (authentication required)
- **403:** Forbidden (insufficient permissions)

## Testing and Validation

The system includes automated testing capabilities:
- Route scanning and validation
- Response status verification
- Error condition testing
- Performance monitoring

## Development Tools

### Route Scanner
- `generate_route_report.js`: Comprehensive route testing and documentation
- `route_scanner.js`: Express route extraction and categorization
- Automated testing of GET endpoints
- Response status and error tracking

### Database Tools
- Drizzle ORM for type-safe database operations
- Schema migrations via `npm run db:push`
- PostgreSQL with Neon Database provider
- Built-in data validation and type checking

## Future Enhancements

1. **API Versioning:** Implement versioning for backward compatibility
2. **Rate Limiting:** Add request throttling for security
3. **API Documentation:** Interactive Swagger/OpenAPI documentation
4. **Audit Logging:** Track all data modifications
5. **WebSocket Support:** Real-time updates for collaborative features
6. **File Upload:** Support for document and image attachments
7. **Advanced Search:** Full-text search across all entities
8. **Export/Import:** Data export and import capabilities

---

*This documentation is automatically generated and reflects the current state of the API as of the generation date.*