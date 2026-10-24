// Capacidad: presupuesto
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);

// Escenario: disponible con un reembolsable
t.test("disponible con un reembolsable", async () => {
  const { page } = await abrir({ datos: A.con({ gastos: [
    { id: 1, fecha: "2026-10-03", importe: 64.3, cuenta: "tarjeta", cat: "Súper", nota: "" },
    { id: 2, fecha: "2026-10-04", importe: 42, cuenta: "tarjeta", cat: "Trabajo (reembolsable)", nota: "" }] }) });
  assert.equal(await A.texto(page, "#dispTarjeta"), "435,7 €");
  assert.equal(await A.texto(page, "#subTarjeta"), "Gastado 64,3 € de 500 €");
});

// Escenario: tope superado
t.test("tope superado", async () => {
  const { page } = await abrir({ datos: A.con({ gastos: [{ id: 1, fecha: "2026-10-03", importe: 320, cuenta: "revolut", cat: "Ocio", nota: "" }] }) });
  assert.equal(await A.texto(page, "#dispRevolut"), "-20 €");
  assert.match(await page.getAttribute("#ringRevolut", "class"), /\bbad\b/);
});

// Escenario: tope en aviso
t.test("tope en aviso", async () => {
  const { page } = await abrir({ datos: A.con({ gastos: [{ id: 1, fecha: "2026-10-03", importe: 400, cuenta: "tarjeta", cat: "Compras", nota: "" }] }) });
  assert.equal(await A.texto(page, "#ringTarjeta b"), "80 %");
  assert.match(await page.getAttribute("#ringTarjeta", "class"), /\bwarn\b/);
});

// Escenario: ajustes completos
t.test("ajustes completos", async () => {
  const { page } = await abrir();
  await A.ir(page, "ajustes");
  await page.fill("#topeTarjeta", "500");
  await page.fill("#topeRevolut", "300");
  await page.fill("#aporte", "100");
  await page.fill("#objFondo", "1000");
  await page.fill("#inicio", "2026-09");
  await page.fill("#saltos", "2026-12, diciembre");
  await page.click("#guardarAjustes");
  await A.aviso(page, "Ajustes guardados");
  const s = (await A.guardados(page)).settings;
  assert.deepEqual(s, { topeTarjeta: 500, topeRevolut: 300, objetivoFondo: 1000, aporte: 100, inicio: "2026-09", saltos: "2026-12" });
  assert.equal(await page.inputValue("#saltos"), "2026-12");
});

// Escenario: ajustes incompletos
t.test("ajustes incompletos", async () => {
  const { page } = await abrir();
  await A.ir(page, "ajustes");
  await page.fill("#topeTarjeta", "500");
  await page.fill("#topeRevolut", "300");
  await page.fill("#aporte", "100");
  await page.fill("#inicio", "2026-09");
  await page.click("#guardarAjustes");
  await A.aviso(page, "Completá todos los importes y el mes de inicio");
  const d = await A.guardados(page);
  assert.equal(d?.settings?.topeTarjeta, undefined);
});

// Escenario: app sin configurar
t.test("app sin configurar", async () => {
  const { page } = await abrir();
  assert.ok(await page.isVisible("#setupCard"));
  await page.click("#irAjustes");
  assert.equal(await A.texto(page, "#title"), "Ajustes");
  assert.ok(await page.isVisible("#guardarAjustes"));
});

// Escenario: app configurada
t.test("app configurada", async () => {
  const { page } = await abrir({ datos: A.con() });
  assert.equal(await page.isVisible("#setupCard"), false);
});
