// Capacidad: importacion
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");
const X = require("./extractos.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 1000, { desde: "2026-10-01" });
const REVOLUT = A.cta(2, "Revolut", 0, { desde: "2026-10-01" });
const R = "Trabajo (reembolsable)";
const cuentas = (extra = {}) => A.v2({ cuentas: [{ ...BANCO, ref: "4321" }, REVOLUT], ...extra });

// Elige el PDF desde Movimientos y espera la hoja de importación (o el aviso)
async function importar(page, buf, nombre = "extracto.pdf") {
  await A.ir(page, "movs");
  const antes = await page.evaluate(() => window.__avisos.length);
  await page.setInputFiles("#pdfIn", { name: nombre, mimeType: "application/pdf", buffer: buf });
  await page.waitForFunction((n) => !document.getElementById("sheetI").hidden || window.__avisos.length > n, antes, { timeout: 20000 });
}
const que = (page, i) => page.$eval(`[data-que="${i}"]`, (s) => s.value);
const borr = (page, i) => page.locator(`[data-borr="${i}"]`);
const marcado = (page, i) => page.isChecked(`[data-on="${i}"]`);
const gasto = (fecha, desc, importe, extra) => ({ fecha, desc, importe: -importe, extra });
const indice = (page, nota) => page.evaluate((n) => imp.d.find((x) => x.nota === n).i, nota);

// Escenario: extracto reconocido
t.test("extracto reconocido", async () => {
  const { page } = await abrir({ datos: cuentas() });
  const movs = Array.from({ length: 12 }, (_, i) => gasto(`2026-10-${String(i + 1).padStart(2, "0")}`, `Pago Movil En Comercio ${"ABCDEFGHIJKL"[i]}, Ciudad Es`, 10 + i));
  await importar(page, await X.santanderCuenta(page, { ref: "4321", inicial: 1000, movs }));
  assert.equal(await page.isVisible("#iElegir"), false);
  assert.equal(await A.texto(page, '#segICuenta [aria-pressed="true"]'), "Banco A");
  assert.equal(await A.texto(page, "#iRevisa"), "Revisá 12 movimientos");
});

// Escenario: primera vez con una cuenta
t.test("primera vez con una cuenta", async () => {
  const { page } = await abrir({ datos: cuentas() });
  const extracto = (dia) => X.revolut(page, { ref: "7788", movs: [{ fecha: `2026-10-${dia}`, desc: "Tienda Ejemplo", importe: -5 }] });
  await importar(page, await extracto("05"));
  assert.ok(await page.isVisible("#iElegir"));
  assert.match(await A.texto(page, "#iElegirSub"), /Extracto de Revolut en euros · cuenta terminada en 7788/);
  await A.elegir(page, "segIElegir", "Revolut");
  await page.click("#iSeguir");
  await page.click("#iGuardar");
  await A.aviso(page, "1 movimiento importado");
  await page.click("#icNo");
  await importar(page, await extracto("12"));
  assert.equal(await page.isVisible("#iElegir"), false);
  assert.equal(await A.texto(page, '#segICuenta [aria-pressed="true"]'), "Revolut");
});

// Escenario: archivo no reconocido
t.test("archivo no reconocido", async () => {
  const { page } = await abrir({ datos: cuentas() });
  const antes = await A.guardados(page);
  await importar(page, await X.otroPdf(page), "factura.pdf");
  await A.aviso(page, "No reconozco este extracto. Por ahora leo Revolut (cuenta en euros) y Santander (cuenta y tarjeta de crédito).");
  assert.equal(await page.isVisible("#sheetI"), false);
  assert.deepEqual(await A.guardados(page), antes);
});

// Escenario: guardar sólo lo marcado
t.test("guardar sólo lo marcado", async () => {
  const { page } = await abrir({ datos: cuentas() });
  const movs = ["Uno", "Dos", "Tres", "Cuatro", "Cinco"].map((n, i) => gasto(`2026-10-0${i + 1}`, `Comercio ${n}`, 10));
  await importar(page, await X.santanderCuenta(page, { ref: "4321", inicial: 1000, movs }));
  assert.equal(await A.texto(page, "#iGuardar"), "Guardar 5 movimientos");
  await page.uncheck('[data-on="2"]');
  assert.equal(await A.texto(page, "#iGuardar"), "Guardar 4 movimientos");
  await page.click("#iGuardar");
  await A.aviso(page, "4 movimientos importados");
  const d = await A.guardados(page);
  assert.equal(d.movs.length, 4);
  assert.ok(d.movs.every((m) => m.cuenta === 1 && m.tipo === "gasto" && m.origen));
});

// Escenario: cerrar sin guardar
t.test("cerrar sin guardar", async () => {
  const { page } = await abrir({ datos: cuentas() });
  const antes = await A.guardados(page);
  await importar(page, await X.santanderCuenta(page, { ref: "4321", inicial: 1000, movs: [gasto("2026-10-03", "Comercio Uno", 10)] }));
  await page.click("#iCerrar");
  assert.equal(await page.isVisible("#sheetI"), false);
  assert.deepEqual(await A.guardados(page), antes);
});

// Escenario: comercio conocido
t.test("comercio conocido", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await importar(page, await X.santanderCuenta(page, { ref: "4321", inicial: 1000, movs: [gasto("2026-10-03", "Pago Movil En 8930208 Consum, Ciudad Es, Tarj. :*1111", 22.05)] }));
  assert.equal(await que(page, 0), "g|Súper");
  assert.equal(await A.texto(page, '[data-borr="0"] .d b'), "Consum");
});

