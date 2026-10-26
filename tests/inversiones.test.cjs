// Capacidad: inversiones
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const BROKER = A.cta(1, "Broker X", 1000, { tipo: "inversion" });
const FONDO_A = { id: 10, cuenta: 1, nombre: "Fondo A" };
const FONDO_B = { id: 11, cuenta: 1, nombre: "Fondo B" };
const compra = (id, activo, cantidad, precio, fecha = "2026-10-10", extra = {}) => ({ id, activo, tipo: "compra", cantidad, precio, fecha, ...extra });
const venta = (id, activo, cantidad, precio, fecha = "2026-10-12") => ({ id, activo, tipo: "venta", cantidad, precio, fecha });
const con = ({ cuentas = [BROKER], activos = [FONDO_A], ops = [], movs = [] } = {}) => ({ datos: A.v2({ cuentas, activos, ops, movs }) });

const hojaInv = async (page) => { await A.ir(page, "cuentas"); await page.click("[data-ver-rend]"); };
const activoTxt = (page, id) => A.texto(page, `[data-activo="${id}"]`).then((x) => x.replace(/\s+/g, " "));
async function operacion(page, { tipo = "compra", cant, precio, com, fecha, activo } = {}) {
  await page.click("[data-nueva-op]");
  if (tipo === "venta") await page.click('#segOpTipo button[data-v="venta"]');
  if (activo) await A.elegir(page, "segOpActivo", activo);
  if (fecha) await page.fill("#oFecha", fecha);
  if (cant !== undefined) await page.fill("#oCant", String(cant));
  if (precio !== undefined) await page.fill("#oPrecio", String(precio));
  if (com !== undefined) await page.fill("#oCom", String(com));
  await page.click('#sheetOp button[type="submit"]');
}
const resumen = (page) => A.texto(page, '#invCuerpo [data-ui="resumen-inversion"]').then((x) => x.replace(/\s+/g, " "));

// Escenario: alta de un activo
t.test("alta de un activo", async () => {
  const { page } = await abrir(con({ activos: [] }));
  await hojaInv(page);
  await page.click("[data-nuevo-activo]");
  await page.fill("#aNombre", "Fondo A");
  await page.click('#sheetAct button[type="submit"]');
  await A.aviso(page, "Activo guardado");
  assert.match(await activoTxt(page, (await A.guardados(page)).activos[0].id), /Fondo A.*0 unidades.*Sin datos todavía/);
});

// Escenario: nombre vacío
t.test("nombre vacío", async () => {
  const { page } = await abrir(con({ activos: [] }));
  await hojaInv(page);
  await page.click("[data-nuevo-activo]");
  await page.click('#sheetAct button[type="submit"]');
  await A.aviso(page, "Poné un nombre para el activo");
  assert.deepEqual((await A.guardados(page)).activos, []);
});

// Escenario: compra
t.test("compra", async () => {
  const { page } = await abrir(con());
  await hojaInv(page);
  await operacion(page, { cant: 10, precio: 50, fecha: "2026-10-10" });
  await A.aviso(page, "Operación guardada");
  assert.match(await activoTxt(page, 10), /10 unidades/);
  assert.match(await resumen(page), /Efectivo 500 €/);
  await page.click("#invCerrar");
  assert.equal(await A.texto(page, '[data-cta="1"] .v .num'), "1000 €");
});

// Escenario: compra con comisión
t.test("compra con comisión", async () => {
  const { page } = await abrir(con());
  await hojaInv(page);
  await operacion(page, { cant: 10, precio: 50, com: 2 });
  await A.aviso(page, "Operación guardada");
  assert.match(await resumen(page), /Efectivo 498 €/);
});

// Escenario: venta parcial
t.test("venta parcial", async () => {
  const { page } = await abrir(con({ ops: [compra(1, 10, 10, 50)] }));
  await hojaInv(page);
  await operacion(page, { tipo: "venta", cant: 4, precio: 60, fecha: "2026-10-12" });
  await A.aviso(page, "Operación guardada");
  assert.match(await activoTxt(page, 10), /6 unidades/);
  assert.match(await resumen(page), /Efectivo 740 €/);
});

