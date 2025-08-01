const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const baseURL = 'https://future-face-jacko3233.replit.app';
  const startURL = baseURL + '/hire/live-jobs';

  const visited = new Set();
  const navigations = [];
  const errors = [];
  const screenshotsDir = './screenshots';
  if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);

  async function takeScreenshot(name) {
    const filePath = path.join(screenshotsDir, name.replace(/[\/:"*?<>|]+/g, '_') + '.png');
    await page.screenshot({ path: filePath, fullPage: true });
  }

  async function simulateFormSubmission() {
    const forms = await page.$$('form');
    for (const form of forms) {
      const inputs = await form.$$eval('input[name]', els =>
        els.map(el => ({ name: el.name, type: el.type }))
      );
      for (const input of inputs) {
        const sel = `input[name="${input.name}"]`;
        if (input.type === 'text' || input.type === 'email') {
          await page.type(sel, 'Test Value');
        } else if (input.type === 'date') {
          await page.$eval(sel, el => el.value = '2025-07-30');
        }
      }
      try {
        await form.evaluate(f => f.submit());
        await page.waitForTimeout(1000);
      } catch (e) {
        errors.push({ url: page.url(), error: 'Form submission failed: ' + e.message });
      }
    }
  }

  async function crawl(url, depth = 0) {
    if (visited.has(url) || depth > 3) return;
    visited.add(url);

    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
    } catch (e) {
      errors.push({ url, error: e.message });
      return;
    }

    await takeScreenshot(`Page_${depth}_${url.replace(baseURL, '').replace(/\W+/g, '_')}`);

    const links = await page.$$eval('a[href]', anchors =>
      anchors.map(a => a.href).filter(href => href.includes(location.origin))
    );
    navigations.push({ url, links });

    const buttons = await page.$$('button, input[type="button"], div[role="button"]');
    for (const button of buttons) {
      try {
        await button.click();
        await page.waitForTimeout(500);
      } catch (err) {
        errors.push({ url, error: 'Unclickable element: ' + err.message });
      }
    }

    await simulateFormSubmission();

    for (const link of links) {
      if (!visited.has(link)) {
        await crawl(link, depth + 1);
      }
    }
  }

  await crawl(startURL);

  const report = {
    tested: Array.from(visited),
    errors: errors,
    navigation: navigations,
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync('./omnor_navigation_report.json', JSON.stringify(report, null, 2));

  console.log('✅ Full QA Test complete. Screenshots saved. JSON report generated.');
  await browser.close();
})();