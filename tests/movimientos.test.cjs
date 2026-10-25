// Capacidad: movimientos
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 1000);
const TARJETA = A.cta(2, "Tarjeta Y", 350, { tipo: "tarjeta" });
const saldo = (page, id) => A.texto(page, `[data-cta="${id}"] .v .num`);
const enCuentas = async (page) => { await A.ir(page, "cuentas"); };

// Escenario: gasto desde una cuenta propia
t.test("gasto desde una cuenta propia", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await A.nuevoGasto(page, { importe: 12.5, cuenta: "Banco A", cat: "Súper", nota: "verdulería" });
  await A.aviso(page, "Gasto guardado");
  await A.ir(page, "movs");
  const tarjeta = await A.texto(page, "#movs .mov");
  assert.match(tarjeta, /Súper · 15\/10/);
  assert.match(tarjeta, /verdulería/);
  assert.match(tarjeta, /−12,5 €/);
  await enCuentas(page);
  assert.equal(await saldo(page, 1), "987,5 €");
});

// Escenario: importe en cero
t.test("importe en cero", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await A.nuevoGasto(page, { importe: 0 });
  await A.aviso(page, "Poné un importe mayor que 0");
  assert.equal((await A.guardados(page)).movs.length, 0);
});

// Escenario: importe vacío
t.test("importe vacío", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await A.nuevoGasto(page);
  assert.ok(await page.isVisible("#sheet"));
  assert.ok(await page.$eval("#mImporte", (el) => el.validity.valueMissing));
  assert.equal((await A.guardados(page)).movs.length, 0);
});

// Escenario: sin cuentas para anotar
t.test("sin cuentas para anotar", async () => {
  const { page } = await abrir();
  await page.click("#fab");
  assert.match(await A.texto(page, "#sinCuentas"), /Primero creá una cuenta/);
  assert.equal(await page.isVisible("#mImporte"), false);
  await page.click("#mCrearCuenta");
  assert.equal(await A.texto(page, "#cTitulo"), "Nueva cuenta");
  assert.ok(await page.isVisible("#sheetC"));
});

// Escenario: ingreso extra
t.test("ingreso extra", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await A.nuevoMov(page, { tipo: "ingreso", importe: 200, cuenta: "Banco A", cat: "Venta o trabajo extra", nota: "bicicleta" });
  await A.aviso(page, "Ingreso guardado");
  await A.ir(page, "movs");
  assert.match(await A.texto(page, "#movs .mov"), /\+200 €/);
  await enCuentas(page);
  assert.equal(await saldo(page, 1), "1200 €");
});

// Escenario: devolución en la tarjeta
t.test("devolución en la tarjeta", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [TARJETA] }) });
  await A.nuevoMov(page, { tipo: "ingreso", importe: 20, cuenta: "Tarjeta Y", cat: "Reembolso" });
  await A.aviso(page, "Ingreso guardado");
  await enCuentas(page);
  assert.equal(await saldo(page, 2), "-330 €");
});

// Escenario: pagar la tarjeta
t.test("pagar la tarjeta", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, TARJETA] }) });
  await A.nuevoMov(page, { tipo: "transferencia", importe: 350, desde: "Banco A", hacia: "Tarjeta Y" });
  await A.aviso(page, "Transferencia guardada");
  await enCuentas(page);
  assert.equal(await saldo(page, 1), "650 €");
  assert.equal(await saldo(page, 2), "0 €");
  assert.equal(await A.texto(page, "#neto"), "650 €");
  await A.ir(page, "movs");
  assert.equal(await A.texto(page, "#totGas"), "0 €");
});

// Escenario: misma cuenta de origen y destino
t.test("misma cuenta de origen y destino", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, TARJETA] }) });
  await A.nuevoMov(page, { tipo: "transferencia", importe: 50, desde: "Banco A", hacia: "Banco A" });
  await A.aviso(page, "Elegí dos cuentas distintas");
  assert.equal((await A.guardados(page)).movs.length, 0);
});

// Escenario: movimientos de otro mes no aparecen
t.test("movimientos de otro mes no aparecen", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-09-28", 30, 1, "Ocio"), A.gasto(2, "2026-10-03", 20, 1)] }) });
  await A.ir(page, "movs");
  const movs = await page.locator("#movs .mov").allInnerTexts();
  assert.equal(movs.length, 1);
  assert.match(movs[0], /03\/10/);
});

