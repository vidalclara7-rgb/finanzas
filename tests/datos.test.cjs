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
  const { page } = await abrir({ datos: { settings: {}, gastos: [{ id: 1, fecha: "2026-10-03", importe: 20, cuenta: "tarjeta", cat: "Supermercado", nota: "" }], meses: {} } });
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

// Escenario: datos con una paleta elegida
t.test("datos con una paleta elegida", async () => {
  const datos = A.v2({ settings: { paleta: "pastel" }, cuentas: [BANCO], movs: [A.gasto(1, "2026-10-03", 20, 1)] });
  const { page, errores } = await abrir({ datos });
  assert.equal(await page.evaluate(() => document.documentElement.hasAttribute("data-paleta")), false);
  const d = await A.guardados(page);
  assert.deepEqual(d.cuentas, datos.cuentas);
  assert.deepEqual(d.movs, datos.movs);
  await A.ir(page, "ajustes");
  assert.equal(await page.locator("[data-paleta-op]").count(), 0);
  assert.equal(await page.locator('[data-ui="selector-paleta"]').count(), 0);
  const copia = JSON.stringify(A.v2({ settings: { paleta: "lima" }, cuentas: [BANCO] }));
  await restaurar(page, copia);
  await A.aviso(page, "Copia restaurada");
  assert.deepEqual(errores, []);
});

// Escenario: datos sin marca de fijo
t.test("datos sin marca de fijo", async () => {
  const datos = A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-03", 200, 1), A.gasto(2, "2026-10-04", 100, 1, "Ocio", "cine")] });
  delete datos.fijos;
  const { page, errores } = await abrir({ datos });
  assert.equal(await A.texto(page, '#fv [data-grupo="var"] span:last-child'), "300 € · 100 %");
  const d = await A.guardados(page);
  assert.deepEqual(d.movs, datos.movs);
  assert.deepEqual(d.fijos, {});
  assert.deepEqual(errores, []);
});

// Escenario: copia anterior sin fijos
t.test("copia anterior sin fijos", async () => {
  const copia = A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-03", 80, 1)] });
  const { page } = await abrir();
  await restaurar(page, JSON.stringify(copia));
  await A.aviso(page, "Copia restaurada");
  await A.ir(page, "inicio");
  assert.equal(await A.texto(page, '#fv [data-grupo="var"] span:last-child'), "80 € · 100 %");
  assert.equal(await page.locator('#fv [data-grupo="fij"]').count(), 0);
});

// Escenario: copia con fijos y una sugerencia rechazada
t.test("copia con fijos y una sugerencia rechazada", async () => {
  const gim = ["2026-08", "2026-09", "2026-10"].map((m, i) => A.gasto(10 + i, `${m}-05`, 30, 1, "Salud", "gimnasio"));
  const copia = A.v2({ cuentas: [BANCO], movs: [{ ...A.gasto(1, "2026-10-01", 600, 1, "Casa/Splitwise", "alquiler"), fijo: true }, ...gim],
    fijos: { "Casa/Splitwise|alquiler": true, "Salud|gimnasio": false } });
  const { page } = await abrir();
  await restaurar(page, JSON.stringify(copia));
  await A.aviso(page, "Copia restaurada");
  await A.ir(page, "inicio");
  assert.equal(await page.isVisible("#sugFijo"), false);
  await A.ir(page, "movs");
  assert.equal(await A.texto(page, '[data-mov="1"] [data-ui="chip-fijo"]'), "Fijo");
});

// Escenario: datos sin importaciones
t.test("datos sin importaciones", async () => {
  const X = require("./extractos.cjs");
  const datos = A.v2({ cuentas: [BANCO, A.cta(2, "Revolut", 50)], movs: [A.gasto(1, "2026-10-03", 20, 1, "Supermercado", "verdulería")] });
  delete datos.reglas;
  const { page, errores } = await abrir({ datos });
  const d = await A.guardados(page);
  assert.deepEqual(d.cuentas, datos.cuentas);
  assert.deepEqual(d.movs, datos.movs);
  assert.deepEqual(d.reglas, {});
  await A.ir(page, "movs");
  await page.setInputFiles("#pdfIn", { name: "extracto.pdf", mimeType: "application/pdf", buffer: await X.revolut(page, { movs: [{ fecha: "2026-10-05", desc: "Tienda Ejemplo", importe: -5 }] }) });
  await page.waitForFunction(() => !document.getElementById("sheetI").hidden, null, { timeout: 20000 });
  assert.ok(await page.isVisible("#iElegir"));
  assert.equal(await page.locator('#segIElegir [aria-pressed="true"]').count(), 0);
  assert.deepEqual(errores, []);
});

