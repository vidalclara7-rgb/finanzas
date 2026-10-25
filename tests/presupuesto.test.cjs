// Capacidad: presupuesto
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const TARJETA = A.cta(1, "Tarjeta", 0, { tipo: "tarjeta", tope: 500 });
const REVOLUT = A.cta(2, "Revolut", 1000, { tope: 300 });
const disp = (page, id, sel) => A.texto(page, `[data-disp="${id}"] ${sel}`);

// Escenario: disponible con un reembolsable
t.test("disponible con un reembolsable", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [TARJETA], movs: [A.gasto(1, "2026-10-03", 64.3, 1), A.gasto(2, "2026-10-04", 42, 1, "Trabajo (reembolsable)"), A.ingreso(3, "2026-10-05", 100, 1, "Reembolso")] }) });
  assert.equal(await disp(page, 1, ".big"), "435,7 €");
  assert.equal(await disp(page, 1, ".sub"), "Gastado 64,3 € de 500 €");
});

// Escenario: tope superado
t.test("tope superado", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [REVOLUT], movs: [A.gasto(1, "2026-10-03", 320, 2, "Ocio")] }) });
  assert.equal(await disp(page, 2, ".big"), "-20 €");
  assert.match(await page.getAttribute('[data-disp="2"] .ring', "class"), /\bbad\b/);
});

// Escenario: tope en aviso
t.test("tope en aviso", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [TARJETA], movs: [A.gasto(1, "2026-10-03", 400, 1, "Compras")] }) });
  assert.equal(await disp(page, 1, ".ring b"), "80 %");
  assert.match(await page.getAttribute('[data-disp="1"] .ring', "class"), /\bwarn\b/);
});

// Escenario: cuenta sin tope
t.test("cuenta sin tope", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [A.cta(3, "Banco A", 1000), TARJETA] }) });
  const nombres = await page.locator("#disponibles [data-disp] .lbl").allInnerTexts();
  assert.deepEqual(nombres, ["Tarjeta"]);
});

// Escenario: app sin configurar
t.test("app sin configurar", async () => {
  const { page } = await abrir();
  assert.ok(await page.isVisible("#setupCard"));
  await page.click("#crearPrimera");
  assert.equal(await A.texto(page, "#title"), "Mis cuentas");
  assert.equal(await A.texto(page, "#cTitulo"), "Nueva cuenta");
  assert.ok(await page.isVisible("#sheetC"));
});

// Escenario: app configurada
t.test("app configurada", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [A.cta(3, "Banco A", 1000)] }) });
  assert.equal(await page.isVisible("#setupCard"), false);
});
