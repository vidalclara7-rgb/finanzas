// Capacidad: gastos
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const g = (id, fecha, importe, cuenta, cat, nota = "") => ({ id, fecha, importe, cuenta, cat, nota });

// Escenario: gasto válido
t.test("gasto válido", async () => {
  const { page } = await abrir({ datos: A.con() });
  await A.nuevoGasto(page, { importe: 12.5, cuenta: "tarjeta", cat: "Súper", nota: "verdulería" });
  await A.aviso(page, "Gasto guardado");
  const ultimo = await A.texto(page, "#ultimos .item");
  assert.match(ultimo, /Súper · verdulería/);
  assert.match(ultimo, /15\/10 · Tarjeta/);
  await A.ir(page, "movs");
  assert.equal(await page.locator("#movs .item").count(), 1);
  assert.equal(await A.texto(page, "#totalMes"), "12,5 €");
});

// Escenario: importe en cero
t.test("importe en cero", async () => {
  const { page } = await abrir({ datos: A.con() });
  await A.nuevoGasto(page, { importe: 0 });
  await A.aviso(page, "Poné un importe mayor que 0");
  assert.equal((await A.guardados(page)).gastos.length, 0);
});

// Escenario: importe vacío
t.test("importe vacío", async () => {
  const { page } = await abrir({ datos: A.con() });
  await A.nuevoGasto(page);
  assert.ok(await page.isVisible("#sheet"));
  assert.ok(await page.$eval("#gImporte", (el) => el.validity.valueMissing));
  assert.equal((await A.guardados(page)).gastos.length, 0);
});

// Escenario: gastos de otro mes no aparecen
t.test("gastos de otro mes no aparecen", async () => {
  const { page } = await abrir({ datos: A.con({ gastos: [g(1, "2026-09-28", 30, "tarjeta", "Ocio"), g(2, "2026-10-03", 20, "tarjeta", "Súper")] }) });
  await A.ir(page, "movs");
  const items = await page.locator("#movs .item").allInnerTexts();
  assert.equal(items.length, 1);
  assert.match(items[0], /03\/10/);
  assert.equal(await A.texto(page, "#totalMes"), "20 €");
});

// Escenario: mes sin gastos
t.test("mes sin gastos", async () => {
  const { page } = await abrir({ datos: A.con() });
  await A.ir(page, "movs");
  assert.equal(await A.texto(page, "#movs"), "Sin gastos este mes.");
});

// Escenario: borrar con dos toques
t.test("borrar con dos toques", async () => {
  const { page } = await abrir({ datos: A.con({ gastos: [g(1, "2026-10-03", 20, "tarjeta", "Súper")] }) });
  await A.ir(page, "movs");
  await page.click('[data-del="1"]');
  assert.equal(await A.texto(page, '[data-del="1"]'), "Borrar");
  await page.click('[data-del="1"]');
  await A.aviso(page, "Gasto borrado");
  assert.equal(await page.locator("#movs .item").count(), 0);
});

// Escenario: un solo toque no borra
t.test("un solo toque no borra", async () => {
  const { page } = await abrir({ datos: A.con({ gastos: [g(1, "2026-10-03", 20, "tarjeta", "Súper")] }) });
  await A.ir(page, "movs");
  await page.click('[data-del="1"]');
  await page.waitForTimeout(3000);
  assert.equal(await A.texto(page, '[data-del="1"]'), "×");
  assert.equal(await page.locator("#movs .item").count(), 1);
});

// Escenario: categorías ordenadas
t.test("categorías ordenadas", async () => {
  const { page } = await abrir({ datos: A.con({ gastos: [
    g(1, "2026-10-02", 18, "revolut", "Comida fuera"), g(2, "2026-10-03", 64.3, "tarjeta", "Súper"),
    g(3, "2026-10-04", 42, "tarjeta", "Trabajo (reembolsable)")] }) });
  const cats = await page.locator("#cats .item span:first-child").allInnerTexts();
  assert.deepEqual(cats, ["Súper", "Trabajo (reembolsable)", "Comida fuera"]);
});

// Escenario: sin gastos por categoría
t.test("sin gastos por categoría", async () => {
  const { page } = await abrir({ datos: A.con() });
  assert.equal(await A.texto(page, "#cats"), "Todavía no anotaste gastos este mes. Tocá + para empezar.");
});