// Escenario: vender más de lo que se tiene
t.test("vender más de lo que se tiene", async () => {
  const { page } = await abrir(con({ ops: [compra(1, 10, 6, 50)] }));
  await hojaInv(page);
  await operacion(page, { tipo: "venta", cant: 8, precio: 60 });
  await A.aviso(page, "No tenés tantas unidades");
  assert.equal((await A.guardados(page)).ops.length, 1);
});

// Escenario: cantidad o precio en cero
t.test("cantidad o precio en cero", async () => {
  const { page } = await abrir(con());
  await hojaInv(page);
  await operacion(page, { cant: 0, precio: 50 });
  await A.aviso(page, "Poné una cantidad y un precio mayores que 0");
  assert.deepEqual((await A.guardados(page)).ops, []);
});

// Escenario: no es gasto ni ingreso
t.test("no es gasto ni ingreso", async () => {
  const { page } = await abrir(con({ ops: [compra(1, 10, 10, 50, "2026-10-10")] }));
  assert.equal(await A.texto(page, "#gasMes"), "Gastos 0 €");
  assert.equal(await A.texto(page, "#ingMes"), "Ingresos 0 €");
  assert.match(await A.texto(page, "#resultado"), /^0/);
});

// Escenario: efectivo negativo
t.test("efectivo negativo", async () => {
  const { page } = await abrir(con({ cuentas: [A.cta(1, "Broker X", 100, { tipo: "inversion" })] }));
  await hojaInv(page);
  await operacion(page, { cant: 10, precio: 50 });
  await A.aviso(page, "Operación guardada");
  assert.equal((await A.guardados(page)).ops.length, 1);
  assert.match(await A.texto(page, "#invCuerpo"), /El efectivo de esta cuenta quedó en negativo: anotá la transferencia de entrada/);
});

// Escenario: actualizar el precio
t.test("actualizar el precio", async () => {
  const { page } = await abrir(con({ ops: [compra(1, 10, 10, 50)] }));
  await hojaInv(page);
  await page.click('[data-activo="10"]');
  await page.fill("#aPrecioNuevo", "55");
  await page.click("#aPrecioBtn");
  await A.aviso(page, "Precio actualizado");
  await page.click("#aCerrar");
  assert.match(await activoTxt(page, 10), /550 €/);
});

// Escenario: precio más viejo no pisa al nuevo
t.test("precio más viejo no pisa al nuevo", async () => {
  const { page } = await abrir(con({ activos: [{ ...FONDO_A, precio: 55, fechaPrecio: "2026-10-20" }] }));
  await hojaInv(page);
  await operacion(page, { cant: 1, precio: 52, fecha: "2026-10-12" });
  await A.aviso(page, "Operación guardada");
  assert.match(await activoTxt(page, 10), /precio 55 €/);
});

// Escenario: precio inválido
t.test("precio inválido", async () => {
  const { page } = await abrir(con({ ops: [compra(1, 10, 10, 50)] }));
  await hojaInv(page);
  await page.click('[data-activo="10"]');
  await page.fill("#aPrecioNuevo", "0");
  await page.click("#aPrecioBtn");
  await A.aviso(page, "Poné un precio mayor que 0");
});

// Escenario: valor con una posición
t.test("valor con una posición", async () => {
  const { page } = await abrir(con({ activos: [{ ...FONDO_A, precio: 55, fechaPrecio: "2026-10-12" }], ops: [compra(1, 10, 10, 50)] }));
  await A.ir(page, "cuentas");
  assert.equal(await A.texto(page, '[data-cta="1"] .v .num'), "1050 €");
  assert.equal(await A.texto(page, "#activos"), "1050 €");
});

// Escenario: cuenta sin activos
t.test("cuenta sin activos", async () => {
  const { page } = await abrir(con({ cuentas: [A.cta(1, "Broker X", 2000, { tipo: "inversion", aportado: 1500 })], activos: [] }));
  await A.ir(page, "cuentas");
  assert.equal(await A.texto(page, '[data-cta="1"] .v .num'), "2000 €");
  assert.match(await A.texto(page, '[data-cta="1"]'), /\+500 € \(\+33,3 %\) sobre 1500 €/);
});

