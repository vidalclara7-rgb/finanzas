// Capacidad: cierre-mes
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);

// Escenario: lo marcado se conserva
t.test("lo marcado se conserva", async () => {
  const { page } = await abrir({ datos: A.con() });
  await A.ir(page, "mes");
  await page.check("#ck-total");
  await page.reload();
  await A.ir(page, "mes");
  assert.ok(await page.isChecked("#ck-total"));
});

// Escenario: cada mes empieza sin marcar
t.test("cada mes empieza sin marcar", async () => {
  const todas = { tr: true, rev: true, total: true, empresa: true, mitad: true };
  const { page } = await abrir({ datos: A.con({ meses: { "2026-09": { fondo: null, checks: todas } } }) });
  await A.ir(page, "mes");
  assert.equal(await page.locator("#checks input:checked").count(), 0);
  assert.equal(await page.locator("#checks input").count(), 5);
});

// Escenario: tareas con los importes de Ajustes
t.test("tareas con los importes de Ajustes", async () => {
  const { page } = await abrir({ datos: A.con() });
  await A.ir(page, "mes");
  const tareas = await page.locator("#checks label").allInnerTexts();
  assert.ok(tareas.includes("Transferir 100 € al fondo"), tareas.join(" | "));
  assert.ok(tareas.includes("Transferir 300 € a Revolut"), tareas.join(" | "));
});
