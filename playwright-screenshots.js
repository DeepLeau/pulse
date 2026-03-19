const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = './screenshots';

// Assure que le dossier screenshots existe
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

(async () => {
  console.log('🚀 Launching browser for screenshots...');
  
  const browser = await chromium.launch({ 
    headless: true 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    // Si l'app utilise une auth basée sur le storage local, on peut le charger ici
    // storageState: './playwright/.auth/state.json' 
  });

  const page = await context.newPage();

  // --- Helper pour gérer les captures et erreurs cleanly ---
  async function capture(stepName, actionFn) {
    try {
      console.log(`➡️  Exécution : ${stepName}`);
      await actionFn();
    } catch (error) {
      console.error(`❌ Erreur lors de l'étape "${stepName}" :`, error.message);
      // On continue malgré l'erreur pour ne pas bloquer les captures suivantes
    }
  }

  // ============================================================
  // SCREENSHOT 1 : /dashboard - Vérification du bouton 'Add endpoint'
  // ============================================================
  await capture('Screenshot 1: Dashboard - Bouton "Add endpoint"', async () => {
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    
    // On attend que le bouton soit visible et stable
    const addButton = page.getByRole('button', { name: 'Add endpoint', exact: true });
    await addButton.waitFor({ state: 'visible', timeout: 5000 });

    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/screenshot-1.png`, 
      fullPage: false 
    });
  });

  // ============================================================
  // SCREENSHOT 2 : /dashboard - Ouverture de la modale
  // ============================================================
  await capture('Screenshot 2: Dashboard - Ouverture modale', async () => {
    // On s'assure d'être sur le dashboard (redondant si Screenshot 1 a réussi)
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    
    // Interaction : Cliquer sur le bouton
    const addButton = page.getByRole('button', { name: 'Add endpoint', exact: true });
    await addButton.click();

    // Attente active : La modale (dialog) doit être présente
    // On utilise 'dialog' role qui est l'attribut ARIA standard pour les modales
    const modal = page.getByRole('dialog');
    await modal.waitFor({ state: 'visible', timeout: 5000 });

    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/screenshot-2.png`, 
      fullPage: false 
    });
  });

  // ============================================================
  // SCREENSHOT 3 : /dashboard/endpoints - Présence barre de recherche
  // ============================================================
  await capture('Screenshot 3: Endpoints - Barre de recherche', async () => {
    await page.goto(`${BASE_URL}/dashboard/endpoints`, { waitUntil: 'networkidle' });

    // On cible l'input de recherche. 
    // Stratégie : Chercher par placeholder (courant) ou par rôle 'searchbox'
    const searchInput = page.getByPlaceholder('Search endpoints...');
    await searchInput.waitFor({ state: 'visible', timeout: 5000 });

    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/screenshot-3.png`, 
      fullPage: false 
    });
  });

  // ============================================================
  // SCREENSHOT 4 : /dashboard/endpoints - Filtrage
  // ============================================================
  await capture('Screenshot 4: Endpoints - Filtrage результат', async () => {
    // Assure que nous sommes sur la page (reload pour reset l'état si besoin)
    await page.goto(`${BASE_URL}/dashboard/endpoints`, { waitUntil: 'networkidle' });

    const searchInput = page.getByPlaceholder('Search endpoints...');
    await searchInput.waitFor({ state: 'visible' });

    // Action : Remplir avec un terme probable ("api" est souvent présent dans les endpoints)
    await searchInput.fill('api');

    // Attente : On attend que la liste des résultats change ou que l'input soit rempli.
    //playwright attend automatiquement que la valeur soit injective dans l'input
    await expect(searchInput).toHaveValue('api');

    // Petit délai pour laisser le temps au rendu UI de la liste de se mettre à jour (filtering est souvent instantané mais side-effect possible)
    // On wait un selector qui change : par exemple la liste des items.
    // Ici, comme on ne sait pas si des résultats existent, on valide juste l'état "Inputfilled"
    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/screenshot-4.png`, 
      fullPage: false 
    });
  });

  console.log('✅ Capture sequence completed.');
  await browser.close();
})();
