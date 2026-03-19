const { chromium, expect } = require('@playwright/test');

(async () => {
  let browser;
  try {
    // Initialisation du navigateur avec le viewport requis
    browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();
    const baseUrl = 'http://localhost:3000';

    // --- Screenshot 1: Vérification de la page et du bouton "Add endpoint" ---
    try {
      console.log('Step 1: Navigation vers /dashboard/endpoints');
      await page.goto(`${baseUrl}/dashboard/endpoints`, { waitUntil: 'networkidle' });

      // Attendre que le bouton soit visible
      const addButton = page.locator('[data-testid="add-endpoint-button"]');
      await addButton.waitFor({ state: 'visible' });

      // Valider que le texte est bien "Add endpoint"
      await expect(addButton).toHaveText('Add endpoint');

      await page.screenshot({ path: 'screenshots/screenshot-1.png' });
      console.log('Screenshot 1 capturé : Bouton "Add endpoint" visible et validé.');
    } catch (error) {
      console.error('Erreur au Screenshot 1:', error.message);
    }

    // --- Screenshot 2: Ouverture de la modale ---
    try {
      console.log('Step 2: Ouverture de la modale');
      await page.locator('[data-testid="add-endpoint-button"]').click();

      // Attendre que la modale soit visible
      const modal = page.locator('[data-testid="endpoint-modal"]');
      await modal.waitFor({ state: 'visible' });

      await page.screenshot({ path: 'screenshots/screenshot-2.png' });
      console.log('Screenshot 2 capturé : Modale ouverte.');
    } catch (error) {
      console.error('Erreur au Screenshot 2:', error.message);
    }

    // --- Screenshot 3: Création d\'un endpoint ---
    try {
      console.log('Step 3: Création de l\'endpoint "Test Endpoint"');
      const nameInput = page.locator('[data-testid="endpoint-name-input"]');
      await nameInput.fill('Test Endpoint');
      
      // Soumission via Entrée (méthode robuste lorsque l'ID du bouton de soumission n'est pas spécifié)
      await nameInput.press('Enter');

      // Attendre que le tableau contienne le nouvel élément
      const tableRow = page.locator('table').getByText('Test Endpoint');
      await tableRow.waitFor({ state: 'visible' });

      await page.screenshot({ path: 'screenshots/screenshot-3.png' });
      console.log('Screenshot 3 capturé : Création et affichage dans la liste.');
    } catch (error) {
      console.error('Erreur au Screenshot 3:', error.message);
    }

    // --- Screenshot 4: Test de la recherche ---
    try {
      console.log('Step 4: Test du filtre de recherche');
      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.fill('Test Endpoint');

      // Attendre que le résultat filtré soit visible
      const tableRow = page.locator('table').getByText('Test Endpoint');
      await tableRow.waitFor({ state: 'visible' });

      await page.screenshot({ path: 'screenshots/screenshot-4.png' });
      console.log('Screenshot 4 capturé : Recherche fonctionnelle.');
    } catch (error) {
      console.error('Erreur au Screenshot 4:', error.message);
    }

  } catch (globalError) {
    console.error('Erreur critique du script:', globalError);
  } finally {
    if (browser) await browser.close();
  }
})();
