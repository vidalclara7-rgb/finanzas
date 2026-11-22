// Capacidades: cuentas (lo que hay que pagar de la tarjeta al cierre, cargar la fecha) y datos (fechas de cierre)
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const NOV = "2026-11-25T12:00:00", NOV15 = "2026-11-15T12:00:00";
const BANCO = A.cta(1, "Banco A", 5000);
const TARJ = (extra = {}) => A.cta(2, "Tarjeta Y", 0, { tipo: "tarjeta", ...extra });
const datos = (cuentas, movs) => A.v2({ cuentas, movs });
const fila = async (page, id) => { const f = page.locator(`#pagarFilas [data-cid="${id}"]`); return { imp: (await f.locator(".num").innerText()).trim(), sub: (await f.locator(".sub").innerText()).trim() }; };
async function hoja(page) { await page.click("#pagarCard"); await page.waitForSelector("#sheetPagar:not([hidden])"); }
const item = (page, id, n) => page.locator(`#pgLista [data-cid="${id}"] .item`).nth(n).locator(".num").innerText();
async function restaurar(page, texto) { await A.ir(page, "ajustes"); await page.fill("#backupIn", texto); await page.click("#restaurar"); await page.click("#restaurar"); }

// Escenario: lo que toca pagar
t.test("lo que toca pagar", async () => {
  const movs = [A.gasto(1, "2026-11-05", 100, 2), { ...A.gasto(2, "2026-11-10", 300, 2), cuotas: { n: 3, cuota: 100 } }, A.gasto(3, "2026-11-22", 50, 2)];
  const { page } = await abrir({ hoy: NOV, datos: datos([BANCO, TARJ({ cierres: { "2026-11": "2026-11-20" } })], movs) });
  assert.deepEqual(await fila(page, 2), { imp: "200 €", sub: "Cerró el 20 nov." });
});

// Escenario: antes del cierre
t.test("antes del cierre", async () => {
  const { page } = await abrir({ hoy: NOV15, datos: datos([TARJ({ cierres: { "2026-11": "2026-11-20" } })], [A.gasto(1, "2026-11-05", 100, 2)]) });
  assert.deepEqual(await fila(page, 2), { imp: "100 €", sub: "Hasta hoy · cierra el 20 nov." });
});

// Escenario: sin fecha de cierre
t.test("sin fecha de cierre", async () => {
  const { page } = await abrir({ hoy: NOV15, datos: datos([TARJ()], [A.gasto(1, "2026-11-05", 100, 2)]) });
  assert.deepEqual(await fila(page, 2), { imp: "100 €", sub: "Sin fecha de cierre" });
});

// Escenario: lo que quedó del resumen anterior
t.test("lo que quedó del resumen anterior", async () => {
  const { page } = await abrir({ hoy: NOV15, datos: datos([TARJ()], [A.gasto(1, "2026-10-10", 80, 2), A.gasto(2, "2026-11-05", 100, 2)]) });
  assert.equal((await fila(page, 2)).imp, "180 €");
});

// Escenario: resumen pagado
t.test("resumen pagado", async () => {
  const { page } = await abrir({ hoy: NOV15, datos: datos([BANCO, TARJ()], [A.gasto(1, "2026-10-10", 80, 2), A.transf(2, "2026-11-05", 80, 1, 2)]) });
  assert.equal((await fila(page, 2)).imp, "0 €");
});

// Escenario: varias tarjetas
t.test("varias tarjetas", async () => {
  const z = A.cta(3, "Tarjeta Z", 0, { tipo: "tarjeta" });
  const { page } = await abrir({ hoy: NOV15, datos: datos([TARJ(), z], [A.gasto(1, "2026-11-05", 100, 2), A.gasto(2, "2026-11-06", 50, 3)]) });
  assert.equal(await A.texto(page, "#pagarTot"), "150 €");
  assert.equal(await page.locator("#pagarFilas .pfila").count(), 2);
});

// Escenario: sin tarjetas de crédito
t.test("sin tarjetas de crédito", async () => {
  const { page } = await abrir({ datos: datos([BANCO], [A.gasto(1, "2026-10-05", 100, 1)]) });
  assert.equal(await page.isHidden("#pagarCard"), true);
});

// Escenario: otro mes en a pagar
t.test("otro mes en a pagar", async () => {
  const { page } = await abrir({ hoy: NOV15, datos: datos([TARJ({ cierres: { "2026-10": "2026-10-18" } })], [A.gasto(1, "2026-10-10", 40, 2)]) });
  await page.click("#mesAnterior");
  assert.deepEqual(await fila(page, 2), { imp: "40 €", sub: "Cerró el 18 oct." });
});

// Escenario: cargar la fecha
t.test("cargar la fecha", async () => {
  const { page } = await abrir({ hoy: NOV15, datos: datos([TARJ()], [A.gasto(1, "2026-11-05", 100, 2), A.gasto(2, "2026-11-25", 50, 2)]) });
  await hoja(page);
  assert.equal(await A.texto(page, "#pgMes"), "noviembre 2026");
  await page.fill('#pgLista input[data-cierre="2"]', "2026-11-20");
  await A.aviso(page, "Fecha de cierre guardada");
  assert.equal(await item(page, 2, 0), "100 €");
  assert.equal(await item(page, 2, 2), "100 €");
  assert.deepEqual((await A.guardados(page)).cuentas.find((c) => c.id === 2).cierres, { "2026-11": "2026-11-20" });
  await page.reload();
  assert.deepEqual(await fila(page, 2), { imp: "100 €", sub: "Hasta hoy · cierra el 20 nov." });
});

