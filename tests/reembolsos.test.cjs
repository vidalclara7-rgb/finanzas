// Capacidad: reembolsos
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 1000, { desde: "2026-09-01" });
const R = "Trabajo (reembolsable)";
const reemb = (id, fecha, importe, estado, nota = "", extra = {}) => ({ ...A.gasto(id, fecha, importe, 1, R, nota), reembolso: { estado, ...extra } });
const estadoDe = (page, id) => A.texto(page, `[data-mov="${id}"] [data-estado-r]`);

// Escenario: nuevo gasto reembolsable
t.test("nuevo gasto reembolsable", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await A.nuevoGasto(page, { importe: 12.4, cuenta: "Banco A", cat: R, nota: "parking" });
  await A.aviso(page, "Gasto guardado");
  await A.ir(page, "movs");
  const id = (await A.guardados(page)).movs[0].id;
  assert.equal(await estadoDe(page, id), "Pendiente");
});

// Escenario: aprobar un reembolso
t.test("aprobar un reembolso", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [reemb(5, "2026-10-12", 12.4, "pendiente", "parking")] }) });
  await A.ir(page, "movs");
  await page.click('[data-mov="5"] .linea');
  await page.click('#segReembM button[data-v="aprobado"]');
  await page.click("#mGuardar");
  await A.aviso(page, "Gasto guardado");
  assert.equal(await estadoDe(page, 5), "Aprobado");
});

// Escenario: deja de ser reembolsable
t.test("deja de ser reembolsable", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [reemb(5, "2026-10-12", 12.4, "pendiente", "parking")] }) });
  await A.ir(page, "movs");
  await page.click('[data-mov="5"] .linea');
  await A.elegir(page, "segCat", "Comida fuera");
  await page.click("#mGuardar");
  await A.aviso(page, "Gasto guardado");
  assert.equal(await page.locator('[data-mov="5"] [data-estado-r]').count(), 0);
  assert.equal((await A.guardados(page)).movs[0].reembolso, undefined);
});

// Escenario: gastos por cobrar
t.test("gastos por cobrar", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [reemb(1, "2026-10-12", 12.4, "pendiente"), reemb(2, "2026-10-08", 15, "pendiente"), reemb(3, "2026-10-05", 7, "aprobado")] }) });
  assert.equal(await A.texto(page, "#cobrarVal"), "34,4 €");
  assert.equal(await A.texto(page, "#cobrarSub"), "2 pendientes · 1 aprobado");
});

// Escenario: nada por cobrar
t.test("nada por cobrar", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [reemb(1, "2026-10-12", 12.4, "pagado")] }) });
  assert.equal(await page.isVisible("#porCobrar"), false);
});

// Escenario: transferencia que cubre dos gastos
t.test("transferencia que cubre dos gastos", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [reemb(1, "2026-10-12", 12.4, "pendiente", "parking"), reemb(2, "2026-10-05", 4.6, "pendiente", "taxi")] }) });
  await page.click("#fab");
  await page.click('#segMov button[data-v="ingreso"]');
  await page.fill("#mImporte", "17");
  await A.elegir(page, "segCat", "Reembolso");
  await page.check('[data-cubre="1"]');
  await page.check('[data-cubre="2"]');
  assert.equal(await A.texto(page, "#mMarcados"), "Marcados 17 €");
  await page.click("#mGuardar");
  await A.aviso(page, "Ingreso guardado");
  await A.ir(page, "movs");
  assert.equal(await estadoDe(page, 1), "Pagado");
  assert.equal(await estadoDe(page, 2), "Pagado");
  await A.ir(page, "inicio");
  assert.equal(await page.isVisible("#porCobrar"), false);
});

// Escenario: el importe no coincide
t.test("el importe no coincide", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [reemb(1, "2026-10-12", 12.4, "pendiente", "parking")] }) });
  await page.click("#fab");
  await page.click('#segMov button[data-v="ingreso"]');
  await page.fill("#mImporte", "13");
  await A.elegir(page, "segCat", "Reembolso");
  await page.check('[data-cubre="1"]');
  await page.click("#mGuardar");
  await A.aviso(page, "El ingreso es 0,6 € más que los gastos marcados");
  const d = await A.guardados(page);
  assert.equal(d.movs.length, 2);
  assert.equal(d.movs.find((m) => m.id === 1).reembolso.estado, "pagado");
});

// Escenario: borrar el ingreso que pagó
t.test("borrar el ingreso que pagó", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [reemb(1, "2026-10-12", 12.4, "pagado", "parking", { cobro: 9 }), A.ingreso(9, "2026-10-14", 12.4, 1, "Reembolso")] }) });
  await A.ir(page, "movs");
  await page.click('[data-mov="9"] .linea');
  await page.click("#mBorrar");
  await page.click("#mBorrar");
  await A.aviso(page, "Movimiento borrado");
  assert.equal(await estadoDe(page, 1), "Aprobado");
});

// Escenario: ver los pendientes
t.test("ver los pendientes", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [reemb(1, "2026-10-12", 12.4, "pendiente"), reemb(2, "2026-09-28", 15, "pendiente"), reemb(3, "2026-10-05", 7, "pagado")] }) });
  await A.ir(page, "movs");
  await page.click('#segReemb button[data-v="pendiente"]');
  assert.equal(await A.texto(page, '#segReemb button[data-v="pendiente"]'), "Pendiente 2");
  const ids = await page.locator("#movs .mov").evaluateAll((els) => els.map((e) => e.dataset.mov));
  assert.deepEqual(ids, ["1", "2"]);
  assert.equal(await A.texto(page, "#filtroSuma"), "Suma 27,4 €");
});

// Escenario: quitar el filtro
t.test("quitar el filtro", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [reemb(1, "2026-10-12", 12.4, "pendiente"), reemb(2, "2026-09-28", 15, "pendiente"), A.gasto(4, "2026-10-03", 20, 1)] }) });
  await A.ir(page, "movs");
  await page.click('#segReemb button[data-v="pendiente"]');
  await page.click('#segReemb button[data-v="pendiente"]');
  const ids = await page.locator("#movs .mov").evaluateAll((els) => els.map((e) => e.dataset.mov));
  assert.deepEqual(ids, ["1", "4"]);
  assert.equal(await page.isVisible("#sumaFiltro"), false);
});
