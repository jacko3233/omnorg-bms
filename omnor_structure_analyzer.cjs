#!/usr/bin/env node

// OMNOR Deep Structure Analysis - Server-side analysis
const fs = require('fs');
const path = require('path');

function analyzeProjectStructure() {
  console.log('🔍 OMNOR Deep Structure Analysis\n');

  const analysis = {
    timestamp: new Date().toISOString(),
    projectStructure: {},
    routes: [],
    components: [],
    pages: [],
    schemas: {},
    apiEndpoints: [],
    summary: {}
  };

  // Analyze file structure
  function scanDirectory(dir, prefix = '') {
    const items = [];
    if (!fs.existsSync(dir)) return items;

    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        items.push({
          type: 'directory',
          name: file,
          path: fullPath,
          children: scanDirectory(fullPath, prefix + '  ')
        });
      } else if (stat.isFile() && (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js'))) {
        items.push({
          type: 'file',
          name: file,
          path: fullPath,
          size: stat.size
        });
      }
    }
    return items;
  }

  // Analyze routes from server
  function analyzeRoutes() {
    try {
      const routesPath = './server/routes.ts';
      if (fs.existsSync(routesPath)) {
        const content = fs.readFileSync(routesPath, 'utf8');
        
        const routeMatches = content.match(/router\.(get|post|put|delete|patch)\(['"`]([^'"`]+)['"`]/g) || [];
        const routes = routeMatches.map(match => {
          const [, method, path] = match.match(/router\.(\w+)\(['"`]([^'"`]+)['"`]/);
          return { method: method.toUpperCase(), path };
        });

        analysis.routes = routes;
        console.log(`📋 API Routes Found: ${routes.length}`);
        routes.forEach(route => console.log(`   ${route.method} ${route.path}`));
        console.log();
      }
    } catch (error) {
      console.log(`❌ Error analyzing routes: ${error.message}`);
    }
  }

  // Analyze React pages
  function analyzePages() {
    try {
      const pagesDir = './client/src/pages';
      if (fs.existsSync(pagesDir)) {
        const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));
        
        analysis.pages = files.map(file => {
          const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
          
          // Extract component name and key features
          const componentMatch = content.match(/export default function (\w+)/);
          const componentName = componentMatch ? componentMatch[1] : file.replace('.tsx', '');
          
          // Look for forms, queries, and key features
          const hasForm = content.includes('useForm') || content.includes('<form');
          const hasQuery = content.includes('useQuery');
          const hasMutation = content.includes('useMutation');
          const hasCharts = content.includes('Chart') || content.includes('recharts');
          
          return {
            file,
            component: componentName,
            features: {
              hasForm,
              hasQuery,
              hasMutation,
              hasCharts
            }
          };
        });

        console.log(`📄 React Pages Found: ${analysis.pages.length}`);
        analysis.pages.forEach(page => {
          const features = Object.entries(page.features)
            .filter(([key, value]) => value)
            .map(([key]) => key.replace('has', '').toLowerCase());
          console.log(`   ${page.component} (${page.file}) - ${features.join(', ') || 'basic'}`);
        });
        console.log();
      }
    } catch (error) {
      console.log(`❌ Error analyzing pages: ${error.message}`);
    }
  }

  // Analyze database schema
  function analyzeSchema() {
    try {
      const schemaPath = './shared/schema.ts';
      if (fs.existsSync(schemaPath)) {
        const content = fs.readFileSync(schemaPath, 'utf8');
        
        // Extract table definitions
        const tableMatches = content.match(/export const (\w+) = pgTable\("([^"]+)"/g) || [];
        const tables = tableMatches.map(match => {
          const [, varName, tableName] = match.match(/export const (\w+) = pgTable\("([^"]+)"/);
          return { variable: varName, table: tableName };
        });

        // Extract schema types
        const typeMatches = content.match(/export type (\w+) = /g) || [];
        const types = typeMatches.map(match => {
          const [, typeName] = match.match(/export type (\w+) = /);
          return typeName;
        });

        analysis.schemas = { tables, types };
        console.log(`🗄️  Database Tables: ${tables.length}`);
        tables.forEach(table => console.log(`   ${table.table} (${table.variable})`));
        console.log(`🏷️  TypeScript Types: ${types.length}`);
        console.log();
      }
    } catch (error) {
      console.log(`❌ Error analyzing schema: ${error.message}`);
    }
  }

  // Analyze UI components
  function analyzeComponents() {
    try {
      const componentsDir = './client/src/components';
      if (fs.existsSync(componentsDir)) {
        function scanComponents(dir, components = []) {
          const files = fs.readdirSync(dir);
          for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
              scanComponents(fullPath, components);
            } else if (file.endsWith('.tsx')) {
              components.push({
                name: file.replace('.tsx', ''),
                path: fullPath.replace('./client/src/', ''),
                category: path.basename(path.dirname(fullPath))
              });
            }
          }
          return components;
        }

        analysis.components = scanComponents(componentsDir);
        console.log(`🧩 UI Components Found: ${analysis.components.length}`);
        
        // Group by category
        const byCategory = analysis.components.reduce((acc, comp) => {
          acc[comp.category] = (acc[comp.category] || 0) + 1;
          return acc;
        }, {});
        
        Object.entries(byCategory).forEach(([category, count]) => {
          console.log(`   ${category}: ${count} components`);
        });
        console.log();
      }
    } catch (error) {
      console.log(`❌ Error analyzing components: ${error.message}`);
    }
  }

  // Run all analyses
  console.log('🚀 Starting comprehensive structure analysis...\n');
  
  analysis.projectStructure = {
    client: scanDirectory('./client'),
    server: scanDirectory('./server'),
    shared: scanDirectory('./shared')
  };

  analyzeRoutes();
  analyzePages();
  analyzeSchema();
  analyzeComponents();

  // Generate summary
  analysis.summary = {
    totalRoutes: analysis.routes.length,
    totalPages: analysis.pages.length,
    totalTables: analysis.schemas.tables?.length || 0,
    totalComponents: analysis.components.length,
    features: {
      hasPerformanceDashboard: analysis.pages.some(p => p.component.toLowerCase().includes('performance')),
      hasJobManagement: analysis.pages.some(p => p.component.toLowerCase().includes('job')),
      hasClientManagement: analysis.pages.some(p => p.component.toLowerCase().includes('client')),
      hasAdminPanel: analysis.pages.some(p => p.component.toLowerCase().includes('admin')),
      hasCharts: analysis.pages.some(p => p.features.hasCharts)
    }
  };

  console.log('📊 Structure Summary:');
  console.log(`   API Routes: ${analysis.summary.totalRoutes}`);
  console.log(`   React Pages: ${analysis.summary.totalPages}`);
  console.log(`   Database Tables: ${analysis.summary.totalTables}`);
  console.log(`   UI Components: ${analysis.summary.totalComponents}`);
  console.log();
  
  console.log('🎯 Key Features Detected:');
  Object.entries(analysis.summary.features).forEach(([feature, hasFeature]) => {
    const icon = hasFeature ? '✅' : '❌';
    const name = feature.replace('has', '').replace(/([A-Z])/g, ' $1').trim();
    console.log(`   ${icon} ${name}`);
  });

  // Save detailed report
  fs.writeFileSync('./deep_structure_report.json', JSON.stringify(analysis, null, 2));
  console.log('\n✅ Deep structure analysis complete!');
  console.log('📄 Detailed report saved to: deep_structure_report.json');

  return analysis;
}

// Run the analysis
analyzeProjectStructure();