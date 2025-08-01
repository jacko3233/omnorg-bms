# White-Label Business Management System - Branding Guide

## Overview

This business management system is designed as a fully white-labelable solution that can be easily customized for any engineering services company. All branding elements, colors, company information, and styling can be modified through configuration files and CSS variables.

## Quick Start Customization

### 1. Company Configuration

Edit the company configuration in each page component to customize basic branding:

**Location:** All page components (e.g., `client/src/pages/home.tsx`)

```typescript
const companyConfig: CompanyConfig = {
  name: "Your Company Name",       // Main company name
  tagline: "Your Services Ltd",    // Company tagline/subtitle
  brandColor: "var(--brand-primary)",    // Primary brand color
  deliveryColor: "var(--brand-secondary)" // Secondary brand color
};
```

### 2. Color Scheme Customization

**Location:** `client/src/index.css`

The system uses CSS custom properties for easy theming:

```css
:root {
  /* Primary Colors */
  --brand-primary: #dc2626;     /* Red-600 - Main brand color */
  --brand-secondary: #2563eb;   /* Blue-600 - Secondary color */
  --brand-accent: #f97316;      /* Orange-500 - Accent color */
  
  /* Status Colors */
  --success-color: #16a34a;     /* Green-600 */
  --warning-color: #ca8a04;     /* Yellow-600 */
  --error-color: #dc2626;       /* Red-600 */
  
  /* Background Colors */
  --bg-primary: #f9fafb;        /* Gray-50 */
  --bg-secondary: #ffffff;      /* White */
  --bg-accent: #f3f4f6;         /* Gray-100 */
}
```

### 3. Logo and Visual Assets

**Current Implementation:** Text-based logo with company name
**Customization Options:**

1. **Replace text logo with image:**
   - Add logo files to `client/src/assets/`
   - Update header components to use image instead of text
   - Recommended sizes: 200x60px (header), 400x120px (large displays)

2. **Custom favicon:**
   - Replace `public/favicon.ico` with company favicon
   - Update `index.html` meta tags if needed

## Detailed Branding Components

### Header Branding

**Location:** All page headers

Current structure:
```tsx
<div className="bg-red-600 text-white p-6">
  <div className="bg-white text-red-600 rounded-lg p-3 font-bold text-lg">
    {companyConfig.name.toUpperCase()}
  </div>
  <span className="text-lg font-medium">{companyConfig.tagline}</span>
</div>
```

**Customization:**
- Change `bg-red-600` to your primary brand color class
- Modify text styling and layout as needed
- Replace text with logo image

### Department Configuration

**Location:** `client/src/pages/home.tsx`

```typescript
const departments = [
  {
    name: "ENGINEERING",
    code: "LES",
    onClick: () => console.log("Navigating to Engineering...")
  },
  {
    name: "HIRE", 
    code: "LEH",
    onClick: () => setLocation("/hire")
  },
  {
    name: "CLIENTS",
    code: "LEC", 
    onClick: () => setLocation("/clients")
  },
  {
    name: "ACCOUNTS",
    code: "LEA",
    onClick: () => console.log("Navigating to Accounts...")
  }
];
```

**Customization:**
- Modify department names to match your business structure
- Update department codes (currently using "LE" prefix for "Larkin Engineering")
- Add or remove departments as needed
- Implement navigation logic for each department

### Color Usage Guide

#### Primary Red (`#dc2626`)
- **Usage:** Headers, primary buttons, alerts, main branding
- **Components:** Page headers, submit buttons, error states
- **CSS Classes:** `bg-red-600`, `text-red-600`, `border-red-600`

#### Secondary Blue (`#2563eb`)
- **Usage:** Table headers, secondary actions, information displays
- **Components:** Table headers, info panels, secondary buttons
- **CSS Classes:** `bg-blue-600`, `text-blue-600`, `border-blue-600`

#### Accent Orange (`#f97316`)
- **Usage:** Action cards, highlights, call-to-action elements
- **Components:** "Add New" buttons, highlight elements
- **CSS Classes:** `bg-orange-500`, `text-orange-500`, `border-orange-500`

## Component Customization

### Card Layouts

**Action Cards** (Client management, department cards):
```tsx
<button className="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
  {/* Card content */}
</button>
```

**Customization:**
- Change gradient colors to match brand
- Modify hover effects
- Update icons and text

### Table Styling

**Headers:**
```tsx
<TableRow className="bg-blue-50">
  <TableHead className="font-bold text-blue-800">Company Name</TableHead>
</TableRow>
```

**Customization:**
- Change `bg-blue-50` and `text-blue-800` to brand colors
- Modify font weights and sizing

### Form Elements

