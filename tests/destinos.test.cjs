// Capacidades: importacion (cuentas nuevas y destinos recordados) y datos (destinos aprendidos)
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");
const X = require("./extractos.cjs");

const abrir = A.preparar(t);
const BANCO = { ...A.cta(1, "Banco A", 1000, { desde: "2026-10-01" }), ref: "4321" };
const BROKER = A.cta(3, "Broker X", 0, { tipo: "inversion", desde: "2026-10-01" });
const DEPOSITO = A.cta(4, "Depósito", 0, { tipo: "compartida", desde: "2026-10-01" });
const mov = (fecha, desc, importe) => ({ fecha, desc, importe });
async function importar(page, movs) {
  await A.ir(page, "movs");
  const buf = await X.santanderCuenta(page, { ref: "4321", inicial: 1000, movs });
  await page.setInputFiles("#pdfIn", { name: "extracto.pdf", mimeType: "application/pdf", buffer: buf });
  await page.waitForFunction(() => !document.getElementById("sheetI").hidden, null, { timeout: 20000 });
}
const que = (page, nota) => page.evaluate((n) => { const x = imp.d.find((d) => d.nota === n); return document.querySelector(`[data-que="${x.i}"]`).value; }, nota);
const etiqueta = (page, nota) => page.evaluate((n) => { const x = imp.d.find((d) => d.nota === n), s = document.querySelector(`[data-que="${x.i}"]`); return s.options[s.selectedIndex].textContent; }, nota);
const elegir = (page, nota, valor) => page.evaluate((n) => imp.d.find((d) => d.nota === n).i, nota).then((i) => page.selectOption(`[data-que="${i}"]`, valor));
async function nuevaCuenta(page, nota, { tipo, nombre }) {
  await elegir(page, nota, "n|cuenta");
  await page.waitForSelector("#sheetC", { state: "visible" });
  await A.enfocado(page, "cNombre");
  if (tipo) await page.click(`#segTipo button[data-v="${tipo}"]`);
  if (nombre !== undefined) await page.fill("#cNombre", nombre);
  await page.click('#sheetC button[type="submit"]');
}
async function guardarImportacion(page) { await page.click("#iGuardar"); await page.waitForFunction(() => !document.getElementById("sheetIC").hidden); }
const saldo = (page, id) => A.texto(page, `[data-cta="${id}"] .v .num`);
async function restaurar(page, texto) {
  await A.ir(page, "ajustes");
  await page.fill("#backupIn", texto);
  await page.click("#restaurar");
  await page.click("#restaurar");
}
const TRASPASO = [mov("2026-10-05", "Traspaso Fondo", -200), mov("2026-10-08", "Consum", -30)];

// Escenario: mandar plata a una inversión que no existía
t.test("mandar plata a una inversión que no existía", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await importar(page, TRASPASO);
  assert.equal(await que(page, "Traspaso Fondo"), "g|Otros");
  const antes = await que(page, "Consum");
  await nuevaCuenta(page, "Traspaso Fondo", { tipo: "inversion", nombre: "Broker X" });
  assert.ok(await page.isVisible("#sheetI"), "vuelve a la revisión");
  assert.equal(await etiqueta(page, "Traspaso Fondo"), "Transferencia a Broker X");
  assert.equal(await que(page, "Consum"), antes);
  await guardarImportacion(page);
  await page.click("#icNo");
  await A.ir(page, "cuentas");
  assert.equal(await saldo(page, 1), "770 €");
  const id = (await A.guardados(page)).cuentas.find((c) => c.nombre === "Broker X").id;
  assert.equal(await saldo(page, id), "200 €");
});

// Escenario: cobro que llega de una cuenta nueva
t.test("cobro que llega de una cuenta nueva", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await importar(page, [mov("2026-10-06", "Ingreso Fondo", 150)]);
  assert.equal(await que(page, "Ingreso Fondo"), "i|Otros");
  await nuevaCuenta(page, "Ingreso Fondo", { tipo: "inversion", nombre: "Broker X" });
  assert.equal(await etiqueta(page, "Ingreso Fondo"), "Transferencia desde Broker X");
});

// Escenario: cerrar sin guardar
t.test("cerrar sin guardar", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await importar(page, TRASPASO);
  await elegir(page, "Traspaso Fondo", "n|cuenta");
  await A.enfocado(page, "cNombre");
  await page.click("#cCerrar");
  assert.ok(await page.isVisible("#sheetI"));
  assert.equal(await que(page, "Traspaso Fondo"), "g|Otros");
  assert.equal((await A.guardados(page)).cuentas.length, 1);
});

// Escenario: cuenta sin nombre
t.test("cuenta sin nombre", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await importar(page, TRASPASO);
  await nuevaCuenta(page, "Traspaso Fondo", { nombre: "" });
  await A.aviso(page, "Ponele un nombre a la cuenta");
  assert.ok(await page.isVisible("#sheetC"));
});

