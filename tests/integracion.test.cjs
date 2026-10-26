// Pruebas de integración de los ajustes de octubre de 2026: lo que une varias capacidades,
// lo que escribe la persona, los datos viejos y el ancho de iPhone en claro y oscuro.
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 2000);
const TARJ = A.cta(2, "Tarjeta Y", 0, { tipo: "tarjeta" });
const BROKER = A.cta(3, "Broker X", 1000, { tipo: "inversion" });
const FONDO = { id: 10, cuenta: 3, nombre: "Fondo A" };
const compra = (id, cantidad, precio, fecha = "2026-10-10", extra = {}) => ({ id, activo: 10, tipo: "compra", cantidad, precio, fecha, ...extra });
const EN_CUOTAS = { ...A.gasto(1, "2026-10-15", 700, 2, "Compras", "notebook"), cuotas: { n: 3, cuota: 240 } };
const PDF = { name: "factura.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\n%%EOF") };
const NOV = "2026-11-15T12:00:00";
const sinEspacios = (s) => s.replace(/\s+/g, " ").trim();
const guardadosFin = async (page) => (await A.guardados(page));

// --- Lo que escribe la persona se pinta con esc()
t.test("el texto de la persona en inversiones y documentos no se interpreta como HTML", async () => {
  const sucio = '<b id="inyectado">x</b>';
  const datos = A.v2({
    cuentas: [BANCO, { ...BROKER, nombre: 'Broker <u id="en-cuenta">X</u>' }],
    activos: [{ ...FONDO, nombre: sucio }],
    ops: [compra(1, 1, 10)],
    movs: [A.gasto(7, "2026-10-03", 20, 1, "Salud", sucio)],
  });
  const { page, errores } = await abrir({ datos });
  await A.ir(page, "cuentas");
  await page.click("[data-ver-rend]");
  assert.equal(await page.locator("#inyectado, #en-cuenta").count(), 0);
  assert.match(await A.texto(page, "#invCuerpo"), /<b id="inyectado">x<\/b>/);
  await page.click('[data-activo="10"]');
  assert.equal(await page.locator("#inyectado").count(), 0);
  await page.click("#aCerrar");
  await page.click("#invCerrar");
  // documento con un nombre que parece HTML
  await A.ir(page, "movs");
  await page.click("#selBtn");
  await page.click('[data-mov="7"] [data-sel]');
  await page.setInputFiles("#docIn", { name: '<i id="doc-x">.pdf', mimeType: "application/pdf", buffer: PDF.buffer });
  await A.aviso(page, "Documento adjuntado a 1 gasto");
  await page.click('[data-mov="7"] .linea');
  await A.hojaLista(page);
  assert.equal(await page.locator("#doc-x, #inyectado").count(), 0);
  assert.match(await A.texto(page, "#mDocsLista"), /<i id="doc-x">\.pdf/);
  assert.deepEqual(errores, []);
});

// --- Cuotas con otras funciones
t.test("compra en cuotas en otra moneda", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [TARJ], movs: [{ ...EN_CUOTAS, moneda: "USD" }] }) });
  await A.ir(page, "movs");
  const x = sinEspacios(await A.texto(page, '[data-mov="1"]'));
  assert.match(x, /−240 USD/);
  assert.match(x, /Cuota 1 de 3/);
  assert.match(x, /total 700 €|total 700 USD/);
});

t.test("editar una compra en cuotas desde un mes posterior", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [TARJ], movs: [EN_CUOTAS] }), hoy: NOV });
  await A.ir(page, "movs");
  await page.click('[data-mov="1"] .linea');
  await A.hojaLista(page);
  assert.equal(await page.inputValue("#mFecha"), "2026-10-15");
  assert.equal(await page.inputValue("#mImporte"), "700");
  assert.equal(await page.isChecked("#mCuotasOn"), true);
  assert.equal(await page.inputValue("#mCuotasN"), "3");
  await page.fill("#mCuotasN", "4");
  await page.fill("#mCuotaV", "175");
  await page.click("#mGuardar");
  await A.aviso(page, "Gasto guardado");
  const x = sinEspacios(await A.texto(page, '[data-mov="1"]'));
  assert.match(x, /Cuota 2 de 4/);
  assert.match(x, /−175 €/);
  assert.equal(await A.texto(page, "#totGas"), "175 €");
});

