// Capacidad: graficos
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 1000);
const con = (movs, cuentas = [BANCO]) => ({ datos: A.v2({ cuentas, movs }) });
const TRES = [A.gasto(1, "2026-10-03", 64.3, 1), A.gasto(2, "2026-10-08", 42, 1, "Trabajo (reembolsable)"), A.gasto(3, "2026-10-05", 18, 1, "Comida fuera")];

// Escenario: torta con tres categorías
t.test("torta con tres categorías", async () => {
  const { page } = await abrir(con(TRES));
  const porciones = await page.locator("#torta circle").evaluateAll((cs) => cs.map((c) => [c.dataset.cat, parseFloat(c.style.strokeDasharray)]));
  assert.equal(porciones.length, 3);
  assert.equal(await A.texto(page, "#torta .centro b"), "124,3 €");
  assert.equal(porciones.reduce((a, b) => (b[1] > a[1] ? b : a))[0], "Súper");
});

// Escenario: torta sin gastos
t.test("torta sin gastos", async () => {
  const { page } = await abrir(con([]));
  assert.equal(await page.isVisible("#torta"), false);
  assert.equal(await A.texto(page, "#cats"), "Todavía no anotaste gastos este mes. Tocá + para empezar.");
});

// Escenario: tope usado en parte
t.test("tope usado en parte", async () => {
  const { page } = await abrir(con([A.gasto(1, "2026-10-03", 64.3, 7)], [A.cta(7, "Tarjeta", 0, { tipo: "tarjeta", tope: 500 })]));
  assert.equal(await A.texto(page, '[data-disp="7"] .ring b'), "13 %");
  assert.doesNotMatch(await page.getAttribute('[data-disp="7"] .ring', "class"), /\b(bad|warn)\b/);
});

// Escenario: tope superado en el anillo
t.test("tope superado en el anillo", async () => {
  const { page } = await abrir(con([A.gasto(1, "2026-10-03", 320, 8, "Ocio")], [A.cta(8, "Revolut", 1000, { tope: 300 })]));
  assert.equal(await A.texto(page, '[data-disp="8"] .ring b'), "107 %");
  assert.match(await page.getAttribute('[data-disp="8"] .ring', "class"), /\bbad\b/);
});

// Escenario: gasto repartido en semanas
t.test("gasto repartido en semanas", async () => {
  const { page } = await abrir(con([A.gasto(1, "2026-10-03", 64.3, 1), A.gasto(2, "2026-10-05", 18, 1), A.gasto(3, "2026-10-08", 42, 1), A.gasto(4, "2026-10-11", 25.5, 1)]));
  const cols = await page.locator("#barras .col").evaluateAll((cs) => cs.map((c) => [c.querySelector("small").textContent, c.querySelector("em").textContent, c.classList.contains("hoy")]));
  assert.deepEqual(cols, [["1–7", "82,3 €", false], ["8–14", "67,5 €", false], ["15–21", "", true], ["22–28", "", false], ["29–31", "", false]]);
});

// Escenario: barras sin gastos
t.test("barras sin gastos", async () => {
  const { page } = await abrir(con([]));
  assert.equal(await page.isVisible("#barrasCard"), false);
});

// Escenario: dos meses con datos
t.test("dos meses con datos", async () => {
  const { page } = await abrir(con([A.ingreso(1, "2026-09-01", 1500, 1), A.gasto(2, "2026-09-10", 900, 1), A.ingreso(3, "2026-10-01", 1700, 1), A.gasto(4, "2026-10-03", 82.3, 1)], [A.cta(1, "Banco A", 1000, { desde: "2026-09-01" })]));
  const cols = await page.locator("#meses .col").evaluateAll((cs) => cs.map((c) => [c.dataset.mes, +c.dataset.ing, +c.dataset.gas]));
  assert.deepEqual(cols, [["2026-05", 0, 0], ["2026-06", 0, 0], ["2026-07", 0, 0], ["2026-08", 0, 0], ["2026-09", 1500, 900], ["2026-10", 1700, 82.3]]);
});

// Escenario: mes que cerró en negativo
t.test("mes que cerró en negativo", async () => {
  const { page } = await abrir(con([A.ingreso(1, "2026-09-01", 800, 1), A.gasto(2, "2026-09-10", 950, 1)], [A.cta(1, "Banco A", 1000, { desde: "2026-09-01" })]));
  assert.match(await page.getAttribute('#meses [data-mes="2026-09"]', "class"), /\bneg\b/);
  assert.doesNotMatch(await page.getAttribute('#meses [data-mes="2026-10"]', "class"), /\bneg\b/);
});

// Escenario: sin ingresos ni gastos
t.test("sin ingresos ni gastos", async () => {
  const { page } = await abrir(con([A.transf(1, "2026-10-02", 100, 1, 2)], [BANCO, A.cta(2, "Banco B", 0)]));
  assert.equal(await page.isVisible("#mesesCard"), false);
});

// Escenario: gasto chico frente a lo que entró
t.test("gasto chico frente a lo que entró", async () => {
  const { page } = await abrir(con([A.ingreso(1, "2026-10-01", 1700, 1), A.gasto(2, "2026-10-03", 149.8, 1)]));
  assert.equal(await A.texto(page, "#formaTxt"), "Gastaste el 9 % de lo que entró");
  assert.equal(await A.texto(page, "#resultado"), "1550,2 €");
  assert.doesNotMatch(await page.getAttribute("#forma", "class"), /\bbad\b/);
});

// Escenario: gasto mayor que lo que entró
t.test("gasto mayor que lo que entró", async () => {
  const { page } = await abrir(con([A.ingreso(1, "2026-10-01", 100, 1), A.gasto(2, "2026-10-03", 150, 1)]));
  assert.equal(await A.texto(page, "#formaTxt"), "Gastaste el 150 % de lo que entró");
  assert.match(await page.getAttribute("#forma", "class"), /\bbad\b/);
});

// Escenario: mes sin ingresos
t.test("mes sin ingresos", async () => {
  const { page } = await abrir(con([A.gasto(2, "2026-10-03", 50, 1)]));
  assert.equal(await A.texto(page, "#formaTxt"), "Todavía no anotaste ingresos este mes");
});