// Escenario: la app aprende
t.test("la app aprende", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await importar(page, await X.santanderCuenta(page, { ref: "4321", inicial: 1000, movs: [gasto("2026-10-03", "Pago Movil En Bar Ejemplo, Ciudad Es", 8)] }));
  assert.equal(await que(page, 0), "g|Comida fuera");
  await page.selectOption('[data-que="0"]', "g|Ocio");
  await page.click("#iGuardar");
  await A.aviso(page, "1 movimiento importado");
  await page.click("#icNo");
  await importar(page, await X.santanderCuenta(page, { ref: "4321", inicial: 992, movs: [gasto("2026-10-10", "Pago Movil En Bar Ejemplo, Otra Ciudad Es", 12)] }));
  assert.equal(await que(page, 0), "g|Ocio");
});

// Escenario: movimiento ya cargado
t.test("movimiento ya cargado", async () => {
  const { page } = await abrir({ datos: cuentas({ movs: [A.gasto(9, "2026-10-18", 25.3, 1, "Transporte", "gasolina")] }) });
  await importar(page, await X.santanderCuenta(page, { ref: "4321", inicial: 1000, movs: [gasto("2026-10-17", "Comercio Uno", 5), gasto("2026-10-18", "Pago Movil En Gasolinera Ejemplo, Ciudad", 25.3)] }));
  const i = await indice(page, "Gasolinera Ejemplo");
  assert.equal(await marcado(page, i), false);
  assert.equal(await borr(page, i).locator('[data-ui="marca-ya-esta"]').innerText(), "Ya está");
  assert.ok(await marcado(page, 1 - i));
});

// Escenario: compra anulada
t.test("compra anulada", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await importar(page, await X.santanderCuenta(page, { ref: "4321", inicial: 1000, movs: [
    gasto("2026-10-15", "Pago Movil En Kiosco Ejemplo, Ciudad Es, Tarj. :", 3.5),
    { fecha: "2026-10-15", desc: "Anulacion Pago Movil En Kiosco Ejemplo, Ciudad Es,", importe: 3.5 },
    gasto("2026-10-14", "Pago Movil En Comercio Uno, Ciudad Es", 9)] }));
  const d = await page.evaluate(() => imp.d.map((x) => [x.nota, x.on, x.marca]));
  assert.deepEqual(d.filter((x) => x[2] === "anulada").length, 2);
  assert.ok(d.filter((x) => x[2] === "anulada").every((x) => x[1] === false && x[0] === "Kiosco Ejemplo"));
  assert.equal(await page.locator('[data-ui="marca-anulada"]').count(), 2);
  assert.ok(d.find((x) => x[0] === "Comercio Uno")[1]);
});

