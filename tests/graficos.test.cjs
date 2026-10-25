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
  assert.equal(porciones.reduce((a, b) => (b[1] > a[1] ? b : a))[0], "Supermercado");
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
  assert.doesNotMatch(await page.getAttribute("#formaTxt", "class"), /\bexc\b/);
});

// Escenario: gasto mayor que lo que entró
t.test("gasto mayor que lo que entró", async () => {
  const { page } = await abrir(con([A.ingreso(1, "2026-10-01", 100, 1), A.gasto(2, "2026-10-03", 150, 1)]));
  assert.equal(await A.texto(page, "#formaTxt"), "Gastaste el 150 % de lo que entró");
  assert.match(await page.getAttribute("#formaTxt", "class"), /\bexc\b/);
});

// Escenario: mes sin ingresos
t.test("mes sin ingresos", async () => {
  const { page } = await abrir(con([A.gasto(2, "2026-10-03", 50, 1)]));
  assert.equal(await A.texto(page, "#formaTxt"), "Todavía no anotaste ingresos este mes");
});

const fijo = (id, fecha, importe, cat, nota = "") => ({ ...A.gasto(id, fecha, importe, 1, cat, nota), fijo: true });
const grupo = (page, k) => page.locator(`#fv [data-grupo="${k}"] span`).allInnerTexts();
const rank = (page) => page.locator("#fv .rank > *").evaluateAll((els) => els.map((e) => e.dataset.rankGrupo || e.dataset.rank));

// Escenario: reparto entre fijos y variables
t.test("reparto entre fijos y variables", async () => {
  const { page } = await abrir(con([fijo(1, "2026-10-01", 600, "Casa/Splitwise", "alquiler"), fijo(2, "2026-10-02", 40, "Ocio", "streaming"),
    A.gasto(3, "2026-10-03", 300, 1), A.gasto(4, "2026-10-04", 60, 1, "Comida fuera")]));
  assert.deepEqual((await grupo(page, "fij")).map((x) => x.trim()), ["Fijos", "640 € · 64 %"]);
  assert.deepEqual((await grupo(page, "var")).map((x) => x.trim()), ["Variables", "360 € · 36 %"]);
  assert.deepEqual(await rank(page), ["fij", "Casa/Splitwise", "Ocio", "var", "Supermercado", "Comida fuera"]);
  assert.equal(await page.isVisible("#fvPista"), false);
});

// Escenario: reembolsables fuera del reparto
t.test("reembolsables fuera del reparto", async () => {
  const { page } = await abrir(con([A.gasto(1, "2026-10-03", 100, 1), A.gasto(2, "2026-10-04", 50, 1, "Trabajo (reembolsable)")]));
  assert.deepEqual((await grupo(page, "var")).map((x) => x.trim()), ["Variables", "100 € · 100 %"]);
  assert.deepEqual(await rank(page), ["var", "Supermercado"]);
  assert.doesNotMatch(await A.texto(page, "#fv"), /Trabajo/);
});

// Escenario: todavía sin gastos fijos
t.test("todavía sin gastos fijos", async () => {
  const { page } = await abrir(con([A.gasto(1, "2026-10-03", 150, 1), A.gasto(2, "2026-10-04", 50, 1, "Ocio")]));
  assert.deepEqual(await page.locator("#fv .partida i").evaluateAll((is) => is.map((i) => i.className)), ["var"]);
  assert.equal(await A.texto(page, "#fvPista"), "Marcá tus gastos fijos al anotarlos: alquiler, cuotas, suscripciones.");
});

// Escenario: sin gastos para repartir
t.test("sin gastos para repartir", async () => {
  const { page } = await abrir(con([A.gasto(1, "2026-10-03", 30, 1, "Trabajo (reembolsable)")]));
  assert.equal(await page.locator("#fv .partida").count(), 0);
  assert.equal(await A.texto(page, "#fv"), "Todavía no anotaste gastos este mes.");
});

// Escenario: reembolsos fuera del porcentaje
t.test("reembolsos fuera del porcentaje", async () => {
  const { page } = await abrir(con([A.ingreso(1, "2026-10-01", 1000, 1), A.ingreso(2, "2026-10-10", 50, 1, "Reembolso"),
    A.gasto(3, "2026-10-03", 200, 1), A.gasto(4, "2026-10-04", 50, 1, "Trabajo (reembolsable)")]));
  assert.equal(await A.texto(page, "#formaTxt"), "Gastaste el 20 % de lo que entró");
});
