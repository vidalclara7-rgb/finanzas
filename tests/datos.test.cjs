// Capacidad: datos
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 1000);
// Datos guardados por la primera versión: gastos en cuentas fijas, topes en ajustes, fondo anotado a mano
const PRIMERA = () => { const d = A.datosEjemplo(); delete d.cuentas; return d; };
const nombres = async (page) => (await A.guardados(page)).cuentas.map((c) => c.nombre);

async function restaurar(page, texto) {
  await A.ir(page, "ajustes");
  await page.fill("#backupIn", texto);
  await page.click("#restaurar");
}

// Escenario: se conserva al volver a abrir
t.test("se conserva al volver a abrir", async () => {
  const { page, ctx } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await A.nuevoGasto(page, { importe: 10, cuenta: "Banco A", nota: "prueba" });
  await A.aviso(page, "Gasto guardado");
  await A.ir(page, "cuentas");
  await A.nuevaCuenta(page, { nombre: "Banco B", saldo: 500 });
  await A.aviso(page, "Cuenta guardada");
  const url = page.url();
  await page.close();
  const otra = await ctx.newPage();
  await otra.clock.setFixedTime(new Date(A.HOY));
  await otra.goto(url);
  await A.ir(otra, "movs");
  assert.match(await A.texto(otra, "#movs"), /prueba/);
  await A.ir(otra, "cuentas");
  assert.match(await A.texto(otra, "#grupos"), /Banco B/);
});

// Escenario: nada sale del teléfono
t.test("nada sale del teléfono", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  const afuera = [];
  page.on("request", (r) => { if (new URL(r.url()).hostname !== "127.0.0.1") afuera.push(r.url()); });
  await page.reload();
  await A.nuevoGasto(page, { importe: 10, cuenta: "Banco A" });
  await A.aviso(page, "Gasto guardado");
  await A.ir(page, "cuentas");
  await A.nuevaCuenta(page, { nombre: "Banco B", saldo: 500 });
  await A.aviso(page, "Cuenta guardada");
  assert.deepEqual(afuera, []);
});

// Escenario: restaurar una copia
t.test("restaurar una copia", async () => {
  const copia = A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-03", 20, 1), A.gasto(2, "2026-10-04", 15, 1, "Ocio")] });
  const { page } = await abrir();
  await restaurar(page, JSON.stringify(copia));
  await A.aviso(page, "Copia restaurada");
  await A.ir(page, "movs");
  assert.equal(await page.locator("#movs .mov").count(), 2);
  await A.ir(page, "cuentas");
  assert.match(await A.texto(page, "#grupos"), /Banco A/);
});

// Escenario: copia inválida
t.test("copia inválida", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-03", 20, 1)] }) });
  const antes = await A.guardados(page);
  await restaurar(page, "hola");
  await A.aviso(page, "Esa copia no es válida");
  assert.deepEqual(await A.guardados(page), antes);
});

// Escenario: datos de la primera versión
t.test("datos de la primera versión", async () => {
  const { page, errores } = await abrir({ datos: PRIMERA() });
  const d = await A.guardados(page);
  assert.deepEqual(d.cuentas.map((c) => c.nombre), ["Tarjeta", "Revolut", "Débito/efectivo", "Fondo de emergencia"]);
  const fondo = d.cuentas.find((c) => c.fondo);
  assert.equal(fondo.nombre, "Fondo de emergencia");
  await A.ir(page, "cuentas");
  assert.equal(await A.texto(page, `[data-cta="${fondo.id}"] .v .num`), "150 €");
  await A.ir(page, "movs");
  const movs = await page.locator("#movs .mov").allInnerTexts();
  assert.equal(movs.length, 4);
  const porCuenta = Object.fromEntries(d.cuentas.map((c) => [c.nombre, d.movs.filter((m) => m.cuenta === c.id).length]));
  assert.deepEqual(porCuenta, { Tarjeta: 3, Revolut: 1, "Débito/efectivo": 1, "Fondo de emergencia": 0 });
  await A.ir(page, "inicio");
  const tarjeta = d.cuentas.find((c) => c.nombre === "Tarjeta");
  assert.equal(await A.texto(page, `[data-disp="${tarjeta.id}"] .big`), "435,7 €");
  assert.equal(tarjeta.tope, 500);
  assert.deepEqual(errores, []);
});

