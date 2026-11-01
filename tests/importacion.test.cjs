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

// --- cualquier archivo: Excel, PDF, CSV y fotos
const F = require("./archivos.cjs");
// Elige el archivo desde Movimientos y espera la hoja de importación, la pregunta de signo o un aviso de lectura (no «Leyendo la foto…»)
async function importaArchivo(page, archivo) {
  await A.ir(page, "movs");
  await page.setInputFiles("#pdfIn", archivo);
  await page.waitForFunction(() => !document.getElementById("sheetI").hidden || !document.getElementById("sheetSigno").hidden || window.__avisos.some((a) => a !== "Leyendo la foto…"), null, { timeout: 60000 });
}
// Primera vez con ese archivo: elige la cuenta y sigue a la revisión
async function eligeBanco(page) {
  await page.click('#segIElegir button:has-text("Banco A")');
  await page.click("#iSeguir");
}
const notas = (page) => page.evaluate(() => imp.d.map((x) => [x.nota, x.s]));
const TARJETA_XLSX = [["", "", "CREDITO EJEMPLO", "Date"], ["", "", "Tarjeta ejemplo", "28/10/2026"], ["Transactions"], ["Transaction date", "Description", "Amount", "Currency"],
  [{ f: "2026-10-01" }, "Tienda Uno", "−11,11", "EUR"], [{ f: "2026-10-06" }, "Cafeteria Dos", "−2,25", "EUR"], [{ f: "2026-10-10" }, "Taller Tres", "−35,00", "EUR"]];

// Escenario: tabla en Excel con cabeceras en inglés
t.test("tabla en Excel con cabeceras en inglés", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await importaArchivo(page, F.XLSX(F.xlsx(TARJETA_XLSX)));
  await eligeBanco(page);
  assert.equal(await A.texto(page, "#iRevisa"), "Revisá 3 movimientos");
  assert.deepEqual(await notas(page), [["Tienda Uno", -11.11], ["Cafeteria Dos", -2.25], ["Taller Tres", -35]]);
  assert.deepEqual(await page.evaluate(() => imp.d.map((x) => x.fecha)), ["2026-10-01", "2026-10-06", "2026-10-10"]);
  assert.match(await A.texto(page, "#iBorr"), /−11,11 €/);
});

// Escenario: la misma tabla en un PDF
t.test("la misma tabla en un PDF", async () => {
  const { page } = await abrir({ datos: cuentas() });
  const filas = [["01/10/2026", "Tienda Uno", "−11,11"], ["06/10/2026", "Cafeteria Dos", "−2,25"], ["10/10/2026", "Taller Tres", "−35,00"]];
  const buf = await X.pdf(page, [[[40, 760, "Transaction date"], [160, 760, "Description"], [360, 760, "Amount"], [440, 760, "Currency"],
    ...filas.flatMap((f, i) => [[40, 740 - i * 20, f[0]], [160, 740 - i * 20, f[1]], [360, 740 - i * 20, f[2]], [440, 740 - i * 20, "EUR"]])]]);
  await importaArchivo(page, { name: "tarjeta.pdf", mimeType: "application/pdf", buffer: buf });
  await eligeBanco(page);
  assert.equal(await A.texto(page, "#iRevisa"), "Revisá 3 movimientos");
  assert.deepEqual(await notas(page), [["Tienda Uno", -11.11], ["Cafeteria Dos", -2.25], ["Taller Tres", -35]]);
});

// Escenario: CSV con punto y coma y coma decimal
t.test("CSV con punto y coma y coma decimal", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await importaArchivo(page, F.CSV("Fecha;Concepto;Importe\n05/10/2026;Tienda Uno;-12,50\n06/10/2026;Cobro ejemplo;1.200,00\n"));
  await eligeBanco(page);
  assert.deepEqual(await notas(page), [["Tienda Uno", -12.5], ["Cobro ejemplo", 1200]]);
});

// Escenario: columnas de cargo y abono
t.test("columnas de cargo y abono", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await importaArchivo(page, F.CSV("Fecha;Concepto;Cargo;Abono\n05/10/2026;Tienda Uno;30,00;\n06/10/2026;Ingreso ejemplo;;100,00\n"));
  await eligeBanco(page);
  assert.deepEqual(await notas(page), [["Tienda Uno", -30], ["Ingreso ejemplo", 100]]);
});

