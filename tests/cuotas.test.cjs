// Capacidades: cuotas, cuentas (movimientos de una cuenta) y datos (cuenta regresiva de las financiaciones)
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const NOV = "2026-11-15T12:00:00", DIC = "2026-12-15T12:00:00", ENE = "2027-01-15T12:00:00", OCT27 = "2027-10-15T12:00:00";
const BANCO = A.cta(1, "Banco A", 2000);
const TARJ = A.cta(2, "Tarjeta Y", 0, { tipo: "tarjeta" });
const FIN = (extra = {}) => A.cta(3, "Financiera Z", 600, { tipo: "financiacion", cuota: 50, cuotas: 12, cuotasMes: "2026-10", ...extra });
const COMPRA = { ...A.gasto(10, "2026-10-05", 700, 2, "Compras", "notebook"), cuotas: { n: 3, cuota: 240 } };
const sinEspacios = (s) => s.replace(/\s+/g, " ").trim();
const tarjeta = (page) => page.isVisible("#cuotasCard");
const enCuentas = async (opciones) => { const r = await abrir(opciones); await A.ir(r.page, "cuentas"); return r; };
async function restaurar(page, texto) {
  await A.ir(page, "ajustes");
  await page.fill("#backupIn", texto);
  await page.click("#restaurar");
  await page.click("#restaurar");
}
async function verMovs(page, id) {
  await A.ir(page, "cuentas");
  await page.click(`[data-cta="${id}"]`);
  await A.enfocado(page, "cNombre");
  await page.click("#cVerMovs");
}

// --- cuotas

// Escenario: financiación y compra en cuotas
t.test("financiación y compra en cuotas", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, TARJ, FIN()], movs: [COMPRA] }) });
  assert.ok(await tarjeta(page));
  assert.equal(await A.texto(page, "#cuotasMes"), "290 €");
  assert.equal(await A.texto(page, "#cuotasSubI"), "2 cuotas · te quedan por pagar 1320 €");
});

// Escenario: sin cuotas no hay tarjeta
t.test("sin cuotas no hay tarjeta", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  assert.equal(await tarjeta(page), false);
});

// Escenario: una compra en cuotas ya terminada
t.test("una compra en cuotas ya terminada", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, TARJ], movs: [COMPRA] }), hoy: ENE });
  assert.equal(await tarjeta(page), false);
});

// Escenario: financiación sin fecha de fin
t.test("financiación sin fecha de fin", async () => {
  const fin = FIN(); delete fin.cuotas; delete fin.cuotasMes;
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, fin] }) });
  assert.equal(await A.texto(page, "#cuotasMes"), "50 €");
  assert.equal(await A.texto(page, "#cuotasSubI"), "1 cuota");
  await page.click("#cuotasCard");
  assert.match(sinEspacios(await A.texto(page, "#cuFinLista")), /sin fecha de fin/);
  assert.doesNotMatch(await A.texto(page, "#cuFinLista"), /te quedan/);
});

// Escenario: filas de la hoja
t.test("filas de la hoja", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, TARJ, FIN()], movs: [COMPRA] }) });
  await page.click("#cuotasCard");
  const fin = sinEspacios(await A.texto(page, "#cuFinLista"));
  assert.match(fin, /Financiera Z/);
  assert.match(fin, /50 €/);
  assert.match(fin, /faltan 12 \(hasta septiembre 2027\)/);
  assert.match(fin, /600 € te quedan/);
  const compras = sinEspacios(await A.texto(page, "#cuComprasLista"));
  assert.match(compras, /Tarjeta Y/);
  assert.match(compras, /cuota 1 de 3 · 240 €/);
  assert.match(compras, /faltan 3 \(hasta diciembre 2026\)/);
  assert.match(compras, /720 € te quedan/);
  assert.equal(await page.locator('[data-ui="fila-cuota"]').count(), 2);
});

// Escenario: la última cuota
t.test("la última cuota", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, TARJ], movs: [COMPRA] }), hoy: DIC });
  await page.click("#cuotasCard");
  const compras = sinEspacios(await A.texto(page, "#cuComprasLista"));
  assert.match(compras, /cuota 3 de 3 · 240 €/);
  assert.match(compras, /faltan 1 \(hasta diciembre 2026\)/);
});

// Escenario: un mes después
t.test("un mes después", async () => {
  const { page } = await enCuentas({ datos: A.v2({ cuentas: [BANCO, FIN()] }), hoy: NOV });
  assert.match(await A.texto(page, '[data-cta="3"]'), /50 €\/mes · faltan 11 \(hasta septiembre 2027\)/);
});

