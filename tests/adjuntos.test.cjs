// Capacidad: adjuntos
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");
const X = require("./extractos.cjs");
const F = require("./archivos.cjs");

const abrir = A.preparar(t);
const BANCO = { ...A.cta(1, "Banco A", 1000, { desde: "2026-10-01" }), ref: "4321" };
const FOTO = { name: "recibo.jpg", mimeType: "image/jpeg", buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46, 0x49, 0x46]) };
const lista = (page) => page.locator("#cAdjLista .adj .d").allInnerTexts();
async function hojaCuenta(page) {
  await A.ir(page, "cuentas");
  await page.click('[data-cta="1"]');
  await page.waitForFunction(() => document.querySelector("#cAdjLista").children.length > 0);
}
async function adjuntar(page, archivo) {
  const n = await page.locator("#cAdjLista .adj").count();
  await page.setInputFiles("#adjIn", archivo);
  await page.waitForFunction((k) => document.querySelectorAll("#cAdjLista .adj").length > k, n);
}

// Escenario: extracto importado queda en la cuenta
t.test("extracto importado queda en la cuenta", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await A.ir(page, "movs");
  const buf = await X.santanderCuenta(page, { ref: "4321", inicial: 1000, movs: [{ fecha: "2026-10-05", desc: "Comercio Uno", importe: -10 }] });
  await page.setInputFiles("#pdfIn", { name: "extracto-octubre.pdf", mimeType: "application/pdf", buffer: buf });
  await page.waitForFunction(() => !document.getElementById("sheetI").hidden, null, { timeout: 20000 });
  await page.click("#iGuardar");
  await A.aviso(page, "1 movimiento importado");
  await page.click("#icNo");
  await hojaCuenta(page);
  assert.deepEqual((await lista(page)).map((x) => x.replace(/\s+/g, " ").trim()), ["extracto-octubre.pdf octubre 2026 · PDF"]);
});

// Escenario: adjuntar una foto
t.test("adjuntar una foto", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await hojaCuenta(page);
  assert.match(await A.texto(page, "#cAdjLista"), /Todavía no hay adjuntos/);
  await adjuntar(page, FOTO);
  await A.aviso(page, "Archivo adjuntado");
  assert.deepEqual((await lista(page)).map((x) => x.replace(/\s+/g, " ").trim()), ["recibo.jpg octubre 2026 · Foto"]);
});

const SEPT = [["Fecha", "Concepto", "Importe"], [{ f: "2026-09-03" }, "Tienda Uno", "−10,00"], [{ f: "2026-09-10" }, "Tienda Dos", "−20,00"], [{ f: "2026-09-24" }, "Tienda Tres", "−30,00"]];
const MOVS_XLSX = () => F.XLSX(F.xlsx(SEPT), "septiembre.xlsx");
async function conPregunta(page) {
  await hojaCuenta(page);
  await page.setInputFiles("#adjIn", MOVS_XLSX());
  await page.waitForSelector("#sheetAdjQ:not([hidden])", { timeout: 20000 });
}

// Escenario: adjuntar un archivo de cualquier tipo
t.test("adjuntar un archivo de cualquier tipo", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await hojaCuenta(page);
  await adjuntar(page, { name: "contrato.docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", buffer: Buffer.from("PK contrato de ejemplo") });
  assert.deepEqual((await lista(page)).map((x) => x.replace(/\s+/g, " ").trim()), ["contrato.docx octubre 2026 · Archivo"]);
  assert.equal(await page.isVisible("#sheetAdjQ"), false);
  const [abierto] = await Promise.all([Promise.race([page.waitForEvent("popup"), page.waitForEvent("download")]), page.click("#cAdjLista [data-abrir]")]);
  assert.ok(abierto);
});

// Escenario: un solo botón
t.test("un solo botón", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await A.ir(page, "cuentas");
  await page.click('[data-cta="1"]');
  assert.equal(await page.isVisible("#cAdjuntar"), true);
  assert.equal(await A.texto(page, "#cAdjuntar"), "Adjuntar archivo");
  assert.equal(await page.locator("#cAdj button.btn").count(), 1);
  assert.equal(await page.locator("#cImportar").count(), 0);
  assert.equal((await A.texto(page, "#cAdj")).includes("Importar extracto"), false);
});

