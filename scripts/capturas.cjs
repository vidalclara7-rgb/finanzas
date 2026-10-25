// Capturas en ancho de iPhone (390 px), en claro y oscuro, para revisar desde el teléfono.
//   node scripts/capturas.cjs preview <ruta/preview.html> <carpeta>   cada pantalla × estado del preview
//   node scripts/capturas.cjs app <carpeta>                           cada pantalla de la app con datos de ejemplo
const path = require("node:path");
const fs = require("node:fs");
const { pathToFileURL } = require("node:url");
const A = require("../tests/ayuda.cjs");

async function preview(archivo, salida) {
  const { chromium } = require("playwright");
  const browser = await chromium.launch();
  const html = fs.readFileSync(archivo, "utf-8").replace(/<!--[\s\S]*?-->/g, "");
  const pantallas = [...html.matchAll(/data-pantalla="([^"]+)"/g)].map((m) => m[1]);
  const hechas = [];
  for (const esquema of ["light", "dark"]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: esquema });
    for (const p of pantallas) for (const e of ["normal", "vacio"]) {
      await page.goto(`${pathToFileURL(archivo)}?pantalla=${p}&estado=${e}`);
      await page.waitForTimeout(300);
      const f = path.join(salida, `${p}-${e}-${esquema}.png`);
      await page.screenshot({ path: f, fullPage: true });
      hechas.push(f);
    }
    await page.close();
  }
  await browser.close();
  return hechas;
}

async function app(salida) {
  const ent = await A.iniciar();
  const hechas = [];
  try {
    for (const esquema of ["light", "dark"]) {
      const { page, ctx, errores } = await A.pagina(ent, { datos: A.datosEjemplo(), esquema });
      await page.waitForTimeout(300);
      for (const v of A.VISTAS) {
        await A.ir(page, v);
        const f = path.join(salida, `${v}-${esquema}.png`);
        await page.screenshot({ path: f, fullPage: true });
        hechas.push(f);
      }
      if (errores.length) console.log("  ✗ errores en la consola:", errores.join(" | "));
      await ctx.close();
    }
  } finally { await ent.cerrar(); }
  return hechas;
}

(async () => {
  const [modo, a, b] = process.argv.slice(2);
  const salida = modo === "preview" ? b : a;
  fs.mkdirSync(salida, { recursive: true });
  const hechas = modo === "preview" ? await preview(path.resolve(a), salida) : await app(salida);
  for (const f of hechas) console.log("  ·", path.relative(A.RAIZ, f));
})().catch((e) => { console.error(e.message); process.exit(1); });
