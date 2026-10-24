// Capacidad: interfaz
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const luminancia = (rgb) => { const [r, g, b] = rgb.match(/\d+/g).map(Number); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };

// Escenario: ninguna pantalla se desborda
t.test("ninguna pantalla se desborda", async () => {
  const { page, errores } = await abrir({ datos: A.datosEjemplo() });
  for (const v of A.VISTAS) {
    await A.ir(page, v);
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
    assert.ok(ancho <= 390, `«${v}» se desborda: ${ancho}px`);
  }
  assert.deepEqual(errores, []);
});

// Escenario: el más según la pantalla
t.test("el más según la pantalla", async () => {
  const { page } = await abrir({ datos: A.datosEjemplo() });
  await page.click("#fab");
  assert.ok(await page.isVisible("#sheet"));
  assert.equal(await A.texto(page, "#sheet h2"), "Nuevo gasto");
  await page.click("#cerrar");
  await A.ir(page, "cuentas");
  await page.click("#fab");
  assert.ok(await page.isVisible("#sheetC"));
  assert.equal(await A.texto(page, "#cTitulo"), "Nueva cuenta");
  assert.equal(await page.isVisible("#sheet"), false);
});

// Escenario: ajustes desde el engranaje
t.test("ajustes desde el engranaje", async () => {
  const { page } = await abrir({ datos: A.datosEjemplo() });
  await page.click('header [data-v="ajustes"]');
  assert.equal(await A.texto(page, "#title"), "Ajustes");
  assert.ok(await page.isVisible("#topeTarjeta"));
});

// Escenario: teléfono en modo oscuro
t.test("teléfono en modo oscuro", async () => {
  const { page } = await abrir({ datos: A.datosEjemplo(), esquema: "dark" });
  const fondo = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  assert.ok(luminancia(fondo) < 0.2, `fondo ${fondo}`);
  const tarjeta = await page.evaluate(() => getComputedStyle(document.getElementById("dispTarjeta")).color);
  assert.ok(luminancia(tarjeta) < 0.2, `texto de Tarjeta ${tarjeta}`);
});

// Escenario: abrir sin conexión
t.test("abrir sin conexión", async () => {
  const { page, ctx } = await abrir({ datos: A.datosEjemplo(), sw: true });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await ctx.setOffline(true);
  await page.reload();
  assert.equal(await A.texto(page, "#title"), "Este mes");
  assert.equal(await A.texto(page, "#dispTarjeta"), "435,7 €");
});
