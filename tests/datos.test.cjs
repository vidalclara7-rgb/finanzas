// Capacidad: datos
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const ANTERIOR = () => {
  const d = A.datosEjemplo();
  delete d.cuentas;
  return d;
};

async function restaurar(page, texto) {
  await A.ir(page, "ajustes");
  await page.fill("#backupIn", texto);
  await page.click("#restaurar");
}

// Escenario: se conserva al volver a abrir
t.test("se conserva al volver a abrir", async () => {
  const { page, ctx } = await abrir();
  await A.nuevoGasto(page, { importe: 10, nota: "prueba" });
  await A.aviso(page, "Gasto guardado");
  await A.ir(page, "cuentas");
  await A.nuevaCuenta(page, { nombre: "Banco A", saldo: 500 });
  await A.aviso(page, "Cuenta guardada");
  await page.close();
  const otra = await ctx.newPage();
  await otra.clock.setFixedTime(new Date(A.HOY));
  await otra.goto(page.url());
  await A.ir(otra, "movs");
  assert.match(await A.texto(otra, "#movs"), /prueba/);
  await A.ir(otra, "cuentas");
  assert.match(await A.texto(otra, "#grupos"), /Banco A/);
});

// Escenario: nada sale del teléfono
t.test("nada sale del teléfono", async () => {
  const { page } = await abrir();
  const afuera = [];
  page.on("request", (r) => {
    const u = new URL(r.url());
    if (u.hostname !== "127.0.0.1") afuera.push(r.url());
  });
  await A.nuevoGasto(page, { importe: 10 });
  await A.aviso(page, "Gasto guardado");
  await A.ir(page, "cuentas");
  await A.nuevaCuenta(page, { nombre: "Banco A", saldo: 500 });
  await A.aviso(page, "Cuenta guardada");
  await page.reload();
  assert.deepEqual(afuera, []);
});

// Escenario: restaurar una copia
t.test("restaurar una copia", async () => {
  const copia = A.con({
    gastos: [
      { id: 1, fecha: "2026-10-03", importe: 20, cuenta: "tarjeta", cat: "Súper", nota: "" },
      { id: 2, fecha: "2026-10-04", importe: 15, cuenta: "revolut", cat: "Ocio", nota: "" }],
    cuentas: [{ id: 9, tipo: "liquidez", nombre: "Banco A", saldo: 800, actualizado: "2026-10-01" }],
  });
  const { page } = await abrir();
  await restaurar(page, JSON.stringify(copia));
  await A.aviso(page, "Copia restaurada");
  await A.ir(page, "movs");
  assert.equal(await page.locator("#movs .item").count(), 2);
  await A.ir(page, "cuentas");
  assert.match(await A.texto(page, "#grupos"), /Banco A/);
});

// Escenario: copia inválida
t.test("copia inválida", async () => {
  const { page } = await abrir({ datos: A.datosEjemplo() });
  const antes = await A.guardados(page);
  await restaurar(page, "hola");
  await A.aviso(page, "Esa copia no es válida");
  assert.deepEqual(await A.guardados(page), antes);
});

// Escenario: datos guardados antes de Cuentas
t.test("datos guardados antes de Cuentas", async () => {
  const { page, errores } = await abrir({ datos: ANTERIOR() });
  assert.equal(await A.texto(page, "#dispTarjeta"), "435,7 €");
  assert.equal(await A.texto(page, "#fondoVal"), "150 €");
  await A.ir(page, "movs");
  assert.equal(await page.locator("#movs .item").count(), 4);
  await A.ir(page, "cuentas");
  assert.ok(await page.isVisible("#cuentasVacio"));
  assert.deepEqual(errores, []);
});

// Escenario: copia de seguridad anterior a Cuentas
t.test("copia de seguridad anterior a Cuentas", async () => {
  const { page } = await abrir();
  await restaurar(page, JSON.stringify(ANTERIOR()));
  await A.aviso(page, "Copia restaurada");
  await A.ir(page, "cuentas");
  await A.nuevaCuenta(page, { nombre: "Banco A", saldo: 500 });
  await A.aviso(page, "Cuenta guardada");
  assert.equal((await A.guardados(page)).cuentas.length, 1);
});

// Escenario: resumen con cuentas
t.test("resumen con cuentas", async () => {
  const { page } = await abrir({ datos: A.datosEjemplo() });
  await A.ir(page, "ajustes");
  await page.click("#copiarResumen");
  await A.aviso(page, "Resumen copiado");
  const txt = await A.portapapeles(page);
  assert.ok(txt.startsWith("Resumen octubre 2026"), txt.split("\n")[0]);
  assert.match(txt, /Patrimonio neto: 2305 €/);
  for (const c of A.datosEjemplo().cuentas) assert.match(txt, new RegExp(`^- ${c.nombre} \\(`, "m"));
});