// Escenario: recarga de Revolut desde el banco
t.test("recarga de Revolut desde el banco", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await importar(page, await X.santanderCuenta(page, { ref: "4321", inicial: 1000, movs: [gasto("2026-10-13", "Compra Revolut**1234*, Dublin, Tarjeta", 100, ", Comision 0,00")] }));
  assert.equal(await que(page, 0), "t|2");
  assert.equal(await page.$eval('[data-que="0"] option:checked', (o) => o.textContent), "Transferencia a Revolut");
  await page.click("#iGuardar");
  await A.aviso(page, "1 movimiento importado");
  const m = (await A.guardados(page)).movs[0];
  assert.deepEqual([m.tipo, m.cuenta, m.destino, m.importe], ["transferencia", 1, 2, 100]);
});

// Escenario: la otra mitad ya está
t.test("la otra mitad ya está", async () => {
  const { page } = await abrir({ datos: cuentas({ movs: [A.transf(9, "2026-10-13", 100, 1, 2)] }) });
  await importar(page, await X.revolut(page, { ref: "7788", movs: [{ fecha: "2026-10-13", desc: "Una recarga de Apple Pay con *1234", importe: 100 }, { fecha: "2026-10-14", desc: "Tienda Ejemplo", importe: -4 }] }));
  await A.elegir(page, "segIElegir", "Revolut");
  await page.click("#iSeguir");
  assert.equal(await marcado(page, 0), false);
  assert.equal(await borr(page, 0).locator('[data-ui="marca-ya-esta"]').innerText(), "Ya está");
  assert.ok(await marcado(page, 1));
});

// Escenario: transferencia de la empresa
t.test("transferencia de la empresa", async () => {
  const reemb = (id, fecha, v, nota) => ({ ...A.gasto(id, fecha, v, 1, R, nota), reembolso: { estado: "pendiente" } });
  const { page } = await abrir({ datos: cuentas({ movs: [reemb(5, "2026-09-12", 12.4, "parking"), reemb(6, "2026-09-05", 4.6, "taxi")] }) });
  await importar(page, await X.santanderCuenta(page, { ref: "4321", inicial: 1000, movs: [{ fecha: "2026-10-10", desc: "Transferencia De Empresa X Sl, Concepto Gastos De", extra: "Agosto.", importe: 17 }] }));
  assert.equal(await que(page, 0), "i|Reembolso");
  await page.check('[data-icubre="0"][value="5"]');
  await page.check('[data-icubre="0"][value="6"]');
  await page.click("#iGuardar");
  await A.aviso(page, "1 movimiento importado");
  const d = await A.guardados(page);
  const ing = d.movs.find((m) => m.tipo === "ingreso");
  assert.equal(ing.cat, "Reembolso");
  assert.deepEqual(d.movs.filter((m) => m.reembolso).map((m) => m.reembolso), [{ estado: "pagado", cobro: ing.id }, { estado: "pagado", cobro: ing.id }]);
});

// Escenario: saldo que coincide
t.test("saldo que coincide", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await importar(page, await X.santanderCuenta(page, { ref: "4321", inicial: 1000, movs: [gasto("2026-10-05", "Comercio Uno", 30), gasto("2026-10-09", "Comercio Dos", 20)] }));
  await page.click("#iGuardar");
  await A.aviso(page, "2 movimientos importados");
  assert.equal(await A.texto(page, "#icExt"), "950 €");
  assert.equal(await A.texto(page, "#icDif"), "0 €");
  await page.click("#icConciliar");
  await A.aviso(page, "Cuenta conciliada");
  await A.ir(page, "mes");
  assert.equal(await A.texto(page, '[data-conc="1"] .chip'), "Conciliada");
});

