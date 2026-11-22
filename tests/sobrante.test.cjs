// Capacidad: presupuesto — qué hiciste con lo que sobró
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 5000);
const BROKER = A.cta(2, "Broker X", 0, { tipo: "inversion" });
const FONDOY = A.cta(3, "Fondo Y", 0, { tipo: "inversion" });
const VIAJE = A.cta(4, "Ahorro viaje", 0);
const obj = (id, nombre, cuenta) => ({ id, nombre, monto: 1000, cuenta, aporte: 100, inicio: "2026-10", dia: 1 });
const datos = (movs, extra = {}) => A.v2({ cuentas: [BANCO, BROKER, FONDOY, VIAJE], movs, ...extra });
const titulo = (page) => A.texto(page, "#resTit");
const filas = (page) => page.$$eval("#destino .mov", (fs) => fs.map((f) => ({ desc: f.querySelector(".desc").textContent, det: (f.querySelector(".det") || { textContent: "" }).textContent, imp: (f.querySelector(".num") || { textContent: "" }).textContent })));
const fila = async (page, d) => (await filas(page)).find((f) => f.desc === d);

// Escenario: sobrante repartido
t.test("sobrante repartido", async () => {
  const { page } = await abrir({ datos: datos([A.ingreso(1, "2026-10-01", 2000, 1), A.gasto(2, "2026-10-03", 1200, 1), A.transf(3, "2026-10-05", 300, 1, 2), A.transf(4, "2026-10-06", 200, 1, 4)], { objetivos: [obj(1, "Viaje", 4)] }) });
  assert.equal(await titulo(page), "Te sobraron 800 €");
  assert.deepEqual(await fila(page, "Invertiste"), { desc: "Invertiste", det: "Broker X 300 €", imp: "300 €" });
  assert.deepEqual(await fila(page, "Ahorraste"), { desc: "Ahorraste", det: "Viaje", imp: "200 €" });
  const sin = await fila(page, "Sin mover");
  assert.equal(sin.det, "300 €");
  assert.equal(await page.locator("#destino .partida.fina i").count(), 3);
});

// Escenario: detalle de varias inversiones
t.test("detalle de varias inversiones", async () => {
  const { page } = await abrir({ datos: datos([A.ingreso(1, "2026-10-01", 2000, 1), A.transf(2, "2026-10-05", 250, 1, 2), A.transf(3, "2026-10-06", 150, 1, 3)]) });
  const f = await fila(page, "Invertiste");
  assert.equal(f.imp, "400 €");
  assert.equal(f.det, "Broker X 250 € · Fondo Y 150 €");
});

// Escenario: lo que vuelve de una inversión resta
t.test("lo que vuelve de una inversión resta", async () => {
  const { page } = await abrir({ datos: datos([A.ingreso(1, "2026-10-01", 2000, 1), A.transf(2, "2026-10-05", 300, 1, 2), A.transf(3, "2026-10-06", 100, 2, 1)]) });
  assert.equal((await fila(page, "Invertiste")).imp, "200 €");
});

// Escenario: entre inversiones no cuenta
t.test("entre inversiones no cuenta", async () => {
  const { page } = await abrir({ datos: datos([A.ingreso(1, "2026-10-01", 1000, 1), A.gasto(2, "2026-10-03", 400, 1), A.transf(3, "2026-10-05", 500, 2, 3)]) });
  assert.equal(await fila(page, "Invertiste"), undefined);
  assert.equal((await fila(page, "Sin mover")).det, "600 €");
});

// Escenario: nada movido
t.test("nada movido", async () => {
  const { page } = await abrir({ datos: datos([A.ingreso(1, "2026-10-01", 1000, 1), A.gasto(2, "2026-10-03", 400, 1)]) });
  const fs = await filas(page);
  assert.deepEqual(fs.map((f) => f.desc), ["Sin mover"]);
  assert.equal(fs[0].det, "600 €");
  assert.equal(await A.texto(page, '[data-ui="boton-mover"]'), "Mover");
});

// Escenario: mover lo que quedó
t.test("mover lo que quedó", async () => {
  const { page } = await abrir({ datos: datos([A.ingreso(1, "2026-10-01", 1000, 1), A.gasto(2, "2026-10-03", 400, 1)]) });
  await page.click('[data-ui="boton-mover"]');
  await page.waitForSelector("#sheet:not([hidden])");
  assert.equal(await page.$eval('#segMov button[aria-pressed="true"]', (b) => b.dataset.v), "transferencia");
  assert.equal(await page.inputValue("#mImporte"), "600");
});

// Escenario: movió más de lo que sobró
t.test("movió más de lo que sobró", async () => {
  const { page } = await abrir({ datos: datos([A.ingreso(1, "2026-10-01", 1000, 1), A.gasto(2, "2026-10-03", 900, 1), A.transf(3, "2026-10-05", 300, 1, 2)]) });
  assert.equal((await fila(page, "Invertiste")).imp, "300 €");
  assert.equal(await fila(page, "Sin mover"), undefined);
  assert.equal(await A.texto(page, '[data-ui="movio-de-mas"]'), "Moviste 200 € más de lo que sobró este mes");
});

// Escenario: mes en negativo
t.test("mes en negativo", async () => {
  const { page } = await abrir({ datos: datos([A.ingreso(1, "2026-10-01", 500, 1), A.gasto(2, "2026-10-03", 700, 1)]) });
  assert.equal(await titulo(page), "Te faltaron 200 €");
  assert.equal(await page.locator("#destino .partida").count(), 0);
  assert.equal(await page.locator("#destino .mov").count(), 0);
});

// Escenario: el objetivo en una cuenta de inversión
t.test("el objetivo en una cuenta de inversión", async () => {
  const { page } = await abrir({ datos: datos([A.ingreso(1, "2026-10-01", 1000, 1), A.transf(2, "2026-10-05", 100, 1, 2)], { objetivos: [obj(1, "Jubilación", 2)] }) });
  assert.equal((await fila(page, "Invertiste")).imp, "100 €");
  assert.equal(await fila(page, "Ahorraste"), undefined);
});

// Escenario: otro mes
t.test("otro mes", async () => {
  const { page } = await abrir({ hoy: "2026-11-02T12:00:00", datos: datos([A.ingreso(1, "2026-10-01", 1000, 1), A.transf(2, "2026-10-20", 300, 1, 2), A.ingreso(3, "2026-11-01", 1000, 1)]) });
  assert.equal(await fila(page, "Invertiste"), undefined);
  await page.click("#mesAnterior");
  assert.equal((await fila(page, "Invertiste")).imp, "300 €");
});