**Consistent styling across all forms:**
- Red primary buttons for submission
- Blue secondary buttons for actions
- Gray borders and backgrounds for inputs

## Typography and Fonts

### Current Font Stack
```css
font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
```

### Customization Options
1. **Add custom fonts:**
   - Import Google Fonts or custom font files
   - Update CSS font-family declarations
   - Ensure fallbacks for web safety

2. **Font sizing scale:**
   - Headings: `text-5xl`, `text-3xl`, `text-2xl`, `text-xl`
   - Body: `text-base`, `text-sm`, `text-xs`
   - Customize via Tailwind config if needed

## Industry-Specific Adaptations

### Engineering Services (Current)
- Department focus: Engineering, Hire, Clients, Accounts
- Job types: Hire, Fixed Price, Service
- Colors: Professional red/blue scheme

### Construction Services
**Suggested modifications:**
- Departments: Projects, Equipment, Contracts, Safety
- Job types: Residential, Commercial, Infrastructure
- Colors: Orange/gray professional scheme

### Manufacturing
**Suggested modifications:**
- Departments: Production, Quality, Logistics, Maintenance
- Job types: Production Run, Maintenance, Quality Check
- Colors: Blue/green industrial scheme

### Professional Services
**Suggested modifications:**
- Departments: Consulting, Projects, Clients, Finance
- Job types: Consultation, Project, Retainer
- Colors: Navy/gold professional scheme

## Client Application Customization

### Login Credentials
**Location:** `client/src/pages/client-login.tsx`

```typescript
const VALID_CREDENTIALS = {
  username: "client",
  password: "creditapp2024"
};
```

**Customization:**
- Update demo credentials for your company
- Implement proper authentication system for production
- Customize login page branding and messaging

### Form Branding
**Location:** `client/src/pages/client-application.tsx`

- Update header colors and company name
- Modify form field labels to match business terminology
- Customize thank you page messaging
- Add company contact information

## Email Template Customization

### SendGrid Integration
**Location:** `server/sendgrid.ts` (when implemented)

**Customizable elements:**
- Email sender name and address
- Email templates and styling
- Company branding in emails
- Notification preferences

## Database Customization

### Business Type Options
**Location:** `shared/schema.ts`

```typescript
businessType: varchar("business_type", { length: 50 }).notNull().default("Limited Company")
```

**Options to customize:**
- Default business types for your market
- Industry-specific client fields
- Custom job categories
- Regional compliance requirements

## Production Deployment Branding

### Environment Variables
```env
COMPANY_NAME="Your Company Name"
COMPANY_TAGLINE="Your Services Description"
SUPPORT_EMAIL="support@yourcompany.com"
ADMIN_EMAIL="admin@yourcompany.com"
```

### Domain and SSL
- Configure custom domain
- Set up SSL certificates
- Update CORS settings for your domain
- Configure email sending domain

## Quality Assurance Checklist

Before deploying a white-labeled version:

### Visual Consistency
- [ ] All page headers use consistent branding
- [ ] Color scheme is applied throughout application
- [ ] Company name appears consistently
- [ ] Department names match business structure
- [ ] Icons and visual elements align with brand

### Functional Testing
- [ ] All navigation links work correctly
- [ ] Forms submit and save data properly
- [ ] Client application process works end-to-end
- [ ] Email notifications use correct branding
- [ ] Database integration functions properly

### Content Review
- [ ] All text reflects company terminology
- [ ] Contact information is updated
- [ ] Legal and compliance text is reviewed
- [ ] Help documentation is customized
- [ ] Error messages are professional and branded

## Advanced Customization

### Custom CSS Classes
Create company-specific CSS classes:

```css
.company-primary {
  background-color: var(--brand-primary);
  color: white;
}

.company-secondary {
  background-color: var(--brand-secondary);
  color: white;
}

.company-accent {
  background-color: var(--brand-accent);
  color: white;
}
```

### Component Library Extension
- Create reusable branded components
- Implement company-specific form layouts
- Add custom dashboard widgets
- Develop industry-specific features

### Multi-tenant Architecture
For serving multiple companies:
- Database tenant separation
- Dynamic branding configuration
- Subdomain-based routing
- Company-specific feature flags

## Support and Maintenance

### Documentation Updates
- Keep branding guide current with code changes
- Document custom modifications
- Maintain component inventory
- Track brand compliance issues

### Version Control
- Use feature branches for branding changes
- Tag releases with company identifiers
- Maintain separate configurations for different clients
- Document rollback procedures

---

## Contact

For technical support with white-label customization:
- Review component documentation
- Test changes in development environment
- Validate branding consistency across all pages
- Ensure responsive design works with custom branding