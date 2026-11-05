// Capacidades: objetivos, datos (los objetivos al cargar datos anteriores)
const t = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const AHORRO = (saldo = 400, extra = {}) => A.cta(1, "Ahorro A", saldo, { desde: "2026-01-01", ...extra });
const OBJ = (extra = {}) => ({ id: 50, nombre: "Vacaciones", monto: 1000, cuenta: 1, aporte: 100, inicio: "2026-09", dia: 1, ...extra });
const con = (extra = {}, saldo = 400) => A.v2({ cuentas: [AHORRO(saldo)], objetivos: [OBJ()], ...extra });
const sin = () => A.v2({ cuentas: [AHORRO()] });
const PLAN = { aporte: 100, objetivoFondo: 1000, inicio: "2026-09", saltos: "2026-12" };
const sinEspacios = (s) => s.replace(/\s+/g, " ").trim();

async function lista(page) {
  await page.click("#menuBtn");
  await page.click("#panelObj");
  await page.waitForSelector("#sheetObj:not([hidden])");
}
const tarjeta = async (page, id = 50) => sinEspacios(await page.locator(`#objLista [data-obj="${id}"]`).innerText());
async function editar(page, id = 50) {
  await lista(page);
  await page.click(`#objLista [data-obj="${id}"]`);
  await page.waitForSelector("#sheetObjEd:not([hidden])");
}
async function nuevo(page, v = {}) {
  await lista(page);
  await page.click("#objNuevo");
  await page.waitForSelector("#sheetObjEd:not([hidden])");
  const f = { nombre: "Vacaciones", monto: "1000", cuenta: "Ahorro A", aporte: "100", inicio: "2026-09", ...v };
  if (f.nombre) await page.fill("#obNombre", f.nombre);
  if (f.monto) await page.fill("#obMonto", f.monto);
  if (f.cuenta) await page.selectOption("#obCuenta", { label: f.cuenta });
  if (f.aporte) await page.fill("#obAporte", f.aporte);
  if (f.inicio) await page.fill("#obInicio", f.inicio);
  if (f.dia) await page.fill("#obDia", f.dia);
  if (f.saltos) await page.fill("#obSaltos", f.saltos);
  if (f.limite) await page.fill("#obLimite", f.limite);
}
const objetivos = (page) => page.evaluate(() => S.objetivos);
async function restaurar(page, texto) {
  await A.ir(page, "ajustes");
  await page.fill("#backupIn", texto);
  await page.click("#restaurar");
  await page.click("#restaurar");
}
const planFilas = (page) => page.locator("#obPlan .item").evaluateAll((els) => els.map((e) => [e.querySelector("span").textContent, e.querySelector(".num").textContent]));

// --- lista de objetivos

// Escenario: objetivo con su progreso
t.test("objetivo con su progreso", async () => {
  const { page } = await abrir({ datos: con() });
  await lista(page);
  const x = await tarjeta(page);
  assert.match(x, /Vacaciones/);
  assert.match(x, /400 de 1000 €/);
  assert.match(x, /40 %/);
  assert.match(x, /En plan/);
});

// Escenario: sin objetivos
t.test("sin objetivos", async () => {
  const { page } = await abrir({ datos: sin() });
  await lista(page);
  assert.equal(await A.texto(page, "#objVacio"), "Todavía no tenés objetivos. Creá uno para seguir lo que ahorrás.");
  assert.equal(await page.isVisible("#objNuevo"), true);
});

// Escenario: objetivo sin cuenta destino
t.test("objetivo sin cuenta destino", async () => {
  const { page } = await abrir({ datos: con({ objetivos: [OBJ({ cuenta: null })] }) });
  await lista(page);
  assert.match(await tarjeta(page), /Elegí una cuenta destino/);
});

// --- crear y editar un objetivo

// Escenario: objetivo completo
t.test("objetivo completo", async () => {
  const { page } = await abrir({ datos: sin() });
  await nuevo(page);
  await page.click("#obGuardar");
  await A.aviso(page, "Objetivo guardado");
  assert.match(await A.texto(page, "#objLista"), /Vacaciones/);
  const [o] = await objetivos(page);
  assert.deepEqual([o.nombre, o.monto, o.cuenta, o.aporte, o.inicio, o.dia], ["Vacaciones", 1000, 1, 100, "2026-09", 1]);
});

