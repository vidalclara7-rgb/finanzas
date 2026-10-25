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
