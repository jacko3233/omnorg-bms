# Technical Architecture Documentation

## System Overview

The Business Management System is a full-stack TypeScript application built with modern web technologies, designed for scalability, maintainability, and easy white-label customization.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (React + Vite)                  │
├─────────────────────────────────────────────────────────────┤
│  Components: Pages, UI Components, Forms, Layouts          │
│  State: TanStack Query, React Hook Form                    │
│  Styling: Tailwind CSS, shadcn/ui, CSS Variables          │
│  Routing: Wouter (lightweight client-side routing)        │
└─────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP/REST API
                                │
┌─────────────────────────────────────────────────────────────┐
│                    Server (Node.js + Express)              │
├─────────────────────────────────────────────────────────────┤
│  Routes: RESTful API endpoints                             │
│  Middleware: CORS, JSON parsing, Error handling           │
│  Business Logic: CRUD operations, Validation              │
│  Storage: Interface-based abstraction layer               │
└─────────────────────────────────────────────────────────────┘
                                │
                                │ SQL Queries
                                │
┌─────────────────────────────────────────────────────────────┐
│                Database (PostgreSQL + Drizzle ORM)         │
├─────────────────────────────────────────────────────────────┤
│  Tables: users, clients, jobs, job_items                  │
│  Relations: Foreign keys, One-to-many relationships       │
│  Migrations: Schema versioning and updates                │
│  Validation: Type-safe operations with Zod integration    │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Structure
```
client/src/
├── components/ui/          # shadcn/ui reusable components
│   ├── button.tsx         # Button component with variants
│   ├── input.tsx          # Form input components
│   ├── table.tsx          # Data table components
│   └── ...
├── pages/                 # Route-based page components
│   ├── home.tsx           # Main dashboard
│   ├── clients.tsx        # Client management
│   ├── new-job.tsx        # Job creation
│   ├── client-login.tsx   # External client portal
│   └── ...
├── lib/                   # Utility functions and configurations
│   ├── queryClient.ts     # TanStack Query setup
│   └── utils.ts           # Helper functions
└── hooks/                 # Custom React hooks
    └── use-toast.tsx      # Toast notification hook
```

### State Management
- **TanStack Query (React Query)**: Server state management, caching, and synchronization
- **React Hook Form**: Form state management with validation
- **Local State**: Component-level state with useState/useReducer

### Styling Architecture
- **Tailwind CSS**: Utility-first CSS framework
- **CSS Variables**: Theme customization and white-label support
- **shadcn/ui**: Pre-built accessible components
- **Responsive Design**: Mobile-first approach with breakpoints

## Backend Architecture

### Server Structure
```
server/
├── index.ts              # Application entry point
├── routes.ts             # API route definitions
├── storage.ts            # Data access layer interface
├── vite.ts               # Vite integration for development
└── db.ts                 # Database connection (when using DB)
```

### API Design Patterns
- **RESTful Routes**: Standard HTTP methods (GET, POST, PUT, DELETE)
- **JSON Communication**: Request/response format
- **Error Handling**: Consistent error response structure
- **Validation**: Request validation using Zod schemas

### Storage Abstraction
```typescript
interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Client operations
  getClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  
  // Job operations
  getJobs(): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
}
```

## Database Architecture

### Schema Design
```sql
-- Core Tables
users (id, username, password, created_at, updated_at)
clients (id, company_name, email, phone, address, ..., created_at, updated_at)
jobs (id, job_les, client_id, description, status, ..., created_at, updated_at)
job_items (id, job_id, description, hire_dates, pricing, ..., created_at)

-- Relationships
clients.id ← jobs.client_id (one-to-many)
jobs.id ← job_items.job_id (one-to-many)
```

### Data Relationships
- **One-to-Many**: Client → Jobs → Job Items
- **Foreign Keys**: Maintain referential integrity
- **Cascade Deletes**: Job items deleted when job is deleted
- **Indexes**: Optimized queries on frequently accessed fields

### Type Safety
- **Drizzle ORM**: Type-safe database operations
- **Zod Integration**: Runtime validation matching database schema
- **Shared Types**: Common type definitions between frontend and backend

## Development Workflow

### Local Development
```bash
npm run dev          # Start development servers
npm run db:push      # Push schema changes to database
npm run build        # Build for production
```

### File Structure
```
project/
├── client/          # Frontend React application
├── server/          # Backend Express application
├── shared/          # Shared types and schemas
├── docs/            # Documentation files
├── package.json     # Dependencies and scripts
├── tsconfig.json    # TypeScript configuration
├── vite.config.ts   # Vite build configuration
└── tailwind.config.ts # Tailwind CSS configuration
```

## Security Architecture

### Authentication & Authorization
- **Session-based**: Secure session management
- **Password Hashing**: Bcrypt for password security
- **CSRF Protection**: Cross-site request forgery prevention
- **Input Validation**: Server-side validation for all inputs

