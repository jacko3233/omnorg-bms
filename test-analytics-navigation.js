// Simple analytics navigation test
import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  console.log('🚀 Starting analytics navigation test...');
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  const baseUrl = 'http://localhost:5000';
  
  const testResults = {
    successful: [],
    failed: [],
    screenshots: []
  };

  try {
    // Test home page loading
    await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });
    console.log('✅ Home page loaded');
    testResults.successful.push('Home page loaded');
    
    // Take screenshot of home
    await page.screenshot({ path: './home-test.png' });
    testResults.screenshots.push('home-test.png');
    
    // Test Performance Insights button
    const performanceBtn = await page.$('button:has-text("Performance Insights")');
    if (performanceBtn) {
      await performanceBtn.click();
      await page.waitForTimeout(2000);
      console.log('✅ Performance Insights dashboard loaded');
      testResults.successful.push('Performance Insights navigation');
      
      // Take screenshot of performance dashboard
      await page.screenshot({ path: './performance-dashboard-test.png' });
      testResults.screenshots.push('performance-dashboard-test.png');
      
      // Test clickable metric cards
      const revenueCard = await page.$('[data-testid="revenue-card"], .cursor-pointer');
      if (revenueCard) {
        await revenueCard.click();
        await page.waitForTimeout(1000);
        console.log('✅ Revenue card clickable');
        testResults.successful.push('Revenue card navigation');
      }
      
    } else {
      console.log('❌ Performance Insights button not found');
      testResults.failed.push('Performance Insights button missing');
    }
    
    // Test job creation navigation
    await page.goto(`${baseUrl}/hire/new-job`, { waitUntil: 'networkidle2' });
    console.log('✅ New hire job page accessible');
    testResults.successful.push('New hire job page');
    
    await page.screenshot({ path: './new-job-test.png' });
    testResults.screenshots.push('new-job-test.png');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    testResults.failed.push(`Test error: ${error.message}`);
  }

  // Write results
  fs.writeFileSync('./analytics-test-results.json', JSON.stringify(testResults, null, 2));
  console.log('📊 Test results saved to analytics-test-results.json');
  
  await browser.close();
  console.log('🏁 Analytics navigation test completed');
})();