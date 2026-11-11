// Capacidad: cuentas
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const enCuentas = async (opciones) => { const r = await abrir(opciones); await A.ir(r.page, "cuentas"); return r; };
const saldo = (page, id) => A.texto(page, `[data-cta="${id}"] .v .num`);
// Las cuentas de ejemplo en el modelo v2
const EJEMPLO = () => A.v2({ cuentas: [
  A.cta(11, "Banco A", 1200), A.cta(12, "Broker X", 2100, { tipo: "inversion", aportado: 2000 }),
  A.cta(13, "Tarjeta Y", 350, { tipo: "tarjeta", limite: 1500 }), A.cta(14, "Financiera Z", 600, { tipo: "financiacion", cuota: 50, cuotas: 12 }),
  A.cta(15, "Gastos del piso", -45, { tipo: "compartida" })] });

// Escenario: cuenta de banco
t.test("cuenta de banco", async () => {
  const { page } = await enCuentas();
  await A.nuevaCuenta(page, { tipo: "liquidez", nombre: "Banco A", saldo: 1200 });
  await A.aviso(page, "Cuenta guardada");
  const grupo = await A.texto(page, "#grupos .grupo-cta");
  assert.match(grupo, /Bancos y efectivo/);
  assert.match(grupo, /Banco A/);
  assert.match(grupo, /1200 €/);
  assert.match(grupo, /Sin conciliar/);
});

// Escenario: cuenta sin nombre
t.test("cuenta sin nombre", async () => {
  const { page } = await enCuentas();
  await A.nuevaCuenta(page, { saldo: 100 });
  await A.aviso(page, "Ponele un nombre a la cuenta");
  assert.deepEqual((await A.guardados(page)).cuentas, []);
});

// Escenario: sin cuentas todavía
t.test("sin cuentas todavía", async () => {
  const { page } = await enCuentas();
  assert.match(await A.texto(page, "#cuentasVacio"), /Tu foto financiera/);
  assert.equal(await A.texto(page, "#addCuenta"), "Agregar cuenta");
  await A.ir(page, "inicio");
  assert.equal(await page.isVisible("#netoCard"), false);
});

// Escenario: un solo fondo de emergencia
t.test("un solo fondo de emergencia", async () => {
  const { page } = await enCuentas({ datos: A.v2({ cuentas: [A.cta(1, "Fondo A", 500, { fondo: true }), A.cta(2, "Banco A", 900)] }) });
  await page.click('[data-cta="2"]');
  await page.check("#cFondo");
  await page.click('#sheetC button[type="submit"]');
  await A.aviso(page, "Cuenta guardada");
  const c = (await A.guardados(page)).cuentas;
  assert.equal(c.find((x) => x.id === 2).fondo, true);
  assert.equal(c.find((x) => x.id === 1).fondo, undefined);
});

// Escenario: gasto con la tarjeta
t.test("gasto con la tarjeta", async () => {
  const { page } = await enCuentas({ datos: A.v2({ cuentas: [A.cta(2, "Tarjeta Y", 350, { tipo: "tarjeta" })] }) });
  assert.equal(await A.texto(page, "#neto"), "-350 €");
  await A.ir(page, "inicio");
  await A.nuevoGasto(page, { importe: 50, cuenta: "Tarjeta Y" });
  await A.aviso(page, "Gasto guardado");
  await A.ir(page, "cuentas");
  assert.equal(await saldo(page, 2), "-400 €");
  assert.equal(await A.texto(page, "#neto"), "-400 €");
});

// Escenario: movimientos anteriores al saldo de partida
t.test("movimientos anteriores al saldo de partida", async () => {
  const { page } = await enCuentas({ datos: A.v2({ cuentas: [A.cta(1, "Banco A", 1000, { desde: "2026-10-10" })], movs: [A.gasto(1, "2026-10-05", 30, 1)] }) });
  assert.equal(await saldo(page, 1), "1000 €");
});

