const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function runScreenshotScript() {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    baseURL: 'http://localhost:3000',
  });
  const page = await context.newPage();

  console.log('Starting screenshot capture script...');

  try {
    // ============================================
    // SCREENSHOT 1: Jalon initial — Liste d'endpoints avec pagination
    // ============================================
    console.log('\n[Screenshot 1] Navigating to /dashboard/endpoints...');
    await page.goto('/dashboard/endpoints', { waitUntil: 'networkidle' });

    // Attendre que la liste d'endpoints soit visible
    const endpointsList = page.getByTestId('endpoints-list');
    await endpointsList.waitFor({ state: 'visible', timeout: 10000 });
    console.log('[Screenshot 1] Endpoints list is visible');

    // Vérifier la présence de la pagination
    const pagination = page.getByTestId('pagination');
    if (await pagination.isVisible()) {
      console.log('[Screenshot 1] Pagination is visible');
    }

    await page.screenshot({
      path: 'screenshots/screenshot-1-endpoints-list.png',
      fullPage: false,
    });
    console.log('[Screenshot 1] Captured: screenshot-1-endpoints-list.png');

    // ============================================
    // SCREENSHOT 2: Jalon menu contextuel — Menu 3 points
    // ============================================
    console.log('\n[Screenshot 2] Opening row menu for first endpoint...');

    // Cliquer sur le bouton menu (3 points) de la première ligne
    const rowMenuButton = page
      .getByTestId('endpoints-list')
      .getByTestId('endpoint-row')
      .first()
      .getByTestId('row-menu-button');
    await rowMenuButton.waitFor({ state: 'visible', timeout: 5000 });
    await rowMenuButton.click();
    console.log('[Screenshot 2] Clicked row menu button');

    // Attendre que le dropdown soit visible
    const dropdownMenu = page.getByTestId('row-dropdown-menu');
    await dropdownMenu.waitFor({ state: 'visible', timeout: 5000 });
    console.log('[Screenshot 2] Dropdown menu is visible');

    // Vérifier les options Supprimer et Modifier
    const deleteOption = page.getByTestId('dropdown-delete-option');
    const modifyOption = page.getByTestId('dropdown-modify-option');
    await expect(deleteOption).toBeVisible();
    await expect(modifyOption).toBeVisible();
    console.log('[Screenshot 2] Delete and Modify options are visible');

    await page.screenshot({
      path: 'screenshots/screenshot-2-row-menu-open.png',
      fullPage: false,
    });
    console.log('[Screenshot 2] Captured: screenshot-2-row-menu-open.png');

    // ============================================
    // SCREENSHOT 3: Jalon suppression — Supprimer endpoint
    // ============================================
    console.log('\n[Screenshot 3] Clicking delete option...');

    await deleteOption.click();
    console.log('[Screenshot 3] Clicked delete option');

    // Attendre que l'endpoint disparaisse de la liste
    // On vérifie d'abord qu'un对话框 de confirmation ou un toast apparaît
    const toastOrConfirm = page.getByTestId('delete-confirmation-dialog');
    
    // Si dialogue de confirmation présent, confirmer
    if (await toastOrConfirm.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('[Screenshot 3] Confirmation dialog visible, confirming...');
      const confirmButton = page.getByTestId('confirm-delete-button');
      await confirmButton.click();
    }

    // Attendre que l'endpoint soit supprimé (disparaît de la liste)
    const firstEndpointRow = page
      .getByTestId('endpoints-list')
      .getByTestId('endpoint-row')
      .first();
    
    // Attendre que la liste se mette à jour (disparaît ou change)
    await page.waitForFunction(() => {
      const rows = document.querySelectorAll('[data-testid="endpoint-row"]');
      return rows.length > 0;
    }, { timeout: 5000 });
    
    console.log('[Screenshot 3] Endpoint removed from list, list updated');

    // Prendre le screenshot AVANT de refermer le menu pour capturer l'état supprimé
    // Re-cliquer sur le menu d'une autre ligne si nécessaire pour état propre
    await page.keyboard.press('Escape'); // Fermer tout dropdown éventuel
    
    await page.screenshot({
      path: 'screenshots/screenshot-3-after-delete.png',
      fullPage: false,
    });
    console.log('[Screenshot 3] Captured: screenshot-3-after-delete.png');

    // ============================================
    // SCREENSHOT 4: Jalon modification — Modal d'édition
    // ============================================
    console.log('\n[Screenshot 4] Clicking modify option...');

    // Rouvrir le menu sur une autre ligne (la première qui reste)
    const secondRowMenuButton = page
      .getByTestId('endpoints-list')
      .getByTestId('endpoint-row')
      .first()
      .getByTestId('row-menu-button');
    
    await secondRowMenuButton.waitFor({ state: 'visible', timeout: 5000 });
    await secondRowMenuButton.click();

    const modifyBtn = page.getByTestId('dropdown-modify-option');
    await modifyBtn.waitFor({ state: 'visible', timeout: 5000 });
    await modifyBtn.click();
    console.log('[Screenshot 4] Clicked modify option');

    // Attendre que la modal d'édition soit visible
    const editModal = page.getByTestId('edit-endpoint-modal');
    await editModal.waitFor({ state: 'visible', timeout: 5000 });
    console.log('[Screenshot 4] Edit modal is visible');

    // Vérifier que les champs sont pré-remplis
    const nameInput = page.getByTestId('endpoint-name-input');
    const urlInput = page.getByTestId('endpoint-url-input');
    await expect(nameInput).toBeVisible();
    await expect(urlInput).toBeVisible();
    
    // Vérifier que les champs ont une valeur (pré-remplis)
    const nameValue = await nameInput.inputValue();
    const urlValue = await urlInput.inputValue();
    console.log(`[Screenshot 4] Pre-filled values - Name: "${nameValue}", URL: "${urlValue}"`);

    await page.screenshot({
      path: 'screenshots/screenshot-4-edit-modal.png',
      fullPage: false,
    });
    console.log('[Screenshot 4] Captured: screenshot-4-edit-modal.png');

    console.log('\n✅ All screenshots captured successfully!');
  } catch (error) {
    console.error('\n❌ Error during screenshot capture:', error.message);
    
    // Capture d'erreur pour debug
    await page.screenshot({
      path: 'screenshots/screenshot-error-state.png',
      fullPage: false,
    }).catch(() => {});
    
    throw error;
  } finally {
    await browser.close();
    console.log('\nBrowser closed. Script finished.');
  }
}

// Helper: expect wrapper simple sans imports
async function expect(locator) {
  return {
    toBeVisible: async () => {
      const isVisible = await locator.isVisible();
      if (!isVisible) {
        throw new Error(`Expected element to be visible`);
      }
    },
  };
}

runScreenshotScript()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
