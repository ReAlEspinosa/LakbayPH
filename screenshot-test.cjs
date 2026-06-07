const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  const base = 'http://localhost:5174';
  const shots = [
    ['/', 'home'],
    ['/discover', 'discover'],
    ['/destination/el-nido', 'destination-detail'],
    ['/roadside', 'roadside'],
    ['/planner', 'planner'],
    ['/bookings', 'bookings'],
    ['/community', 'community'],
    ['/profile', 'profile'],
    ['/this-does-not-exist', '404-page'],
  ];

  for (const [path, name] of shots) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `test-screenshots/${name}.png` });
    console.log('✓', name);
  }

  await browser.close();
  console.log('Done.');
})();
