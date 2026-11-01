// Capacidad: meses
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const NOV = "2026-11-02T12:00:00";
const BANCO = A.cta(1, "Banco A", 1000, { desde: "2026-09-01" });
const etiqueta = (page) => A.texto(page, "#mesLabel");
const anterior = (page) => page.click("#mesAnterior");

// Escenario: ver el mes anterior en Inicio
t.test("ver el mes anterior en Inicio", async () => {
  const datos = A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-20", 40, 1, "Supermercado"), A.gasto(2, "2026-11-01", 10, 1, "Ocio")] });
  const { page } = await abrir({ datos, hoy: NOV });
  assert.equal(await etiqueta(page), "noviembre 2026");
  await anterior(page);
  assert.equal(await etiqueta(page), "octubre 2026");
  assert.equal(await A.texto(page, "#gasMes"), "Gastos 40 €");
  assert.deepEqual(await page.$$eval("#torta circle", (c) => c.map((x) => x.dataset.cat)), ["Supermercado"]);
});

// Escenario: no pasa del mes en curso
t.test("no pasa del mes en curso", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }), hoy: NOV });
  assert.equal(await etiqueta(page), "noviembre 2026");
  assert.equal(await page.isDisabled("#mesSiguiente"), true);
  await anterior(page);
  assert.equal(await page.isDisabled("#mesSiguiente"), false);
  await page.click("#mesSiguiente");
  assert.equal(await etiqueta(page), "noviembre 2026");
  assert.equal(await page.isDisabled("#mesSiguiente"), true);
});

// Escenario: movimientos de otro mes
t.test("movimientos de otro mes", async () => {
  const datos = A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-20", 40, 1), A.gasto(2, "2026-11-01", 10, 1)] });
  const { page } = await abrir({ datos, hoy: NOV });
  await A.ir(page, "movs");
  assert.deepEqual(await page.$$eval("#movs .mov", (e) => e.map((x) => x.dataset.mov)), ["2"]);
  await anterior(page);
  assert.deepEqual(await page.$$eval("#movs .mov", (e) => e.map((x) => x.dataset.mov)), ["1"]);
});

// Escenario: el mes elegido se mantiene
t.test("el mes elegido se mantiene", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }), hoy: NOV });
  await anterior(page);
  await A.ir(page, "movs");
  assert.equal(await etiqueta(page), "octubre 2026");
  await A.ir(page, "mes");
  assert.equal(await etiqueta(page), "octubre 2026");
  assert.equal(await A.texto(page, "#concTitulo"), "Conciliación de octubre");
});

// Escenario: al abrir la app, el mes en curso
t.test("al abrir la app, el mes en curso", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }), hoy: NOV });
  await anterior(page);
  assert.equal(await etiqueta(page), "octubre 2026");
  await page.reload();
  assert.equal(await etiqueta(page), "noviembre 2026");
});

// Escenario: conciliar un mes anterior
t.test("conciliar un mes anterior", async () => {
  const datos = A.v2({ cuentas: [{ ...BANCO, saldoInicial: 1000, desde: "2026-10-01" }], movs: [A.gasto(1, "2026-10-05", 100, 1)] });
  const { page } = await abrir({ datos, hoy: NOV });
  await A.ir(page, "mes");
  await anterior(page);
  await page.click('[data-conc="1"]');
  await A.enfocado(page, "kReal");
  assert.equal(await A.texto(page, "#kCalc"), "900 €");
  await page.fill("#kReal", "880");
  await page.click("#kAjuste");
  await A.aviso(page, "Cuenta conciliada");
  const d = await A.guardados(page);
  const ajuste = d.movs.find((m) => m.tipo === "ajuste");
  assert.deepEqual([ajuste.fecha, ajuste.importe, ajuste.cuenta], ["2026-10-31", -20, 1]);
  assert.equal(d.meses["2026-10"].conc["1"].ok, true);
  assert.equal(await A.texto(page, '[data-conc="1"] .chip'), "Conciliada");
});

// Escenario: patrimonio al cierre del mes
t.test("patrimonio al cierre del mes", async () => {
  const datos = A.v2({ cuentas: [{ ...BANCO, saldoInicial: 1000, desde: "2026-10-01" }], movs: [A.gasto(1, "2026-11-01", 100, 1)] });
  const { page } = await abrir({ datos, hoy: NOV });
  assert.equal(await A.texto(page, "#netoIni"), "900 €");
  await anterior(page);
  assert.equal(await A.texto(page, "#netoIni"), "1000 €");
  assert.match(await A.texto(page, "#netoIniSub"), /^Al cierre de octubre 2026/);
});

// Escenario: anotar sigue usando la fecha de hoy
t.test("anotar sigue usando la fecha de hoy", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }), hoy: NOV });
  await anterior(page);
  await page.click("#fab");
  await page.waitForSelector("#sheet:not([hidden])");
  assert.equal(await page.inputValue("#mFecha"), "2026-11-02");
});

// Escenario: mes sin datos
t.test("mes sin datos", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-11-01", 10, 1)] }), hoy: NOV });
  await anterior(page);
  await anterior(page);
  assert.equal(await etiqueta(page), "septiembre 2026");
  assert.equal(await A.texto(page, "#cats"), "Todavía no anotaste gastos este mes. Tocá + para empezar.");
  assert.equal(await A.texto(page, "#resultado"), "0 €");
});