// Escenario: corregir el número
t.test("corregir el número", async () => {
  const { page } = await enCuentas({ datos: A.v2({ cuentas: [BANCO, FIN()] }), hoy: NOV });
  await page.click('[data-cta="3"]');
  await A.enfocado(page, "cNombre");
  assert.equal(await page.inputValue("#cCuotas"), "11");
  await page.fill("#cCuotas", "8");
  await page.click('#sheetC button[type="submit"]');
  await A.aviso(page, "Cuenta guardada");
  assert.match(await A.texto(page, '[data-cta="3"]'), /faltan 8 \(hasta junio 2027\)/);
  assert.equal((await A.guardados(page)).cuentas.find((c) => c.id === 3).cuotasMes, "2026-11");
});

// Escenario: editar otro dato no reinicia la cuenta
t.test("editar otro dato no reinicia la cuenta", async () => {
  const { page } = await enCuentas({ datos: A.v2({ cuentas: [BANCO, FIN()] }), hoy: NOV });
  await page.click('[data-cta="3"]');
  await A.enfocado(page, "cNombre");
  await page.fill("#cNombre", "Financiera Z2");
  await page.click('#sheetC button[type="submit"]');
  await A.aviso(page, "Cuenta guardada");
  assert.match(await A.texto(page, '[data-cta="3"]'), /faltan 11 \(hasta septiembre 2027\)/);
  assert.equal((await A.guardados(page)).cuentas.find((c) => c.id === 3).cuotasMes, "2026-10");
});

// Escenario: financiación terminada
t.test("financiación terminada", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, FIN()] }), hoy: OCT27 });
  assert.equal(await tarjeta(page), false);
  await A.ir(page, "cuentas");
  assert.match(await A.texto(page, '[data-cta="3"]'), /Sin cuotas pendientes/);
  assert.equal(await A.texto(page, "#cuotasSub"), "");
});

// --- cuentas: ver y editar los movimientos de una cuenta

const GASTOS = [A.gasto(1, "2026-09-10", 30, 2, "Ocio", "cine"), A.gasto(2, "2026-10-03", 40, 2, "Supermercado", "verdulería")];

// Escenario: un mes anterior
t.test("un mes anterior", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, TARJ], movs: GASTOS }) });
  await verMovs(page, 2);
  assert.equal(await A.texto(page, "#mcMes"), "octubre 2026");
  await page.click("#mcAnt");
  assert.equal(await A.texto(page, "#mcMes"), "septiembre 2026");
  assert.equal(await page.locator('#mcLista [data-mov="1"]').count(), 1);
  assert.equal(await page.locator('#mcLista [data-mov="2"]').count(), 0);
});

// Escenario: marcar un gasto importado como compra en cuotas
t.test("marcar un gasto importado como compra en cuotas", async () => {
  const datos = A.v2({ cuentas: [BANCO, TARJ], movs: [A.gasto(1, "2026-09-10", 700, 2, "Compras", "notebook")] });
  const { page } = await abrir({ datos });
  await verMovs(page, 2);
  await page.click("#mcAnt");
  await page.click('#mcLista [data-mov="1"] .linea');
  await A.hojaLista(page);
  await page.check("#mCuotasOn");
  await page.fill("#mCuotasN", "3");
  await page.fill("#mCuotaV", "240");
  await page.click("#mGuardar");
  await A.aviso(page, "Gasto guardado");
  assert.ok(await page.isVisible("#sheetMovsCta"), "vuelve a la lista");
  assert.equal(await A.texto(page, "#mcMes"), "septiembre 2026");
  const fila = sinEspacios(await A.texto(page, '#mcLista [data-mov="1"]'));
  assert.match(fila, /Cuota 1 de 3/);
  assert.match(fila, /−240 €/);
  await page.click("#mcSig");
  assert.match(sinEspacios(await A.texto(page, '#mcLista [data-mov="1"]')), /Cuota 2 de 3/);
});

// Escenario: incluye las transferencias
t.test("incluye las transferencias", async () => {
  const datos = A.v2({ cuentas: [BANCO, FIN()], movs: [A.transf(5, "2026-10-05", 50, 1, 3)] });
  const { page } = await abrir({ datos });
  await verMovs(page, 3);
  assert.equal(await page.locator('#mcLista [data-mov="5"]').count(), 1);
});

// Escenario: mes sin movimientos
t.test("mes sin movimientos", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, TARJ], movs: GASTOS }) });
  await verMovs(page, 2);
  await page.click("#mcAnt");
  await page.click("#mcAnt");
  assert.equal(await A.texto(page, "#mcMes"), "agosto 2026");
  assert.equal(await A.texto(page, "#mcVacioTxt"), "Sin movimientos de Tarjeta Y en agosto de 2026.");
});

