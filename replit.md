# Business Management System - Replit Configuration

## Overview

This is a professional white-label business management system built with React (frontend) and Express (backend). The application features a clean, professional interface designed for transport services companies, with department management, delivery tracking, and various business modules. It includes a fully white-labeled design system that can be easily rebranded for different companies. The system uses PostgreSQL with Drizzle ORM for data persistence and includes a comprehensive UI component library built with shadcn/ui and Radix UI primitives.

**NEW: Private Client Application System** - Added secure client portal with login system for credit applications. Clients can access a dedicated form via private credentials and submit GDPR-compliant credit applications with thank you confirmation.

**NEW: White-Label Documentation Suite** - Complete documentation system for easy customization and deployment, including branding guides, technical architecture, deployment procedures, and industry-specific examples.

**LATEST: Job Edit System Implementation & GitHub Integration** - Successfully fixed broken edit functionality across all department pages by replacing broken edit routes with modal-based editing system. Implemented JobEditModal components on fabrication, sales, testing, and hire department pages. Fixed all JSX syntax errors and import issues. All edit buttons now properly open JobEditModal for seamless job editing experience. Project is now ready for GitHub integration with proper Git setup and .gitignore configuration.

**Complete Job Management System Integration** - Successfully implemented full job management functionality with live database editing, comprehensive job items system, and fixed all API integration issues. JobDetailsModal now features proper field mappings, live editing capabilities, and bulk save operations. Created dedicated hire job form with proper routing and validation. Fixed critical API request parameter ordering issue that was causing "Method no valid http" errors. All job creation, editing, and item management now fully functional with PostgreSQL backend.

**Department Navigation & Performance Optimizations** - Successfully implemented dynamic job navigation system enabling click-through to individual job detail pages across all 5 departments. Applied consistent useMemo optimization patterns for job filtering and client mapping across all department pages. All departments now feature red header styling matching transport department, proper department separation with unique prefixes (LEH, LEF, LES, LET, LEX), and comprehensive mobile performance enhancements including React.memo, useMemo, useCallback, CSS optimizations, and Core Web Vitals monitoring.

**Clickable Analytics Dashboard Navigation** - Implemented comprehensive clickable navigation throughout the performance insights dashboard. All metric cards (Total Revenue, Active Jobs, Total Clients, Avg Job Value) are clickable and navigate to relevant management sections. Department performance charts feature clickable bars that navigate to specific department pages. Revenue trends, client analysis items, and job status distribution components are fully interactive with proper navigation routes. Added visual feedback with hover effects, tooltips with navigation hints, and department quick navigation buttons for seamless user experience.

**Mobile-Optimized Professional Interface** - Successfully redesigned interface with sophisticated, corporate-grade mobile-responsive design. Implemented touch-friendly interactions, responsive grid layouts, and adaptive typography while maintaining professional 2050 aesthetic. Enhanced with proper mobile breakpoints and touch-manipulation for optimal mobile experience.

**Phase 1 Complete - User Management Interface** - Successfully implemented comprehensive admin user management system with full CRUD operations, search/filtering, role-based access control, and professional UI. All 24 API routes tested and functional. Enhanced route scanner with performance tracking and recommendations system.

**Latest Update - Auto-Generated Job Numbers System** - Implemented global job counter system ensuring unique job numbers across all departments. Added smart LES prefix generation (LEH for Hire, LEE for Engineering, etc.) with 6-digit auto-incrementing numbers. Updated new job form to remove manual number entry. Created comprehensive dummy client "Thomas Plant Hire Ltd" for testing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: Built-in session handling with connect-pg-simple
- **Development**: Hot reloading with tsx

### Database Schema
- **Users Table**: Complete user management with role-based access control (User/Admin), profile fields, activity tracking
- **Admin Settings Table**: System-wide configuration management with key-value pairs and metadata
- **Clients Table**: Comprehensive client management with full GDPR credit application fields
- **Jobs Table**: Job tracking with client relationships and job items
- **Job Items Table**: Detailed job item management with hire dates and pricing
- **Schema Location**: `shared/schema.ts` for type-safe database operations
- **Validation**: Drizzle-Zod integration for schema validation

