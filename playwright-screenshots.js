const { chromium } = require('playwright');
const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  // Configuration et préparation du répertoire de captures
  const screenshotDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const browser = await chromium.launch();
  // Configuration du viewport selon les spécifications (1280x800)
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  try {
    // --- Screenshot 1 ---
    console.log('Initialisation : Navigation vers la page d\'accueil et validation du Hero.');
    
    // 1. Navigation
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

    // 2. Wait for the hero section to be visible (Milestone UI)
    // On cible la première section qui correspond généralement au Hero dans une的结构
    const heroSection = page.locator('section').first();
    await heroSection.waitFor({ state: 'visible', timeout: 10000 });

    // 3. Localisation du bouton CTA
    // Utilisation de getByRole pour la robustesse (accessibilité)
    const ctaButton = page.getByRole('link', { name: 'get started for free' })
                          .or(page.getByRole('button', { name: 'get started for free' }));

    // 4. Attente dynamique du bouton
    await ctaButton.waitFor({ state: 'visible' });

    // 5. Validation : Le bouton CTA affiche le texte corrigé
    await expect(ctaButton).toHaveText(/get started for free/i);

    // 6. Validation : Le bouton est correctement aligné (Vérification de stabilité + Capture)
    // L'assertion de alignement visuel se fait via la capture d'écran, mais on s'assure ici 
    // que l'élément est présent et interactif (état stable).
    
    console.log('Capture : screenshot-1.png');
    await page.screenshot({ path: 'screenshots/screenshot-1.png', fullPage: false });

  } catch (error) {
    console.error('Erreur lors de l\'exécution du script :', error);
  } finally {
    await browser.close();
  }
})();
