// Capacidad: interfaz (el sistema de diseño: vidrio, tarjeta destacada, botón principal, tendencia y colores)
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 1000, { desde: "2026-01-01" });
const CATS = ["Supermercado", "Comida fuera", "Delivery", "Transporte", "Ocio", "Compras", "Belleza", "Casa/Splitwise", "Salud", "Viajes", "Trabajo (reembolsable)", "Otros", "Regalos", "Ropa", "Salidas bar/disco", "Plan Iberia", "Servicios mensuales", "Alquiler", "Carga móvil"];
const datos = (extra = {}, ap) => A.v2({ settings: ap ? { apariencia: ap } : {}, cuentas: [BANCO], movs: [A.ingreso(1, "2026-10-01", 1700, 1), A.gasto(2, "2026-10-03", 64.3, 1)], ...extra });
const estilo = (page, sel, prop, pseudo) => page.$eval(sel, (e, [p, ps]) => getComputedStyle(e, ps || null)[p], [prop, pseudo]);
const variable = (page, n) => page.evaluate((x) => getComputedStyle(document.documentElement).getPropertyValue(x).trim().toUpperCase(), n);
const rgb = (hex) => { const h = hex.replace("#", ""); return `rgb(${[0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(", ")})`; };
const canales = (c) => c.match(/[\d.]+/g).slice(0, 3).map(Number);
const lum = (c) => { const q = canales(c).map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * q[0] + 0.7152 * q[1] + 0.0722 * q[2]; };
const contraste = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

// --- tarjetas de vidrio

// Escenario: el vidrio deja ver el fondo
t.test("el vidrio deja ver el fondo", async () => {
  const { page } = await abrir({ datos: datos() });
  const fondo = await estilo(page, '[data-ui="gasto-categorias"]', "backgroundColor");
  const alfa = fondo.startsWith("rgba") ? parseFloat(fondo.match(/[\d.]+/g)[3]) : 1;
  assert.ok(alfa > 0 && alfa < 1, fondo);
  const filtro = (await estilo(page, '[data-ui="gasto-categorias"]', "backdropFilter")) || (await estilo(page, '[data-ui="gasto-categorias"]', "webkitBackdropFilter"));
  assert.match(filtro, /blur/);
});

// --- tarjeta destacada

// Escenario: tarjetas destacadas
t.test("tarjetas destacadas", async () => {
  const { page } = await abrir({ datos: datos() });
  assert.equal(await page.$eval('[data-ui="resultado-mes"]', (e) => e.classList.contains("destacada")), true);
  assert.equal(await page.$eval('[data-ui="gasto-categorias"]', (e) => e.classList.contains("destacada")), false);
  assert.equal(await page.locator("#v-inicio .card.destacada").count(), 1);
  await A.ir(page, "cuentas");
  assert.equal(await page.$eval("#netoBox", (e) => e.classList.contains("destacada")), true);
  assert.equal(await page.locator("#v-cuentas .card.destacada:visible").count(), 1);
});

// Escenario: el borde gira
t.test("el borde gira", async () => {
  const { page } = await abrir({ datos: datos() });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const sel = '[data-ui="resultado-mes"]';
  assert.equal(await estilo(page, sel, "animationName", "::after"), "gira");
  const ang = () => page.$eval(sel, (e) => getComputedStyle(e, "::after").getPropertyValue("--ang"));
  const a = await ang();
  await page.waitForTimeout(400);
  assert.notEqual(await ang(), a);
});

// Escenario: borde quieto con reducir movimiento
t.test("borde quieto con reducir movimiento", async () => {
  const { page } = await abrir({ datos: datos() });
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(await estilo(page, '[data-ui="resultado-mes"]', "animationName", "::after"), "none");
});