// Escenario: no se avanza más allá del mes actual
t.test("no se avanza más allá del mes actual", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, TARJ], movs: GASTOS }) });
  await verMovs(page, 2);
  assert.equal(await page.isDisabled("#mcSig"), true);
});

// Pruebas extra: borrar desde la lista y textos escapados
t.test("borrar un movimiento desde la lista de la cuenta", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, TARJ], movs: GASTOS }) });
  await verMovs(page, 2);
  await page.click('#mcLista [data-mov="2"] .linea');
  await page.click("#mBorrar");
  await page.click("#mBorrar");
  await A.aviso(page, "Movimiento borrado");
  assert.equal(await page.locator('#mcLista [data-mov="2"]').count(), 0);
  assert.equal((await A.guardados(page)).movs.length, 1);
});

t.test("el nombre de la cuenta se escapa en las cuotas y en la lista", async () => {
  const sucio = '<b id="inyectado">x</b>';
  const datos = A.v2({ cuentas: [BANCO, { ...TARJ, nombre: sucio }, FIN({ nombre: sucio })], movs: [COMPRA, A.gasto(11, "2026-10-04", 5, 2, "Ocio", sucio)] });
  const { page, errores } = await abrir({ datos });
  await page.click("#cuotasCard");
  assert.equal(await page.locator("#inyectado").count(), 0);
  await page.click("#cuotasCerrar");
  await verMovs(page, 2);
  assert.equal(await page.locator("#inyectado").count(), 0);
  assert.deepEqual(errores, []);
});

// --- datos: financiaciones guardadas antes de la cuenta regresiva

const sinMes = () => { const f = FIN(); delete f.cuotasMes; return f; };

// Escenario: datos de la versión anterior
t.test("datos de la versión anterior (cuotas)", async () => {
  const { page } = await enCuentas({ datos: A.v2({ cuentas: [BANCO, sinMes()] }) });
  assert.match(await A.texto(page, '[data-cta="3"]'), /faltan 12 \(hasta septiembre 2027\)/);
  assert.equal((await A.guardados(page)).cuentas.find((c) => c.id === 3).cuotasMes, "2026-10");
});

// Escenario: copia de seguridad vieja
t.test("copia de seguridad vieja (cuotas)", async () => {
  const { page, errores } = await abrir({ hoy: NOV });
  await restaurar(page, JSON.stringify(A.v2({ cuentas: [BANCO, sinMes()] })));
  await A.aviso(page, "Copia restaurada");
  await A.ir(page, "cuentas");
  assert.match(await A.texto(page, '[data-cta="3"]'), /faltan 12 \(hasta octubre 2027\)/);
  assert.deepEqual(errores, []);
});

// Escenario: el mes de partida viaja en la copia
t.test("el mes de partida viaja en la copia", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, FIN()] }) });
  await A.ir(page, "ajustes");
  await page.click("#copiarBackup");
  const copia = await A.portapapeles(page);
  const { page: otra } = await abrir({ hoy: NOV });
  await restaurar(otra, copia);
  await A.aviso(otra, "Copia restaurada");
  await A.ir(otra, "cuentas");
  assert.match(await A.texto(otra, '[data-cta="3"]'), /faltan 11 \(hasta septiembre 2027\)/);
});

// Escenario: mes de partida inválido
t.test("mes de partida inválido", async () => {
  const { page, errores } = await abrir();
  await restaurar(page, JSON.stringify(A.v2({ cuentas: [BANCO, FIN({ cuotasMes: "2026-13" })] })));
  await A.aviso(page, "Copia restaurada");
  await A.ir(page, "cuentas");
  assert.match(await A.texto(page, '[data-cta="3"]'), /faltan 12 \(hasta septiembre 2027\)/);
  assert.equal((await A.guardados(page)).cuentas.find((c) => c.id === 3).cuotasMes, "2026-10");
  assert.deepEqual(errores, []);
});

// Pruebas extra: nada se desborda a 390 px, en las dos apariencias
t.test("las hojas de cuotas y de movimientos caben en 390 px", async () => {
  for (const apariencia of ["oscura", "clara"]) {
    const datos = A.v2({ settings: { apariencia }, cuentas: [BANCO, TARJ, FIN()], movs: [COMPRA, ...GASTOS] });
    const { page } = await abrir({ datos });
    const ancho = () => page.evaluate(() => document.documentElement.scrollWidth);
    assert.ok(await ancho() <= 390, `${apariencia}: Inicio ${await ancho()}`);
    await page.click("#cuotasCard");
    assert.ok(await ancho() <= 390, `${apariencia}: hoja de cuotas ${await ancho()}`);
    await page.click("#cuotasCerrar");
    await verMovs(page, 2);
    assert.ok(await ancho() <= 390, `${apariencia}: movimientos de la cuenta ${await ancho()}`);
  }
});
