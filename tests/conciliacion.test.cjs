// Capacidad: conciliacion
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 1000);
const TARJETA = A.cta(2, "Tarjeta Y", 350, { tipo: "tarjeta" });
const conc = (ids) => ({ "2026-10": { checks: {}, conc: Object.fromEntries(ids.map((i) => [i, { real: 0, fecha: "2026-10-15", ok: true }])) } });
const estado = (page, id) => A.texto(page, `[data-conc="${id}"] .chip`);
async function conciliar(page, id, real) {
  await A.ir(page, "mes");
  await page.click(`[data-conc="${id}"]`);
  await A.enfocado(page, "kReal");
  if (real !== undefined) await page.fill("#kReal", String(real));
}

// Escenario: saldo que coincide
t.test("saldo que coincide", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-05", 12.5, 1)] }) });
  await conciliar(page, 1, 987.5);
  assert.equal(await A.texto(page, "#kCalc"), "987,5 €");
  await page.click("#kConciliar");
  await A.aviso(page, "Cuenta conciliada");
  assert.equal(await estado(page, 1), "Conciliada");
});

// Escenario: cuentas pendientes
t.test("cuentas pendientes", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, TARJETA], meses: conc([1]) }) });
  await A.ir(page, "mes");
  assert.match(await A.texto(page, "#concSub"), /^1 de 2 cuentas conciliadas/);
});

// Escenario: registrar un ajuste
t.test("registrar un ajuste", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-05", 12.5, 1)] }) });
  await conciliar(page, 1, 975.2);
  assert.equal(await A.texto(page, "#kDifVal"), "-12,3 €");
  await page.click("#kAjuste");
  await A.aviso(page, "Cuenta conciliada");
  assert.equal(await estado(page, 1), "Conciliada");
  assert.equal(await A.texto(page, '[data-conc="1"] .v .num'), "975,2 €");
  await A.ir(page, "movs");
  assert.match(await A.texto(page, '#movs [data-tipo="ajuste"]'), /Ajuste de conciliación[\s\S]*-12,3 €/);
  assert.equal(await A.texto(page, "#totGas"), "12,5 €");
});

// Escenario: dejar la diferencia pendiente
t.test("dejar la diferencia pendiente", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-05", 12.5, 1)] }) });
  await conciliar(page, 1, 975.2);
  await page.click("#kPendiente");
  assert.equal(await A.texto(page, '[data-conc="1"] .v .num'), "987,5 €");
  assert.equal(await estado(page, 1), "Diferencia -12,3 €");
});

// Escenario: saldo real vacío
t.test("saldo real vacío", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await conciliar(page, 1);
  await page.click("#kConciliar");
  await A.aviso(page, "Cargá el saldo real de la cuenta");
  assert.equal(await estado(page, 1), "Sin conciliar");
});

// Escenario: editar un gasto de un mes conciliado
t.test("editar un gasto de un mes conciliado", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [A.gasto(5, "2026-10-05", 20, 1)], meses: conc([1]) }) });
  await A.ir(page, "movs");
  await page.click('[data-mov="5"] .linea');
  await page.fill("#mImporte", "25");
  await page.click("#mGuardar");
  await A.aviso(page, "Gasto guardado");
  await A.ir(page, "mes");
  assert.equal(await estado(page, 1), "Sin conciliar");
});

// Escenario: transferencia en un mes conciliado
t.test("transferencia en un mes conciliado", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, TARJETA], meses: conc([1, 2]) }) });
  await A.nuevoMov(page, { tipo: "transferencia", importe: 100, desde: "Banco A", hacia: "Tarjeta Y", fecha: "2026-10-10" });
  await A.aviso(page, "Transferencia guardada");
  await A.ir(page, "mes");
  assert.equal(await estado(page, 1), "Sin conciliar");
  assert.equal(await estado(page, 2), "Sin conciliar");
});

// Escenario: inversión que subió
t.test("inversión que subió", async () => {
  const BROKER = A.cta(3, "Broker X", 2100, { tipo: "inversion" });
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, BROKER], movs: [A.ingreso(1, "2026-10-01", 500, 1)] }) });
  await conciliar(page, 3, 2180);
  await page.click("#kAjuste");
  await A.aviso(page, "Cuenta conciliada");
  assert.equal(await A.texto(page, '[data-conc="3"] .v .num'), "2180 €");
  assert.equal(await estado(page, 3), "Conciliada");
  await A.ir(page, "inicio");
  assert.equal(await A.texto(page, "#resultado"), "500 €");
});
