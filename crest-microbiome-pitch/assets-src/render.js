// usage: node render.js scene.html out.png [dsf]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const [, , src, out, dsf = '1'] = process.argv;
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: Number(dsf), viewport: { width: 2400, height: 2000 } });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await page.goto('file://' + path.resolve(src));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const el = await page.$('#art');
  await el.screenshot({ path: out, omitBackground: true });
  await browser.close();
  console.log('wrote', out);
})();