// Escenario: datos con Súper
t.test("datos con Súper", async () => {
  const VIEJA = "Súper";
  const datos = A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-03", 20, 1, VIEJA), { ...A.gasto(2, "2026-10-04", 15, 1, VIEJA, "verdulería"), fijo: true }],
    fijos: { [`${VIEJA}|verdulería`]: true }, reglas: { "g|consum": VIEJA } });
  const { page } = await abrir({ datos });
  const d = await A.guardados(page);
  assert.deepEqual(d.movs.map((m) => m.cat), ["Supermercado", "Supermercado"]);
  assert.deepEqual(d.fijos, { "Supermercado|verdulería": true });
  assert.deepEqual(d.reglas, { "g|consum": "Supermercado" });
  await page.click("#fab");
  await A.hojaLista(page);
  await A.elegir(page, "segCat", "Supermercado");
  await page.fill("#mNota", "verdulería");
  assert.ok(await page.isChecked("#mFijo"));
});

// Escenario: copia vieja con Súper
t.test("copia vieja con Súper", async () => {
  const copia = A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-03", 20, 1, "Súper", "pan")] });
  const { page } = await abrir();
  await restaurar(page, JSON.stringify(copia));
  await A.aviso(page, "Copia restaurada");
  await A.ir(page, "movs");
  assert.equal((await A.guardados(page)).movs[0].cat, "Supermercado");
  assert.match(await A.texto(page, '[data-mov="1"]'), /03\/10/);
});

// Escenario: datos de la versión anterior
t.test("datos de la versión anterior", async () => {
  const movs = [1, 2, 3].map((d) => A.gasto(d, `2026-10-0${d}`, 10 * d, 1));
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs }) });
  await A.ir(page, "movs");
  assert.equal(await A.texto(page, "#totGas"), "60 €");
  const textos = await page.locator("#movs .mov .num").allInnerTexts();
  assert.ok(textos.every((x) => x.includes("€") && !/USD|GBP/.test(x)));
});

// Escenario: copia de seguridad vieja
t.test("copia de seguridad vieja", async () => {
  const copia = A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-03", 20, 1)] });
  const { page, errores } = await abrir();
  await restaurar(page, JSON.stringify(copia));
  await A.aviso(page, "Copia restaurada");
  await A.ir(page, "movs");
  assert.match(await A.texto(page, '[data-mov="1"]'), /−20 €/);
  assert.deepEqual(errores, []);
});

// Escenario: la moneda viaja en la copia
t.test("la moneda viaja en la copia", async () => {
  const datos = A.v2({ cuentas: [BANCO], movs: [{ ...A.gasto(1, "2026-10-03", 20, 1), moneda: "USD" }] });
  const { page } = await abrir({ datos });
  await A.ir(page, "ajustes");
  await page.click("#copiarBackup");
  const copia = await A.portapapeles(page);
  const { page: otra } = await abrir();
  await restaurar(otra, copia);
  await A.aviso(otra, "Copia restaurada");
  await A.ir(otra, "movs");
  assert.match(await A.texto(otra, '[data-mov="1"]'), /−20 USD/);
});

// Escenario: datos de la versión anterior (gastos de tarjeta sin cuotas)
t.test("gastos de tarjeta guardados antes de las cuotas", async () => {
  const tarj = A.cta(2, "Tarjeta Y", 0, { tipo: "tarjeta" });
  const { page } = await abrir({ datos: A.v2({ cuentas: [tarj], movs: [A.gasto(1, "2026-10-05", 100, 2)] }) });
  await A.ir(page, "movs");
  assert.equal(await A.texto(page, "#totGas"), "100 €");
  assert.equal(await page.locator('[data-ui="chip-cuota"]').count(), 0);
  await A.ir(page, "cuentas");
  assert.equal(await A.texto(page, '[data-cta="2"] .v .num'), "-100 €");
});

