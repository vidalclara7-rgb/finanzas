// Capacidad: cierre-mes
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const ALQUILER = { id: "a1", texto: "Pagar el alquiler" };
const tareas = (page) => page.locator("#checks .check label").allInnerTexts();

// Escenario: agregar una tarea
t.test("agregar una tarea", async () => {
  const { page } = await abrir();
  await A.ir(page, "mes");
  await page.click("#addTarea");
  await page.fill("#tTexto", "Pagar el alquiler");
  await page.click('#sheetT button[type="submit"]');
  await A.aviso(page, "Tarea guardada");
  assert.deepEqual(await tareas(page), ["Pagar el alquiler"]);
  assert.equal(await page.locator("#checks input:checked").count(), 0);
});

// Escenario: tarea sin texto
t.test("tarea sin texto", async () => {
  const { page } = await abrir();
  await A.ir(page, "mes");
  await page.click("#addTarea");
  await page.click('#sheetT button[type="submit"]');
  await A.aviso(page, "Escribí la tarea");
  assert.deepEqual((await A.guardados(page)).tareas, []);
});

// Escenario: cambiar el texto de una tarea
t.test("cambiar el texto de una tarea", async () => {
  const { page } = await abrir({ datos: A.v2({ tareas: [ALQUILER] }) });
  await A.ir(page, "mes");
  await page.click('[data-tarea="a1"]');
  await page.fill("#tTexto", "Pagar alquiler y expensas");
  await page.click('#sheetT button[type="submit"]');
  await A.aviso(page, "Tarea guardada");
  assert.deepEqual(await tareas(page), ["Pagar alquiler y expensas"]);
});

// Escenario: borrar una tarea
t.test("borrar una tarea", async () => {
  const { page } = await abrir({ datos: A.v2({ tareas: [ALQUILER] }) });
  await A.ir(page, "mes");
  await page.click('[data-tarea="a1"]');
  await page.click("#tBorrar");
  assert.equal(await A.texto(page, "#tBorrar"), "Tocá de nuevo para borrar");
  await page.click("#tBorrar");
  await A.aviso(page, "Tarea borrada");
  assert.deepEqual(await tareas(page), []);
});

// Escenario: lo marcado se conserva
t.test("lo marcado se conserva", async () => {
  const { page } = await abrir({ datos: A.v2({ tareas: [ALQUILER] }) });
  await A.ir(page, "mes");
  await page.check("#ck-a1");
  await page.reload();
  await A.ir(page, "mes");
  assert.ok(await page.isChecked("#ck-a1"));
});

// Escenario: cada mes empieza sin marcar
t.test("cada mes empieza sin marcar", async () => {
  const { page } = await abrir({ datos: A.v2({ tareas: [ALQUILER], meses: { "2026-09": { checks: { a1: true } } } }) });
  await A.ir(page, "mes");
  assert.equal(await page.locator("#checks input").count(), 1);
  assert.equal(await page.locator("#checks input:checked").count(), 0);
});

// Escenario: persona nueva sin tareas
t.test("persona nueva sin tareas", async () => {
  const { page } = await abrir();
  await A.ir(page, "mes");
  assert.equal(await A.texto(page, "#checks"), "Agregá las tareas de tu cierre de mes.");
});