// Escenario: rendimiento con una venta
t.test("rendimiento con una venta", async () => {
  const { page } = await abrir(con({ ops: [compra(1, 10, 10, 50), venta(2, 10, 4, 60)] }));
  await hojaInv(page);
  const x = await activoTxt(page, 10);
  assert.match(x, /360 €/);
  assert.match(x, /\+100 € \(\+20,0 %\)/);
});

// Escenario: precio subido
t.test("precio subido", async () => {
  const { page } = await abrir(con({ activos: [{ ...FONDO_A, precio: 55, fechaPrecio: "2026-10-12" }], ops: [compra(1, 10, 10, 50)] }));
  await hojaInv(page);
  assert.match(await activoTxt(page, 10), /\+50 € \(\+10,0 %\)/);
});

// Escenario: activo sin compras
t.test("activo sin compras", async () => {
  const { page } = await abrir(con());
  await hojaInv(page);
  assert.match(await activoTxt(page, 10), /Sin datos todavía/);
});

// Escenario: rendimiento de la cuenta
t.test("rendimiento de la cuenta", async () => {
  const datos = con({
    activos: [{ ...FONDO_A, precio: 55, fechaPrecio: "2026-10-12" }, { ...FONDO_B, precio: 28, fechaPrecio: "2026-10-12" }],
    ops: [compra(1, 10, 10, 50), compra(2, 11, 10, 30)],
  });
  const { page } = await abrir(datos);
  await hojaInv(page);
  assert.match(await resumen(page), /Rendimiento \+30 €/);
});

// Escenario: sin cuentas de inversión
t.test("sin cuentas de inversión", async () => {
  const { page } = await abrir(con({ cuentas: [A.cta(2, "Banco A", 500)], activos: [] }));
  await A.ir(page, "cuentas");
  assert.equal(await page.locator("[data-ver-rend]").count(), 0);
});

// Escenario: borrar una operación
t.test("borrar una operación", async () => {
  const { page } = await abrir(con({ ops: [compra(1, 10, 10, 50)] }));
  await hojaInv(page);
  await page.click('[data-activo="10"]');
  await page.click('[data-op="1"]');
  await page.click("#oBorrar");
  await page.click("#oBorrar");
  await A.aviso(page, "Operación borrada");
  assert.match(await activoTxt(page, 10), /0 unidades/);
  assert.match(await resumen(page), /Efectivo 1000 €/);
});

// Escenario: borrar una compra que respalda ventas
t.test("borrar una compra que respalda ventas", async () => {
  const { page } = await abrir(con({ ops: [compra(1, 10, 10, 50, "2026-10-01"), venta(2, 10, 4, 60, "2026-10-05"), venta(3, 10, 6, 60, "2026-10-06")] }));
  await hojaInv(page);
  await page.click('[data-activo="10"]');
  await page.click('[data-op="1"]');
  await page.click("#oBorrar");
  await page.click("#oBorrar");
  await A.aviso(page, "Esa compra respalda ventas posteriores");
  assert.equal((await A.guardados(page)).ops.length, 3);
});

// Escenario: borrar un activo con operaciones
t.test("borrar un activo con operaciones", async () => {
  const { page } = await abrir(con({ ops: [compra(1, 10, 10, 50), compra(2, 10, 2, 48)] }));
  await hojaInv(page);
  await page.click('[data-activo="10"]');
  await page.click("#aBorrar");
  assert.match(await A.texto(page, "#aBorrar"), /se borran sus 2 operaciones/);
  await page.click("#aBorrar");
  await A.aviso(page, "Activo borrado");
  assert.match(await resumen(page), /Efectivo 1000 €/);
  const g = await A.guardados(page);
  assert.deepEqual([g.activos.length, g.ops.length], [0, 0]);
});

// Escenario: borrar la cuenta
t.test("borrar la cuenta", async () => {
  const { page } = await abrir(con({ ops: [compra(1, 10, 10, 50)] }));
  await A.ir(page, "cuentas");
  await page.click('[data-cta="1"]');
  await page.click("#cBorrar");
  await page.click("#cBorrar");
  await A.aviso(page, "Cuenta borrada");
  const g = await A.guardados(page);
  assert.deepEqual([g.cuentas.length, g.activos.length, g.ops.length], [0, 0, 0]);
});
