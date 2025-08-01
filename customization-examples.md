# White-Label Customization Examples

## Overview

This document provides practical examples of how to customize the business management system for different industries and companies. Each example includes specific code changes, color schemes, and configuration adjustments.

## Example 1: Construction Company - "BuildPro Services"

### Company Profile
- **Industry:** Construction & Building Services
- **Departments:** Projects, Equipment, Safety, Finance
- **Brand Colors:** Orange (#f97316) and Dark Gray (#374151)
- **Key Features:** Project management, equipment tracking, safety compliance

### Customization Steps

**1. Update Company Configuration**
```typescript
// All page components
const companyConfig: CompanyConfig = {
  name: "BuildPro",
  tagline: "Construction Services Ltd",
  brandColor: "#f97316",
  deliveryColor: "#374151"
};
```

**2. Customize Color Scheme**
```css
/* client/src/index.css */
:root {
  --brand-primary: #f97316;     /* Orange-500 */
  --brand-secondary: #374151;   /* Gray-700 */
  --brand-accent: #059669;      /* Green-600 */
  --success-color: #059669;
  --warning-color: #d97706;
  --error-color: #dc2626;
}
```

**3. Update Department Structure**
```typescript
// client/src/pages/home.tsx
const departments = [
  {
    name: "PROJECTS",
    code: "BPS", // BuildPro Projects
    onClick: () => setLocation("/projects")
  },
  {
    name: "EQUIPMENT", 
    code: "BPE", // BuildPro Equipment
    onClick: () => setLocation("/equipment")
  },
  {
    name: "SAFETY",
    code: "BPF", // BuildPro Safety
    onClick: () => setLocation("/safety")
  },
  {
    name: "FINANCE",
    code: "BPF", // BuildPro Finance
    onClick: () => console.log("Navigating to Finance...")
  }
];
```

**4. Customize Job Types**
```typescript
// client/src/pages/new-job.tsx
<SelectContent>
  <SelectItem value="Residential">Residential</SelectItem>
  <SelectItem value="Commercial">Commercial</SelectItem>
  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
  <SelectItem value="Renovation">Renovation</SelectItem>
</SelectContent>
```

**5. Update Header Styling**
```tsx
<div className="bg-orange-500 text-white p-6">
  <div className="bg-white text-orange-500 rounded-lg p-3 font-bold text-lg">
    BUILDPRO
  </div>
  <span className="text-lg font-medium">Construction Services Ltd</span>
</div>
```

## Example 2: Manufacturing Company - "TechManu Industries"

### Company Profile
- **Industry:** Manufacturing & Production
- **Departments:** Production, Quality, Logistics, Maintenance
- **Brand Colors:** Blue (#2563eb) and Steel Gray (#6b7280)
- **Key Features:** Production tracking, quality control, maintenance scheduling

### Customization Steps

**1. Company Configuration**
```typescript
const companyConfig: CompanyConfig = {
  name: "TechManu",
  tagline: "Industries & Manufacturing",
  brandColor: "#2563eb",
  deliveryColor: "#6b7280"
};
```

**2. Industrial Color Scheme**
```css
:root {
  --brand-primary: #2563eb;     /* Blue-600 */
  --brand-secondary: #6b7280;   /* Gray-500 */
  --brand-accent: #0891b2;      /* Cyan-600 */
  --success-color: #059669;
  --warning-color: #d97706;
  --error-color: #dc2626;
  --production-color: #7c3aed;  /* Purple-600 */
}
```

**3. Manufacturing Departments**
```typescript
const departments = [
  {
    name: "PRODUCTION",
    code: "TMR", // TechManu Production
    onClick: () => setLocation("/production")
  },
  {
    name: "QUALITY", 
    code: "TMQ", // TechManu Quality
    onClick: () => setLocation("/quality")
  },
  {
    name: "LOGISTICS",
    code: "TML", // TechManu Logistics
    onClick: () => setLocation("/logistics")
  },
  {
    name: "MAINTENANCE",
    code: "TMM", // TechManu Maintenance
    onClick: () => setLocation("/maintenance")
  }
];
```

**4. Production Job Types**
```typescript
<SelectContent>
  <SelectItem value="Production Run">Production Run</SelectItem>
  <SelectItem value="Quality Check">Quality Check</SelectItem>
  <SelectItem value="Maintenance">Maintenance</SelectItem>
  <SelectItem value="Setup">Setup & Configuration</SelectItem>
</SelectContent>
```

## Example 3: Professional Services - "Elite Consulting"

### Company Profile
- **Industry:** Business Consulting
- **Departments:** Consulting, Projects, Clients, Finance
- **Brand Colors:** Navy (#1e40af) and Gold (#d97706)
- **Key Features:** Client consulting, project management, financial tracking

### Customization Steps

**1. Professional Branding**
```typescript
const companyConfig: CompanyConfig = {
  name: "Elite",
  tagline: "Consulting & Advisory",
  brandColor: "#1e40af",
  deliveryColor: "#d97706"
};
```

**2. Professional Color Palette**
```css
:root {
  --brand-primary: #1e40af;     /* Blue-800 */
  --brand-secondary: #d97706;   /* Amber-600 */
  --brand-accent: #059669;      /* Green-600 */
  --consulting-color: #7c2d12;  /* Red-900 */
  --premium-color: #92400e;     /* Amber-800 */
}
```

**3. Consulting Departments**
```typescript
const departments = [
  {
    name: "CONSULTING",
    code: "ECS", // Elite Consulting Services
    onClick: () => setLocation("/consulting")
  },
  {
    name: "PROJECTS", 
    code: "ECP", // Elite Projects
    onClick: () => setLocation("/projects")
  },
  {
    name: "CLIENTS",
    code: "ECC", // Elite Client Care
    onClick: () => setLocation("/clients")
  },
  {
    name: "FINANCE",
    code: "ECF", // Elite Finance
    onClick: () => setLocation("/finance")
  }
];
```

**4. Service Types**
```typescript
<SelectContent>
  <SelectItem value="Strategy Consulting">Strategy Consulting</SelectItem>
  <SelectItem value="Implementation">Implementation</SelectItem>
  <SelectItem value="Assessment">Assessment</SelectItem>
  <SelectItem value="Training">Training & Development</SelectItem>
</SelectContent>
```

## Example 4: Healthcare Services - "MedCare Solutions"

### Company Profile
- **Industry:** Healthcare & Medical Services
- **Departments:** Clinical, Equipment, Compliance, Administration
- **Brand Colors:** Medical Green (#059669) and Clean Blue (#0ea5e9)
- **Key Features:** Patient management, equipment tracking, compliance monitoring

### Customization Steps

**1. Healthcare Branding**
```typescript
const companyConfig: CompanyConfig = {
  name: "MedCare",
  tagline: "Healthcare Solutions",
  brandColor: "#059669",
  deliveryColor: "#0ea5e9"
};
```

**2. Medical Color Scheme**
```css
:root {
  --brand-primary: #059669;     /* Green-600 */
  --brand-secondary: #0ea5e9;   /* Sky-500 */
  --brand-accent: #2563eb;      /* Blue-600 */
  --medical-green: #065f46;     /* Green-800 */
  --safety-blue: #075985;      /* Sky-800 */
  --critical-red: #dc2626;     /* Red-600 */
}
```

**3. Healthcare Departments**
```typescript
const departments = [
  {
    name: "CLINICAL",
    code: "MCC", // MedCare Clinical
    onClick: () => setLocation("/clinical")
  },
  {
    name: "EQUIPMENT", 
    code: "MCE", // MedCare Equipment
    onClick: () => setLocation("/equipment")
  },
  {
    name: "COMPLIANCE",
    code: "MCP", // MedCare Compliance
    onClick: () => setLocation("/compliance")
  },
  {
    name: "ADMIN",
    code: "MCA", // MedCare Administration
    onClick: () => setLocation("/admin")
  }
];
```

## Advanced Customization Techniques

### 1. Dynamic Theme Loading

**Create theme configuration file:**
```typescript
// client/src/config/themes.ts
export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  departments: string[];
}

export const themes: Record<string, Theme> = {
  construction: {
    name: "Construction",
    primary: "#f97316",
    secondary: "#374151", 
    accent: "#059669",
    departments: ["PROJECTS", "EQUIPMENT", "SAFETY", "FINANCE"]
  },
  manufacturing: {
    name: "Manufacturing",
    primary: "#2563eb",
    secondary: "#6b7280",
    accent: "#0891b2", 
    departments: ["PRODUCTION", "QUALITY", "LOGISTICS", "MAINTENANCE"]
  },
  consulting: {
    name: "Consulting",
    primary: "#1e40af",
    secondary: "#d97706",
    accent: "#059669",
    departments: ["CONSULTING", "PROJECTS", "CLIENTS", "FINANCE"]
  }
};
```

**Dynamic theme application:**
```typescript
// client/src/hooks/useTheme.ts
import { useEffect } from 'react';
import { themes } from '../config/themes';

export function useTheme(themeName: string) {
  useEffect(() => {
    const theme = themes[themeName];
    if (theme) {
      document.documentElement.style.setProperty('--brand-primary', theme.primary);
      document.documentElement.style.setProperty('--brand-secondary', theme.secondary);
      document.documentElement.style.setProperty('--brand-accent', theme.accent);
    }
  }, [themeName]);
}
```

### 2. Component-Level Customization

**Custom button variants:**
```typescript
// client/src/components/ui/custom-button.tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomButtonProps {
  variant?: "construction" | "manufacturing" | "consulting";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function CustomButton({ variant = "construction", children, className, ...props }: CustomButtonProps) {
  const variants = {
    construction: "bg-orange-500 hover:bg-orange-600 text-white",
    manufacturing: "bg-blue-600 hover:bg-blue-700 text-white", 
    consulting: "bg-navy-800 hover:bg-navy-900 text-white"
  };

  return (
    <Button 
      className={cn(variants[variant], className)}
      {...props}
    >
      {children}
    </Button>
  );
}
```

### 3. Industry-Specific Forms

**Construction client form additions:**
```typescript
// Additional fields for construction clients
const constructionFields = {
  licenseNumber: "",
  insuranceProvider: "",
  safetyRating: "",
  projectTypes: [],
  equipmentNeeds: ""
};
```

**Manufacturing client form additions:**
```typescript
// Additional fields for manufacturing clients
const manufacturingFields = {
  productionCapacity: "",
  certifications: [],
  qualityStandards: "",
  supplierCategory: "",
  deliveryRequirements: ""
};
```

### 4. Environment-Based Configuration

**Multi-environment setup:**
```bash
# .env.construction
COMPANY_NAME="BuildPro"
COMPANY_TAGLINE="Construction Services Ltd"
THEME="construction"
PRIMARY_COLOR="#f97316"

# .env.manufacturing  
COMPANY_NAME="TechManu"
COMPANY_TAGLINE="Industries & Manufacturing"
THEME="manufacturing"
PRIMARY_COLOR="#2563eb"
```

**Dynamic configuration loading:**
```typescript
// client/src/config/environment.ts
export const getCompanyConfig = () => ({
  name: import.meta.env.VITE_COMPANY_NAME || "Your Company",
  tagline: import.meta.env.VITE_COMPANY_TAGLINE || "Your Services",
  theme: import.meta.env.VITE_THEME || "default",
  primaryColor: import.meta.env.VITE_PRIMARY_COLOR || "#dc2626"
});
```

## Logo Integration Examples

### 1. Replace Text with Image Logo

**Header component update:**
```tsx
// client/src/components/Header.tsx
import logoImage from "@/assets/company-logo.png";

<div className="flex items-center space-x-4">
  <img 
    src={logoImage} 
    alt={companyConfig.name}
    className="h-12 w-auto"
  />
  <span className="text-lg font-medium">{companyConfig.tagline}</span>
</div>
```

### 2. Responsive Logo Sizing

```css
/* client/src/index.css */
.company-logo {
  height: 3rem;
  width: auto;
  max-width: 200px;
}

@media (max-width: 768px) {
  .company-logo {
    height: 2rem;
    max-width: 150px;
  }
}

@media (max-width: 480px) {
  .company-logo {
    height: 1.5rem;
    max-width: 120px;
  }
}
```

## White-Label Documentation Template

### For Each Client Deployment

**Create deployment-specific documentation:**

```markdown
# [Company Name] - Business Management System

## Deployment Details
- **Company:** [Company Name]
- **Industry:** [Industry Type]
- **Theme:** [Theme Name]
- **Domain:** [company.domain.com]
- **Deployment Date:** [Date]

## Customizations Applied
- [ ] Company branding updated
- [ ] Color scheme configured
- [ ] Department structure customized
- [ ] Logo integration completed
- [ ] Industry-specific fields added

## Configuration Files Modified
- `/client/src/pages/home.tsx` - Company config and departments
- `/client/src/index.css` - Color scheme
- `/client/src/assets/` - Logo and visual assets
- `/.env` - Environment variables

## Support Contacts
- **Technical Support:** [Email]
- **Account Manager:** [Name and Email]
- **System Administrator:** [Name and Email]
```

This comprehensive customization guide provides the foundation for white-labeling the business management system for any industry or company, with practical examples and implementation details.