// Escenario: archivo con movimientos
t.test("archivo con movimientos", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await conPregunta(page);
  assert.equal(await A.texto(page, "#aqTxt"), "Encontré 3 movimientos. ¿Querés revisarlos?");
  await page.click("#aqNo");
  assert.deepEqual((await lista(page)).map((x) => x.replace(/\s+/g, " ").trim()), ["septiembre.xlsx octubre 2026 · Excel"]);
});

// Escenario: revisar y guardar los movimientos
t.test("revisar y guardar los movimientos", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await conPregunta(page);
  await page.click("#aqRevisar");
  await page.waitForSelector("#sheetI:not([hidden])");
  assert.equal(await A.texto(page, "#iRevisa"), "Revisá 3 movimientos");
  await page.click("#iGuardar");
  await A.aviso(page, "3 movimientos importados");
  assert.deepEqual((await A.guardados(page)).movs.map((m) => m.cuenta), [1, 1, 1]);
  await page.click("#icNo");
  await hojaCuenta(page);
  await page.waitForFunction(() => document.querySelector("#cAdjLista").textContent.includes("septiembre 2026"));
  assert.deepEqual((await lista(page)).map((x) => x.replace(/\s+/g, " ").trim()), ["septiembre.xlsx septiembre 2026 · Excel"]);
});

// Escenario: no revisar ahora
t.test("no revisar ahora", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await conPregunta(page);
  await page.click("#aqNo");
  assert.equal(await page.isVisible("#sheetC"), true);
  assert.deepEqual((await A.guardados(page)).movs, []);
  assert.equal((await lista(page)).length, 1);
});

// Escenario: archivo vacío
t.test("archivo vacío", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await A.ir(page, "cuentas");
  await page.click('[data-cta="1"]');
  await page.setInputFiles("#adjIn", { name: "vacio.txt", mimeType: "text/plain", buffer: Buffer.alloc(0) });
  await A.aviso(page, "El archivo está vacío.");
  assert.match(await A.texto(page, "#cAdjLista"), /Todavía no hay adjuntos/);
});

// Escenario: borrar un adjunto
t.test("borrar un adjunto", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await hojaCuenta(page);
  await adjuntar(page, FOTO);
  await page.click("#cAdjLista [data-adj-x]");
  await page.click('#cAdjLista [data-ui="borrar-adjunto"]');
  await A.aviso(page, "Adjunto borrado");
  assert.match(await A.texto(page, "#cAdjLista"), /Todavía no hay adjuntos/);
});

// Escenario: aviso en Ajustes
t.test("aviso en Ajustes", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await A.ir(page, "ajustes");
  assert.equal(await page.isVisible("#avisoAdj"), false);
  await hojaCuenta(page);
  await adjuntar(page, FOTO);
  await adjuntar(page, { ...FOTO, name: "ticket.jpg" });
  await page.click("#cCerrar");
  await A.ir(page, "ajustes");
  await page.waitForFunction(() => !document.getElementById("avisoAdj").hidden);
  assert.equal(await A.texto(page, "#avisoAdj"), "Tus 2 adjuntos no entran en la copia: guardalos aparte si los necesitás.");
});

// --- documentos de gastos
const PDF = { name: "factura.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\n%%EOF") };
const G = [A.gasto(1, "2026-10-03", 64.3, 1), A.gasto(2, "2026-10-08", 42, 1, "Salud"), A.gasto(3, "2026-10-05", 18, 1, "Ocio")];
const docs = (page) => page.evaluate(() => new Promise((ok) => {
  const q = indexedDB.open("finanzas-adjuntos", 1);
  q.onsuccess = () => { const r = q.result.transaction("archivos").objectStore("archivos").getAll(); r.onsuccess = () => ok(r.result.map((a) => ({ nombre: a.nombre, cuenta: a.cuenta, movs: a.movs }))); };
}));
async function seleccionar(page, ids) {
  await A.ir(page, "movs");
  await page.click("#selBtn");
  for (const id of ids) await page.click(`[data-mov="${id}"] [data-sel]`);
}
async function adjuntarGastos(page, ids, archivo = PDF) {
  await seleccionar(page, ids);
  await page.setInputFiles("#docIn", archivo);
}
const clip = (page, id) => page.locator(`[data-mov="${id}"] [data-ui="chip-documento"]`).count();

