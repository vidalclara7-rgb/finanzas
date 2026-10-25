// Capacidad: interfaz
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 1000);
const luminancia = (rgb) => { const [r, g, b] = rgb.match(/\d+/g).map(Number); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };
// Relación de contraste WCAG entre dos colores rgb()
const contraste = (a, b) => {
  const lum = (rgb) => { const v = rgb.match(/\d+/g).slice(0, 3).map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
// Color del texto y fondo efectivo (el del primer contenedor con fondo)
const colores = (page, sel) => page.$eval(sel, (el) => {
  let f = el; while (f && getComputedStyle(f).backgroundColor === "rgba(0, 0, 0, 0)") f = f.parentElement;
  return [getComputedStyle(el).color, getComputedStyle(f || document.body).backgroundColor];
});
const EJEMPLO = () => A.v2({ cuentas: [BANCO, A.cta(2, "Tarjeta", 0, { tipo: "tarjeta", tope: 500 })],
  movs: [A.ingreso(1, "2026-10-01", 1700, 1), A.gasto(2, "2026-10-03", 64.3, 2), A.gasto(3, "2026-10-05", 18, 1, "Comida fuera")] });

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
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await page.click("#fab");
  assert.ok(await page.isVisible("#sheet"));
  assert.equal(await A.texto(page, "#mTitulo"), "Nuevo movimiento");
  await page.click("#cerrar");
  await A.ir(page, "cuentas");
  await page.click("#fab");
  assert.ok(await page.isVisible("#sheetC"));
  assert.equal(await A.texto(page, "#cTitulo"), "Nueva cuenta");
  assert.equal(await page.isVisible("#sheet"), false);
});

// Escenario: ajustes desde el engranaje
t.test("ajustes desde el engranaje", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await page.click('header [data-v="ajustes"]');
  assert.equal(await A.texto(page, "#title"), "Ajustes");
  assert.ok(await page.isVisible("#aporte"));
});

// Escenario: nombres de las pestañas
t.test("nombres de las pestañas", async () => {
  const { page } = await abrir();
  const nombres = await page.locator("nav button[data-v]").allInnerTexts();
  assert.deepEqual(nombres.map((x) => x.trim()), ["Inicio", "Movimientos", "Cuentas", "Cierre"]);
});

// Escenario: títulos con la letra del texto
t.test("títulos con la letra del texto", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  const letra = (sel) => page.$eval(sel, (el) => getComputedStyle(el).fontFamily);
  const cuerpo = await letra("body");
  assert.equal(await letra("#title"), cuerpo);
  await page.click("#fab");
  assert.equal(await letra("#sheet h2"), cuerpo);
});

// Escenario: fondo blanco
t.test("fondo blanco", async () => {
  const { page } = await abrir({ datos: EJEMPLO() });
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), "rgb(255, 255, 255)");
  assert.equal(await A.texto(page, "#resultado .dec"), ",7 €");
  const [entero] = await colores(page, "#resultado");
  const [dec] = await colores(page, "#resultado .dec");
  assert.ok(luminancia(dec) > luminancia(entero) + 0.2, `decimales ${dec} contra ${entero}`);
});

// Escenario: mismo color por categoría
t.test("mismo color por categoría", async () => {
  const { page } = await abrir({ datos: EJEMPLO() });
  const porcion = await page.$eval('#torta circle[data-cat="Súper"]', (c) => getComputedStyle(c).stroke);
  await A.ir(page, "movs");
  const tarjeta = await page.$eval('[data-mov="2"]', (el) => getComputedStyle(el).backgroundColor);
  assert.equal(porcion, tarjeta);
});

// Escenario: teléfono en modo oscuro
t.test("teléfono en modo oscuro", async () => {
  const { page } = await abrir({ datos: EJEMPLO(), esquema: "dark" });
  const fondo = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  assert.ok(luminancia(fondo) < 0.1, `fondo ${fondo}`);
  for (const sel of ["#resultado", '[data-disp="2"] .big', "#netoIni", "#torta .centro b"]) {
    const [texto, detras] = await colores(page, sel);
    assert.ok(contraste(texto, detras) >= 4.5, `${sel}: ${texto} sobre ${detras} = ${contraste(texto, detras).toFixed(2)}`);
  }
  await A.ir(page, "movs");
  const [texto, detras] = await colores(page, '[data-mov="2"] .linea');
  assert.ok(contraste(texto, detras) >= 4.5, `tarjeta de movimiento: ${contraste(texto, detras).toFixed(2)}`);
});

// Escenario: abrir sin conexión
t.test("abrir sin conexión", async () => {
  const { page, ctx } = await abrir({ datos: EJEMPLO(), sw: true });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await ctx.setOffline(true);
  await page.reload();
  assert.equal(await A.texto(page, "#title"), "Este mes");
  assert.equal(await A.texto(page, "#resultado"), "1617,7 €");
});