// Escenario: todos los importes positivos
t.test("todos los importes positivos", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await importaArchivo(page, F.CSV("Fecha;Concepto;Importe\n01/10/2026;Pago A;10,00\n02/10/2026;Pago B;20,00\n03/10/2026;Pago C;30,00\n04/10/2026;Pago D;40,00\n"));
  assert.equal(await page.isVisible("#sheetSigno"), true);
  assert.match(await A.texto(page, "#sheetSigno"), /Todos los importes son positivos\. ¿Son gastos o ingresos\?/);
  await page.click("#sgGastos");
  await eligeBanco(page);
  assert.equal(await A.texto(page, "#iRevisa"), "Revisá 4 movimientos");
  assert.deepEqual((await notas(page)).map((x) => x[1]), [-10, -20, -30, -40]);
});

// Escenario: filas que no son movimientos
t.test("filas que no son movimientos", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await importaArchivo(page, F.CSV("Extracto ejemplo\nFecha;Concepto;Importe\n01/10/2026;Pago A;-10,00\n02/10/2026;Pago B;-20,00\nTotal;;-30,00\n"));
  await eligeBanco(page);
  assert.equal(await A.texto(page, "#iRevisa"), "Revisá 2 movimientos");
});

// Escenario: cuenta reconocida por el número de tarjeta
t.test("cuenta reconocida por el número de tarjeta", async () => {
  const datos = A.v2({ cuentas: [A.cta(1, "Banco A", 0), A.cta(2, "Tarjeta Y", 0, { tipo: "tarjeta", ref: "0123" })] });
  const { page } = await abrir({ datos });
  const numero = ["4000", "0000", "0000", "0123"].join(" ");
  await importaArchivo(page, F.XLSX(F.xlsx([["Tarjeta", numero], ["Fecha", "Concepto", "Importe"], [{ f: "2026-10-01" }, "Tienda Uno", "−11,11"], [{ f: "2026-10-02" }, "Tienda Dos", "−5,00"]])));
  assert.equal(await page.isVisible("#iElegir"), false);
  assert.equal(await A.texto(page, '#segICuenta [aria-pressed="true"]'), "Tarjeta Y");
});

// Escenario: archivo sin movimientos
t.test("archivo sin movimientos", async () => {
  const { page } = await abrir({ datos: cuentas() });
  const antes = await A.guardados(page);
  await importaArchivo(page, F.TXT("Una nota cualquiera\nsin fechas ni importes\n"));
  await A.aviso(page, "No encontré movimientos en este archivo.");
  assert.equal(await page.isVisible("#sheetI"), false);
  assert.deepEqual(await A.guardados(page), antes);
});

// Escenario: archivo que no se puede leer
t.test("archivo que no se puede leer", async () => {
  const { page } = await abrir({ datos: cuentas() });
  const antes = await A.guardados(page);
  await importaArchivo(page, F.XLSX(Buffer.from("esto no es un zip"), "datos.xlsx"));
  await A.aviso(page, "No pude leer este archivo.");
  assert.equal(await page.isVisible("#sheetI"), false);
  assert.deepEqual(await A.guardados(page), antes);
});

// Escenario: foto de una tabla de movimientos
t.test("foto de una tabla de movimientos", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await page.evaluate(() => { window.__leyendo = false; const e = document.getElementById("leyendoFoto"); new MutationObserver(() => { if (!e.hidden && e.textContent === "Leyendo la foto…") window.__leyendo = true; }).observe(e, { attributes: true }); });
  await importaArchivo(page, F.PNG(await F.imagenTabla(page, F.FOTO_TABLA)));
  await eligeBanco(page);
  assert.equal(await page.evaluate(() => window.__leyendo), true, "mostró «Leyendo la foto…»");
  assert.equal(await A.texto(page, "#iRevisa"), "Revisá 3 movimientos");
  assert.deepEqual((await notas(page)).map((x) => x[1]), [-12.5, -3.2, -45]);
  assert.equal(await page.isVisible("#leyendoFoto"), false);
});

