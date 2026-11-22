// Capacidades: proyeccion (ingreso guardado, tarjeta, préstamos), cuentas (fecha de pago, saldos de hoy, préstamo), cuotas (primera cuota) y datos
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const NOV = "2026-11-22T12:00:00", NOV15 = "2026-11-15T12:00:00";
const BANCO = A.cta(1, "Banco A", 1000, { desde: "2026-06-01" });
const TARJ = (extra = {}) => A.cta(2, "Tarjeta Y", 0, { tipo: "tarjeta", desde: "2026-06-01", ...extra });
const ING = (id, fecha, importe, cat = "Sueldo") => A.ingreso(id, fecha, importe, 1, cat);
const datos = (extra = {}) => A.v2({ cuentas: [BANCO], ...extra });
async function forecast(page) { await page.click("#menuBtn"); await page.click("#panelFore"); await page.waitForSelector("#sheetFore:not([hidden])"); }
async function reabrir(page) { await page.click("#foreCerrar"); await forecast(page); }
const fila = (page, mes) => page.evaluate((m) => { const x = document.querySelector(`#foreLista [data-mes="${m}"]`); return x && x.innerText.replace(/\s+/g, " "); }, mes);
const comp = (page, mes) => page.evaluate((m) => +document.querySelector(`#foreBarras [data-mes="${m}"]`).dataset.comp, mes);
const valor = (page, id, hasta) => page.evaluate(([i, h]) => valorCuenta(S.cuentas.find((c) => c.id === i), h), [id, hasta]);
const filaPagar = (page, id) => page.locator(`#pagarFilas [data-cid="${id}"] .sub`).innerText();
async function nuevaFin(page) { await page.click("#addCuenta"); await A.enfocado(page, "cNombre"); await page.click('#segTipo button[data-v="financiacion"]'); await page.fill("#cNombre", "Préstamo piso"); }
async function restaurar(page, texto) { await A.ir(page, "ajustes"); await page.fill("#backupIn", texto); await page.click("#restaurar"); await page.click("#restaurar"); }
// Tres meses con 740 € de ingreso y un fijo de 300 €
const BASE740 = [ING(1, "2026-08-10", 740), ING(2, "2026-09-10", 740), ING(3, "2026-10-10", 740), { ...A.gasto(4, "2026-10-12", 300, 1, "Casa/Splitwise", "Alquiler"), fijo: true }];

// --- el ingreso por mes

// Escenario: guardar el ingreso
t.test("guardar el ingreso", async () => {
  const { page } = await abrir({ hoy: NOV15, datos: datos({ movs: BASE740 }) });
  await forecast(page);
  assert.equal(await page.inputValue("#foreIng"), "740");
  await page.fill("#foreIng", "1500");
  await page.press("#foreIng", "Tab");
  await A.aviso(page, "Ingreso guardado");
  assert.match(await fila(page, "2026-12"), /1\.200 € Libre/);
  await reabrir(page);
  assert.equal(await page.inputValue("#foreIng"), "1500");
  assert.equal(await A.texto(page, "#foreIngSub"), "Ingreso guardado: se usa todos los meses.");
  await page.reload();
  await forecast(page);
  assert.equal(await page.inputValue("#foreIng"), "1500");
});

// Escenario: volver al promedio
t.test("volver al promedio", async () => {
  const { page } = await abrir({ hoy: NOV15, datos: datos({ movs: BASE740, settings: { foreIng: 1500 } }) });
  await forecast(page);
  assert.equal(await A.texto(page, "#forePromedio"), "Usar el promedio (740 €)");
  await page.click("#forePromedio");
  assert.equal(await page.inputValue("#foreIng"), "740");
  assert.equal(await page.isHidden("#forePromedio"), true);
  await reabrir(page);
  assert.equal(await page.inputValue("#foreIng"), "740");
  assert.equal("foreIng" in (await A.guardados(page)).settings, false);
});

// --- el resumen de la tarjeta en la proyección

