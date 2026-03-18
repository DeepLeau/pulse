const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🚀 Starting screenshot script...');

  // Configuration
  const BASE_URL = 'http://localhost:3000';
  const SCREENSHOTS_DIR = './screenshots';
  
  // Assurer que le dossier screenshots existe
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR);
  }

  // Lancement du navigateur
  const browser = await chromium.launch({ 
    headless: true 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();

  // Fonction utilitaire pour capturer une page de manière déterministe
  async function capturePage(name, route, waitAction) {
    const filePath = path.join(SCREENSHOTS_DIR, `${name}.png`);
    try {
      console.log(`📸 [${name}] Navigation vers ${route}...`);
      
      // Navigation initiale
      // On utilise domcontentloaded car on attendra l'élément spécifique ensuite
      // Cela rend le test plus rapide et robuste que networkidle qui peut attendre les scripts analytiques
      await page.goto(route, { waitUntil: 'domcontentloaded' });

      // Action d'attente spécifique (jalon stable)
      console.log(`📸 [${name}] Attente de l'état stable...`);
      await waitAction(page);

      // Capture
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`✅ [${name}] Capture sauvegardée : ${filePath}`);

    } catch (error) {
      console.error(`❌ [${name}] Échec de la capture : ${error.message}`);
      // Capture d'écran d'erreur pour le debug si besoin (optionnel mais bonne pratique)
      try {
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `error-${name}.png`), fullPage: false });
      } catch (screenshotErr) {
        console.error(`Échec de la capture d'erreur : ${screenshotErr.message}`);
      }
    }
  }

  // --- Scénario 1 : Page d'accueil ---
  await capturePage('screenshot-1', 
    `${BASE_URL}/`, 
    async (p) => {
      // Attendre le bouton CTA avec le texte exact corrigé
      const ctaButton = p.getByText('Get started for free', { exact: true });
      await ctaButton.waitFor({ state: 'visible' });
      // Validation supplémentaire implicite : le bouton est cliquable (visible)
      console.log('   -> Bouton CTA "Get started for free" détecté et visible.');
    }
  );

  // --- Scénario 2 : Dashboard Endpoints ---
  await capturePage('screenshot-2',
    `${BASE_URL}/dashboard/endpoints`,
    async (p) => {
      // Attendre le header de la nouvelle page
      const header = p.locator('.page-header').first();
      await header.waitFor({ state: 'visible' });
      console.log('   -> Header de la page Endpoints détecté.');
    }
  );

  // --- Scénario 3 : Dashboard Analytics ---
  await capturePage('screenshot-3',
    `${BASE_URL}/dashboard/analytics`,
    async (p) => {
      // Attendre le header de la nouvelle page
      const header = p.locator('.page-header').first();
      await header.waitFor({ state: 'visible' });
      console.log('   -> Header de la page Analytics détecté.');
    }
  );

  // --- Scénario 4 : Dashboard Settings ---
  await capturePage('screenshot-4',
    `${BASE_URL}/dashboard/settings`,
    async (p) => {
      // Attendre le header de la nouvelle page
      const header = p.locator('.page-header').first();
      await header.waitFor({ state: 'visible' });
      console.log('   -> Header de la page Settings détecté.');
    }
  );

  await browser.close();
  console.log('🏁 Script terminé.');
})();