// Escenario: PDF escaneado
t.test("PDF escaneado", async () => {
  const { page } = await abrir({ datos: cuentas() });
  const pdf = await F.pdfEscaneado(page, await F.imagenTabla(page, F.FOTO_TABLA));
  await importaArchivo(page, { name: "escaneado.pdf", mimeType: "application/pdf", buffer: pdf });
  await eligeBanco(page);
  assert.equal(await A.texto(page, "#iRevisa"), "Revisá 3 movimientos");
});

// Escenario: foto sin texto
t.test("foto sin texto", async () => {
  const { page } = await abrir({ datos: cuentas() });
  const antes = await A.guardados(page);
  await importaArchivo(page, F.PNG(await F.imagenTabla(page, [])));
  await A.aviso(page, "No pude leer texto en la foto.");
  assert.equal(await page.isVisible("#sheetI"), false);
  assert.deepEqual(await A.guardados(page), antes);
});

// Escenario: el lector de fotos no se puede cargar
t.test("el lector de fotos no se puede cargar", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await page.route("**/vendor/tesseract/**", (r) => r.abort());
  const antes = await A.guardados(page);
  await importaArchivo(page, F.PNG(await F.imagenTabla(page, F.FOTO_TABLA)));
  await A.aviso(page, "No pude cargar el lector de fotos. Probá de nuevo con conexión.");
  assert.equal(await page.isVisible("#sheetI"), false);
  assert.deepEqual(await A.guardados(page), antes);
});

// Escenario: la lectura no pide nada a otros sitios
t.test("la lectura no pide nada a otros sitios", async () => {
  const { page } = await abrir({ datos: cuentas() });
  const afuera = [];
  page.on("request", (r) => { const u = new URL(r.url()); if (u.protocol.startsWith("http") && u.origin !== new URL(page.url()).origin) afuera.push(r.url()); });
  await importaArchivo(page, F.PNG(await F.imagenTabla(page, F.FOTO_TABLA)));
  await eligeBanco(page);
  assert.equal(await A.texto(page, "#iRevisa"), "Revisá 3 movimientos");
  assert.deepEqual(afuera, []);
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
  assert.equal(await que(page, 0), "g|Supermercado");
  assert.equal(await A.texto(page, '[data-borr="0"] .d b'), "Consum");
});