### Client Application System
- **Private Portal**: Secure login system (/client-login) with demo credentials
- **Credit Application Form**: Complete GDPR-compliant form based on provided PDF
- **Thank You Page**: Post-submission confirmation with contact message
- **Admin Dashboard**: Internal review system for submitted applications
- **Database Integration**: Automatic saving of all application data

### White-Label Documentation
- **Comprehensive Branding Guide**: Step-by-step customization for any industry
- **Technical Architecture**: Complete system design and implementation documentation
- **Deployment Guide**: Production deployment with security and performance optimization
- **Customization Examples**: Industry-specific implementations (Construction, Manufacturing, Consulting, Healthcare)
- **Multi-Tenant Support**: Documentation for serving multiple client deployments

## Key Components

### Frontend Components
1. **Main Dashboard**: Futuristic business interface with animated elements
2. **Department Cards**: Interactive cards for different business departments (Engineering, Hire, Clients)
3. **Client Management**: Comprehensive credit application system with private portal
4. **Client Application Portal**: Secure login system for external client access
5. **Application Admin**: Internal dashboard for reviewing submitted applications
6. **Delivery Notes**: Delivery tracking and management system
7. **Quick Actions**: Shortcuts for common business operations
8. **System Status**: Real-time system health monitoring
9. **UI Library**: Complete set of reusable components (buttons, forms, dialogs, etc.)

### Backend Components
1. **Express Server**: RESTful API with middleware for logging and error handling
2. **Storage Interface**: Abstracted storage layer with both in-memory and database implementations
3. **Route Registration**: Comprehensive API routing with role-based access control
4. **User Management System**: Complete CRUD operations for users with security features
5. **Admin Settings System**: Dynamic configuration management for system-wide settings
6. **Route Testing & Documentation**: Automated route scanning and validation tools
7. **Vite Integration**: Development server integration for SPA serving

### Styling System
- **Design Theme**: Glass morphism with "Year 2050" aesthetics
- **Color Scheme**: Blue/indigo gradients with neutral backgrounds
- **Animations**: CSS animations for floating orbs, slide-ups, and parallax effects
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **API Layer**: Express routes handle HTTP requests and responses
3. **Storage Layer**: Abstract storage interface allows for different implementations
4. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
5. **Type Safety**: Shared schema definitions ensure consistency across client/server

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Query
- **Backend Framework**: Express.js with TypeScript support
- **Database**: Drizzle ORM, Neon Database client, PostgreSQL

### UI and Styling
- **Component Library**: Radix UI primitives, shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Icons**: Lucide React icon library
- **Utilities**: date-fns for date handling

### Development Tools
- **Build Tools**: Vite, esbuild for production builds
- **Development**: tsx for TypeScript execution, Replit plugins
- **Database Tools**: Drizzle Kit for migrations and schema management

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reloading**: Full-stack hot reloading support
- **Database**: PostgreSQL connection via environment variables
- **Replit Integration**: Cartographer plugin for Replit environment

### Production Build
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles Express server to `dist/index.js`
3. **Static Serving**: Express serves built frontend assets
4. **Database Migrations**: Drizzle Kit manages schema changes

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **Build Scripts**: Separate development and production configurations
- **Port Configuration**: Express server adapts to environment port settings

### Key Architectural Decisions

1. **Monorepo Structure**: Client, server, and shared code in single repository for easier development
2. **Type Safety**: Shared TypeScript definitions between frontend and backend
3. **Storage Abstraction**: Interface-based storage allows switching between in-memory and database implementations
4. **Component Architecture**: Modular UI components with consistent design system
5. **Modern Tooling**: Vite for fast builds, Drizzle for type-safe database operations
6. **Future-Proof Design**: Glassmorphism UI with animation system for engaging user experience