// Escenario: el resumen se paga el mes que viene
t.test("el resumen se paga el mes que viene", async () => {
  const { page } = await abrir({ hoy: NOV, datos: datos({ cuentas: [BANCO, TARJ({ cierres: { "2026-11": "2026-11-20" }, pagos: { "2026-11": "2026-12-05" } })], movs: [A.gasto(1, "2026-11-05", 250, 2), A.gasto(2, "2026-11-10", 150, 2, "Ocio")] }) });
  await forecast(page);
  assert.match(await fila(page, "2026-12"), /tarjeta 400 €/);
  assert.equal(await comp(page, "2026-12"), 400);
  assert.doesNotMatch(await fila(page, "2027-01"), /tarjeta/);
});

// Escenario: sin fecha de pago
t.test("sin fecha de pago", async () => {
  const { page } = await abrir({ hoy: NOV, datos: datos({ cuentas: [BANCO, TARJ()], movs: [A.gasto(1, "2026-11-05", 400, 2)] }) });
  await forecast(page);
  assert.match(await fila(page, "2026-12"), /tarjeta 400 €/);
});

// Escenario: los fijos de la tarjeta no se cuentan dos veces
t.test("los fijos de la tarjeta no se cuentan dos veces", async () => {
  const gym = (id, f) => ({ ...A.gasto(id, f, 50, 2, "Salud", "Gimnasio"), fijo: true });
  // El resumen de octubre ya se pagó
  const movs = [gym(1, "2026-10-03"), A.transf(2, "2026-10-31", 50, 1, 2), gym(3, "2026-11-03"), A.gasto(4, "2026-11-08", 350, 2)];
  const { page } = await abrir({ hoy: NOV, datos: datos({ cuentas: [BANCO, TARJ()], movs }) });
  await forecast(page);
  assert.match(await fila(page, "2026-12"), /Fijos 50 € · cuotas 0 € · tarjeta 350 €/);
});

// Escenario: las cuotas de la tarjeta no se cuentan dos veces
t.test("las cuotas de la tarjeta no se cuentan dos veces", async () => {
  const compra = { ...A.gasto(1, "2026-10-05", 720, 2, "Compras"), cuotas: { n: 3, cuota: 240 } };
  const { page } = await abrir({ datos: datos({ cuentas: [BANCO, TARJ()], movs: [compra] }) });
  await forecast(page);
  const f = await fila(page, "2026-11");
  assert.match(f, /cuotas 240 €/);
  assert.doesNotMatch(f, /tarjeta/);
});

// Escenario: tarjeta sin nada a pagar
t.test("tarjeta sin nada a pagar", async () => {
  const { page } = await abrir({ hoy: NOV, datos: datos({ cuentas: [BANCO, TARJ()], movs: [ING(1, "2026-10-10", 1000)] }) });
  await forecast(page);
  const filas = await page.$$eval("#foreLista [data-mes]", (xs) => xs.map((x) => x.innerText));
  assert.ok(filas.every((x) => !/tarjeta/.test(x)));
});

// --- préstamos

const PREST = (extra = {}) => A.cta(5, "Préstamo piso", 0, { tipo: "financiacion", cuota: 300, cuotas: 20, cuotasMes: "2027-02", desde: "2026-11-22", ...extra });
const LLEGA = { ...A.transf(9, "2027-01-10", 6000, 5, 1), nota: "Préstamo" };

// Escenario: préstamo con devolución
t.test("préstamo con devolución", async () => {
  const { page } = await abrir({ hoy: NOV, datos: datos({ cuentas: [BANCO, PREST()], movs: [LLEGA], settings: { foreIng: 2000 } }) });
  await forecast(page);
  const ene = await fila(page, "2027-01");
  assert.match(ene, /Entra un préstamo de 6\.000 €/);
  assert.match(ene, /8\.000 € Libre/);
  assert.match(await fila(page, "2027-02"), /cuotas 300 € .*1\.700 € Libre/);
  assert.match(await fila(page, "2026-12"), /cuotas 0 €/);
});