t.test("quitar las cuotas devuelve el gasto entero a su mes", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [TARJ], movs: [EN_CUOTAS] }), hoy: NOV });
  await A.ir(page, "movs");
  await page.click('[data-mov="1"] .linea');
  await A.hojaLista(page);
  await page.uncheck("#mCuotasOn");
  await page.click("#mGuardar");
  await A.aviso(page, "Gasto guardado");
  const g = await guardadosFin(page);
  assert.equal(g.movs[0].cuotas, undefined);
  assert.equal(await page.locator('[data-mov="1"]').count(), 0, "el gasto vuelve a octubre");
  assert.equal(await A.texto(page, "#totGas"), "0 €");
});

t.test("cambiar una compra en cuotas a una cuenta de bancos descarta las cuotas", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, TARJ], movs: [EN_CUOTAS] }) });
  await A.ir(page, "movs");
  await page.click('[data-mov="1"] .linea');
  await A.hojaLista(page);
  await A.elegir(page, "segCuentaM", "Banco A");
  await page.click("#mGuardar");
  await A.aviso(page, "Gasto guardado");
  assert.equal((await guardadosFin(page)).movs[0].cuotas, undefined);
  assert.equal(await A.texto(page, "#totGas"), "700 €");
});

t.test("datos con cuotas inválidas se tratan como gasto normal", async () => {
  const malas = [{ ...EN_CUOTAS, id: 1, cuotas: { n: 1, cuota: 240 } }, { ...EN_CUOTAS, id: 2, cuotas: { n: 3, cuota: 900 } }, { ...EN_CUOTAS, id: 3, cuenta: 1, cuotas: { n: 3, cuota: 240 } }, { ...EN_CUOTAS, id: 4, cuotas: "x" }];
  const { page, errores } = await abrir({ datos: A.v2({ cuentas: [BANCO, TARJ], movs: malas }) });
  await A.ir(page, "movs");
  assert.equal(await A.texto(page, "#totGas"), "2800 €");
  assert.equal(await page.locator('[data-ui="chip-cuota"]').count(), 0);
  assert.deepEqual(errores, []);
});

// --- Documentos y cuotas
t.test("adjuntar un documento a la cuota de un mes posterior", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [TARJ], movs: [EN_CUOTAS] }), hoy: NOV });
  await A.ir(page, "movs");
  await page.click("#selBtn");
  await page.click('[data-mov="1"] [data-sel]');
  await page.setInputFiles("#docIn", PDF);
  await A.aviso(page, "Documento adjuntado a 1 gasto");
  assert.equal(await page.locator('[data-mov="1"] [data-ui="chip-documento"]').count(), 1);
  assert.equal(await page.locator('[data-mov="1"] [data-ui="chip-cuota"]').count(), 1);
});

// Escenario: salir de Movimientos cancela el modo seleccionar
t.test("salir de Movimientos cancela el modo seleccionar", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-03", 10, 1)] }) });
  await A.ir(page, "movs");
  await page.click("#selBtn");
  await page.click('[data-mov="1"] [data-sel]');
  await A.ir(page, "inicio");
  await A.ir(page, "movs");
  assert.equal(await page.locator("#movs [data-sel]").count(), 0);
  assert.equal(await page.isVisible("#selBtn"), true);
});