// Escenario: renombrar una cuenta
t.test("renombrar una cuenta", async () => {
  const { page } = await enCuentas({ datos: A.v2({ cuentas: [A.cta(1, "Banco A", 1000)], movs: [A.gasto(1, "2026-10-05", 30, 1)] }) });
  await page.click('[data-cta="1"]');
  await A.enfocado(page, "cNombre");
  await page.fill("#cNombre", "Banco principal");
  await page.click('#sheetC button[type="submit"]');
  await A.aviso(page, "Cuenta guardada");
  assert.match(await A.texto(page, '[data-cta="1"]'), /Banco principal/);
  assert.equal(await saldo(page, 1), "970 €");
  assert.equal((await A.guardados(page)).movs.length, 1);
});

// Escenario: borrar una cuenta sin movimientos
t.test("borrar una cuenta sin movimientos", async () => {
  const { page } = await enCuentas({ datos: A.v2({ cuentas: [A.cta(1, "Banco A", 1000)] }) });
  await page.click('[data-cta="1"]');
  await page.click("#cBorrar");
  assert.equal(await A.texto(page, "#cBorrar"), "Tocá de nuevo para borrar");
  await page.click("#cBorrar");
  await A.aviso(page, "Cuenta borrada");
  assert.equal(await page.locator('[data-cta="1"]').count(), 0);
});

// Escenario: cuenta con movimientos no se borra
t.test("cuenta con movimientos no se borra", async () => {
  const { page } = await enCuentas({ datos: A.v2({ cuentas: [A.cta(1, "Banco A", 1000)], movs: [A.gasto(1, "2026-10-05", 30, 1)] }) });
  await page.click('[data-cta="1"]');
  await page.click("#cBorrar");
  await page.click("#cBorrar");
  await A.aviso(page, "No se puede borrar: la cuenta tiene movimientos");
  await page.click("#cCerrar");
  assert.equal(await page.locator('[data-cta="1"]').count(), 1);
});

// Escenario: patrimonio del mes guardado
t.test("patrimonio del mes guardado", async () => {
  const { page } = await enCuentas();
  await A.nuevaCuenta(page, { tipo: "liquidez", nombre: "Banco A", saldo: 1200 });
  await A.aviso(page, "Cuenta guardada");
  await A.ir(page, "inicio");
  await A.nuevoGasto(page, { importe: 200, cuenta: "Banco A" });
  await A.aviso(page, "Gasto guardado");
  await A.ir(page, "ajustes");
  await page.click("#copiarBackup");
  await A.aviso(page, "Copia de seguridad copiada");
  assert.equal(JSON.parse(await A.portapapeles(page)).meses["2026-10"].neto, 1000);
});

// Escenario: patrimonio con todos los tipos
t.test("patrimonio con todos los tipos", async () => {
  const { page } = await enCuentas({ datos: EJEMPLO() });
  assert.equal(await A.texto(page, "#neto"), "2305 €");
  assert.equal(await A.texto(page, "#activos"), "3300 €");
  assert.equal(await A.texto(page, "#deudas"), "995 €");
  assert.equal(await A.texto(page, "#cuotasSub"), "Cuotas de financiaciones: 50 € por mes");
  await A.ir(page, "inicio");
  assert.equal(await A.texto(page, "#netoIni"), "2305 €");
});

// Escenario: deuda compartida a favor
t.test("deuda compartida a favor", async () => {
  const { page } = await enCuentas({ datos: A.v2({ cuentas: [A.cta(1, "Gastos del piso", 30, { tipo: "compartida" })] }) });
  assert.equal(await A.texto(page, "#neto"), "30 €");
  assert.match(await A.texto(page, '[data-cta="1"]'), /Te deben/);
});

// Escenario: ganancia de una inversión
t.test("ganancia de una inversión", async () => {
  const { page } = await enCuentas({ datos: EJEMPLO() });
  assert.match(await A.texto(page, '[data-cta="12"]'), /\+100 € \(\+5,0 %\) sobre 2000 €/);
});

// Escenario: disponible de una tarjeta
t.test("disponible de una tarjeta", async () => {
  const { page } = await enCuentas({ datos: EJEMPLO() });
  assert.match(await A.texto(page, '[data-cta="13"]'), /Disponible 1150 € de 1500 €/);
});

// Escenario: fin de una financiación
t.test("fin de una financiación", async () => {
  const { page } = await enCuentas({ datos: EJEMPLO() });
  assert.match(await A.texto(page, '[data-cta="14"]'), /50 €\/mes · faltan 12 \(hasta septiembre 2027\)/);
});

