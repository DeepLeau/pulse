const { chromium } = require('@playwright/test');

(async () => {
  console.log('Starting screenshot script...');
  
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  try {
    // --- Screenshot 1: Desktop Hero Validation ---
    console.log('Step 1: Navigating to / and validating desktop hero...');
    await page.goto('http://localhost:3000/');
    
    // Wait for the hero section to be visible (stable state)
    await page.waitForSelector('[data-testid="hero-section"]', { state: 'visible' });
    
    // Capture screenshot
    await page.screenshot({ path: 'screenshots/screenshot-1.png', fullPage: false });
    console.log('Screenshot 1 saved: screenshots/screenshot-1.png');

    // --- Screenshot 2: Mobile Responsive Validation ---
    console.log('Step 2: Resizing viewport to 390x844 (Mobile)...');
    
    // Update viewport to mobile dimensions
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Wait for the hero section to be visible again after resize to ensure stability
    await page.waitForSelector('[data-testid="hero-section"]', { state: 'visible' });
    
    // Capture screenshot
    await page.screenshot({ path: 'screenshots/screenshot-2.png', fullPage: false });
    console.log('Screenshot 2 saved: screenshots/screenshot-2.png');

  } catch (error) {
    console.error('An error occurred during execution:', error);
    process.exit(1);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
