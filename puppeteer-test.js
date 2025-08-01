// puppeteer-test.js

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

(async () => {
  const screenshotDir = './screenshots';
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const baseUrl = 'https://future-face-Jacko3233.replit.app';

  const errors = [];
  const deadLinks = [];
  const navigationFlow = [];

  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  const departments = [
    'Fabrication',
    'Sales',
    'Testing',
    'Transport',
    'Hire',
    'Vessel Support'
  ];

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: `${screenshotDir}/home.png` });
  navigationFlow.push('Visited Home');

  for (let dept of departments) {
    try {
      const deptSelector = `a:has-text("${dept}")`;
      await page.waitForSelector(deptSelector, { timeout: 3000 });
      await page.click(deptSelector);
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `${screenshotDir}/${dept}-landing.png` });
      navigationFlow.push(`Visited ${dept} tab`);

      // New Job
      if (await page.$('a:has-text("New Job")')) {
        await page.click('a:has-text("New Job")');
        await page.waitForTimeout(1000);
        navigationFlow.push(`Opened New Job - ${dept}`);
        await page.screenshot({ path: `${screenshotDir}/${dept}-new-job.png` });

        // Fill dummy data if inputs exist
        const inputFields = await page.$$('input, textarea');
        for (let input of inputFields) {
          await input.type('Test Entry');
        }
        if (await page.$('button[type="submit"]')) {
          await page.click('button[type="submit"]');
          await page.waitForTimeout(1000);
          navigationFlow.push(`Submitted New Job - ${dept}`);
        }
      } else {
        deadLinks.push(`Missing New Job in ${dept}`);
      }

      // Update Job
      if (await page.$('a:has-text("Update Job")')) {
        await page.click('a:has-text("Update Job")');
        await page.waitForTimeout(1000);
        navigationFlow.push(`Opened Update Job - ${dept}`);
        await page.screenshot({ path: `${screenshotDir}/${dept}-update-job.png` });

        if (await page.$('button:has-text("Complete")')) {
          await page.click('button:has-text("Complete")');
          await page.waitForTimeout(1000);
          navigationFlow.push(`Marked Job Complete - ${dept}`);
        }
      } else {
        deadLinks.push(`Missing Update Job in ${dept}`);
      }

      await page.goto(baseUrl); // Go back to homepage for next dept
    } catch (err) {
      deadLinks.push(`Navigation failed for ${dept}: ${err.message}`);
    }
  }

  // Catch any other non-clickable links on homepage
  const allLinks = await page.$$('a');
  for (let i = 0; i < allLinks.length; i++) {
    const href = await page.evaluate(el => el.getAttribute('href'), allLinks[i]);
    if (!href || href === '#') {
      deadLinks.push(`Non-functional tab on homepage: ${href}`);
    }
  }

  fs.writeFileSync('./report.json', JSON.stringify({
    navigationFlow,
    errors,
    deadLinks
  }, null, 2));

  await browser.close();
})();