// Escenario: el foco sigue el dedo
t.test("el foco sigue el dedo", async () => {
  const { page } = await abrir({ datos: datos() });
  const sel = '[data-ui="resultado-mes"]';
  const caja = await page.locator(sel).boundingBox();
  const foco = () => page.$eval(`${sel} .foco`, (e) => parseFloat(getComputedStyle(e).opacity));
  assert.equal(await foco(), 0);
  await page.mouse.move(caja.x + 60, caja.y + 40);
  await page.mouse.down();
  await page.waitForFunction((s) => parseFloat(getComputedStyle(document.querySelector(s + " .foco")).opacity) > 0.9, sel);
  assert.equal(await page.$eval(sel, (e) => e.classList.contains("tocada")), true);
  assert.ok(Math.abs(parseFloat(await page.$eval(sel, (e) => e.style.getPropertyValue("--fx"))) - 60) < 2);
  await page.mouse.move(caja.x + 160, caja.y + 40);
  assert.ok(Math.abs(parseFloat(await page.$eval(sel, (e) => e.style.getPropertyValue("--fx"))) - 160) < 2);
  await page.mouse.up();
  await page.waitForFunction((s) => parseFloat(getComputedStyle(document.querySelector(s + " .foco")).opacity) < 0.05, sel);
});

// --- botón principal

const abrirHoja = async (page) => { await page.click("#fab"); await page.waitForSelector("#sheet:not([hidden])"); };

// Escenario: botón lima
t.test("botón lima", async () => {
  const { page } = await abrir({ datos: datos() });
  await abrirHoja(page);
  assert.equal(await estilo(page, "#mGuardar", "backgroundColor"), "rgb(178, 255, 0)");
  assert.equal(await estilo(page, "#mGuardar", "color"), "rgb(19, 19, 26)");
  assert.ok(parseFloat(await estilo(page, "#mGuardar", "borderTopLeftRadius")) >= 20);
});

// Escenario: el botón pulsa
t.test("el botón pulsa", async () => {
  const { page } = await abrir({ datos: datos() });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await abrirHoja(page);
  assert.equal(await estilo(page, "#mGuardar", "animationName"), "pulso");
  const sombra = () => estilo(page, "#mGuardar", "boxShadow");
  const a = await sombra();
  await page.waitForTimeout(700);
  assert.notEqual(await sombra(), a);
});

// Escenario: sin pulso con reducir movimiento
t.test("sin pulso con reducir movimiento", async () => {
  const { page } = await abrir({ datos: datos() });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await abrirHoja(page);
  assert.equal(await estilo(page, "#mGuardar", "animationName"), "none");
});

// Escenario: botón secundario de vidrio
t.test("botón secundario de vidrio", async () => {
  const { page } = await abrir({ datos: datos() });
  await abrirHoja(page);
  assert.notEqual(await estilo(page, "#cerrar", "backgroundColor"), "rgb(178, 255, 0)");
  assert.equal(await estilo(page, "#cerrar", "animationName"), "none");
  const filtro = (await estilo(page, "#cerrar", "backdropFilter")) || "";
  assert.match(filtro, /blur/);
});

// --- tendencia del mes

const tendencia = (page) => page.evaluate(() => document.documentElement.dataset.tendencia);
const colorResultado = (page) => estilo(page, "#resultado", "color");

// Escenario: tendencia positiva
t.test("tendencia positiva", async () => {
  const { page } = await abrir({ datos: datos({ movs: [A.ingreso(1, "2026-10-01", 1500, 1), A.gasto(2, "2026-10-03", 100, 1)] }) });
  assert.equal(await tendencia(page), "positiva");
  assert.equal(await colorResultado(page), rgb(await variable(page, "--tend-pos-t")));
  assert.equal(await variable(page, "--glow"), await variable(page, "--glow-pos"));
});

// Escenario: tendencia negativa
t.test("tendencia negativa", async () => {
  const { page } = await abrir({ datos: datos({ movs: [A.ingreso(1, "2026-10-01", 100, 1), A.gasto(2, "2026-10-03", 300, 1)] }) });
  assert.equal(await tendencia(page), "negativa");
  assert.equal(await colorResultado(page), rgb(await variable(page, "--tend-neg-t")));
  assert.equal(await variable(page, "--glow"), await variable(page, "--glow-neg"));
});

// Escenario: tendencia neutra
t.test("tendencia neutra", async () => {
  const { page } = await abrir({ datos: datos({ movs: [] }) });
  assert.equal(await tendencia(page), "neutra");
  assert.equal(await variable(page, "--glow"), await variable(page, "--glow-neu"));
});

