# OMNOR GROUP Business Management System

A comprehensive white-label business management platform with advanced multi-department job tracking and intelligent AI-assisted performance optimization.

## 🏢 Features

### Multi-Department Management
- **Hire Department**: Vehicle and equipment rental management
- **Fabrication Department**: Custom steel manufacturing and welding projects
- **Sales Department**: Customer relationship and sales pipeline management  
- **Testing Department**: Quality assurance and testing services

### Core Functionality
- **Job Management**: Complete CRUD operations with live database editing
- **Client Portal**: GDPR-compliant credit application system with secure login
- **Performance Dashboard**: Real-time analytics with clickable insights
- **Mobile Responsive**: Touch-optimized interface for all devices
- **Role-Based Access**: Admin and user permissions with secure authentication

### Professional Design
- **Modern UI**: 2050 futuristic aesthetic with glass morphism effects
- **Corporate Branding**: Professional red/slate color scheme
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Interactive Elements**: Smooth animations and hover effects

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Tailwind CSS** for responsive styling and design system
- **shadcn/ui** component library built on Radix UI primitives
- **Vite** for fast development and optimized production builds
- **TanStack Query** for efficient server state management

### Backend
- **Node.js** with Express.js framework
- **TypeScript** for full-stack type safety
- **PostgreSQL** database with Neon Database provider
- **Drizzle ORM** for type-safe database operations
- **Session Management** with secure authentication

### Development Tools
- **Hot Module Replacement** for instant development feedback
- **ESLint & Prettier** for code quality and formatting
- **Git Integration** ready for version control and deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Neon Database account)

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your DATABASE_URL and other required environment variables

# Start development server
npm run dev
```

### Environment Variables
```env
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key (optional, for AI features)
```

## 📁 Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages/routes
│   │   └── lib/           # Utilities and configurations
├── server/                # Express backend API
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database abstraction layer
│   └── db.ts             # Database connection and setup
├── shared/               # Shared TypeScript schemas
│   └── schema.ts         # Database schema and validation
└── docs/                # Project documentation
```

## 🔧 Key Components

### Job Management System
- **Create Jobs**: Multi-step job creation with client assignment
- **Edit Jobs**: Modal-based editing across all departments
- **Job Items**: Detailed item management with pricing and dates
- **Status Tracking**: Complete job lifecycle management

### Client Management
- **Credit Applications**: GDPR-compliant application forms
- **Client Portal**: Secure login system for external access
- **Admin Dashboard**: Internal review and approval system
- **Client Database**: Comprehensive client information storage

### Department Integration
- **Unified Interface**: Consistent experience across all departments
- **Department Filtering**: Automated job categorization by department
- **Performance Metrics**: Department-specific analytics and reporting
- **Navigation System**: Seamless routing between departments

## 🎨 Design System

### Color Palette
- **Primary**: Red (#DC2626) for headers and primary actions
- **Secondary**: Slate (#64748B) for secondary elements
- **Accent**: Blue gradients for interactive elements
- **Neutral**: Gray scale for backgrounds and text

### Typography
- **Headers**: Bold, modern fonts for impact
- **Body**: Clean, readable fonts optimized for screens
- **UI Elements**: Consistent sizing and spacing

### Components
- **Cards**: Glass morphism effect with subtle shadows
- **Buttons**: Gradient backgrounds with hover animations
- **Forms**: Clean input fields with validation states
- **Modals**: Centered overlays with backdrop blur

## 📊 Database Schema

### Core Tables
- **Users**: Authentication and role management
- **Jobs**: Job tracking with department categorization
- **Clients**: Customer information and credit applications
- **Job Items**: Detailed job components with pricing

### Relationships
- Jobs belong to Clients (many-to-one)
- Jobs have many Job Items (one-to-many)
- Users have roles and permissions

## 🔒 Security Features

- **Role-Based Access Control**: Admin and user permission levels
- **Session Management**: Secure authentication with PostgreSQL sessions
- **GDPR Compliance**: Data protection for client applications
- **Input Validation**: Comprehensive validation using Zod schemas

## 🚀 Deployment

### Production Build
```bash
# Build frontend and backend
npm run build

# Start production server
npm start
```

### Environment Setup
- Configure production DATABASE_URL
- Set up environment variables for production
- Ensure proper security headers and HTTPS

## 📈 Recent Updates

### Latest Features (January 2025)
- ✅ Fixed job edit functionality across all departments
- ✅ Implemented modal-based editing system
- ✅ Resolved all TypeScript compilation errors
- ✅ Added comprehensive navigation system
- ✅ Enhanced mobile responsiveness

### Performance Optimizations
- ✅ React.memo optimization for job listings
- ✅ useMemo for client mapping and job filtering
- ✅ Efficient database queries with proper indexing
- ✅ Code splitting for optimal loading times

## 🤝 Contributing

This is a white-label system designed for easy customization:

1. **Branding**: Update colors, logos, and company information
2. **Features**: Add new departments or modify existing workflows
3. **Integration**: Connect with external APIs and services
4. **Deployment**: Deploy to your preferred hosting platform

## 📄 License

This project is designed as a white-label solution for business management needs.

## 📞 Support

For technical support or customization requests, refer to the documentation in the `/docs` folder or contact your development team.

---

**Built with modern web technologies for scalable business management.**