const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1350 });

  const htmlPath = path.resolve(__dirname, 'carrossel.html');
  await page.goto(`file://${htmlPath}`);
  await page.waitForLoadState('networkidle');

  const outputDir = path.join(__dirname, 'instagram');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const slides = await page.$$('.slide');
  console.log(`Renderizando ${slides.length} slides...`);

  for (let i = 0; i < slides.length; i++) {
    const num = String(i + 1).padStart(2, '0');
    const filename = path.join(outputDir, `slide-${num}.png`);
    await slides[i].screenshot({ path: filename });
    console.log(`✓ slide-${num}.png`);
  }

  await browser.close();
  console.log('\nPronto! PNGs salvos em instagram/');
})();
