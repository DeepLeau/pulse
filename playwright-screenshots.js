const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🚀 Starting screenshot script...');

  // Create screenshots directory if it doesn't exist
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();

  try {
    // --- Initial Navigation & Auth Check ---
    console.log('➡️  Navigating to /dashboard/endpoints...');
    await page.goto('http://localhost:3000/dashboard/endpoints');
    
    // Check if redirected to login (Common Next.js behavior)
    if (page.url().includes('/login')) {
      console.log('⚠️  Auth required. Capturing login page.');
      await page.screenshot({ path: 'screenshots/login-required.png', fullPage: false });
      console.log('✅ Screenshot saved: login-required.png');
      await browser.close();
      return;
    }

    // --- Screenshot 1: Dashboard Load & Button Validation ---
    // Wait for the 'Add endpoint' button to be visible
    // Using getByRole ensures we target the interactive element regardless of exact text casing
    const addButton = page.getByRole('button', { name: /add endpoint/i });
    await expect(addButton).toBeVisible();
    
    console.log('📸 Capturing Screenshot 1: Dashboard Loaded');
    await page.screenshot({ path: 'screenshots/screenshot-1.png', fullPage: false });


    // --- Screenshot 2: Open Modal ---
    console.log('➡️  Clicking Add endpoint button...');
    await addButton.click();

    // Wait for the modal to appear. 
    // We assume the modal has a heading or a dialog role.const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    
    // Optional: Wait for a specific title inside modal to ensure it's fully rendered
    // (Assuming standard naming like "Create Endpoint" or "New Endpoint")
    // If the exact text isn't known, waiting for 'dialog' role is sufficient for stability.

    console.log('📸 Capturing Screenshot 2: Modal Opened');
    await page.screenshot({ path: 'screenshots/screenshot-2.png', fullPage: false });


    // --- Screenshot 3: Create Endpoint ---
    console.log('➡️  Filling form and submitting...');
    
    // Use generic labels that likely exist in a form (Name, URL, etc.)
    // If 'Name' label isn't visible, fallback to placeholder text
    const nameInput = page.getByLabel(/name/i).or(page.getByPlaceholder(/name/i));
    const urlInput = page.getByLabel(/url/i).or(page.getByPlaceholder(/url/i));
    
    await nameInput.fill('QA Test Endpoint');
    await urlInput.fill('https://qa-api.example.com/v1');

    // Find submit button inside the modal
    const submitButton = page.getByRole('button', { name: /save|create/i });
    await submitButton.click();

    // Wait for the modal to close OR the new item to appear in the list
    // Waiting for the new item in the list is a stronger assertion of success
    const newEndpointRow = page.getByText('QA Test Endpoint');
    await expect(newEndpointRow).toBeVisible();

    console.log('📸 Capturing Screenshot 3: Endpoint Created');
    await page.screenshot({ path: 'screenshots/screenshot-3.png', fullPage: false });


    // --- Screenshot 4: Search & Filter ---
    console.log('➡️  Testing search filter...');
    
    // Locate search input. Common patterns: placeholder 'Search...', 'Filter', etc.const searchInput = page.getByPlaceholder(/search/i).or(page.getByLabel(/search/i));
    await searchInput.fill('QA Test Endpoint');

    // Wait for the list to reflect the filter
    // We verify the specific row is still visible and perhaps others are gone (hard to do without specific IDs, 
    // so we verify our target is present).await expect(newEndpointRow).toBeVisible();

    console.log('📸 Capturing Screenshot 4: Search Filter Active');
    await page.screenshot({ path: 'screenshots/screenshot-4.png', fullPage: false });


  } catch (error) {
    console.error('❌ Error during execution:', error);
    // Attempt to capture error state
    try {
      await page.screenshot({ path: 'screenshots/error-state.png', fullPage: false });
    } catch (e) {
      console.error('Failed to capture error screenshot');
    }
  } finally {
    await browser.close();
    console.log('✅ Script finished.');
  }
})();