// Escenario: la copia conserva las cuotas
t.test("la copia conserva las cuotas", async () => {
  const tarj = A.cta(2, "Tarjeta Y", 0, { tipo: "tarjeta" });
  const datos = A.v2({ cuentas: [tarj], movs: [{ ...A.gasto(1, "2026-10-15", 700, 2, "Compras"), cuotas: { n: 3, cuota: 240 } }] });
  const { page } = await abrir({ datos });
  await A.ir(page, "ajustes");
  await page.click("#copiarBackup");
  const copia = await A.portapapeles(page);
  const { page: otra } = await abrir();
  await restaurar(otra, copia);
  await A.aviso(otra, "Copia restaurada");
  await A.ir(otra, "movs");
  assert.match(await A.texto(otra, '[data-mov="1"]'), /Cuota 1 de 3/);
  assert.equal(await A.texto(otra, "#totGas"), "240 €");
});

// --- documentos de gastos
const PDF3 = { name: "factura.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\n%%EOF") };
const sembrarAdjunto = (page, reg) => page.evaluate((r) => new Promise((ok, mal) => {
  const q = indexedDB.open("finanzas-adjuntos", 1);
  q.onupgradeneeded = () => q.result.createObjectStore("archivos", { keyPath: "id" });
  q.onsuccess = () => { const tx = q.result.transaction("archivos", "readwrite"); tx.objectStore("archivos").put({ ...r, datos: new ArrayBuffer(4) }); tx.oncomplete = ok; tx.onerror = mal; };
}), reg);

// Escenario: adjuntos anteriores intactos
t.test("adjuntos anteriores intactos", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-03", 20, 1)] }) });
  await sembrarAdjunto(page, { id: 900, cuenta: 1, mes: "2026-10", nombre: "extracto.pdf", tipo: "pdf", mime: "application/pdf" });
  await page.reload();
  await A.ir(page, "movs");
  assert.equal(await page.locator('[data-ui="chip-documento"]').count(), 0);
  await A.ir(page, "cuentas");
  await page.click('[data-cta="1"]');
  await page.waitForFunction(() => document.querySelector("#cAdjLista").textContent.includes("extracto.pdf"));
});

// Escenario: aviso en Ajustes cuenta los documentos de gastos
t.test("aviso en Ajustes cuenta los documentos de gastos", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-03", 20, 1)] }) });
  await sembrarAdjunto(page, { id: 901, cuenta: 1, mes: "2026-10", nombre: "extracto.pdf", tipo: "pdf", mime: "application/pdf" });
  await A.ir(page, "movs");
  await page.click("#selBtn");
  await page.click('[data-mov="1"] [data-sel]');
  await page.setInputFiles("#docIn", PDF3);
  await A.aviso(page, "Documento adjuntado a 1 gasto");
  await A.ir(page, "ajustes");
  await page.waitForFunction(() => document.getElementById("avisoAdj").textContent.includes("2 adjuntos"));
  assert.equal(await A.texto(page, "#avisoAdj"), "Tus 2 adjuntos no entran en la copia: guardalos aparte si los necesitás.");
});

// Escenario: copia restaurada con gastos que ya no existen
t.test("copia restaurada con gastos que ya no existen", async () => {
  const { page, errores } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-03", 20, 1)] }) });
  await sembrarAdjunto(page, { id: 902, cuenta: null, mes: "2026-10", nombre: "viejo.pdf", tipo: "pdf", mime: "application/pdf", movs: [77] });
  await restaurar(page, JSON.stringify(A.v2({ cuentas: [BANCO], movs: [A.gasto(2, "2026-10-04", 15, 1)] })));
  await A.aviso(page, "Copia restaurada");
  await A.ir(page, "movs");
  assert.equal(await page.locator('[data-ui="chip-documento"]').count(), 0);
  assert.deepEqual(errores, []);
});

