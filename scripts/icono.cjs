// Ícono de la app: pila de tres tarjetas sobre verde oliva (paleta Viva). Lo exporta a PNG en los
// tamaños que usa la app con el navegador de los tests:  node scripts/icono.cjs
const path = require("node:path");
const { chromium } = require("playwright");

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#5F6B4E"/>
  <rect x="108" y="118" width="296" height="150" rx="40" fill="#B9BDA6"/>
  <rect x="108" y="196" width="296" height="150" rx="40" fill="#F3A6DA"/>
  <rect x="108" y="274" width="296" height="150" rx="40" fill="#F05A2C"/>
  <text x="144" y="398" font-family="Helvetica, Arial, sans-serif" font-weight="800" font-size="108" fill="#121212">€</text>
</svg>`;

(async () => {
  const raiz = path.resolve(__dirname, "..");
  const browser = await chromium.launch();
  for (const lado of [180, 192, 512]) {
    const page = await browser.newPage({ viewport: { width: lado, height: lado } });
    await page.setContent(`<body style="margin:0">${SVG.replace("<svg ", `<svg width="${lado}" height="${lado}" `)}</body>`);
    await page.screenshot({ path: path.join(raiz, `icon-${lado}.png`), omitBackground: false });
    await page.close();
  }
  await browser.close();
  console.log("✓ icon-180.png, icon-192.png, icon-512.png");
})();