// Escenario: sin nombre
t.test("sin nombre", async () => {
  const { page } = await abrir({ datos: sin() });
  await nuevo(page, { nombre: "" });
  await page.click("#obGuardar");
  await A.aviso(page, "Poné un nombre para el objetivo");
  assert.equal((await objetivos(page)).length, 0);
});

// Escenario: monto o aporte inválido
t.test("monto o aporte inválido", async () => {
  const { page } = await abrir({ datos: sin() });
  await nuevo(page, { monto: "0" });
  await page.fill("#obMonto", "0");
  await page.click("#obGuardar");
  await A.aviso(page, "El monto y el aporte tienen que ser mayores que 0");
  await page.fill("#obMonto", "1000");
  await page.fill("#obAporte", "");
  await page.click("#obGuardar");
  assert.equal((await objetivos(page)).length, 0);
});

// Escenario: sin cuenta destino
t.test("sin cuenta destino", async () => {
  const { page } = await abrir({ datos: sin() });
  await nuevo(page, { cuenta: "" });
  await page.click("#obGuardar");
  await A.aviso(page, "Elegí la cuenta destino");
  assert.equal((await objetivos(page)).length, 0);
});

// Escenario: sin mes de inicio
t.test("sin mes de inicio", async () => {
  const { page } = await abrir({ datos: sin() });
  await nuevo(page, { inicio: "" });
  await page.click("#obGuardar");
  await A.aviso(page, "Elegí el mes del primer aporte");
  assert.equal((await objetivos(page)).length, 0);
});

// Escenario: día fuera de rango
t.test("día fuera de rango", async () => {
  const { page } = await abrir({ datos: sin() });
  await nuevo(page, { dia: "31" });
  await page.click("#obGuardar");
  await A.aviso(page, "El día tiene que estar entre 1 y 28");
  assert.equal((await objetivos(page)).length, 0);
});

// Escenario: meses sin aporte con formato inválido
t.test("meses sin aporte con formato inválido", async () => {
  const { page } = await abrir({ datos: sin() });
  await nuevo(page, { saltos: "2026-12, diciembre" });
  await page.click("#obGuardar");
  await A.aviso(page, "Objetivo guardado");
  assert.equal((await objetivos(page))[0].saltos, "2026-12");
});

// Escenario: editar un objetivo
t.test("editar un objetivo", async () => {
  const { page } = await abrir({ datos: con() });
  await editar(page);
  await page.fill("#obAporte", "200");
  await page.click("#obGuardar");
  await A.aviso(page, "Objetivo guardado");
  assert.equal((await objetivos(page))[0].aporte, 200);
  await page.click('#objLista [data-obj="50"]');
  assert.deepEqual((await planFilas(page))[0], ["septiembre 2026", "200 €"]);
});

// Escenario: sin cuentas de bancos ni de inversión
t.test("sin cuentas de bancos ni de inversión", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [A.cta(2, "Tarjeta Y", 0, { tipo: "tarjeta" })] }) });
  await lista(page);
  await page.click("#objNuevo");
  assert.equal(await page.isVisible("#obSinCuentas"), true);
  assert.equal(await A.texto(page, "#obSinCuentas"), "Creá una cuenta de bancos o de inversión en Cuentas para elegirla como destino.");
});

// --- el progreso es el saldo de la cuenta destino

// Escenario: el progreso sigue al saldo
t.test("el progreso sigue al saldo", async () => {
  const { page } = await abrir({ datos: con() });
  await page.evaluate(() => { S.movs.push({ id: 99, tipo: "ingreso", fecha: "2026-10-10", importe: 100, cuenta: 1, cat: "Sueldo", nota: "" }); cambio(); });
  await lista(page);
  const x = await tarjeta(page);
  assert.match(x, /500 de 1000 €/);
  assert.match(x, /50 %/);
});