// Escenario: préstamo que llega más adelante
t.test("préstamo que llega más adelante", async () => {
  const { page } = await abrir({ hoy: NOV, datos: datos() });
  await A.ir(page, "cuentas");
  await page.click("#addCuenta");
  await A.enfocado(page, "cNombre");
  await page.click('#segTipo button[data-v="financiacion"]');
  await page.fill("#cNombre", "Préstamo piso");
  assert.equal(await page.isHidden("#cPrestBox"), true);
  await page.check("#cPrest");
  assert.equal(await page.isVisible("#cPrestBox"), true);
  assert.equal(await page.isHidden("#cSaldo"), true);
  await page.fill("#cPrestImp", "6000");
  await page.fill("#cPrestFecha", "2027-01-10");
  await page.selectOption("#cPrestDest", "1");
  await page.fill("#cCuota", "300");
  await page.fill("#cCuotas", "20");
  await page.fill("#cPrimera", "2027-02");
  await page.click('#sheetC button[type="submit"]');
  await A.aviso(page, "Cuenta guardada");
  const g = await A.guardados(page);
  const p = g.cuentas.find((c) => c.nombre === "Préstamo piso");
  assert.equal(p.saldoInicial, 0);
  assert.equal(p.cuotasMes, "2027-02");
  const m = g.movs.find((x) => x.tipo === "transferencia" && x.cuenta === p.id);
  assert.deepEqual({ fecha: m.fecha, importe: m.importe, destino: m.destino, nota: m.nota }, { fecha: "2027-01-10", importe: 6000, destino: 1, nota: "Préstamo" });
  assert.equal(await valor(page, 1), 1000);
  assert.ok((await valor(page, p.id)) === 0);
});

// Escenario: cuando llega el préstamo
t.test("cuando llega el préstamo", async () => {
  const { page } = await abrir({ hoy: "2027-01-15T12:00:00", datos: datos({ cuentas: [BANCO, PREST()], movs: [LLEGA] }) });
  assert.match(await A.saldoCta(page, 1), /7\.000 €/);
  assert.equal(await valor(page, 5), -6000);
  assert.match(await A.saldoCta(page, 5), /6\.000 €/);
});

// Escenario: préstamo sin cuenta donde llega
t.test("préstamo sin cuenta donde llega", async () => {
  const { page } = await abrir({ hoy: NOV, datos: datos() });
  await A.ir(page, "cuentas");
  await nuevaFin(page);
  await page.check("#cPrest");
  await page.fill("#cPrestImp", "6000");
  await page.fill("#cPrestFecha", "2027-01-10");
  await page.click('#sheetC button[type="submit"]');
  await A.aviso(page, "Elegí a qué cuenta llega el préstamo");
  assert.equal((await A.guardados(page)).cuentas.length, 1);
});

// Escenario: préstamo sin importe
t.test("préstamo sin importe", async () => {
  const { page } = await abrir({ hoy: NOV, datos: datos() });
  await A.ir(page, "cuentas");
  await nuevaFin(page);
  await page.check("#cPrest");
  await page.click('#sheetC button[type="submit"]');
  await A.aviso(page, "Poné el importe del préstamo");
  assert.equal((await A.guardados(page)).cuentas.length, 1);
});

// --- saldos de hoy

// Escenario: un movimiento con fecha futura
t.test("un movimiento con fecha futura", async () => {
  const { page } = await abrir({ hoy: NOV15, datos: datos({ movs: [ING(1, "2026-12-01", 500)] }) });
  assert.match(await A.saldoCta(page, 1), /^1\.000 €/);
  assert.equal(await valor(page, 1, "2026-12-01"), 1500);
});

// --- primera cuota

// Escenario: primera cuota más adelante
t.test("primera cuota más adelante", async () => {
  const { page } = await abrir({ hoy: NOV15, datos: datos({ cuentas: [BANCO, PREST({ desde: "2026-11-01" })] }) });
  assert.equal(await page.isHidden("#cuotasCard"), true);
  await A.ir(page, "cuentas");
  assert.match(await page.innerText('#carCtas [data-cta="5"]'), /300 €\/mes · faltan 20 \(hasta septiembre 2028\)/);
});

// --- fecha de pago

// Escenario: con fecha de pago
t.test("con fecha de pago", async () => {
  const { page } = await abrir({ hoy: "2026-11-25T12:00:00", datos: datos({ cuentas: [TARJ({ cierres: { "2026-11": "2026-11-20" }, pagos: { "2026-11": "2026-12-05" } })], movs: [A.gasto(1, "2026-11-05", 100, 2)] }) });
  assert.equal(await filaPagar(page, 2), "Cerró el 20 nov. · pagás el 5 dic.");
});