// Escenario: la app recuerda el destino
t.test("la app recuerda el destino", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, BROKER] }) });
  await importar(page, TRASPASO);
  assert.equal(await que(page, "Traspaso Fondo"), "g|Otros");
  await elegir(page, "Traspaso Fondo", "t|3");
  await guardarImportacion(page);
  assert.equal((await A.guardados(page)).reglas["t|traspaso fondo"], 3);
  await page.click("#icNo");
  await importar(page, [mov("2026-10-12", "Traspaso Fondo", -75)]);
  assert.equal(await que(page, "Traspaso Fondo"), "t|3");
  assert.equal(await etiqueta(page, "Traspaso Fondo"), "Transferencia a Broker X");
});

// Escenario: elegir otra cosa lo olvida
t.test("elegir otra cosa lo olvida", async () => {
  const datos = A.v2({ cuentas: [BANCO, BROKER], reglas: { "t|traspaso fondo": 3 } });
  const { page } = await abrir({ datos });
  await importar(page, TRASPASO);
  assert.equal(await que(page, "Traspaso Fondo"), "t|3");
  await elegir(page, "Traspaso Fondo", "g|Otros");
  await guardarImportacion(page);
  const r = (await A.guardados(page)).reglas;
  assert.equal(r["t|traspaso fondo"], undefined);
  assert.equal(r["g|traspaso fondo"], "Otros");
  await page.click("#icNo");
  await importar(page, [mov("2026-10-12", "Traspaso Fondo", -75)]);
  assert.equal(await que(page, "Traspaso Fondo"), "g|Otros");
});

// Escenario: la cuenta recordada ya no existe
t.test("la cuenta recordada ya no existe", async () => {
  const { page, errores } = await abrir({ datos: A.v2({ cuentas: [BANCO], reglas: { "t|traspaso fondo": 99 } }) });
  await importar(page, TRASPASO);
  assert.equal(await que(page, "Traspaso Fondo"), "g|Otros");
  assert.deepEqual(errores, []);
});

// Escenario: el destino es la misma cuenta
t.test("el destino es la misma cuenta", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, BROKER], reglas: { "t|traspaso fondo": 1 } }) });
  await importar(page, TRASPASO);
  assert.equal(await que(page, "Traspaso Fondo"), "g|Otros");
});

// Escenario: garantía como cuenta propia
t.test("garantía como cuenta propia", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, DEPOSITO] }) });
  await importar(page, [mov("2026-10-09", "Garantía", -300)]);
  await elegir(page, "Garantía", "t|4");
  await guardarImportacion(page);
  await page.click("#icNo");
  await A.ir(page, "cuentas");
  assert.equal(await saldo(page, 1), "700 €");
  assert.equal(await saldo(page, 4), "300 €");
  assert.equal(await A.texto(page, "#neto"), "1000 €");
  await A.ir(page, "inicio");
  assert.equal(await A.texto(page, "#gasMes"), "Gastos 0 €");
});

// Pruebas extra: el nombre de la cuenta nueva se escapa y nada se desborda en 390 px
t.test("la cuenta nueva con texto raro y el ancho de la revisión", async () => {
  const sucio = '<b id="inyectado">x</b>';
  for (const apariencia of ["oscura", "clara"]) {
    const { page, errores } = await abrir({ datos: A.v2({ settings: { apariencia }, cuentas: [BANCO] }) });
    await importar(page, TRASPASO);
    await nuevaCuenta(page, "Traspaso Fondo", { tipo: "inversion", nombre: sucio });
    assert.equal(await page.locator("#inyectado").count(), 0);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth) <= 390, apariencia);
    assert.deepEqual(errores, []);
  }
});

// --- datos: destinos aprendidos

// Escenario: datos de la versión anterior
t.test("datos de la versión anterior (destinos)", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], reglas: { "g|bar ejemplo": "Ocio" } }) });
  await importar(page, [mov("2026-10-05", "Bar Ejemplo", -12)]);
  assert.equal(await que(page, "Bar Ejemplo"), "g|Ocio");
});

// Escenario: el destino viaja en la copia
t.test("el destino viaja en la copia", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, BROKER], reglas: { "t|traspaso fondo": 3 } }) });
  await A.ir(page, "ajustes");
  await page.click("#copiarBackup");
  const copia = await A.portapapeles(page);
  const { page: otra } = await abrir();
  await restaurar(otra, copia);
  await A.aviso(otra, "Copia restaurada");
  await importar(otra, TRASPASO);
  assert.equal(await que(otra, "Traspaso Fondo"), "t|3");
});

// Escenario: destino inválido en una copia
t.test("destino inválido en una copia", async () => {
  const { page, errores } = await abrir();
  await restaurar(page, JSON.stringify(A.v2({ cuentas: [BANCO], reglas: { "t|traspaso fondo": "abc" } })));
  await A.aviso(page, "Copia restaurada");
  await importar(page, TRASPASO);
  assert.equal(await que(page, "Traspaso Fondo"), "g|Otros");
  assert.deepEqual(errores, []);
});