// Escenario: cuotas del mes
t.test("cuotas del mes", async () => {
  const tarj = A.cta(2, "Tarjeta Y", 0, { tipo: "tarjeta" });
  const movs = [{ ...A.gasto(1, "2026-10-15", 700, 2, "Compras"), cuotas: { n: 3, cuota: 240 } }, { ...A.gasto(2, "2026-10-02", 300, 2, "Ocio"), cuotas: { n: 2, cuota: 150 } }];
  const { page } = await enCuentas({ datos: A.v2({ cuentas: [tarj], movs }) });
  await page.click('[data-cta="2"]');
  assert.equal(await A.texto(page, "#cCuotasMes"), "Cuotas de este mes: 390 € · 2 compras en cuotas");
});

// Escenario: sin compras en cuotas
t.test("sin compras en cuotas", async () => {
  const tarj = A.cta(2, "Tarjeta Y", 100, { tipo: "tarjeta" });
  const { page } = await enCuentas({ datos: A.v2({ cuentas: [tarj] }) });
  await page.click('[data-cta="2"]');
  assert.equal(await page.isVisible("#cCuotasMes"), false);
});

// --- cómo se calcula la deuda de la tarjeta
const TARJ_D = (extra = {}) => A.cta(2, "Tarjeta Y", 100, { tipo: "tarjeta", desde: "2026-10-01", ...extra });
async function abreCuenta(page, id) { await A.ir(page, "cuentas"); await page.click(`[data-cta="${id}"]`); await page.waitForSelector("#sheetC:not([hidden])"); }
const filasD = (page) => page.$$eval("#cDesgloseLista .item", (e) => e.map((x) => x.innerText.replace(/\s+/g, " ").trim()));

// Escenario: desglose de la deuda
t.test("desglose de la deuda", async () => {
  const movs = [A.gasto(1, "2026-10-03", 200, 2), A.gasto(2, "2026-10-04", 100, 2), A.transf(3, "2026-10-08", 150, 1, 2), { id: 4, tipo: "ajuste", fecha: "2026-10-09", importe: 10, cuenta: 2, nota: "" }];
  const { page } = await abrir({ datos: A.v2({ cuentas: [A.cta(1, "Banco A", 1000, { desde: "2026-10-01" }), TARJ_D()], movs }) });
  await abreCuenta(page, 2);
  assert.deepEqual(await filasD(page), ["Deuda anotada al empezar 100 €", "Compras + 300 €", "Pagos − 150 €", "Ajustes de conciliación − 10 €", "Deuda de hoy 240 €"]);
});

// Escenario: lo que queda en cuotas
t.test("lo que queda en cuotas", async () => {
  const compra = { ...A.gasto(1, "2026-10-05", 600, 2), cuotas: { n: 3, cuota: 200 } };
  const { page } = await abrir({ datos: A.v2({ cuentas: [TARJ_D({ saldoInicial: 0 })], movs: [compra] }) });
  await abreCuenta(page, 2);
  assert.match(await A.texto(page, "#cDesgloseSub"), /Por pagar en cuotas: 600 €/);
  assert.match(await A.texto(page, "#cDesgloseSub"), /Lo demás: 0 €/);
});

// Escenario: tarjeta sin movimientos
t.test("tarjeta sin movimientos", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [TARJ_D({ saldoInicial: 0 })] }) });
  await abreCuenta(page, 2);
  assert.deepEqual(await filasD(page), ["Deuda anotada al empezar 0 €", "Compras + 0 €", "Pagos + 0 €", "Ajustes de conciliación + 0 €", "Deuda de hoy 0 €"]);
});

// Escenario: otras cuentas no lo muestran
t.test("otras cuentas no lo muestran", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [A.cta(1, "Banco A", 1000)] }) });
  await abreCuenta(page, 1);
  assert.equal(await page.isVisible("#cDesglose"), false);
});

// --- borrar todos los movimientos de una cuenta
const BANCO_M = A.cta(1, "Banco A", 1000, { desde: "2026-10-01" });
const TRES = [A.gasto(1, "2026-10-03", 20, 2), A.gasto(2, "2026-10-04", 30, 2), A.gasto(3, "2026-10-05", 40, 2)];