// --- inversiones
const BROKER_D = A.cta(1, "Broker X", 1000, { tipo: "inversion" });

// Escenario: datos de la versión anterior
t.test("inversiones guardadas antes de las posiciones", async () => {
  const datos = A.v2({ cuentas: [A.cta(1, "Broker X", 2100, { tipo: "inversion", aportado: 2000 })] });
  const { page } = await abrir({ datos });
  await A.ir(page, "cuentas");
  assert.match(await A.texto(page, '[data-cta="1"]'), /\+100 € \(\+5,0 %\) sobre 2000 €/);
  assert.equal(await A.texto(page, "#activos"), "2100 €");
});

// Escenario: copia de seguridad vieja
t.test("copia de seguridad vieja sin posiciones", async () => {
  const { page, errores } = await abrir();
  await restaurar(page, JSON.stringify(A.v2({ cuentas: [BROKER_D] })));
  await A.aviso(page, "Copia restaurada");
  const g = await A.guardados(page);
  assert.deepEqual([g.activos, g.ops], [[], []]);
  assert.deepEqual(errores, []);
});

// Escenario: la copia conserva las posiciones
t.test("la copia conserva las posiciones", async () => {
  const datos = A.v2({ cuentas: [BROKER_D], activos: [{ id: 10, cuenta: 1, nombre: "Fondo A" }], ops: [{ id: 1, activo: 10, tipo: "compra", cantidad: 10, precio: 50, fecha: "2026-10-10" }] });
  const { page } = await abrir({ datos });
  await A.ir(page, "ajustes");
  await page.click("#copiarBackup");
  const copia = await A.portapapeles(page);
  const { page: otra } = await abrir();
  await restaurar(otra, copia);
  await A.aviso(otra, "Copia restaurada");
  await A.ir(otra, "cuentas");
  await otra.click("[data-ver-rend]");
  assert.match((await A.texto(otra, '[data-activo="10"]')).replace(/\s+/g, " "), /Fondo A.*10 unidades/);
});

// Escenario: copia rota o con una operación huérfana
t.test("copia con una operación huérfana", async () => {
  const datos = A.v2({ cuentas: [BROKER_D, A.cta(2, "Banco A", 500)], activos: [], ops: [{ id: 1, activo: 99, tipo: "compra", cantidad: 10, precio: 50, fecha: "2026-10-10" }] });
  const { page, errores } = await abrir();
  await restaurar(page, JSON.stringify(datos));
  await A.aviso(page, "Copia restaurada");
  const g = await A.guardados(page);
  assert.equal(g.ops.length, 0);
  assert.equal(g.cuentas.length, 2);
  await A.ir(page, "cuentas");
  assert.match(await A.texto(page, "#grupos"), /Banco A/);
  assert.deepEqual(errores, []);
});

// --- proteger los datos
const KEY_COPIA = "finanzas-copia", KEY_RESP = "finanzas-respaldo";
const ls = (page, k) => page.evaluate((x) => localStorage.getItem(x), k);
const conCopia = async (page, fecha) => { await page.evaluate(([k, f]) => localStorage.setItem(k, JSON.stringify({ fecha: f })), [KEY_COPIA, fecha]); await page.reload(); };
const unGasto = (nota = "") => A.v2({ cuentas: [BANCO], movs: [{ ...A.gasto(1, "2026-10-03", 20, 1), nota }] });
const otrosDatos = () => A.v2({ cuentas: [A.cta(1, "Banco Otro", 500)], movs: [A.gasto(5, "2026-10-04", 7, 1, "Ocio")] });
const avisoCopia = (page) => page.locator("#avisoCopia").isVisible();
const sembrarCrudo = async (page, crudo) => { await page.evaluate((c) => localStorage.setItem("finanzas-v1", c), crudo); await page.reload(); };
const archivo = (contenido, name = "copia.json") => ({ name, mimeType: "application/json", buffer: Buffer.from(contenido) });

