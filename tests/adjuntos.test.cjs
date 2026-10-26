// Capacidad: adjuntos
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");
const X = require("./extractos.cjs");

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

// Escenario: archivo que no se puede guardar
t.test("archivo que no se puede guardar", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: G }) });
  await adjuntarGastos(page, [1], { name: "notas.txt", mimeType: "text/plain", buffer: Buffer.from("hola") });
  await A.aviso(page, "Elegí un PDF o una foto");
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
  await page.click('[data-del="1"]');
  assert.equal(await A.texto(page, '[data-del="1"]'), "Borrar y su documento");
  await page.click('[data-del="1"]');
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
  await page.click('[data-del="1"]');
  assert.equal(await A.texto(page, '[data-del="1"]'), "Borrar");
  await page.click('[data-del="1"]');
  await A.aviso(page, "Movimiento borrado");
  await page.waitForTimeout(300);
  assert.deepEqual((await docs(page)).map((d) => d.movs), [[2]]);
  assert.equal(await clip(page, 2), 1);
});