// Escenario: un documento para dos gastos
t.test("un documento para dos gastos", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: G }) });
  await adjuntarGastos(page, [1, 2]);
  await A.aviso(page, "Documento adjuntado a 2 gastos");
  assert.equal(await clip(page, 1), 1);
  assert.equal(await clip(page, 2), 1);
  assert.equal(await clip(page, 3), 0);
  await page.click('[data-mov="2"] .linea');
  await A.hojaLista(page);
  assert.match(await A.texto(page, "#mDocsLista"), /factura\.pdf/);
  assert.deepEqual((await docs(page)).map((d) => [d.nombre, d.cuenta, d.movs.sort()]), [["factura.pdf", null, [1, 2]]]);
});

// Escenario: sin gastos marcados
t.test("sin gastos marcados", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: G }) });
  await A.ir(page, "movs");
  await page.click("#selBtn");
  assert.equal(await page.isDisabled("#selAdj"), true);
  await page.click('[data-mov="1"] [data-sel]');
  assert.equal(await page.isDisabled("#selAdj"), false);
});

// Escenario: documento de cualquier tipo
t.test("documento de cualquier tipo", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: G }) });
  await adjuntarGastos(page, [1], F.XLSX(F.xlsx([["Concepto", "Importe"], ["Material", "10,00"]]), "presupuesto.xlsx"));
  await A.aviso(page, "Documento adjuntado a 1 gasto");
  await page.click('[data-mov="1"] .linea');
  await A.hojaLista(page);
  assert.match(await A.texto(page, "#mDocsLista"), /presupuesto\.xlsx/);
  assert.deepEqual((await docs(page)).map((d) => d.nombre), ["presupuesto.xlsx"]);
});

// Escenario: documento vacío
t.test("documento vacío", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: G }) });
  await adjuntarGastos(page, [1], { name: "vacio.txt", mimeType: "text/plain", buffer: Buffer.alloc(0) });
  await A.aviso(page, "El archivo está vacío.");
  assert.deepEqual(await docs(page), []);
});

// Escenario: quitar un documento de un gasto
t.test("quitar un documento de un gasto", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: G }) });
  await adjuntarGastos(page, [1, 2]);
  await A.aviso(page, "Documento adjuntado a 2 gastos");
  await page.click('[data-mov="1"] .linea');
  await A.hojaLista(page);
  await page.click("#mDocsLista [data-doc-x]");
  await page.click("#mDocsLista [data-doc-del]");
  await A.aviso(page, "Documento quitado");
  assert.equal(await page.isVisible("#mDocs"), false);
  assert.deepEqual((await docs(page)).map((d) => d.movs), [[2]]);
  await page.click("#cerrar");
  assert.equal(await clip(page, 1), 0);
  assert.equal(await clip(page, 2), 1);
});

// Escenario: borrar el último gasto de un documento
t.test("borrar el último gasto de un documento", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: G }) });
  await adjuntarGastos(page, [1]);
  await A.aviso(page, "Documento adjuntado a 1 gasto");
  await page.click('[data-mov="1"] .linea');
  await page.click("#mBorrar");
  assert.equal(await A.texto(page, "#mBorrar"), "Tocá de nuevo: se borra también su documento");
  await page.click("#mBorrar");
  await A.aviso(page, "Movimiento borrado");
  await page.waitForFunction(() => true);
  await page.waitForTimeout(300);
  assert.deepEqual(await docs(page), []);
});

// Escenario: borrar un gasto con documento compartido
t.test("borrar un gasto con documento compartido", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: G }) });
  await adjuntarGastos(page, [1, 2]);
  await A.aviso(page, "Documento adjuntado a 2 gastos");
  await page.click('[data-mov="1"] .linea');
  await page.click("#mBorrar");
  assert.equal(await A.texto(page, "#mBorrar"), "Tocá de nuevo para borrar");
  await page.click("#mBorrar");
  await A.aviso(page, "Movimiento borrado");
  await page.waitForTimeout(300);
  assert.deepEqual((await docs(page)).map((d) => d.movs), [[2]]);
  assert.equal(await clip(page, 2), 1);
});
