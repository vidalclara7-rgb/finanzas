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
  const grupo = await A.texto(page, "#grupos .card");
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