// Escenario: cargar la fecha de pago
t.test("cargar la fecha de pago", async () => {
  const { page } = await abrir({ hoy: NOV, datos: datos({ cuentas: [TARJ({ cierres: { "2026-11": "2026-11-20" } })] }) });
  await page.click("#pagarCard");
  await page.fill('#pgLista input[data-pago="2"]', "2026-12-05");
  await A.aviso(page, "Fecha de pago guardada");
  assert.deepEqual((await A.guardados(page)).cuentas[0].pagos, { "2026-11": "2026-12-05" });
  await page.reload();
  assert.equal(await filaPagar(page, 2), "Cerró el 20 nov. · pagás el 5 dic.");
});

// Escenario: fecha de pago antes del cierre
t.test("fecha de pago antes del cierre", async () => {
  const { page } = await abrir({ hoy: NOV, datos: datos({ cuentas: [TARJ({ cierres: { "2026-11": "2026-11-20" } })] }) });
  await page.click("#pagarCard");
  await page.fill('#pgLista input[data-pago="2"]', "2026-11-15");
  await A.aviso(page, "La fecha de pago tiene que ser después del cierre y antes de fin de diciembre 2026.");
  assert.equal("pagos" in (await A.guardados(page)).cuentas[0], false);
  assert.equal(await page.inputValue('#pgLista input[data-pago="2"]'), "");
});

// --- datos

// Escenario: datos de la versión anterior (Forecast)
t.test("datos de la versión anterior (Forecast)", async () => {
  const d = datos({ cuentas: [BANCO, TARJ()], movs: [ING(1, "2026-09-10", 2000)] });
  const { page } = await abrir({ datos: d });
  await forecast(page);
  assert.equal(await page.inputValue("#foreIng"), "2000");
  const g = await A.guardados(page);
  assert.equal("foreIng" in g.settings, false);
  assert.equal("pagos" in g.cuentas[1], false);
});

// Escenario: copia de seguridad vieja (Forecast)
t.test("copia de seguridad vieja (Forecast)", async () => {
  const { page, errores } = await abrir();
  await restaurar(page, JSON.stringify(datos({ movs: [ING(1, "2026-09-10", 2000)] })));
  await A.aviso(page, "Copia restaurada");
  await A.ir(page, "inicio");
  await forecast(page);
  assert.equal(await page.inputValue("#foreIng"), "2000");
  assert.deepEqual(errores, []);
});

// Escenario: ingreso y fechas de pago inválidos en la copia
t.test("ingreso y fechas de pago inválidos en la copia", async () => {
  const { page } = await abrir();
  const d = datos({ cuentas: [BANCO, TARJ({ cierres: { "2026-11": "2026-11-20" }, pagos: { "2026-11": "2026-11-10", "2026-10": "2026-11-05" } })], settings: { foreIng: "hola" } });
  await restaurar(page, JSON.stringify(d));
  await A.aviso(page, "Copia restaurada");
  const g = await A.guardados(page);
  assert.equal("foreIng" in g.settings, false);
  assert.deepEqual(g.cuentas.find((c) => c.id === 2).pagos, { "2026-10": "2026-11-05" });
});

// Escenario: el ingreso y la fecha de pago viajan en la copia
t.test("el ingreso y la fecha de pago viajan en la copia", async () => {
  const { page } = await abrir({ hoy: NOV, datos: datos({ cuentas: [BANCO, TARJ({ pagos: { "2026-11": "2026-12-05" } })], settings: { foreIng: 1500 } }) });
  await A.ir(page, "ajustes");
  await page.click("#copiarBackup");
  const copia = await A.portapapeles(page);
  const { page: otra } = await abrir({ hoy: NOV });
  await restaurar(otra, copia);
  await A.aviso(otra, "Copia restaurada");
  const g = await A.guardados(otra);
  assert.equal(g.settings.foreIng, 1500);
  assert.deepEqual(g.cuentas.find((c) => c.id === 2).pagos, { "2026-11": "2026-12-05" });
});
