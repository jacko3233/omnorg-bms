import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const baseURL = 'http://localhost:5000/';
  const visited = new Set();
  const results = [];
  const screenshotsDir = './screenshots_structure';

  if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);

  async function explore(url, depth = 0) {
    if (visited.has(url) || depth > 3) return;
    visited.add(url);

    try {
      console.log(`🔍 Analyzing: ${url} (depth: ${depth})`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
      await page.waitForTimeout(1500);
    } catch (e) {
      console.log(`❌ Error accessing ${url}: ${e.message}`);
      results.push({ url, type: 'error', message: e.message });
      return;
    }

    const pathname = new URL(url).pathname;
    const screenshotPath = path.join(screenshotsDir, pathname.replace(/[^a-z0-9]/gi, '_') + '.png');
    
    try {
      await page.screenshot({ path: screenshotPath, fullPage: true });
    } catch (e) {
      console.log(`📸 Screenshot failed for ${url}: ${e.message}`);
    }

    const pageTitle = await page.title();
    const forms = await page.$$eval('form', forms => forms.length);
    const buttons = await page.$$eval('button', btns => btns.map(b => b.innerText?.trim() || '[button]'));
    const inputs = await page.$$eval('input', ins => ins.map(i => ({ name: i.name || '[unnamed]', type: i.type || 'text' })));
    const links = await page.$$eval('a[href]', anchors => anchors.map(a => a.href));

    // Analyze page content structure
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', headers => 
      headers.map(h => ({ tag: h.tagName.toLowerCase(), text: h.innerText?.trim() }))
    );
    
    const tables = await page.$$eval('table', tables => tables.length);
    const cards = await page.$$eval('[class*="card"], .card', cards => cards.length);

    results.push({
      url,
      title: pageTitle,
      type: 'page',
      structure: {
        forms,
        buttons: buttons.slice(0, 10), // Limit to first 10 for readability
        inputs: inputs.slice(0, 10),
        headings,
        tables,
        cards
      },
      links: links.filter(link => link.startsWith(baseURL))
    });

    console.log(`✅ Analyzed: ${pageTitle || url} - ${forms} forms, ${buttons.length} buttons, ${inputs.length} inputs`);

    // Explore internal links
    for (const link of links) {
      if (link.startsWith(baseURL) && !visited.has(link)) {
        await explore(link, depth + 1);
      }
    }
  }

  console.log('🚀 Starting deep structure analysis of OMNOR system...');
  await explore(baseURL);

  const report = {
    timestamp: new Date().toISOString(),
    baseURL,
    totalPages: results.filter(r => r.type === 'page').length,
    errors: results.filter(r => r.type === 'error').length,
    results
  };

  fs.writeFileSync('./deep_structure_report.json', JSON.stringify(report, null, 2));
  
  console.log('📊 Analysis Summary:');
  console.log(`   Pages analyzed: ${report.totalPages}`);
  console.log(`   Errors: ${report.errors}`);
  console.log(`   Screenshots: ${screenshotsDir}`);
  console.log('✅ Deep structure scan complete. Report saved to deep_structure_report.json');

  await browser.close();
})();