// Escenario: la tendencia cambia con el mes que se ve
t.test("la tendencia cambia con el mes que se ve", async () => {
  const { page } = await abrir({ datos: datos({ movs: [A.ingreso(1, "2026-10-01", 100, 1), A.gasto(2, "2026-10-03", 300, 1), A.ingreso(3, "2026-09-01", 2000, 1), A.gasto(4, "2026-09-03", 100, 1)] }) });
  assert.equal(await tendencia(page), "negativa");
  await page.click("#mesAnterior");
  await page.waitForFunction(() => document.documentElement.dataset.tendencia === "positiva");
});

// --- color por categoría y muestras de color

const TODAS = () => CATS.map((c, i) => A.gasto(i + 1, "2026-10-03", 10 + i, 1, c));
const catColores = (page) => page.evaluate(() => Array.from({ length: 19 }, (_, i) => getComputedStyle(document.documentElement).getPropertyValue("--cat" + (i + 1)).trim().toUpperCase()));

// Escenario: texto legible en las tarjetas
t.test("texto legible en las tarjetas", async () => {
  for (const ap of ["oscura", "clara"]) {
    const { page } = await abrir({ datos: datos({ movs: TODAS() }, ap) });
    await A.ir(page, "movs");
    const filas = await page.evaluate(() => [...document.querySelectorAll("#movs .mov")].map((m) => [m.textContent.slice(0, 18), getComputedStyle(m).backgroundColor, getComputedStyle(m.querySelector(".desc")).color, getComputedStyle(m.querySelector(".num")).color]));
    assert.equal(filas.length, 19);
    for (const [n, fondo, texto, importe] of filas) {
      assert.ok(contraste(fondo, texto) >= 4.5, `${ap} ${n}: ${contraste(fondo, texto).toFixed(2)}`);
      assert.ok(contraste(fondo, importe) >= 4.5, `${ap} ${n} importe: ${contraste(fondo, importe).toFixed(2)}`);
    }
  }
});

// Escenario: el color no cambia de un mes a otro
t.test("el color no cambia de un mes a otro", async () => {
  const movs = [A.gasto(1, "2026-10-03", 300, 1, "Alquiler"), A.gasto(2, "2026-10-04", 20, 1, "Ocio"), A.gasto(3, "2026-09-03", 100, 1, "Alquiler"), A.gasto(4, "2026-09-04", 500, 1, "Ocio")];
  const { page } = await abrir({ datos: datos({ movs }) });
  await A.ir(page, "movs");
  const alquiler = () => page.evaluate(() => getComputedStyle([...document.querySelectorAll("#movs .mov")].find((m) => m.textContent.includes("Alquiler"))).backgroundColor);
  const oct = await alquiler();
  await page.click("#mesAnterior");
  await page.waitForFunction(() => document.querySelector("#mesLabel").textContent.toLowerCase().includes("septiembre"));
  assert.equal(await alquiler(), oct);
});

// Escenario: 19 colores distintos
t.test("19 colores distintos", async () => {
  for (const ap of ["oscura", "clara"]) {
    const { page } = await abrir({ datos: datos({}, ap) });
    assert.equal(new Set(await catColores(page)).size, 19, ap);
  }
});

// Escenario: 5 colores por tipo de cuenta
t.test("5 colores por tipo de cuenta", async () => {
  for (const ap of ["oscura", "clara"]) {
    const { page } = await abrir({ datos: datos({}, ap) });
    const ks = await page.evaluate(() => [1, 2, 3, 4, 5].map((i) => getComputedStyle(document.documentElement).getPropertyValue("--k" + i).trim().toUpperCase()));
    assert.equal(new Set(ks).size, 5, ap);
  }
});

// Escenario: colores de la paleta de gráficos
t.test("colores de la paleta de gráficos", async () => {
  const movs = ["Supermercado", "Comida fuera", "Delivery"].map((c, i) => A.gasto(i + 1, "2026-10-03", 10 + i, 1, c));
  const { page } = await abrir({ datos: datos({ movs }, "oscura") });
  await A.ir(page, "movs");
  const col = (n) => page.evaluate((x) => getComputedStyle([...document.querySelectorAll("#movs .mov")].find((m) => m.textContent.includes(x))).backgroundColor, n);
  assert.deepEqual([await col("Supermercado"), await col("Comida fuera"), await col("Delivery")], [rgb("#8450FC"), rgb("#B2FF00"), rgb("#1AAEFC")]);
});
