
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  const baseURL = 'https://1ef16d25-1a20-46a8-b30e-427571a54cb9-00-2t25mmxh6inw6.picard.replit.dev/';
  const visited = new Set();
  const results = [];
  const screenshotsDir = './screenshots_structure';

  if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);

  async function explore(url, depth = 0) {
    if (visited.has(url) || depth > 3) return;
    visited.add(url);

    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      await page.waitForTimeout(1500);
    } catch (e) {
      results.push({ url, type: 'error', message: e.message });
      return;
    }

    const pathname = new URL(url).pathname;
    const screenshotPath = path.join(screenshotsDir, pathname.replace(/[^a-z0-9]/gi, '_') + '.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });

    const forms = await page.$$eval('form', forms => forms.length);
    const buttons = await page.$$eval('button', btns => btns.map(b => b.innerText || '[button]'));
    const inputs = await page.$$eval('input', ins => ins.map(i => i.name || '[unnamed]'));
    const links = await page.$$eval('a[href]', anchors => anchors.map(a => a.href));

    results.push({
      url,
      type: 'page',
      forms,
      buttons,
      inputs,
      links: links.filter(link => link.startsWith(location.origin))
    });

    for (const link of links) {
      if (link.startsWith(baseURL) && !visited.has(link)) {
        await explore(link, depth + 1);
      }
    }
  }

  await explore(baseURL);

  fs.writeFileSync('./deep_structure_report.json', JSON.stringify(results, null, 2));
  console.log('✅ Deep structure scan complete. JSON saved.');

  await browser.close();
})();
