// Capacidad: graficos
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const g = (id, fecha, importe, cuenta, cat) => ({ id, fecha, importe, cuenta, cat, nota: "" });
const TRES = [g(1, "2026-10-03", 64.3, "tarjeta", "Súper"), g(2, "2026-10-08", 42, "tarjeta", "Trabajo (reembolsable)"), g(3, "2026-10-05", 18, "revolut", "Comida fuera")];

// Escenario: torta con tres categorías
t.test("torta con tres categorías", async () => {
  const { page } = await abrir({ datos: A.con({ gastos: TRES }) });
  const porciones = await page.locator("#torta circle").evaluateAll((cs) => cs.map((c) => [c.dataset.cat, parseFloat(c.style.strokeDasharray)]));
  assert.equal(porciones.length, 3);
  assert.equal(await A.texto(page, "#torta .centro b"), "124,3 €");
  const mayor = porciones.reduce((a, b) => (b[1] > a[1] ? b : a));
  assert.equal(mayor[0], "Súper");
});

// Escenario: torta sin gastos
t.test("torta sin gastos", async () => {
  const { page } = await abrir({ datos: A.con() });
  assert.equal(await page.isVisible("#torta"), false);
  assert.equal(await A.texto(page, "#cats"), "Todavía no anotaste gastos este mes. Tocá + para empezar.");
});

// Escenario: tope usado en parte
t.test("tope usado en parte", async () => {
  const { page } = await abrir({ datos: A.con({ gastos: [g(1, "2026-10-03", 64.3, "tarjeta", "Súper")] }) });
  assert.equal(await A.texto(page, "#ringTarjeta b"), "13 %");
  assert.doesNotMatch(await page.getAttribute("#ringTarjeta", "class"), /\b(bad|warn)\b/);
});

// Escenario: tope superado en el anillo
t.test("tope superado en el anillo", async () => {
  const { page } = await abrir({ datos: A.con({ gastos: [g(1, "2026-10-03", 320, "revolut", "Ocio")] }) });
  assert.equal(await A.texto(page, "#ringRevolut b"), "107 %");
  assert.match(await page.getAttribute("#ringRevolut", "class"), /\bbad\b/);
});

// Escenario: gasto repartido en semanas
t.test("gasto repartido en semanas", async () => {
  const { page } = await abrir({ datos: A.datosEjemplo() });
  const cols = await page.locator("#barras .col").evaluateAll((cs) => cs.map((c) => [c.querySelector("small").textContent, c.querySelector("em").textContent, c.classList.contains("hoy")]));
  assert.deepEqual(cols, [["1–7", "82,3 €", false], ["8–14", "67,5 €", false], ["15–21", "", true], ["22–28", "", false], ["29–31", "", false]]);
});

// Escenario: barras sin gastos
t.test("barras sin gastos", async () => {
  const { page } = await abrir({ datos: A.con() });
  assert.equal(await page.isVisible("#barrasCard"), false);
});