### Data Protection
- **SQL Injection Prevention**: Parameterized queries via ORM
- **XSS Protection**: Input sanitization and output encoding
- **HTTPS Only**: Secure transport in production
- **Environment Variables**: Sensitive configuration management

## Performance Optimization

### Frontend Performance
- **Code Splitting**: Lazy loading of route components
- **Bundle Optimization**: Vite's optimized build process
- **Caching**: TanStack Query intelligent caching
- **Lazy Loading**: Progressive loading of heavy components

### Backend Performance
- **Database Optimization**: Indexed queries and efficient relationships
- **Response Caching**: API response caching where appropriate
- **Connection Pooling**: Efficient database connection management
- **Middleware Optimization**: Minimal middleware stack

## Deployment Architecture

### Production Build
```bash
npm run build        # Build client and server
npm start           # Start production server
```

### Environment Configuration
```env
NODE_ENV=production
DATABASE_URL=postgresql://...
PORT=5000
SESSION_SECRET=...
```

### Hosting Requirements
- **Node.js 18+**: Runtime environment
- **PostgreSQL 14+**: Database server
- **HTTPS**: SSL certificate for secure connections
- **Process Management**: PM2 or similar for production

## Monitoring & Maintenance

### Logging
- **Request Logging**: All API requests and responses
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response times and resource usage
- **Database Queries**: Query performance monitoring

### Health Checks
- **Application Status**: Server health endpoints
- **Database Connectivity**: Connection status monitoring
- **Memory Usage**: Resource utilization tracking
- **Uptime Monitoring**: Availability checking

## Scalability Considerations

### Horizontal Scaling
- **Stateless Design**: No server-side session storage in memory
- **Database Connection Pooling**: Efficient connection management
- **CDN Integration**: Static asset delivery optimization
- **Load Balancer Ready**: Multiple instance support

### Vertical Scaling
- **Resource Optimization**: Efficient memory and CPU usage
- **Database Indexing**: Query optimization strategies
- **Caching Layers**: Multiple levels of caching
- **Asset Optimization**: Minimized bundle sizes

## White-Label Architecture

### Configuration Management
- **CSS Variables**: Dynamic theming support
- **Component Props**: Configurable component behavior
- **Environment Variables**: Deployment-specific configuration
- **Build-time Configuration**: Compile-time customization

### Multi-tenancy Support
- **Database Isolation**: Tenant-specific data separation
- **Subdomain Routing**: Company-specific URLs
- **Feature Flags**: Tenant-specific feature enablement
- **Custom Branding**: Dynamic UI customization

## API Documentation

### Client Endpoints
```
GET    /api/clients           # List all clients
POST   /api/clients           # Create new client
GET    /api/clients/:id       # Get specific client
PUT    /api/clients/:id       # Update client
DELETE /api/clients/:id       # Delete client
```

### Job Endpoints
```
GET    /api/jobs              # List all jobs
POST   /api/jobs              # Create new job
GET    /api/jobs/:id          # Get specific job
PUT    /api/jobs/:id          # Update job
DELETE /api/jobs/:id          # Delete job
```

### Request/Response Format
```typescript
// Request
POST /api/clients
Content-Type: application/json
{
  "companyName": "Example Corp",
  "email": "contact@example.com",
  "telephone": "123-456-7890"
}

// Response
{
  "id": "uuid-string",
  "companyName": "Example Corp",
  "email": "contact@example.com",
  "telephone": "123-456-7890",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## Testing Strategy

### Frontend Testing
- **Component Testing**: React component unit tests
- **Integration Testing**: User interaction flow testing
- **E2E Testing**: Full application workflow testing
- **Visual Testing**: UI consistency and responsiveness

### Backend Testing
- **Unit Testing**: Individual function testing
- **Integration Testing**: API endpoint testing
- **Database Testing**: Data integrity and relationships
- **Performance Testing**: Load and stress testing

## Migration & Upgrades

### Database Migrations
- **Schema Versioning**: Incremental database changes
- **Rollback Support**: Safe downgrade procedures
- **Data Migration**: Existing data transformation
- **Zero-downtime Deployments**: Blue-green deployment strategy

### Application Updates
- **Semantic Versioning**: Clear version numbering
- **Changelog Maintenance**: Detailed change documentation
- **Backward Compatibility**: Legacy support strategies
- **Feature Flags**: Gradual feature rollout

---

## Development Guidelines

### Code Standards
- **TypeScript Strict Mode**: Full type safety
- **ESLint Configuration**: Code quality enforcement
- **Prettier Formatting**: Consistent code formatting
- **Git Hooks**: Pre-commit quality checks

### Best Practices
- **Component Composition**: Reusable component design
- **API Design**: RESTful principles and consistency
- **Error Handling**: Comprehensive error management
- **Documentation**: Code and API documentation maintenance