// Escenario: borrar todos los movimientos de una cuenta
t.test("borrar todos los movimientos de una cuenta", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO_M, TARJ_D()], movs: TRES }) });
  await abreCuenta(page, 2);
  await page.click("#cBorrarMovs");
  assert.equal(await A.texto(page, "#cBorrarMovs"), "Tocá de nuevo: se borran 3 movimientos");
  await page.click("#cBorrarMovs");
  await A.aviso(page, "3 movimientos borrados");
  assert.deepEqual((await A.guardados(page)).movs, []);
  assert.equal(await A.texto(page, "#cCalc"), "-100 €");
});

// Escenario: un solo toque no borra
t.test("un solo toque no borra los movimientos de la cuenta", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO_M, TARJ_D()], movs: TRES }) });
  await abreCuenta(page, 2);
  await page.click("#cBorrarMovs");
  await page.click("#cCerrar");
  assert.equal((await A.guardados(page)).movs.length, 3);
});

// Escenario: las transferencias con otras cuentas
t.test("las transferencias con otras cuentas", async () => {
  const movs = [A.gasto(1, "2026-10-03", 20, 2), A.transf(2, "2026-10-08", 100, 1, 2)];
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO_M, TARJ_D()], movs }) });
  await abreCuenta(page, 2);
  await page.click("#cBorrarMovs");
  assert.equal(await A.texto(page, "#cBorrarMovs"), "Tocá de nuevo: se borran 2 movimientos (1 transferencia con otras cuentas)");
  await page.click("#cBorrarMovs");
  await A.aviso(page, "2 movimientos borrados");
  assert.deepEqual((await A.guardados(page)).movs.filter((m) => m.cuenta === 1 || m.destino === 1), []);
});

// Escenario: la conciliación de la cuenta se borra
t.test("la conciliación de la cuenta se borra", async () => {
  const meses = { "2026-10": { checks: {}, conc: { 2: { real: 0, fecha: "2026-10-15", ok: true } } } };
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO_M, TARJ_D()], movs: TRES, meses }) });
  await abreCuenta(page, 2);
  await page.click("#cBorrarMovs");
  await page.click("#cBorrarMovs");
  await A.aviso(page, "3 movimientos borrados");
  await page.click("#cCerrar");
  await A.ir(page, "mes");
  assert.equal(await A.texto(page, '[data-conc="2"] .chip'), "Sin conciliar");
});

// Escenario: una cuenta sin movimientos
t.test("una cuenta sin movimientos no ofrece borrar", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO_M] }) });
  await abreCuenta(page, 1);
  assert.equal(await page.isVisible("#cBorrarMovs"), false);
});

// Escenario: los reembolsos vuelven a aprobado
t.test("los reembolsos vuelven a aprobado", async () => {
  const R = "Trabajo (reembolsable)";
  const movs = [{ ...A.gasto(1, "2026-10-03", 20, 2, R), reembolso: { estado: "pagado", cobro: 5 } }, A.ingreso(5, "2026-10-10", 20, 1, "Reembolso")];
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO_M, TARJ_D()], movs }) });
  await abreCuenta(page, 1);
  await page.click("#cBorrarMovs");
  await page.click("#cBorrarMovs");
  await A.aviso(page, "1 movimiento borrado");
  const d = await A.guardados(page);
  assert.deepEqual(d.movs.map((m) => [m.id, m.reembolso && m.reembolso.estado]), [[1, "aprobado"]]);
});

// Escenario: los adjuntos se quedan
t.test("los adjuntos se quedan al borrar los movimientos", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO_M, TARJ_D()], movs: TRES }) });
  await abreCuenta(page, 2);
  await page.setInputFiles("#adjIn", { name: "resumen.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 prueba") });
  await page.waitForFunction(() => document.querySelector("#cAdjLista").textContent.includes("resumen.pdf"));
  await page.click("#cBorrarMovs");
  await page.click("#cBorrarMovs");
  await A.aviso(page, "3 movimientos borrados");
  assert.match(await A.texto(page, "#cAdjLista"), /resumen\.pdf/);
});
