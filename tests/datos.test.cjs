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

// Escenario: datos sin paleta
t.test("datos sin paleta", async () => {
  const datos = A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-03", 20, 1)] });
  const { page } = await abrir({ datos });
  assert.equal(await page.evaluate(() => document.documentElement.hasAttribute("data-paleta")), false);
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), "rgb(236, 236, 234)");
  const d = await A.guardados(page);
  assert.deepEqual(d.cuentas, datos.cuentas);
  assert.deepEqual(d.movs, datos.movs);
  await A.ir(page, "ajustes");
  assert.equal(await page.$eval('[data-paleta-op][aria-pressed="true"]', (b) => b.dataset.paletaOp), "viva");
});

// Escenario: copia con paleta
t.test("copia con paleta", async () => {
  const copia = A.v2({ settings: { paleta: "pastel" }, cuentas: [BANCO] });
  const { page } = await abrir();
  await restaurar(page, JSON.stringify(copia));
  await A.aviso(page, "Copia restaurada");
  assert.equal(await page.evaluate(() => document.documentElement.dataset.paleta), "pastel");
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), "rgb(246, 240, 228)");
  assert.equal((await A.guardados(page)).settings.paleta, "pastel");
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
  assert.match(await A.texto(page, '[data-mov="1"]'), /Supermercado · 03\/10/);
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