// Escenario: saldo negativo
t.test("saldo negativo", async () => {
  const { page } = await abrir({ datos: con({}, -50) });
  await lista(page);
  const x = await tarjeta(page);
  assert.match(x, /0 de 1000 €/);
  assert.match(x, /0 %/);
});

// Escenario: objetivo cumplido
t.test("objetivo cumplido", async () => {
  const { page } = await abrir({ datos: con({}, 1200) });
  await lista(page);
  const x = await tarjeta(page);
  assert.match(x, /100 %/);
  assert.match(x, /Lo lograste/);
});

// --- plan mes a mes

// Escenario: plan hasta el monto
t.test("plan hasta el monto", async () => {
  const { page } = await abrir({ datos: con({ objetivos: [OBJ({ monto: 250 })] }) });
  await editar(page);
  assert.deepEqual(await planFilas(page), [["septiembre 2026", "100 €"], ["octubre 2026", "200 €"], ["noviembre 2026", "250 €"]]);
});

// Escenario: mes sin aporte
t.test("mes sin aporte", async () => {
  const { page } = await abrir({ datos: con({ objetivos: [OBJ({ saltos: "2026-10" })] }) });
  await editar(page);
  assert.deepEqual((await planFilas(page)).slice(0, 3), [["septiembre 2026", "100 €"], ["octubre 2026", "100 €"], ["noviembre 2026", "200 €"]]);
});

// Escenario: en plan
t.test("en plan", async () => {
  const { page } = await abrir({ datos: con({}, 200) });
  await lista(page);
  assert.match(await tarjeta(page), /En plan/);
});

// Escenario: atrasado
t.test("atrasado", async () => {
  const { page } = await abrir({ datos: con({}, 150) });
  await lista(page);
  assert.match(await tarjeta(page), /Atrasado 50 €/);
});

// Escenario: meses que todavía no llegaron
t.test("meses que todavía no llegaron", async () => {
  const { page } = await abrir({ datos: con({ objetivos: [OBJ({ monto: 400 })] }) });
  await editar(page);
  assert.equal(await A.texto(page, '[data-plan="2026-11"] .chip'), "Pendiente");
  assert.equal(await A.texto(page, '[data-plan="2026-12"] .chip'), "Pendiente");
});

// --- fecha límite

// Escenario: llega a tiempo
t.test("llega a tiempo", async () => {
  const { page } = await abrir({ datos: con({ objetivos: [OBJ({ monto: 250, limite: "2026-12" })] }) });
  await lista(page);
  assert.match(await tarjeta(page), /Llegás a tiempo/);
});

// Escenario: llega tarde
t.test("llega tarde", async () => {
  const { page } = await abrir({ datos: con({ objetivos: [OBJ({ monto: 250, limite: "2026-10" })] }) });
  await lista(page);
  assert.match(await tarjeta(page), /Llegás 1 mes tarde/);
});

// Escenario: sin fecha límite
t.test("sin fecha límite", async () => {
  const { page } = await abrir({ datos: con({ objetivos: [OBJ({ monto: 250 })] }) });
  await lista(page);
  assert.doesNotMatch(await tarjeta(page), /Llegás/);
});

// --- aviso de transferencia en Inicio

// Escenario: toca transferir
t.test("toca transferir", async () => {
  const { page } = await abrir({ datos: con({}, 150) });
  assert.equal(await page.isVisible("#objCard"), true);
  assert.match(await A.texto(page, "#objCard"), /Toca transferir/);
  assert.match(await A.texto(page, "#objCardLista"), /Transferí 50 € a Ahorro A para Vacaciones/);
});

// Escenario: todavía no es el día
t.test("todavía no es el día", async () => {
  const { page } = await abrir({ datos: con({ objetivos: [OBJ({ dia: 20 })] }, 150) });
  assert.equal(await page.isVisible("#objCard"), false);
});

// Escenario: los atrasos suman
t.test("los atrasos suman", async () => {
  const { page } = await abrir({ datos: con({}, 50) });
  assert.match(await A.texto(page, "#objCardLista"), /Transferí 150 €/);
});

