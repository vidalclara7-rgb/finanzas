// Ícono de la app: el monograma «mf.» en negro sobre rosa chicle, con el punto rojo anaranjado (paleta Viva). Lo exporta a PNG en los
// tamaños que usa la app con el navegador de los tests:  node scripts/icono.cjs
const path = require("node:path");
const { chromium } = require("playwright");

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#F3A6DA"/>
  <text x="236" y="350" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="800" font-size="280" letter-spacing="-16" fill="#121212">mf</text>
  <circle cx="418" cy="326" r="30" fill="#F05A2C"/>
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
