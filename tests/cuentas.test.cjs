// Capacidad: cuentas
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const enCuentas = async (opciones) => { const r = await abrir(opciones); await A.ir(r.page, "cuentas"); return r; };

// Escenario: cuenta de banco
t.test("cuenta de banco", async () => {
  const { page } = await enCuentas({ datos: A.con() });
  await A.nuevaCuenta(page, { tipo: "liquidez", nombre: "Banco A", saldo: 1200 });
  await A.aviso(page, "Cuenta guardada");
  const grupo = await A.texto(page, "#grupos .card");
  assert.match(grupo, /Bancos y efectivo/);
  assert.match(grupo, /Banco A/);
  assert.match(grupo, /1200 €/);
  assert.match(grupo, /act\. 15\/10\/26/);
});

// Escenario: cuenta sin nombre
t.test("cuenta sin nombre", async () => {
  const { page } = await enCuentas({ datos: A.con() });
  await A.nuevaCuenta(page, { saldo: 100 });
  await A.aviso(page, "Ponele un nombre a la cuenta");
  assert.deepEqual((await A.guardados(page)).cuentas, []);
});

// Escenario: sin cuentas todavía
t.test("sin cuentas todavía", async () => {
  const { page } = await enCuentas({ datos: A.con() });
  assert.match(await A.texto(page, "#cuentasVacio"), /Tu foto financiera/);
  assert.equal(await A.texto(page, "#addCuenta"), "Agregar cuenta");
  await A.ir(page, "inicio");
  assert.equal(await page.isVisible("#netoCard"), false);
});

// Escenario: patrimonio con todos los tipos
t.test("patrimonio con todos los tipos", async () => {
  const { page } = await enCuentas({ datos: A.datosEjemplo() });
  assert.equal(await A.texto(page, "#neto"), "2305 €");
  assert.equal(await A.texto(page, "#activos"), "3300 €");
  assert.equal(await A.texto(page, "#deudas"), "995 €");
  assert.equal(await A.texto(page, "#cuotasSub"), "Cuotas de financiaciones: 50 € por mes");
  await A.ir(page, "inicio");
  assert.equal(await A.texto(page, "#netoIni"), "2305 €");
});

// Escenario: deuda compartida a favor
t.test("deuda compartida a favor", async () => {
  const { page } = await enCuentas({ datos: A.con({ cuentas: [{ id: 1, tipo: "compartida", nombre: "Gastos del piso", saldo: 30, actualizado: "2026-10-10" }] }) });
  assert.equal(await A.texto(page, "#neto"), "30 €");
  assert.match(await A.texto(page, '[data-cta="1"]'), /Te deben/);
});

// Escenario: ganancia de una inversión
t.test("ganancia de una inversión", async () => {
  const { page } = await enCuentas({ datos: A.datosEjemplo() });
  assert.match(await A.texto(page, '[data-cta="12"]'), /\+100 € \(\+5,0 %\) sobre 2000 €/);
});

// Escenario: disponible de una tarjeta
t.test("disponible de una tarjeta", async () => {
  const { page } = await enCuentas({ datos: A.datosEjemplo() });
  assert.match(await A.texto(page, '[data-cta="13"]'), /Disponible 1150 € de 1500 €/);
});

// Escenario: fin de una financiación
t.test("fin de una financiación", async () => {
  const { page } = await enCuentas({ datos: A.datosEjemplo() });
  assert.match(await A.texto(page, '[data-cta="14"]'), /50 €\/mes · faltan 12 \(hasta septiembre 2027\)/);
});

// Escenario: actualizar un saldo
t.test("actualizar un saldo", async () => {
  const { page } = await enCuentas({ datos: A.datosEjemplo() });
  await page.click('[data-cta="11"]');
  assert.equal(await page.inputValue("#cSaldo"), "1200");
  await page.fill("#cSaldo", "1250");
  await page.click('#sheetC button[type="submit"]');
  await A.aviso(page, "Cuenta guardada");
  const fila = await A.texto(page, '[data-cta="11"]');
  assert.match(fila, /1250 €/);
  assert.match(fila, /act\. 15\/10\/26/);
});

// Escenario: borrar una cuenta
t.test("borrar una cuenta", async () => {
  const { page } = await enCuentas({ datos: A.datosEjemplo() });
  await page.click('[data-cta="11"]');
  await page.click("#cBorrar");
  assert.equal(await A.texto(page, "#cBorrar"), "Tocá de nuevo para borrar");
  await page.click("#cBorrar");
  await A.aviso(page, "Cuenta borrada");
  assert.equal(await page.locator('[data-cta="11"]').count(), 0);
});

// Escenario: patrimonio del mes guardado
t.test("patrimonio del mes guardado", async () => {
  const { page } = await enCuentas({ datos: A.con() });
  await A.nuevaCuenta(page, { tipo: "liquidez", nombre: "Banco A", saldo: 1200 });
  await A.aviso(page, "Cuenta guardada");
  await A.ir(page, "ajustes");
  await page.click("#copiarBackup");
  await A.aviso(page, "Copia de seguridad copiada");
  const copia = JSON.parse(await A.portapapeles(page));
  assert.equal(copia.meses["2026-10"].neto, 1200);
});
