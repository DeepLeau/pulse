const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  // Configuration
  const BASE_URL = 'http://localhost:3000';
  const SCREENSHOT_DIR = './screenshots';

  // Création du dossier de screenshots si absent
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR);
  }

  // Lancement du navigateur
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 }
  });

  try {
    console.log(`Navigating to ${BASE_URL}/dashboard...`);

    // --- SCREENSHOT 1 : wait for page to load without error ---
    // On utilise 'networkidle' pour s'assurer que le rendu initial côté serveur (Server Component) est terminé
    // Si le fix (data.ts) a échoué, Next.js affichera une Error Boundary (#next-error-root)
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Vérification technique : On détecte si l'overlay d'erreur Next.js est présent
    const errorBoundary = page.locator('#next-error-root');
    const isErrorVisible = await errorBoundary.isVisible().catch(() => false);

    // Capture : Si l'erreur n'est pas visible, cela valide que le fix a fonctionné
    await page.screenshot({ path: `${SCREENSHOT_DIR}/screenshot-1.png`, fullPage: false });
    console.log(`Screenshot 1 captured (Page loaded, Error Boundary present: ${isErrorVisible}).`);

    // --- SCREENSHOT 2 : wait for content to be visible ---
    // On attend explicitement que le contenu textuel du main soit présent pour valider l'affichage des données mockées
    await page.waitForFunction(() => {
      const main = document.querySelector('main');
      // On vérifie que le conteneur principal existe et contient du texte
      return main && main.innerText.length > 0;
    }, { timeout: 10000 });

    // Capture : Valide que les données mockées sont rendues et que la page n'est plus bloquée
    await page.screenshot({ path: `${SCREENSHOT_DIR}/screenshot-2.png`, fullPage: false });
    console.log('Screenshot 2 captured (Mock data visible).');

  } catch (error) {
    console.error('Script execution failed:', error);
  } finally {
    await browser.close();
  }
})();