// Escenario: va en plan
t.test("va en plan", async () => {
  const { page } = await abrir({ datos: con({}, 400) });
  assert.equal(await page.isVisible("#objCard"), false);
});

// Escenario: dos objetivos
t.test("dos objetivos", async () => {
  const datos = A.v2({ cuentas: [AHORRO(150), A.cta(2, "Ahorro B", 170, { desde: "2026-01-01" })], objetivos: [OBJ(), OBJ({ id: 51, nombre: "Viaje", cuenta: 2 })] });
  const { page } = await abrir({ datos });
  const x = await A.texto(page, "#objCardLista");
  assert.match(x, /Transferí 50 € a Ahorro A para Vacaciones/);
  assert.match(x, /Transferí 30 € a Ahorro B para Viaje/);
});

// Escenario: objetivo cumplido sin aviso
t.test("objetivo cumplido sin aviso", async () => {
  const { page } = await abrir({ datos: con({}, 1200) });
  assert.equal(await page.isVisible("#objCard"), false);
});

// --- recordatorio en el calendario

const calendario = async (page) => {
  const [d] = await Promise.all([page.waitForEvent("download"), page.click("#obCal")]);
  return fs.readFileSync(await d.path(), "utf8");
};
const desplegar = (txt) => txt.replace(/\r\n /g, "");

// Escenario: recordatorio mensual
t.test("recordatorio mensual", async () => {
  const { page } = await abrir({ datos: con({ objetivos: [OBJ({ dia: 5 })] }) });
  await editar(page);
  const txt = desplegar(await calendario(page));
  assert.match(txt, /DTSTART:20261105T090000/);
  assert.match(txt, /RRULE:FREQ=MONTHLY;BYMONTHDAY=5;COUNT=8/);
  assert.match(txt, /SUMMARY:Transferir 100 € a Ahorro A \(Vacaciones\)/);
});

// Escenario: mes sin aporte en el calendario
t.test("mes sin aporte en el calendario", async () => {
  const { page } = await abrir({ datos: con({ objetivos: [OBJ({ dia: 5, saltos: "2026-12" })] }) });
  await editar(page);
  const txt = desplegar(await calendario(page));
  assert.match(txt, /EXDATE:20261205T090000/);
});

// Escenario: objetivo cumplido en el calendario
t.test("objetivo cumplido en el calendario", async () => {
  const { page } = await abrir({ datos: con({}, 1200) });
  await editar(page);
  const bajo = page.waitForEvent("download", { timeout: 1500 }).then(() => true, () => false);
  await page.click("#obCal");
  await A.aviso(page, "Este objetivo ya llegó a su monto.");
  assert.equal(await bajo, false);
});

// Escenario: nombre con caracteres especiales
t.test("nombre con caracteres especiales", async () => {
  const { page } = await abrir({ datos: con({ objetivos: [OBJ({ nombre: "Casa; ahorro, año 1" })] }) });
  await editar(page);
  const crudo = await calendario(page);
  assert.ok(crudo.split("\r\n").every((l) => l.length <= 75));
  assert.match(desplegar(crudo), /SUMMARY:Transferir 100 € a Ahorro A \(Casa\; ahorro\\, año 1\)/);
});

// --- borrar un objetivo

// Escenario: borrar con confirmación
t.test("borrar con confirmación", async () => {
  const { page } = await abrir({ datos: con() });
  await editar(page);
  await page.click("#obBorrar");
  assert.equal(await A.texto(page, "#obBorrar"), "Tocá de nuevo para borrar el objetivo");
  await page.click("#obBorrar");
  await page.waitForSelector("#sheetObj:not([hidden])");
  assert.doesNotMatch(await A.texto(page, "#objLista"), /Vacaciones/);
  assert.equal(await page.evaluate(() => valorCuenta(cuentaDe(1))), 400);
});

// Escenario: un solo toque no borra
t.test("un solo toque no borra", async () => {
  const { page } = await abrir({ datos: con() });
  await editar(page);
  await page.click("#obBorrar");
  await page.click("#obCerrar");
  assert.match(await A.texto(page, "#objLista"), /Vacaciones/);
  assert.equal((await objetivos(page)).length, 1);
});