t.test("tocar la tarjeta en modo seleccionar marca el gasto y no abre la hoja", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-03", 10, 1), A.ingreso(2, "2026-10-02", 50, 1)] }) });
  await A.ir(page, "movs");
  await page.click("#selBtn");
  await page.click('[data-mov="1"] .linea');
  assert.equal(await A.texto(page, "#selN"), "1 seleccionado");
  assert.equal(await page.isVisible("#sheet"), false);
  await page.click('[data-mov="2"] .linea');
  assert.equal(await A.texto(page, "#selN"), "1 seleccionado");
  assert.equal(await page.isVisible("#sheet"), false);
});

// --- Inversiones
t.test("editar una operación de inversión", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BROKER], activos: [FONDO], ops: [compra(1, 10, 50)] }) });
  await A.ir(page, "cuentas");
  await page.click("[data-ver-rend]");
  await page.click('[data-activo="10"]');
  await page.click('[data-op="1"]');
  await A.enfocado(page, "oCant");
  await page.fill("#oCant", "8");
  await page.fill("#oPrecio", "55");
  await page.fill("#oCom", "1");
  await page.click('#sheetOp button[type="submit"]');
  await A.aviso(page, "Operación guardada");
  const g = await guardadosFin(page);
  assert.equal(g.ops.length, 1);
  assert.deepEqual([g.ops[0].cantidad, g.ops[0].precio, g.ops[0].comision], [8, 55, 1]);
  assert.match(sinEspacios(await A.texto(page, "#invCuerpo")), /Efectivo 559 €/);
});

t.test("editar una compra para que deje de cubrir una venta se rechaza", async () => {
  const ops = [compra(1, 10, 50, "2026-10-01"), { id: 2, activo: 10, tipo: "venta", cantidad: 8, precio: 60, fecha: "2026-10-05" }];
  const { page } = await abrir({ datos: A.v2({ cuentas: [BROKER], activos: [FONDO], ops }) });
  await A.ir(page, "cuentas");
  await page.click("[data-ver-rend]");
  await page.click('[data-activo="10"]');
  await page.click('[data-op="1"]');
  await A.enfocado(page, "oCant");
  await page.fill("#oCant", "5");
  await page.click('#sheetOp button[type="submit"]');
  await A.aviso(page, "Esa compra respalda ventas posteriores");
  assert.equal((await guardadosFin(page)).ops[0].cantidad, 10);
});

t.test("cantidades con decimales", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BROKER], activos: [FONDO] }) });
  await A.ir(page, "cuentas");
  await page.click("[data-ver-rend]");
  await page.click("[data-nueva-op]");
  await A.enfocado(page, "oCant");
  await page.fill("#oCant", "0,5");
  await page.fill("#oPrecio", "33,333");
  await page.click('#sheetOp button[type="submit"]');
  await A.aviso(page, "Operación guardada");
  const o = (await guardadosFin(page)).ops[0];
  assert.deepEqual([o.cantidad, o.precio], [0.5, 33.333]);
  assert.match(sinEspacios(await A.texto(page, '[data-activo="10"]')), /0,5 unidades.*precio 33,33 €.*16,67 €/);
});

t.test("el valor de una inversión en una fecha pasada no incluye lo posterior", async () => {
  const datos = A.v2({ cuentas: [BROKER], activos: [{ ...FONDO, precio: 55, fechaPrecio: "2026-10-12" }], ops: [compra(1, 10, 50, "2026-10-10")] });
  const { page } = await abrir({ datos });
  const v = (hasta) => page.evaluate((h) => valorCuenta(S.cuentas[0], h), hasta);
  assert.equal(await v("2026-10-09"), 1000);
  assert.equal(await v("2026-10-11"), 1000);
  assert.equal(await v("2026-10-12"), 1050);
  assert.equal(await v(), 1050);
});