// Escenario: checklist anterior convertido
t.test("checklist anterior convertido", async () => {
  const { page } = await abrir({ datos: PRIMERA() });
  await A.ir(page, "mes");
  const tareas = await page.locator("#checks .check label").allInnerTexts();
  assert.equal(tareas.length, 5);
  assert.ok(tareas.includes("Transferir 100 € al fondo"), tareas.join(" | "));
  assert.ok(tareas.includes("Transferir 300 € a Revolut"), tareas.join(" | "));
  assert.ok(await page.isChecked("#ck-tr"));
});

// Escenario: sólo las cuentas usadas
t.test("sólo las cuentas usadas", async () => {
  const { page } = await abrir({ datos: { settings: {}, gastos: [{ id: 1, fecha: "2026-10-03", importe: 20, cuenta: "tarjeta", cat: "Súper", nota: "" }], meses: {} } });
  assert.deepEqual(await nombres(page), ["Tarjeta"]);
});

// Escenario: abrir dos veces no duplica
t.test("abrir dos veces no duplica", async () => {
  const { page } = await abrir({ datos: PRIMERA() });
  const antes = await A.guardados(page);
  await page.reload();
  assert.deepEqual(await A.guardados(page), antes);
});

// Escenario: datos de la versión con cuentas
t.test("datos de la versión con cuentas", async () => {
  const { page } = await abrir({ datos: { settings: {}, gastos: [], meses: {}, cuentas: [{ id: 5, tipo: "liquidez", nombre: "Banco A", saldo: 1200, actualizado: "2026-10-10" }] } });
  const c = (await A.guardados(page)).cuentas[0];
  assert.equal(c.saldoInicial, 1200);
  assert.equal(c.desde, "2026-10-10");
  await A.ir(page, "cuentas");
  assert.equal(await A.texto(page, '[data-cta="5"] .v .num'), "1200 €");
});

// Escenario: copia de seguridad de la primera versión
t.test("copia de seguridad de la primera versión", async () => {
  const { page } = await abrir();
  await restaurar(page, JSON.stringify(PRIMERA()));
  await A.aviso(page, "Copia restaurada");
  assert.deepEqual(await nombres(page), ["Tarjeta", "Revolut", "Débito/efectivo", "Fondo de emergencia"]);
  assert.equal((await A.guardados(page)).v, 2);
});

// Escenario: resumen con conciliación
t.test("resumen con conciliación", async () => {
  const datos = A.v2({ cuentas: [BANCO, A.cta(2, "Tarjeta Y", 0, { tipo: "tarjeta" })],
    movs: [A.ingreso(1, "2026-10-01", 1500, 1), A.gasto(2, "2026-10-03", 100, 2)],
    meses: { "2026-10": { checks: {}, conc: { 1: { real: 2500, fecha: "2026-10-15", ok: true } } } } });
  const { page } = await abrir({ datos });
  await A.ir(page, "ajustes");
  await page.click("#copiarResumen");
  await A.aviso(page, "Resumen copiado");
  const txt = await A.portapapeles(page);
  assert.ok(txt.startsWith("Resumen octubre 2026"), txt.split("\n")[0]);
  assert.match(txt, /Ingresos: 1500 € · Gastos: 100 € · Resultado: 1400 €/);
  assert.match(txt, /^- Banco A \(Bancos y efectivo\): 2500 € · conciliada/m);
  assert.match(txt, /^- Tarjeta Y \(Tarjetas de crédito\): -100 € · sin conciliar/m);
});

// Escenario: reembolsables anteriores
t.test("reembolsables anteriores", async () => {
  const R = "Trabajo (reembolsable)";
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-03", 10, 1, R), A.gasto(2, "2026-10-04", 5, 1, R)] }) });
  const d = await A.guardados(page);
  assert.deepEqual(d.movs.map((m) => m.reembolso), [{ estado: "pendiente" }, { estado: "pendiente" }]);
  assert.equal(await A.texto(page, "#cobrarVal"), "15 €");
});

// Escenario: copia anterior con reembolsables
t.test("copia anterior con reembolsables", async () => {
  const copia = A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-03", 10, 1, "Trabajo (reembolsable)")] });
  const { page } = await abrir();
  await restaurar(page, JSON.stringify(copia));
  await A.aviso(page, "Copia restaurada");
  await A.ir(page, "movs");
  assert.equal(await A.texto(page, '[data-mov="1"] [data-estado-r]'), "Pendiente");
});
