const { chromium } = require('@playwright/test');

(async () => {
  console.log('Starting screenshot capture script...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();
  
  // Base URL assumption for local dev
  const baseURL = 'http://localhost:3000';

  try {
    // --- Screenshot 1: Landing Page ---
    console.log('Capturing Screenshot 1: Landing Page...');
    await page.goto(baseURL + '/', { waitUntil: 'domcontentloaded' });
    
    // Wait for the CTA button to be visible (critical milestone)
    const ctaButton = page.getByRole('button', { name: 'Get Started Free' });
    await expect(ctaButton).toBeVisible({ timeout: 10000 });
    
    await page.screenshot({ path: 'screenshots/screenshot-1-landing.png', fullPage: false });
    console.log('Screenshot 1 saved.');

  } catch (error) {
    console.error('Error capturing Screenshot 1:', error.message);
    // Capture error state if possible
    await page.screenshot({ path: 'screenshots/screenshot-1-error.png', fullPage: false });
  }

  try {
    // --- Screenshot 2: Dashboard Grid (Premium) ---
    console.log('Capturing Screenshot 2: Dashboard Grid...');
    await page.goto(baseURL + '/dashboard', { waitUntil: 'domcontentloaded' });

    // Wait for dashboard grid OR glow card (deterministic milestone)
    // Using first() in case multiple elements match, or specific selector
    const dashboardGrid = page.locator('[data-testid="dashboard-grid"]').first();
    const glowCard = page.locator('.glow-card').first();
    
    // Wait for at least one of the elements to be visible
    await expect(dashboardGrid.or(glowCard)).toBeVisible({ timeout: 10000 });
    
    await page.screenshot({ path: 'screenshots/screenshot-2-dashboard-grid.png', fullPage: false });
    console.log('Screenshot 2 saved.');

  } catch (error) {
    console.error('Error capturing Screenshot 2:', error.message);
    await page.screenshot({ path: 'screenshots/screenshot-2-error.png', fullPage: false });
  }

  try {
    // --- Screenshot 3: API Status Table ---
    console.log('Capturing Screenshot 3: API Status Table...');
    // We are already on /dashboard, just wait for the specific table
    
    const apiTable = page.locator('[data-testid="api-status-table"]');
    await expect(apiTable).toBeVisible({ timeout: 10000 });
    
    await page.screenshot({ path: 'screenshots/screenshot-3-api-status.png', fullPage: false });
    console.log('Screenshot 3 saved.');

  } catch (error) {
    console.error('Error capturing Screenshot 3:', error.message);
    await page.screenshot({ path: 'screenshots/screenshot-3-error.png', fullPage: false });
  }

  await browser.close();
  console.log('Script finished.');
})();