// Escenario: últimos gastos en Inicio
t.test("últimos gastos en Inicio", async () => {
  const movs = [1, 2, 3, 4, 5, 6].map((d) => A.gasto(d, `2026-10-0${d}`, d, 1));
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs }) });
  const ids = await page.locator("#ultimos .mini").evaluateAll((els) => els.map((e) => e.dataset.mini));
  assert.deepEqual(ids, ["6", "5", "4", "3", "2"]);
});

// Escenario: mes sin movimientos
t.test("mes sin movimientos", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await A.ir(page, "movs");
  assert.equal(await A.texto(page, "#movs"), "Sin movimientos este mes.");
});

// Escenario: totales sin transferencias
t.test("totales sin transferencias", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, TARJETA], movs: [A.ingreso(1, "2026-10-01", 1500, 1), A.gasto(2, "2026-10-02", 80, 1), A.transf(3, "2026-10-03", 300, 1, 2)] }) });
  await A.ir(page, "movs");
  assert.equal(await A.texto(page, "#totIng"), "1500 €");
  assert.equal(await A.texto(page, "#totGas"), "80 €");
});

// Escenario: corregir un importe
t.test("corregir un importe", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [A.gasto(7, "2026-10-05", 20, 1)] }) });
  await A.ir(page, "movs");
  await page.click('[data-mov="7"] .linea');
  assert.equal(await page.inputValue("#mImporte"), "20");
  await page.fill("#mImporte", "25");
  await page.click("#mGuardar");
  await A.aviso(page, "Gasto guardado");
  assert.match(await A.texto(page, '[data-mov="7"]'), /−25 €/);
  await enCuentas(page);
  assert.equal(await saldo(page, 1), "975 €");
});

// Escenario: borrar con dos toques
t.test("borrar con dos toques", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [A.gasto(7, "2026-10-05", 20, 1)] }) });
  await A.ir(page, "movs");
  await page.click('[data-del="7"]');
  assert.equal(await A.texto(page, '[data-del="7"]'), "Borrar");
  await page.click('[data-del="7"]');
  await A.aviso(page, "Movimiento borrado");
  assert.equal(await page.locator("#movs .mov").count(), 0);
});

// Escenario: un solo toque no borra
t.test("un solo toque no borra", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [A.gasto(7, "2026-10-05", 20, 1)] }) });
  await A.ir(page, "movs");
  await page.click('[data-del="7"]');
  await page.waitForTimeout(3000);
  assert.equal(await A.texto(page, '[data-del="7"]'), "×");
  assert.equal(await page.locator("#movs .mov").count(), 1);
});

// Escenario: categorías ordenadas
t.test("categorías ordenadas", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [
    A.gasto(1, "2026-10-02", 18, 1, "Comida fuera"), A.gasto(2, "2026-10-03", 64.3, 1, "Súper"),
    A.gasto(3, "2026-10-04", 42, 1, "Trabajo (reembolsable)"), A.ingreso(4, "2026-10-01", 1500, 1)] }) });
  const cats = await page.locator("#cats .item span:first-child").allInnerTexts();
  assert.deepEqual(cats, ["Súper", "Trabajo (reembolsable)", "Comida fuera"]);
});

// Escenario: sin gastos por categoría
t.test("sin gastos por categoría", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  assert.equal(await A.texto(page, "#cats"), "Todavía no anotaste gastos este mes. Tocá + para empezar.");
});

// Escenario: resultado con ingresos y gastos
t.test("resultado con ingresos y gastos", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [
    A.ingreso(1, "2026-10-01", 1500, 1), A.ingreso(2, "2026-10-09", 200, 1, "Venta o trabajo extra"),
    A.gasto(3, "2026-10-03", 64.3, 1), A.gasto(4, "2026-10-05", 18, 1, "Comida fuera")] }) });
  assert.equal(await A.texto(page, "#ingMes"), "Ingresos 1700 €");
  assert.equal(await A.texto(page, "#gasMes"), "Gastos 82,3 €");
  assert.equal(await A.texto(page, "#resultado"), "1617,7 €");
});

// Escenario: mes en negativo
t.test("mes en negativo", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [A.ingreso(1, "2026-10-01", 100, 1), A.gasto(2, "2026-10-02", 150, 1)] }) });
  assert.equal(await A.texto(page, "#resultado"), "-50 €");
  assert.match(await page.getAttribute("#resultado", "class"), /\bneg\b/);
});
