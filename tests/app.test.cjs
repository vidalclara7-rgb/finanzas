// Prueba de humo: la app abre y recorre todas las pantallas sin errores.
// Los tests de cada escenario llevan encima `// Escenario: <título exacto>`.
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

let ent;
before(async () => { ent = await A.iniciar(); });
after(async () => { if (ent) await ent.cerrar(); });

test("la app abre y recorre todas las pantallas sin errores", async () => {
  const { page, errores } = await A.pagina(ent, { datos: A.datosEjemplo() });
  for (const v of A.VISTAS) {
    await A.ir(page, v);
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
    assert.ok(ancho <= 390, `«${v}» se desborda: ${ancho}px`);
  }
  assert.deepEqual(errores, []);
});