// Escenario: saldo que no coincide
t.test("saldo que no coincide", async () => {
  // El banco ya tenía un gasto de 10 € que la app no conoce: el extracto dice 940 € y la app calcula 950 €
  const { page } = await abrir({ datos: cuentas() });
  await importar(page, await X.santanderCuenta(page, { ref: "4321", inicial: 990, movs: [gasto("2026-10-05", "Comercio Uno", 30), gasto("2026-10-09", "Comercio Dos", 20)] }));
  await page.click("#iGuardar");
  await A.aviso(page, "2 movimientos importados");
  assert.equal(await A.texto(page, "#icDif"), "-10 €");
  await page.click("#icConciliar");
  assert.ok(await page.isVisible("#sheetK"));
  assert.equal(await page.inputValue("#kReal"), "940");
  assert.equal(await A.texto(page, "#kDifVal"), "-10 €");
});

// Escenario: alquiler importado
t.test("alquiler importado", async () => {
  const CASA = "Casa/Splitwise";
  const { page } = await abrir({ datos: cuentas({ movs: [{ ...A.gasto(9, "2026-09-01", 600, 1, CASA, "alquiler"), fijo: true }], fijos: { [`${CASA}|alquiler`]: true } }) });
  await importar(page, await X.santanderCuenta(page, { ref: "4321", inicial: 1000, movs: [gasto("2026-10-01", "Alquiler", 600), gasto("2026-10-02", "Comercio Uno", 5)] }));
  const i = await indice(page, "Alquiler");
  assert.equal(await que(page, i), `g|${CASA}`);
  assert.equal(await borr(page, i).locator('[data-ui="marca-fijo"]').innerText(), "Fijo");
  await page.click("#iGuardar");
  await A.aviso(page, "2 movimientos importados");
  const d = await A.guardados(page);
  assert.equal(d.movs.find((m) => m.nota === "Alquiler" && m.fecha === "2026-10-01").fijo, true);
  assert.equal(d.movs.find((m) => m.nota === "Comercio Uno").fijo, undefined);
});

const internacional = (dia, importe) => ({ fecha: `2026-10-${dia}`, desc: "Transferencia internacional a Ana Ejemplo", importe: -importe });

// Escenario: transferencia internacional
t.test("transferencia internacional", async () => {
  const { page } = await abrir({ datos: cuentas({ cuentas: [{ ...BANCO, ref: "4321" }, { ...REVOLUT, ref: "7788" }] }) });
  await importar(page, await X.revolut(page, { ref: "7788", titular: "Ana Ejemplo", movs: [internacional("07", 20)] }));
  assert.equal(await que(page, 0), "g|Regalos");
  assert.equal(await page.$eval('[data-que="0"] option:checked', (o) => o.textContent), "Gasto · Regalos");
});

// Escenario: otra categoría recordada
t.test("otra categoría recordada", async () => {
  const { page } = await abrir({ datos: cuentas({ cuentas: [{ ...BANCO, ref: "4321" }, { ...REVOLUT, ref: "7788" }] }) });
  await importar(page, await X.revolut(page, { ref: "7788", titular: "Ana Ejemplo", movs: [internacional("07", 20)] }));
  await page.selectOption('[data-que="0"]', "g|Casa/Splitwise");
  await page.click("#iGuardar");
  await A.aviso(page, "1 movimiento importado");
  await page.click("#icNo");
  await importar(page, await X.revolut(page, { ref: "7788", titular: "Ana Ejemplo", movs: [internacional("14", 35)] }));
  assert.equal(await que(page, 0), "g|Casa/Splitwise");
});
