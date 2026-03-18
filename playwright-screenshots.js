const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function takeScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  // Ensure screenshots directory exists
  const screenshotsDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Starting screenshot capture script...\n');

  try {
    // ============================================
    // SCREENSHOT 1: Dashboard initial state
    // ============================================
    console.log('[1/2] Navigating to /dashboard...');
    await page.goto('http://localhost:3000/dashboard', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });

    // Wait for page to be stable - wait for New endpoint button to be visible
    const newEndpointButton = page.getByRole('button', { name: /new endpoint/i });
    await newEndpointButton.waitFor({ state: 'visible', timeout: 10000 });
    
    // Additional stabilization - ensure button is actionable
    await page.waitForLoadState('domcontentloaded');
    
    console.log('[1/2] Dashboard loaded, New endpoint button visible.');
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'screenshot-1-dashboard-initial.png'),
      fullPage: false
    });
    console.log('[1/2] Screenshot saved: screenshot-1-dashboard-initial.png\n');

  } catch (error) {
    console.error('[1/2] Failed to capture dashboard screenshot:', error.message);
    // Continue to next screenshot even if this one fails
  }

  try {
    // ============================================
    // SCREENSHOT 2: Modal opened after clicking
    // ============================================
    console.log('[2/2] Clicking New endpoint button...');
    const newEndpointButton = page.getByRole('button', { name: /new endpoint/i });
    await newEndpointButton.click();
    
    // Wait for modal to be visible - use dialog role for resilience
    const modal = page.getByRole('dialog');
    await modal.waitFor({ state: 'visible', timeout: 10000 });
    
    // Additional stabilization for modal content
    await page.waitForLoadState('domcontentloaded');
    
    console.log('[2/2] Modal opened successfully.');
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'screenshot-2-modal-opened.png'),
      fullPage: false
    });
    console.log('[2/2] Screenshot saved: screenshot-2-modal-opened.png\n');

  } catch (error) {
    console.error('[2/2] Failed to capture modal screenshot:', error.message);
  }

  await browser.close();
  console.log('Screenshot capture complete.');
  console.log(`Output directory: ${screenshotsDir}`);
}

takeScreenshots().catch((error) => {
  console.error('Fatal error in screenshot script:', error);
  process.exit(1);
});