// Escenario: un solo toque no restaura
t.test("un solo toque no restaura", async () => {
  const { page } = await abrir({ datos: unGasto() });
  await A.ir(page, "ajustes");
  await page.fill("#backupIn", JSON.stringify(otrosDatos()));
  await page.click("#restaurar");
  assert.equal(await A.texto(page, "#restaurar"), "Tocá de nuevo: reemplaza todo lo que tenés");
  assert.deepEqual((await A.guardados(page)).cuentas.map((c) => c.nombre), ["Banco A"]);
});

// Escenario: guardar la copia en un archivo
t.test("guardar la copia en un archivo", async () => {
  const { page } = await abrir({ datos: unGasto() });
  await A.ir(page, "ajustes");
  const [dl] = await Promise.all([page.waitForEvent("download"), page.click("#guardarArchivo")]);
  assert.equal(dl.suggestedFilename(), "mis-finanzas-2026-10-15.json");
  const texto = require("node:fs").readFileSync(await dl.path(), "utf8");
  const g = await A.guardados(page);
  const copia = JSON.parse(texto);
  assert.deepEqual([copia.v, copia.cuentas, copia.movs], [g.v, g.cuentas, g.movs]);
  await A.aviso(page, "Copia guardada");
});

// Escenario: restaurar desde un archivo
t.test("restaurar desde un archivo", async () => {
  const copia = A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-03", 20, 1), A.gasto(2, "2026-10-04", 15, 1, "Ocio")] });
  const { page } = await abrir();
  await A.ir(page, "ajustes");
  await page.setInputFiles("#archivoIn", archivo(JSON.stringify(copia)));
  await page.waitForFunction(() => document.getElementById("backupIn").value.length > 10);
  await page.click("#restaurar");
  await page.click("#restaurar");
  await A.aviso(page, "Copia restaurada");
  await A.ir(page, "movs");
  assert.equal(await page.locator("#movs .mov").count(), 2);
  await A.ir(page, "cuentas");
  assert.match(await A.texto(page, "#grupos"), /Banco A/);
});

// Escenario: archivo inválido
t.test("archivo inválido", async () => {
  const { page } = await abrir({ datos: unGasto() });
  await A.ir(page, "ajustes");
  await page.setInputFiles("#archivoIn", archivo("hola", "notas.txt"));
  await page.waitForFunction(() => document.getElementById("backupIn").value === "hola");
  await page.click("#restaurar");
  await page.click("#restaurar");
  await A.aviso(page, "Esa copia no es válida");
  assert.equal((await A.guardados(page)).movs.length, 1);
});

// Escenario: última copia en Ajustes
t.test("última copia en Ajustes", async () => {
  const { page } = await abrir({ datos: unGasto() });
  await conCopia(page, "2026-10-12");
  await A.ir(page, "ajustes");
  assert.equal(await A.texto(page, "#ultimaCopia"), "Última copia: hace 3 días");
  assert.match(await A.texto(page, '[data-ui="advertencia-copia"]'), /Si borrás el ícono de la app/);
});

// Escenario: ninguna copia todavía
t.test("ninguna copia todavía", async () => {
  const { page } = await abrir({ datos: unGasto() });
  await A.ir(page, "ajustes");
  assert.equal(await A.texto(page, "#ultimaCopia"), "Todavía no hiciste ninguna copia.");
});

// Escenario: aviso en Inicio a los 7 días
t.test("aviso en Inicio a los 7 días", async () => {
  const { page } = await abrir({ datos: unGasto() });
  await conCopia(page, "2026-10-08");
  assert.equal(await avisoCopia(page), true);
  assert.equal(await A.texto(page, "#avisoCopiaT"), "Hace 7 días que no hacés una copia de seguridad");
});

// Escenario: sin aviso antes de los 7 días
t.test("sin aviso antes de los 7 días", async () => {
  const { page } = await abrir({ datos: unGasto() });
  await conCopia(page, "2026-10-09");
  assert.equal(await avisoCopia(page), false);
});

// Escenario: aviso si nunca hubo copia
t.test("aviso si nunca hubo copia", async () => {
  const { page } = await abrir({ datos: unGasto() });
  assert.equal(await avisoCopia(page), true);
  assert.equal(await A.texto(page, "#avisoCopiaT"), "Todavía no hiciste ninguna copia de seguridad");
});

