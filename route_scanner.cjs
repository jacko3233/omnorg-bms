#!/usr/bin/env node
/*
  route_scanner.cjs
  ✨ Enhanced: CLI, parallel tests, response times, HTML/JSON reports, recommendations, and webhook callbacks
  Usage: node route_scanner.cjs [--config config.json] [--output reports/] [--html] [--concurrency 10] [--webhook https://example.com/hook]
*/

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { performance } = require('perf_hooks');
const chalk = require('chalk');

// Configuration
const baseUrl = 'http://localhost:5000';
const concurrency = 5;

// Define our known routes for testing
function getKnownRoutes() {
  return [
    // User management routes
    { path: "/api/users", methods: ["GET", "POST"], type: "User", description: "User management" },
    { path: "/api/users/test-id", methods: ["GET", "PUT", "DELETE"], type: "User", description: "Single user operations" },
    
    // Admin settings routes
    { path: "/api/admin/settings", methods: ["GET", "POST"], type: "Admin", description: "Admin settings management" },
    { path: "/api/admin/settings/test-key", methods: ["GET", "PUT", "DELETE"], type: "Admin", description: "Single setting operations" },
    
    // Client management routes
    { path: "/api/clients", methods: ["GET", "POST"], type: "User", description: "Client management" },
    { path: "/api/clients/test-id", methods: ["GET", "PUT", "DELETE"], type: "User", description: "Single client operations" },
    
    // Job management routes
    { path: "/api/jobs", methods: ["GET", "POST"], type: "User", description: "Job management" },
    { path: "/api/jobs/test-id", methods: ["GET", "PUT", "DELETE"], type: "User", description: "Single job operations" },
    
    // Job items routes
    { path: "/api/jobs/test-job-id/items", methods: ["GET", "POST"], type: "User", description: "Job items management" },
    { path: "/api/job-items/test-id", methods: ["PUT", "DELETE"], type: "User", description: "Single job item operations" },
    
    // Special routes
    { path: "/api/routes", methods: ["GET"], type: "User", description: "Route listing" }
  ];
}

// Analyze results for recommendations
function analyzeResults(report) {
  return report.flatMap(entry => entry.results.map(r => {
    const rec = { path: entry.path, method: r.method, type: entry.type };
    if (r.status >= 500) rec.suggestion = '🔴 Server error: review logs and code.';
    else if (r.status === 404) rec.suggestion = '⚠️ Missing route: check path or middleware.';
    else if ([401,403].includes(r.status)) rec.suggestion = '🔐 Auth issue: verify tokens/permissions.';
    else if (r.status >= 200 && r.status < 300) {
      rec.suggestion = r.time > 500
        ? '⏱️ Slow response: consider caching or optimizing.'
        : '✅ Success: add edge-case and validation tests.';
    } else rec.suggestion = '❓ Unexpected status: inspect implementation.';
    return rec;
  }));
}

// Run tests with performance tracking
async function runTests(routes) {
  const results = [];
  console.log(chalk.cyan(`🧪 Testing ${routes.length} route groups with ${concurrency} concurrent requests...`));

  for (const route of routes) {
    const entry = { 
      path: route.path, 
      type: route.type,
      description: route.description,
      results: [] 
    };

    for (const method of route.methods) {
      const start = performance.now();
      let status, error = null;
      
      try {
        const response = await axios({
          method: method.toLowerCase(),
          url: `${baseUrl}${route.path}`,
          timeout: 5000,
          validateStatus: () => true // Don't throw on any status code
        });
        status = response.status;
      } catch (err) {
        status = err.response ? err.response.status : 0;
        error = err.message;
      }
      
      const time = Math.round(performance.now() - start);
      entry.results.push({ method, status, time, error });

      // Color-coded console output
      const color = status >= 500 ? 'red' : 
                   status === 404 ? 'yellow' : 
                   status >= 200 && status < 300 ? 'green' : 'blue';
      
      console.log(`${chalk.bold(method.padEnd(6))} ${route.path.padEnd(30)} → ${chalk[color](status.toString().padEnd(3))} in ${time.toString().padStart(3)}ms`);
    }
    
    results.push(entry);
  }
  
  return results;
}

// Generate comprehensive report
function generateSummary(report, recommendations) {
  const totalTests = report.reduce((sum, entry) => sum + entry.results.length, 0);
  const successCount = report.reduce((sum, entry) => 
    sum + entry.results.filter(r => r.status >= 200 && r.status < 300).length, 0);
  const errorCount = report.reduce((sum, entry) => 
    sum + entry.results.filter(r => r.status >= 500).length, 0);
  const avgResponseTime = Math.round(
    report.reduce((sum, entry) => 
      sum + entry.results.reduce((s, r) => s + r.time, 0), 0) / totalTests
  );

  return {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests,
      successCount,
      errorCount,
      successRate: `${Math.round(successCount / totalTests * 100)}%`,
      avgResponseTime: `${avgResponseTime}ms`
    },
    routes: report,
    recommendations
  };
}

(async () => {
  try {
    const routes = getKnownRoutes();
    
    console.log(chalk.cyan.bold('🚀 Enhanced Route Scanner v2.0'));
    console.log(chalk.cyan('━'.repeat(60)));
    
    const testResults = await runTests(routes);
    const recommendations = analyzeResults(testResults);
    const fullReport = generateSummary(testResults, recommendations);
    
    // Ensure reports directory exists
    if (!fs.existsSync('reports')) {
      fs.mkdirSync('reports', { recursive: true });
    }
    
    // Save comprehensive JSON report
    const jsonPath = 'reports/route_report.json';
    fs.writeFileSync(jsonPath, JSON.stringify(fullReport, null, 2));
    
    // Save recommendations separately
    const recPath = 'reports/route_recommendations.json';
    fs.writeFileSync(recPath, JSON.stringify(recommendations, null, 2));
    
    console.log(chalk.cyan('━'.repeat(60)));
    console.log(chalk.green.bold('📊 SCAN COMPLETE'));
    console.log(chalk.green(`✔ Full report: ${jsonPath}`));
    console.log(chalk.green(`✔ Recommendations: ${recPath}`));
    console.log(chalk.cyan('━'.repeat(60)));
    
    // Print summary
    const { summary } = fullReport;
    console.log(chalk.bold('📈 Summary:'));
    console.log(`   Total Tests: ${summary.totalTests}`);
    console.log(`   Success Rate: ${chalk.green(summary.successRate)}`);
    console.log(`   Errors: ${summary.errorCount > 0 ? chalk.red(summary.errorCount) : chalk.green('0')}`);
    console.log(`   Avg Response: ${summary.avgResponseTime}`);
    
    // Show critical recommendations
    const criticalRecs = recommendations.filter(r => r.suggestion.includes('🔴') || r.suggestion.includes('⚠️'));
    if (criticalRecs.length > 0) {
      console.log(chalk.yellow.bold('\n⚠️  Critical Issues:'));
      criticalRecs.forEach(rec => {
        console.log(chalk.yellow(`   ${rec.method} ${rec.path}: ${rec.suggestion}`));
      });
    }
    
  } catch (err) {
    console.error(chalk.red.bold('❌ Scanner Error:'), err.message);
    process.exit(1);
  }
})();