t.test("conciliar una inversión con posiciones", async () => {
  const datos = A.v2({ cuentas: [BROKER], activos: [{ ...FONDO, precio: 55, fechaPrecio: "2026-10-12" }], ops: [compra(1, 10, 50)] });
  const { page, errores } = await abrir({ datos });
  await A.ir(page, "mes");
  await page.click('[data-conc="3"]');
  await page.fill("#kReal", "1080");
  assert.equal(await A.texto(page, "#kCalc"), "1050 €");
  await page.click("#kAjuste");
  await A.aviso(page, "Cuenta conciliada");
  assert.equal(await A.texto(page, '[data-conc="3"] .chip'), "Conciliada");
  await A.ir(page, "cuentas");
  assert.equal(await A.texto(page, '[data-cta="3"] .v .num'), "1080 €");
  assert.deepEqual(errores, []);
});

t.test("el patrimonio neto suma las inversiones con posiciones y se anota en el mes", async () => {
  const datos = A.v2({ cuentas: [BANCO, BROKER], activos: [{ ...FONDO, precio: 55, fechaPrecio: "2026-10-12" }], ops: [compra(1, 10, 50)] });
  const { page } = await abrir({ datos });
  await A.ir(page, "cuentas");
  await page.click('[data-cta="1"]');
  await A.enfocado(page, "cNombre");
  await page.fill("#cNombre", "Banco principal");
  await page.click('#sheetC button[type="submit"]');
  await A.aviso(page, "Cuenta guardada");
  assert.equal(await A.texto(page, "#activos"), "3050 €");
  assert.equal((await guardadosFin(page)).meses["2026-10"].neto, 3050);
});

t.test("las posiciones sobreviven a recargar la app", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BROKER], activos: [], ops: [] }) });
  await A.ir(page, "cuentas");
  await page.click("[data-ver-rend]");
  await page.click("[data-nuevo-activo]");
  await A.enfocado(page, "aNombre");
  await page.fill("#aNombre", "Fondo A");
  await page.click('#sheetAct button[type="submit"]');
  await A.aviso(page, "Activo guardado");
  await page.click("[data-nueva-op]");
  await A.enfocado(page, "oCant");
  await page.fill("#oCant", "10");
  await page.fill("#oPrecio", "50");
  await page.click('#sheetOp button[type="submit"]');
  await A.aviso(page, "Operación guardada");
  await page.reload();
  await A.ir(page, "cuentas");
  assert.equal(await A.texto(page, '[data-cta="3"] .v .num'), "1000 €");
  await page.click("[data-ver-rend]");
  assert.match(sinEspacios(await A.texto(page, '[data-activo]')), /Fondo A.*10 unidades/);
});

// --- Datos de versiones anteriores con las funciones nuevas
t.test("datos de la primera versión abren sin errores y quedan listos para las funciones nuevas", async () => {
  const { page, errores } = await abrir({ datos: A.datosEjemplo() });
  const s = await page.evaluate(() => ({ v: S.v, activos: S.activos, ops: S.ops, n: S.movs.length }));
  assert.equal(s.v, 2);
  assert.deepEqual([s.activos, s.ops], [[], []]);
  assert.ok(s.n > 0);
  for (const v of ["movs", "cuentas", "mes", "inicio"]) await A.ir(page, v);
  assert.deepEqual(errores, []);
});

t.test("restaurar una copia de la primera versión", async () => {
  const { page, errores } = await abrir();
  await A.ir(page, "ajustes");
  await page.fill("#backupIn", JSON.stringify(A.datosEjemplo()));
  await page.click("#restaurar");
  await A.aviso(page, "Copia restaurada");
  const s = await A.guardados(page);
  assert.equal(s.v, 2);
  assert.deepEqual([s.activos, s.ops], [[], []]);
  assert.deepEqual(errores, []);
});