// Escenario: el detalle de las cuotas
t.test("el detalle de las cuotas", async () => {
  const { page } = await abrir({ hoy: NOV15, datos: datos([TARJ()], [{ ...A.gasto(1, "2026-11-05", 300, 2), cuotas: { n: 3, cuota: 100 } }]) });
  await hoja(page);
  assert.equal(await item(page, 2, 0), "300 €");
  assert.equal(await item(page, 2, 1), "− 200 €");
  assert.equal(await item(page, 2, 2), "100 €");
});

// Escenario: fecha de otro mes
t.test("fecha de otro mes", async () => {
  const { page } = await abrir({ hoy: NOV15, datos: datos([TARJ()], [A.gasto(1, "2026-11-05", 100, 2)]) });
  await hoja(page);
  await page.fill('#pgLista input[data-cierre="2"]', "2026-12-03");
  await A.aviso(page, "Elegí una fecha de noviembre 2026.");
  assert.equal("cierres" in (await A.guardados(page)).cuentas.find((c) => c.id === 2), false);
  assert.equal(await page.inputValue('#pgLista input[data-cierre="2"]'), "");
});

// Escenario: borrar la fecha
t.test("borrar la fecha", async () => {
  const { page } = await abrir({ hoy: NOV15, datos: datos([TARJ({ cierres: { "2026-11": "2026-11-20" } })], [A.gasto(1, "2026-11-05", 100, 2), A.gasto(2, "2026-11-28", 30, 2)]) });
  await hoja(page);
  await page.fill('#pgLista input[data-cierre="2"]', "");
  await page.waitForFunction(() => !document.querySelector('#pgLista input[data-cierre="2"]').value && document.querySelector('#pgLista [data-cid="2"] .sub').textContent.startsWith("Sin fecha"));
  assert.equal(await item(page, 2, 0), "130 €");
  await page.click("#pgCerrar");
  assert.deepEqual(await fila(page, 2), { imp: "130 €", sub: "Sin fecha de cierre" });
});

// Escenario: cada mes su fecha
t.test("cada mes su fecha", async () => {
  const { page } = await abrir({ hoy: NOV15, datos: datos([TARJ({ cierres: { "2026-10": "2026-10-18" } })], []) });
  await hoja(page);
  assert.equal(await page.inputValue('#pgLista input[data-cierre="2"]'), "");
  assert.match(await A.texto(page, '#pgLista [data-cid="2"] .sub'), /^Sin fecha de cierre/);
  await page.click("#pgAnt");
  assert.equal(await page.inputValue('#pgLista input[data-cierre="2"]'), "2026-10-18");
});

// Escenario: datos de la versión anterior (cierre)
t.test("datos de la versión anterior (cierre)", async () => {
  const { page } = await abrir({ datos: datos([TARJ()], [A.gasto(1, "2026-10-05", 100, 2)]) });
  assert.deepEqual(await fila(page, 2), { imp: "100 €", sub: "Sin fecha de cierre" });
  assert.equal("cierres" in (await A.guardados(page)).cuentas.find((c) => c.id === 2), false);
});

// Escenario: copia de seguridad vieja (cierre)
t.test("copia de seguridad vieja (cierre)", async () => {
  const { page, errores } = await abrir();
  await restaurar(page, JSON.stringify(datos([TARJ()], [A.gasto(1, "2026-10-05", 100, 2)])));
  await A.aviso(page, "Copia restaurada");
  await A.ir(page, "inicio");
  assert.equal((await fila(page, 2)).sub, "Sin fecha de cierre");
  assert.deepEqual(errores, []);
});

// Escenario: fecha de cierre inválida en la copia
t.test("fecha de cierre inválida en la copia", async () => {
  const { page } = await abrir();
  const d = datos([{ ...BANCO, cierres: { "2026-10": "2026-10-10" } }, TARJ({ cierres: { "2026-11": "2026-12-03", "2026-10": "hola", "2026-09": "2026-09-18" } })], []);
  await restaurar(page, JSON.stringify(d));
  await A.aviso(page, "Copia restaurada");
  const cs = (await A.guardados(page)).cuentas;
  assert.deepEqual(cs.find((c) => c.id === 2).cierres, { "2026-09": "2026-09-18" });
  assert.equal("cierres" in cs.find((c) => c.id === 1), false);
});

// Escenario: la fecha de cierre viaja en la copia
t.test("la fecha de cierre viaja en la copia", async () => {
  const { page } = await abrir({ hoy: NOV15, datos: datos([TARJ({ cierres: { "2026-11": "2026-11-20" } })], []) });
  await A.ir(page, "ajustes");
  await page.click("#copiarBackup");
  const copia = await A.portapapeles(page);
  const { page: otra } = await abrir({ hoy: NOV15 });
  await restaurar(otra, copia);
  await A.aviso(otra, "Copia restaurada");
  assert.deepEqual((await A.guardados(otra)).cuentas.find((c) => c.id === 2).cierres, { "2026-11": "2026-11-20" });
});