// Escenario: sin datos no hay aviso
t.test("sin datos no hay aviso", async () => {
  const { page } = await abrir();
  assert.equal(await avisoCopia(page), false);
});

// Escenario: hacer la copia quita el aviso
t.test("hacer la copia quita el aviso", async () => {
  const { page } = await abrir({ datos: unGasto() });
  assert.equal(await avisoCopia(page), true);
  await page.click("#avisoCopiaBtn");
  await page.click("#copiarBackup");
  await A.aviso(page, "Copia de seguridad copiada");
  assert.equal(await A.texto(page, "#ultimaCopia"), "Última copia: hoy");
  await A.ir(page, "inicio");
  assert.equal(await avisoCopia(page), false);
});

// Escenario: cancelar el guardado no cuenta como copia
t.test("cancelar el guardado no cuenta como copia", async () => {
  const { page } = await abrir({ datos: unGasto() });
  await page.evaluate(() => { navigator.canShare = () => true; navigator.share = () => Promise.reject(new DOMException("cancelado", "AbortError")); });
  await A.ir(page, "ajustes");
  await page.click("#guardarArchivo");
  await page.waitForTimeout(400);
  assert.equal(await A.texto(page, "#ultimaCopia"), "Todavía no hiciste ninguna copia.");
  assert.equal(await ls(page, KEY_COPIA), null);
  await A.ir(page, "inicio");
  assert.equal(await avisoCopia(page), true);
});

// Escenario: lo anterior queda guardado
t.test("lo anterior queda guardado", async () => {
  const { page } = await abrir({ datos: unGasto() });
  await A.ir(page, "ajustes");
  await page.fill("#backupIn", JSON.stringify(otrosDatos()));
  await page.click("#restaurar");
  await page.click("#restaurar");
  await A.aviso(page, "Copia restaurada");
  assert.equal(await page.isVisible("#cardRespaldo"), true);
  assert.match(await A.texto(page, "#respaldoSub"), /Datos de antes de restaurar, del 15\/10/);
  assert.equal(JSON.parse(JSON.parse(await ls(page, KEY_RESP)).texto).cuentas[0].nombre, "Banco A");
});

// Escenario: volver a lo anterior
t.test("volver a lo anterior", async () => {
  const { page } = await abrir({ datos: unGasto() });
  await A.ir(page, "ajustes");
  await page.fill("#backupIn", JSON.stringify(otrosDatos()));
  await page.click("#restaurar");
  await page.click("#restaurar");
  await A.aviso(page, "Copia restaurada");
  await page.click("#respaldoRestaurar");
  await page.click("#respaldoRestaurar");
  await page.waitForFunction(() => JSON.parse(localStorage.getItem("finanzas-v1")).cuentas[0].nombre === "Banco A");
  assert.equal((await A.guardados(page)).movs[0].importe, 20);
  assert.equal(JSON.parse(JSON.parse(await ls(page, KEY_RESP)).texto).cuentas[0].nombre, "Banco Otro");
});

// Escenario: restaurar sobre una app vacía no pisa el respaldo
t.test("restaurar sobre una app vacía no pisa el respaldo", async () => {
  const { page } = await abrir();
  await sembrarCrudo(page, "{texto roto");
  await A.ir(page, "ajustes");
  await page.fill("#backupIn", JSON.stringify(otrosDatos()));
  await page.click("#restaurar");
  await page.click("#restaurar");
  await A.aviso(page, "Copia restaurada");
  assert.equal(JSON.parse(await ls(page, KEY_RESP)).texto, "{texto roto");
});

// Escenario: descartar el respaldo
t.test("descartar el respaldo", async () => {
  const { page } = await abrir();
  await sembrarCrudo(page, "{texto roto");
  await A.ir(page, "ajustes");
  await page.click("#respaldoDescartar");
  assert.equal(await page.isVisible("#cardRespaldo"), true);
  await page.click("#respaldoDescartar");
  await A.aviso(page, "Respaldo descartado");
  assert.equal(await page.isVisible("#cardRespaldo"), false);
  assert.equal(await ls(page, KEY_RESP), null);
});