t.test("una copia con campos nuevos mal formados no rompe la app", async () => {
  const sucia = A.v2({
    cuentas: [BANCO, TARJ, BROKER],
    activos: [null, "x", { id: 1, cuenta: 3, nombre: "" }, { id: 2, cuenta: 1, nombre: "En banco" }, { id: 3, cuenta: 3, nombre: "Bueno" }],
    ops: [null, { id: 1, activo: 3, tipo: "dividendo", cantidad: 1, precio: 1, fecha: "2026-10-01" }, { id: 2, activo: 3, tipo: "compra", cantidad: -1, precio: 1, fecha: "2026-10-01" }, { id: 3, activo: 3, tipo: "compra", cantidad: 2, precio: 10, fecha: "2026-10-01", comision: -5 }],
    movs: [{ ...A.gasto(1, "2026-10-03", 10, 1), moneda: 5 }, { ...A.gasto(2, "2026-10-03", 10, 1), moneda: "dólares" }, { ...A.gasto(3, "2026-10-03", 10, 2), cuotas: { n: "3", cuota: "x" } }],
  });
  const { page, errores } = await abrir();
  await A.ir(page, "ajustes");
  await page.fill("#backupIn", JSON.stringify(sucia));
  await page.click("#restaurar");
  await A.aviso(page, "Copia restaurada");
  const s = await A.guardados(page);
  assert.deepEqual(s.activos.map((a) => a.id), [3]);
  assert.deepEqual(s.ops.map((o) => o.id), [3]);
  assert.equal(s.ops[0].comision, undefined);
  for (const v of ["movs", "cuentas", "mes", "inicio"]) await A.ir(page, v);
  assert.deepEqual(errores, []);
  await A.ir(page, "movs");
  assert.doesNotMatch(await A.texto(page, "#movs"), /dólares|NaN|undefined/);
});

// --- Ancho de iPhone, claro y oscuro, sin desbordes ni errores
for (const esquema of ["light", "dark"]) {
  t.test(`pantallas y hojas nuevas a 390 px sin desbordes (${esquema})`, async () => {
    const datos = A.v2({
      cuentas: [BANCO, TARJ, BROKER],
      activos: [FONDO, { id: 11, cuenta: 3, nombre: "Un fondo con un nombre larguísimo para probar el corte de línea" }],
      ops: [compra(1, 10, 50), { ...compra(2, 3, 12.5), activo: 11 }],
      movs: [{ ...EN_CUOTAS, moneda: "CHF" }, A.gasto(5, "2026-10-04", 18, 1, "Servicios mensuales", "una nota bastante larga para ver cómo corta el renglón en pantalla chica"), A.ingreso(6, "2026-10-01", 1700, 1, "Reembolso por regalos")],
    });
    const { page, errores } = await abrir({ datos, esquema });
    const sinDesborde = async (donde) => {
      const [ancho, vista] = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
      assert.ok(ancho <= vista, `${donde}: scrollWidth ${ancho} > ${vista}`);
      const hoja = await page.evaluate(() => [...document.querySelectorAll(".sheet")].filter((s) => !s.hidden).map((s) => [s.scrollWidth, s.clientWidth]));
      for (const [sw, cw] of hoja) assert.ok(sw <= cw, `${donde}: hoja ${sw} > ${cw}`);
    };
    await A.ir(page, "inicio"); await sinDesborde("inicio");
    await A.ir(page, "movs"); await sinDesborde("movs");
    await page.click("#selBtn"); await sinDesborde("movs seleccionar");
    await page.click("#selCancel");
    await page.click("#fab"); await A.hojaLista(page);
    await A.elegir(page, "segCuentaM", "Tarjeta Y"); await page.check("#mCuotasOn"); await A.elegir(page, "segMoneda", "Otra");
    await sinDesborde("hoja de movimiento con cuotas y moneda");
    await page.click("#cerrar");
    await A.ir(page, "cuentas"); await sinDesborde("cuentas");
    await page.click('[data-cta="2"]'); await sinDesborde("hoja de tarjeta"); await page.click("#cCerrar");
    await page.click("[data-ver-rend]"); await sinDesborde("inversiones");
    await page.click('[data-activo="11"]'); await sinDesborde("activo"); await page.click("#aCerrar");
    await page.click("[data-nueva-op]"); await sinDesborde("operación");
    assert.deepEqual(errores, []);
  });
}
