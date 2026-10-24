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

// Relación de contraste WCAG entre dos colores rgb()
const contraste = (a, b) => {
  const lum = (rgb) => { const v = rgb.match(/\d+/g).slice(0, 3).map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
// Color del texto y fondo efectivo (el de la tarjeta que lo contiene)
const colores = (page, sel) => page.$eval(sel, (el) => {
  let f = el; while (f && getComputedStyle(f).backgroundColor === "rgba(0, 0, 0, 0)") f = f.parentElement;
  return [getComputedStyle(el).color, getComputedStyle(f || document.body).backgroundColor];
});

// Escenario: títulos con la letra del texto
t.test("títulos con la letra del texto", async () => {
  const { page } = await abrir({ datos: A.datosEjemplo() });
  const letra = (sel) => page.$eval(sel, (el) => getComputedStyle(el).fontFamily);
  const cuerpo = await letra("body");
  assert.equal(await letra("#title"), cuerpo);
  await page.click("#fab");
  assert.equal(await letra("#sheet h2"), cuerpo);
});

// Escenario: fondo blanco
t.test("fondo blanco", async () => {
  const { page } = await abrir({ datos: A.datosEjemplo() });
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), "rgb(255, 255, 255)");
  const [texto, fondo] = await colores(page, "#dispTarjeta");
  assert.ok(luminancia(fondo) < 0.1, `tarjeta ${fondo}`);
  assert.ok(luminancia(texto) > 0.9, `texto ${texto}`);
});

// Escenario: teléfono en modo oscuro
t.test("teléfono en modo oscuro", async () => {
  const { page } = await abrir({ datos: A.datosEjemplo(), esquema: "dark" });
  const fondo = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  assert.ok(luminancia(fondo) < 0.1, `fondo ${fondo}`);
  for (const sel of ["#dispTarjeta", "#dispRevolut", "#netoIni", "#fondoVal", "#torta .centro b"]) {
    const [texto, detras] = await colores(page, sel);
    assert.ok(contraste(texto, detras) >= 4.5, `${sel}: ${texto} sobre ${detras} = ${contraste(texto, detras).toFixed(2)}`);
  }
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