// Escenario: copiar el texto del respaldo
t.test("copiar el texto del respaldo", async () => {
  const { page } = await abrir();
  await sembrarCrudo(page, "{texto roto");
  await A.ir(page, "ajustes");
  await page.click("#respaldoCopiar");
  await A.aviso(page, "Respaldo copiado");
  assert.equal(await A.portapapeles(page), "{texto roto");
});

// Escenario: texto guardado dañado
t.test("texto guardado dañado", async () => {
  const { page, errores } = await abrir();
  await sembrarCrudo(page, '{"v":2,"settings":{},"cuentas":[{"id":1,');
  assert.equal(await page.isVisible("#avisoIlegible"), true);
  assert.match(await A.texto(page, "#avisoIlegible"), /No pude leer tus datos guardados/);
  await A.ir(page, "ajustes");
  assert.match(await A.texto(page, "#respaldoSub"), /Datos que no se pudieron leer/);
  assert.equal(JSON.parse(await ls(page, KEY_RESP)).texto, '{"v":2,"settings":{},"cuentas":[{"id":1,');
  assert.deepEqual(errores, []);
});

// Escenario: datos que no son de la app
t.test("datos que no son de la app", async () => {
  const { page } = await abrir();
  await sembrarCrudo(page, '{"hola":"mundo"}');
  assert.equal((await A.guardados(page)).cuentas.length, 0);
  assert.equal(JSON.parse(await ls(page, KEY_RESP)).texto, '{"hola":"mundo"}');
  assert.equal(await page.isVisible("#avisoIlegible"), true);
});

// Escenario: primer uso
t.test("primer uso", async () => {
  const { page } = await abrir();
  assert.equal(await ls(page, KEY_RESP), null);
  assert.equal(await page.isVisible("#avisoIlegible"), false);
  assert.equal(await avisoCopia(page), false);
});

// Escenario: datos de versiones anteriores sin fecha de copia
t.test("datos de la versión anterior sin fecha de copia", async () => {
  const { page } = await abrir({ datos: unGasto("de antes") });
  assert.equal((await A.guardados(page)).movs[0].nota, "de antes");
  await A.ir(page, "ajustes");
  assert.equal(await A.texto(page, "#ultimaCopia"), "Todavía no hiciste ninguna copia.");
  assert.equal(await ls(page, KEY_RESP), null);
});

// --- pruebas extra de robustez
t.test("claves de copia y respaldo con basura no rompen la app", async () => {
  const { page, errores } = await abrir({ datos: unGasto() });
  await page.evaluate(() => { localStorage.setItem("finanzas-copia", "{no es json"); localStorage.setItem("finanzas-respaldo", JSON.stringify({ texto: 5, motivo: {}, fecha: "<b>" })); });
  await page.reload();
  await A.ir(page, "ajustes");
  assert.equal(await A.texto(page, "#ultimaCopia"), "Todavía no hiciste ninguna copia.");
  assert.equal(await page.isVisible("#cardRespaldo"), false);
  await page.evaluate(() => localStorage.setItem("finanzas-copia", JSON.stringify({ fecha: "mañana" })));
  await page.reload();
  assert.equal(await avisoCopia(page), true);
  assert.deepEqual(errores, []);
});

t.test("si el respaldo no cabe en el almacenamiento, la app abre igual", async () => {
  const { page, errores } = await abrir();
  await sembrarCrudo(page, "{texto roto");
  await page.evaluate(() => localStorage.removeItem("finanzas-respaldo"));
  await page.addInitScript(() => { const o = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (k === "finanzas-respaldo") throw new Error("sin espacio"); return o.call(this, k, v); }; });
  await sembrarCrudo(page, "{texto roto otra vez");
  assert.equal(await page.locator("#v-inicio").isVisible(), true);
  assert.deepEqual(errores.filter((e) => !/sin espacio/.test(e)), []);
});