// --- objetivos en Cierre

// Escenario: estado en Cierre
t.test("estado en Cierre", async () => {
  const { page } = await abrir({ datos: con({}, 150) });
  await A.ir(page, "mes");
  const x = sinEspacios(await A.texto(page, "#objCierre"));
  assert.match(x, /Vacaciones/);
  assert.match(x, /Atrasado 50 €/);
});

// Escenario: sin objetivos en Cierre
t.test("sin objetivos en Cierre", async () => {
  const { page } = await abrir({ datos: sin() });
  await A.ir(page, "mes");
  assert.equal(await A.texto(page, "#objCierre"), "Todavía no tenés objetivos. Creá uno desde el panel.");
});

// --- datos: los objetivos al cargar datos anteriores

// Escenario: el plan del fondo pasa a ser un objetivo
t.test("el plan del fondo pasa a ser un objetivo", async () => {
  const { page } = await abrir({ datos: A.v2({ settings: PLAN, cuentas: [A.cta(1, "Fondo A", 0, { fondo: true })] }) });
  const os = await objetivos(page);
  assert.equal(os.length, 1);
  const { id, ...resto } = os[0];
  assert.ok(id);
  assert.deepEqual(resto, { nombre: "Fondo de emergencia", monto: 1000, cuenta: 1, aporte: 100, inicio: "2026-09", dia: 1, saltos: "2026-12" });
});

// Escenario: sin plan no hay objetivos
t.test("sin plan no hay objetivos", async () => {
  const { page } = await abrir({ datos: sin() });
  assert.deepEqual(await objetivos(page), []);
});

// Escenario: plan sin cuenta de fondo
t.test("plan sin cuenta de fondo", async () => {
  const { page } = await abrir({ datos: A.v2({ settings: PLAN, cuentas: [AHORRO()] }) });
  const [o] = await objetivos(page);
  assert.equal(o.nombre, "Fondo de emergencia");
  assert.equal(o.cuenta, null);
});

// Escenario: una copia de seguridad vieja
t.test("una copia de seguridad vieja", async () => {
  const { page } = await abrir({ datos: sin() });
  await restaurar(page, JSON.stringify(A.v2({ settings: PLAN, cuentas: [A.cta(1, "Fondo A", 0, { fondo: true })] })));
  await A.aviso(page, "Copia restaurada");
  const [o] = await objetivos(page);
  assert.deepEqual([o.nombre, o.monto, o.aporte, o.inicio], ["Fondo de emergencia", 1000, 100, "2026-09"]);
});

// Escenario: cargar dos veces no duplica
t.test("cargar dos veces no duplica", async () => {
  const { page } = await abrir({ datos: A.v2({ settings: PLAN, cuentas: [A.cta(1, "Fondo A", 0, { fondo: true })] }) });
  const antes = await objetivos(page);
  await page.evaluate(() => persist());
  await page.reload();
  await page.waitForFunction(() => typeof S !== "undefined" && S.objetivos);
  const despues = await objetivos(page);
  assert.equal(despues.length, 1);
  assert.equal(despues[0].id, antes[0].id);
});

// Escenario: objetivo con datos inválidos
t.test("objetivo con datos inválidos", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [AHORRO()], objetivos: [{ id: 1, nombre: "", monto: 100, aporte: 10, inicio: "2026-09" }, { id: 2, nombre: "Mal", monto: 0, aporte: 10, inicio: "2026-09" }] }) });
  assert.deepEqual(await objetivos(page), []);
  await lista(page);
  assert.equal(await page.locator("#objLista [data-obj]").count(), 0);
});

// Escenario: cuenta destino que no existe
t.test("cuenta destino que no existe", async () => {
  const { page } = await abrir({ datos: con({ objetivos: [OBJ({ cuenta: 99 })] }) });
  await lista(page);
  const x = await tarjeta(page);
  assert.match(x, /Vacaciones/);
  assert.match(x, /Elegí una cuenta destino/);
});