// Escenario: tienda de ropa
t.test("tienda de ropa", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await importar(page, await X.santanderCuenta(page, { ref: "4321", inicial: 1000, movs: [gasto("2026-10-03", "Pago Movil En Zara Centro, Ciudad Es", 39.95)] }));
  assert.equal(await que(page, 0), "g|Ropa");
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

// --- compras fraccionadas del resumen de tarjeta
const TARJETA_Y = A.cta(2, "Tarjeta Y", 0, { tipo: "tarjeta", ref: "5566", desde: "2026-09-01" });
const fraccDatos = () => A.v2({ cuentas: [BANCO, TARJETA_Y] });
const FRACC = [
  { fecha: "2026-10-28", partes: ["Tienda", "Uno"], total: 105, k: 3, m: 5, cuota: 20.99, intereses: 0.96, pendiente: 42.96 },
  { fecha: "2026-10-29", partes: ["Tienda Dos"], total: 89.9, k: 1, m: 2, cuota: 44.61, intereses: 1.35, pendiente: 45.29 },
  { fecha: "2026-10-29", partes: ["Tienda Tres"], total: 132.5, k: 7, m: 7, cuota: 19.35, intereses: 0.15, pendiente: 0 }];
const COMPRAS_F = [{ fecha: "2026-10-05", desc: "PAGO MOVIL COMERCIO UNO", importe: 10 }, { fecha: "2026-10-29", desc: "CUOTA FRACCIONAR COMPRA Tienda Uno", importe: 20.99 }];
const resumen = (page, fraccionadas = FRACC, compras = COMPRAS_F, extra = {}) => X.santanderTarjeta(page, { ref: "5566", desde: "2026-09-29", hasta: "2026-10-29", compras, fraccionadas, ...extra });
const cuotasDe = (page, nota) => A.guardados(page).then((d) => d.movs.find((m) => m.fracc && m.nota === nota));

// Escenario: fraccionadas en curso en el resumen
t.test("fraccionadas en curso en el resumen", async () => {
  const { page } = await abrir({ datos: fraccDatos() });
  await importar(page, await resumen(page));
  assert.equal(await page.isVisible("#iFracc"), true);
  const filas = await page.$$eval("#iFraccLista .borr", (e) => e.map((x) => x.innerText.replace(/\s+/g, " ").trim()));
  assert.equal(filas.length, 2);
  assert.match(filas[0], /Tienda Uno Cuota 3 de 5 · pendiente 42,96 €/);
  assert.match(filas[1], /Tienda Dos Cuota 1 de 2 · pendiente 45,29 €/);
  assert.equal((await A.texto(page, "#iFracc")).includes("Tienda Tres"), false);
});

// Escenario: guardar una fraccionada con varias cuotas
t.test("guardar una fraccionada con varias cuotas", async () => {
  const { page } = await abrir({ datos: fraccDatos(), hoy: "2026-11-02T12:00:00" });
  await importar(page, await resumen(page));
  await page.uncheck('[data-fron="1"]');
  await page.click("#iGuardar");
  await A.aviso(page, "movimientos importados");
  const m = await cuotasDe(page, "Tienda Uno");
  assert.deepEqual([m.importe, m.fecha, m.cuenta, m.cuotas], [42.96, "2026-10-29", 2, { n: 2, cuota: 21.48, desde: "2026-11" }]);
  await page.click("#icNo");
  await A.ir(page, "inicio");
  assert.equal(await A.texto(page, "#cuotasMes"), "21,48 €");
  await page.click("#cuotasCard");
  assert.match(await A.texto(page, "#sheetCuotas"), /Tienda Uno|Tarjeta Y/);
});

// Escenario: guardar una fraccionada con una sola cuota
t.test("guardar una fraccionada con una sola cuota", async () => {
  const { page } = await abrir({ datos: fraccDatos(), hoy: "2026-11-02T12:00:00" });
  await importar(page, await resumen(page));
  await page.uncheck('[data-fron="0"]');
  await page.click("#iGuardar");
  await A.aviso(page, "movimientos importados");
  const m = await cuotasDe(page, "Tienda Dos");
  assert.deepEqual([m.importe, m.cuotas], [45.29, { n: 1, cuota: 45.29, desde: "2026-11" }]);
  const quien = await page.evaluate(() => [movsMes("2026-10").some((x) => x.nota === "Tienda Dos"), movsMes("2026-11").some((x) => x.nota === "Tienda Dos")]);
  assert.deepEqual(quien, [false, true]);
});

// Escenario: no marcar una fraccionada
t.test("no marcar una fraccionada", async () => {
  const { page } = await abrir({ datos: fraccDatos() });
  await importar(page, await resumen(page));
  await page.uncheck('[data-fron="0"]');
  await page.click("#iGuardar");
  await A.aviso(page, "movimientos importados");
  const d = await A.guardados(page);
  assert.equal(d.movs.some((m) => m.fracc && m.nota === "Tienda Uno"), false);
  assert.equal(d.movs.filter((m) => m.fracc).length, 1);
});

// Escenario: la cuota cobrada sigue siendo un gasto
t.test("la cuota cobrada sigue siendo un gasto", async () => {
  const { page } = await abrir({ datos: fraccDatos() });
  await importar(page, await resumen(page));
  await page.click("#iGuardar");
  await A.aviso(page, "movimientos importados");
  const d = await A.guardados(page);
  const cuota = d.movs.find((m) => m.importe === 20.99 && !m.fracc);
  assert.deepEqual([cuota.tipo, cuota.fecha], ["gasto", "2026-10-29"]);
  assert.equal(d.movs.find((m) => m.fracc && m.nota === "Tienda Uno").cuotas.desde, "2026-11");
});

// Escenario: el resumen siguiente no duplica
t.test("el resumen siguiente no duplica", async () => {
  const { page } = await abrir({ datos: fraccDatos() });
  await importar(page, await resumen(page));
  await page.click("#iGuardar");
  await A.aviso(page, "movimientos importados");
  await page.click("#icNo");
  const sig = [{ ...FRACC[0], fecha: "2026-11-28", k: 4, pendiente: 21.48 }];
  await importar(page, await resumen(page, sig, [{ fecha: "2026-11-05", desc: "PAGO MOVIL COMERCIO DOS", importe: 12 }], { desde: "2026-10-30", hasta: "2026-11-29" }));
  const fila = await page.$eval('#iFraccLista [data-fr="0"]', (e) => ({ marcada: e.querySelector("input").checked, ya: !!e.querySelector('[data-ui="marca-ya-esta"]') }));
  assert.deepEqual(fila, { marcada: false, ya: true });
  await page.click("#iGuardar");
  await A.aviso(page, "movimiento importado");
  assert.equal((await A.guardados(page)).movs.filter((m) => m.fracc).length, 2);
});

// Escenario: resumen sin fraccionadas
t.test("resumen sin fraccionadas", async () => {
  const { page } = await abrir({ datos: fraccDatos() });
  await importar(page, await resumen(page, [], [{ fecha: "2026-10-05", desc: "PAGO MOVIL COMERCIO UNO", importe: 10 }]));
  assert.equal(await page.isVisible("#iFracc"), false);
});

// Escenario: deuda del resumen con lo pendiente
t.test("deuda del resumen con lo pendiente", async () => {
  const { page } = await abrir({ datos: fraccDatos() });
  const fr = [{ ...FRACC[0], pendiente: 102.88 }, { ...FRACC[1], pendiente: 200 }];
  await importar(page, await resumen(page, fr, [{ fecha: "2026-10-05", desc: "PAGO MOVIL COMERCIO UNO", importe: 767.47 }]));
  await page.click("#iGuardar");
  await A.aviso(page, "movimientos importados");
  assert.equal(await A.texto(page, "#icExtLbl"), "Deuda del resumen");
  assert.equal(await A.texto(page, "#icExt"), "1070,35 €");
  assert.equal(await A.texto(page, "#icDet"), "a pagar 767,47 € + pendiente en cuotas 302,88 €");
  assert.equal(await A.texto(page, "#icDif"), "0 €");
});

// Escenario: resumen sin fraccionadas al conciliar
t.test("resumen sin fraccionadas al conciliar", async () => {
  const { page } = await abrir({ datos: fraccDatos() });
  await importar(page, await resumen(page, [], [{ fecha: "2026-10-05", desc: "PAGO MOVIL COMERCIO UNO", importe: 500 }]));
  await page.click("#iGuardar");
  await A.aviso(page, "movimiento importado");
  assert.equal(await A.texto(page, "#icExtLbl"), "Deuda del resumen");
  assert.equal(await A.texto(page, "#icExt"), "500 €");
  assert.equal(await page.isVisible("#icDetBox"), false);
});

// --- intereses del resumen de tarjeta
const SANTANDER = { ...A.cta(3, "Santander", 1000, { desde: "2026-09-01" }) };
const interesesDatos = () => A.v2({ cuentas: [BANCO, TARJETA_Y, SANTANDER] });
const INT = [
  { fecha: "2026-10-29", comercio: "ADESLAS DENTAL", importe: 0.15 },
  { fecha: "2026-10-29", comercio: "EL CORTE INGLES", importe: 1.7 },
  { fecha: "2026-10-29", comercio: "ITA SPA5542098383765", importe: 1.95 }];
const verIntereses = (page) => page.evaluate(() => imp.d.filter((x) => /intereses/i.test(x.nota)).map((x) => [x.nota.replace(/\s+/g, " "), x.s, x.que.slice(0, 2)]));

// Escenario: cada interés con su importe
t.test("cada interés con su importe", async () => {
  const { page } = await abrir({ datos: interesesDatos() });
  await importar(page, await resumen(page, [], [{ fecha: "2026-10-05", desc: "PAGO MOVIL COMERCIO UNO", importe: 10 }], { intereses: INT }));
  const r = await verIntereses(page);
  assert.deepEqual(r.map((x) => x[1]), [-0.15, -1.7, -1.95]);
  assert.deepEqual(r.map((x) => x[2]), ["g|", "g|", "g|"]);
});

// Escenario: interés con la fila partida en dos líneas
t.test("interés con la fila partida en dos líneas", async () => {
  const { page } = await abrir({ datos: interesesDatos() });
  const partidos = INT.map((i) => ({ ...i, partido: i.importe === 1.7 }));
  await importar(page, await resumen(page, [], [{ fecha: "2026-10-05", desc: "PAGO MOVIL COMERCIO UNO", importe: 10 }], { intereses: partidos }));
  const r = await verIntereses(page);
  assert.equal(r.length, 3);
  assert.deepEqual(r.find((x) => /corte/i.test(x[0])).slice(1), [-1.7, "g|"]);
});

// Escenario: el pie de página no es parte del interés
t.test("el pie de página no es parte del interés", async () => {
  const { page } = await abrir({ datos: interesesDatos() });
  await importar(page, await resumen(page, [], [{ fecha: "2026-10-05", desc: "PAGO MOVIL COMERCIO UNO", importe: 10 }], { intereses: INT }));
  const r = await verIntereses(page);
  const ultimo = r.find((x) => x[1] === -1.95);
  assert.equal(/santander/i.test(ultimo[0]), false);
  assert.equal(ultimo[2], "g|");
});

// --- empezar la cuenta con el saldo anterior del resumen
const sinMovs = () => A.v2({ cuentas: [BANCO, { ...TARJETA_Y, saldoInicial: 0, desde: "2026-09-01" }] });
const resumenSA = (page) => X.santanderTarjeta(page, { ref: "5566", anterior: 742.94, pagos: [{ fecha: "2026-10-02", importe: 742.94 }], compras: [{ fecha: "2026-10-05", desc: "PAGO MOVIL COMERCIO UNO", importe: 100 }], desde: "2026-09-29", hasta: "2026-10-29" });

// Escenario: ofrecer empezar con el saldo anterior
t.test("ofrecer empezar con el saldo anterior", async () => {
  const { page } = await abrir({ datos: sinMovs() });
  await importar(page, await resumenSA(page));
  assert.equal(await page.isVisible("#iInicio"), true);
  assert.equal(await page.isChecked("#iInicioOn"), true);
  assert.match(await A.texto(page, "#iInicio"), /Empezar esta cuenta con el saldo anterior del resumen/);
  assert.match(await A.texto(page, "#iInicioSub"), /742,94 € el 29\/09/);
});

// Escenario: guardar empezando con el saldo anterior
t.test("guardar empezando con el saldo anterior", async () => {
  const { page } = await abrir({ datos: sinMovs() });
  await importar(page, await resumenSA(page));
  await page.click("#iGuardar");
  await A.aviso(page, "movimientos importados");
  const c = (await A.guardados(page)).cuentas.find((x) => x.id === 2);
  assert.deepEqual([c.saldoInicial, c.desde], [742.94, "2026-09-29"]);
  assert.equal(await A.texto(page, "#icExt"), "100 €");
  assert.equal(await A.texto(page, "#icDif"), "0 €");
});

// Escenario: no empezar con el saldo anterior
t.test("no empezar con el saldo anterior", async () => {
  const { page } = await abrir({ datos: sinMovs() });
  await importar(page, await resumenSA(page));
  await page.uncheck("#iInicioOn");
  await page.click("#iGuardar");
  await A.aviso(page, "movimientos importados");
  const c = (await A.guardados(page)).cuentas.find((x) => x.id === 2);
  assert.deepEqual([c.saldoInicial, c.desde], [0, "2026-09-01"]);
});

// Escenario: una cuenta con movimientos no lo ofrece
t.test("una cuenta con movimientos no lo ofrece", async () => {
  const datos = A.v2({ cuentas: [BANCO, { ...TARJETA_Y, saldoInicial: 0, desde: "2026-09-01" }], movs: [A.gasto(1, "2026-09-10", 10, 2)] });
  const { page } = await abrir({ datos });
  await importar(page, await resumenSA(page));
  assert.equal(await page.isVisible("#iInicio"), false);
});

// Escenario: un resumen sin saldo anterior no lo ofrece
t.test("un resumen sin saldo anterior no lo ofrece", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await importar(page, await X.santanderCuenta(page, { ref: "4321", inicial: 1000, movs: [{ fecha: "2026-10-05", desc: "Comercio Uno", importe: -10 }] }));
  assert.equal(await page.isVisible("#iInicio"), false);
});