t.test("una copia inválida no cambia nada y no guarda respaldo", async () => {
  const { page } = await abrir({ datos: unGasto() });
  await A.ir(page, "ajustes");
  await page.fill("#backupIn", '{"settings":{}}');
  await page.click("#restaurar");
  await A.aviso(page, "Esa copia no es válida");
  assert.equal(await ls(page, KEY_RESP), null);
  assert.equal((await A.guardados(page)).movs.length, 1);
});

t.test("la confirmación de restaurar se cancela al cambiar el texto", async () => {
  const { page } = await abrir({ datos: unGasto() });
  await A.ir(page, "ajustes");
  await page.fill("#backupIn", JSON.stringify(otrosDatos()));
  await page.click("#restaurar");
  assert.match(await A.texto(page, "#restaurar"), /Tocá de nuevo/);
  await page.fill("#backupIn", JSON.stringify(otrosDatos()) + " ");
  assert.equal(await A.texto(page, "#restaurar"), "Restaurar copia");
});

for (const esquema of ["light", "dark"]) {
  t.test(`Ajustes e Inicio con los avisos nuevos a 390 px sin desbordes (${esquema})`, async () => {
    const { page, errores } = await abrir({ esquema });
    const sinDesborde = async (donde) => {
      const [ancho, vista] = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
      assert.ok(ancho <= vista, `${donde}: ${ancho} > ${vista}`);
    };
    await sembrarCrudo(page, "{texto roto");
    assert.equal(await page.isVisible("#avisoIlegible"), true);
    await sinDesborde("inicio con datos ilegibles");
    await A.ir(page, "ajustes");
    assert.equal(await page.isVisible("#cardRespaldo"), true);
    await sinDesborde("ajustes con respaldo");
    await page.evaluate((d) => localStorage.setItem("finanzas-v1", JSON.stringify(d)), unGasto());
    await page.reload();
    assert.equal(await avisoCopia(page), true);
    await sinDesborde("inicio con aviso de copia");
    await A.ir(page, "ajustes");
    await page.fill("#backupIn", JSON.stringify(otrosDatos()));
    await page.click("#restaurar");
    await sinDesborde("ajustes con la confirmación");
    assert.deepEqual(errores, []);
  });
}

// --- apariencia
const ap = (page) => page.evaluate(() => document.documentElement.dataset.apariencia);

// Escenario: datos de la versión anterior
t.test("apariencia: datos de la versión anterior se ven oscuros", async () => {
  const datos = A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-03", 20, 1, "Ocio", "cine")] });
  const { page } = await abrir({ datos, esquema: "light", sinApariencia: true });
  assert.equal(await ap(page), "oscura");
  assert.deepEqual((await A.guardados(page)).movs, datos.movs);
});

// Escenario: copia de seguridad vieja
t.test("apariencia: copia de seguridad vieja se restaura oscura", async () => {
  const { page, errores } = await abrir();
  await restaurar(page, JSON.stringify(A.v2({ cuentas: [BANCO] })));
  await A.aviso(page, "Copia restaurada");
  assert.equal(await ap(page), "oscura");
  assert.deepEqual(errores, []);
});

// Escenario: la apariencia viaja en la copia
t.test("la apariencia viaja en la copia", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], settings: { apariencia: "clara" } }) });
  await A.ir(page, "ajustes");
  await page.click("#copiarBackup");
  const copia = await A.portapapeles(page);
  const { page: otra } = await abrir();
  assert.equal(await ap(otra), "oscura");
  await restaurar(otra, copia);
  await A.aviso(otra, "Copia restaurada");
  assert.equal(await ap(otra), "clara");
});

// Escenario: apariencia inválida
t.test("apariencia inválida", async () => {
  const { page, errores } = await abrir();
  await restaurar(page, JSON.stringify(A.v2({ cuentas: [BANCO], settings: { apariencia: "rosa" } })));
  await A.aviso(page, "Copia restaurada");
  assert.equal(await ap(page), "oscura");
  await A.ir(page, "ajustes");
  assert.equal(await page.$eval('#segApariencia button[aria-pressed="true"]', (b) => b.dataset.v), "oscura");
  assert.deepEqual(errores, []);
});
