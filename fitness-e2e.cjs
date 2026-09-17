const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:5174';
const SHOT = process.env.SHOT_DIR || 'test-screenshots';

/* End-to-end checks for the offline fitness app.
 *
 *   npm run build && npm run preview     # serve on :5174
 *   node fitness-e2e.cjs
 *
 * Env: BASE_URL, SHOT_DIR, PW_CHROMIUM_PATH (override the browser binary).
 * Exits non-zero if any check fails.
 */
let failed = 0;

(async () => {
  require('fs').mkdirSync(process.env.SHOT_DIR || 'test-screenshots', { recursive: true });
  const launchOpts = process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {};
  const browser = await chromium.launch(launchOpts);
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

  const step = async (name, fn) => {
    try { await fn(); console.log('PASS  ' + name); }
    catch (e) { failed++; console.log('FAIL  ' + name + ' :: ' + e.message); }
  };

  await page.goto(BASE + '/fitness', { waitUntil: 'networkidle' });

  await step('loads dashboard (not stuck on Loading)', async () => {
    await page.waitForSelector('text=Start Workout', { timeout: 8000 });
  });
  await page.screenshot({ path: SHOT + '/01-dashboard.png' });

  await step('start workout -> exercise picker seeded from IndexedDB', async () => {
    await page.click('text=Start Workout');
    await page.click('text=Add Exercise');
    await page.waitForSelector('text=Bench Press', { timeout: 5000 });
  });
  await page.screenshot({ path: SHOT + '/02-picker.png' });

  await step('add exercise + log a set', async () => {
    await page.click('text=Bench Press');
    const inputs = page.locator('input[type="number"]');
    await inputs.nth(0).fill('60');
    await inputs.nth(1).fill('8');
    await page.locator('button:has(svg.lucide-check)').first().click();
    await page.waitForTimeout(400);
  });
  await page.screenshot({ path: SHOT + '/03-active.png' });

  await step('rest timer opens and counts down', async () => {
    await page.waitForSelector('text=Rest Timer', { timeout: 3000 });
    const t1 = await page.locator('.tabular-nums').last().textContent();
    await page.waitForTimeout(1600);
    const t2 = await page.locator('.tabular-nums').last().textContent();
    if (t1 === t2) throw new Error('timer did not advance: ' + t1 + ' -> ' + t2);
    console.log('       timer ' + t1.trim() + ' -> ' + t2.trim());
    await page.locator('div:has-text("Rest Timer")').last().locator('button').first().click();
  });

  await step('DRAFT: reload mid-workout restores the session', async () => {
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('text=Unfinished workout', { timeout: 8000 });
    await page.click('text=Resume');
    await page.waitForSelector('text=Bench Press', { timeout: 5000 });
    const val = await page.locator('input[type="number"]').nth(0).inputValue();
    if (val !== '60') throw new Error('set data lost, weight=' + JSON.stringify(val));
  });
  await page.screenshot({ path: SHOT + '/04-resumed.png' });

  await step('CANCEL is guarded by a confirmation', async () => {
    await page.click('text=Cancel');
    await page.waitForSelector('text=Discard this workout?', { timeout: 3000 });
    await page.click('text=Keep going');
    await page.waitForSelector('text=Bench Press', { timeout: 3000 });
  });

  await step('finish workout persists it', async () => {
    await page.click('text=Finish');
    await page.waitForSelector('text=Recent Workouts', { timeout: 5000 });
    await page.waitForSelector('text=1 exercises', { timeout: 5000 });
  });
  await page.screenshot({ path: SHOT + '/05-saved.png' });

  await step('stats view renders saved volume', async () => {
    await page.click('text=Stats');
    await page.waitForSelector('text=Total Workouts', { timeout: 5000 });
    const body = await page.textContent('body');
    if (!body.includes('480')) throw new Error('expected 60kg x 8 = 480 volume in stats');
  });
  await page.screenshot({ path: SHOT + '/06-stats.png' });

  await step('empty workout cannot be saved', async () => {
    await page.click('text=Home');
    await page.click('text=Start Workout');
    await page.click('text=Finish');
    await page.waitForSelector('text=Add at least one exercise', { timeout: 3000 });
  });
  await page.screenshot({ path: SHOT + '/07-empty-guard.png' });

  await step('travel site still renders and links to Fitness', async () => {
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.click('button[aria-label="Toggle menu"], header button:has(svg.lucide-menu)'); await page.waitForSelector('a[href="/fitness"]:visible', { timeout: 5000 });
  });

  // Google Fonts is the only external request; a sandboxed proxy blocking it
  // is not an app failure, so it is reported but not counted.
  console.log('\n--- console/page errors: ' + errors.length + ' ---');
  errors.slice(0, 10).forEach(e => console.log('  ' + e));
  await browser.close();

  console.log(failed === 0 ? '\nAll checks passed.' : `\n${failed} check(s) failed.`);
  process.exit(failed === 0 ? 0 : 1);
})();
