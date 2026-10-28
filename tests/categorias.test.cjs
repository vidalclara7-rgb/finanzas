// Capacidades: categorias, datos (categorías guardadas) y movimientos (siempre fija, desplegable)
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");
const X = require("./extractos.cjs");

const abrir = A.preparar(t);
const BANCO = { ...A.cta(1, "Banco A", 1000, { desde: "2026-08-01" }), ref: "4321" };
const base = (extra = {}) => A.v2({ cuentas: [BANCO], ...extra });
const GASTO_BASE = ["Supermercado", "Comida fuera", "Delivery", "Transporte", "Ocio", "Compras", "Ropa", "Belleza", "Casa/Splitwise", "Salud", "Viajes", "Regalos", "Salidas bar/disco", "Plan Iberia", "Servicios mensuales", "Alquiler", "Carga móvil", "Trabajo (reembolsable)", "Otros"];
const INGRESO_BASE = ["Sueldo", "Reembolso", "Reembolso por regalos", "Venta o trabajo extra", "Regalo", "Intereses y rendimientos", "Otros"];
const nombres = (page, sel) => page.$$eval(`${sel} [data-ed]`, (xs) => xs.map((x) => x.dataset.n));
async function enCategorias(page) { await A.ir(page, "ajustes"); await page.click("#catsCard"); }
async function abrirCategoria(page, nombre, tipo = "g") {
  await page.click(`#sheetCats [data-ed="${tipo}"][data-n="${nombre}"]`);
  await page.waitForSelector("#sheetCatEd", { state: "visible" });
}
async function nueva(page, { tipo = "g", nombre, color, fija } = {}) {
  await page.click(tipo === "g" ? "#ccNuevaG" : "#ccNuevaI");
  await A.enfocado(page, "ceNombre");
  if (nombre !== undefined) await page.fill("#ceNombre", nombre);
  if (color) await page.click(`#ceColores [data-color="${color}"]`);
  if (fija) await page.check("#ceFija");
  await page.click('#sheetCatEd button[type="submit"]');
}
const guardadas = async (page) => (await A.guardados(page)).categorias;
const mov = (fecha, importe, cat, nota = "", id = Math.floor(Math.random() * 1e6)) => A.gasto(id, fecha, importe, 1, cat, nota);
async function restaurar(page, texto) {
  await A.ir(page, "ajustes");
  await page.fill("#backupIn", texto);
  await page.click("#restaurar");
  await page.click("#restaurar");
}
async function importar(page, movs) {
  await A.ir(page, "movs");
  const buf = await X.santanderCuenta(page, { ref: "4321", inicial: 1000, movs });
  await page.setInputFiles("#pdfIn", { name: "extracto.pdf", mimeType: "application/pdf", buffer: buf });
  await page.waitForFunction(() => !document.getElementById("sheetI").hidden, null, { timeout: 20000 });
}
const que = (page, nota) => page.evaluate((n) => document.querySelector(`[data-que="${imp.d.find((d) => d.nota === n).i}"]`).value, nota);
const esFijoTodos = (page) => page.evaluate(() => S.movs.map((m) => esFijo(m)));

// --- categorias

// Escenario: las categorías de siempre
t.test("las categorías de siempre", async () => {
  const { page } = await abrir({ datos: base() });
  await enCategorias(page);
  assert.deepEqual(await nombres(page, "#ccGasto"), GASTO_BASE);
  assert.deepEqual(await nombres(page, "#ccIngreso"), INGRESO_BASE);
});

// Escenario: crear una categoría de gasto
t.test("crear una categoría de gasto", async () => {
  const { page } = await abrir({ datos: base() });
  await enCategorias(page);
  await nueva(page, { nombre: "Mascotas", color: 5 });
  await A.aviso(page, "Categoría guardada");
  const n = await nombres(page, "#ccGasto");
  assert.equal(n[n.length - 2], "Mascotas");
  assert.equal(n[n.length - 1], "Otros");
  assert.equal((await guardadas(page)).gasto.find((c) => c.nombre === "Mascotas").color, 5);
  const punto = await page.$eval('#ccGasto [data-n="Mascotas"] .dot', (d) => d.getAttribute("style"));
  assert.match(punto, /--cat5/);
});

// Escenario: crear una categoría de ingreso
t.test("crear una categoría de ingreso", async () => {
  const { page } = await abrir({ datos: base() });
  await enCategorias(page);
  await nueva(page, { tipo: "i", nombre: "Alquiler cobrado" });
  await A.aviso(page, "Categoría guardada");
  assert.ok((await nombres(page, "#ccIngreso")).includes("Alquiler cobrado"));
});

// Escenario: nombre vacío
t.test("nombre vacío", async () => {
  const { page } = await abrir({ datos: base() });
  await enCategorias(page);
  await nueva(page, { nombre: "" });
  await A.aviso(page, "Poné un nombre para la categoría");
  assert.equal((await guardadas(page)).gasto.length, 19);
});

// Escenario: nombre repetido
t.test("nombre repetido", async () => {
  const { page } = await abrir({ datos: base() });
  await enCategorias(page);
  await nueva(page, { nombre: "  ocio " });
  await A.aviso(page, "Ya tenés una categoría con ese nombre");
  assert.equal((await guardadas(page)).gasto.length, 19);
});

// Escenario: nombre con barra
t.test("nombre con barra", async () => {
  const { page } = await abrir({ datos: base() });
  await enCategorias(page);
  await nueva(page, { nombre: "Luz|Gas" });
  await A.aviso(page, "El nombre no puede llevar el signo |");
  assert.equal((await guardadas(page)).gasto.length, 19);
});

// Escenario: renombrar con movimientos
t.test("renombrar con movimientos", async () => {
  const { page } = await abrir({ datos: base({ movs: [mov("2026-10-05", 20, "Ocio", "cine", 1)] }) });
  await enCategorias(page);
  await abrirCategoria(page, "Ocio");
  await page.fill("#ceNombre", "Salidas");
  await page.click('#sheetCatEd button[type="submit"]');
  await A.aviso(page, "Categoría guardada");
  await page.click("#ccCerrar");
  await A.ir(page, "movs");
  assert.equal((await A.guardados(page)).movs[0].cat, "Salidas");
  await A.ir(page, "inicio");
  assert.equal(await page.locator('#torta circle[data-cat="Salidas"]').count(), 1);
  await page.click('#cats [data-cat="Salidas"]');
  assert.equal(await A.texto(page, "#catTitulo"), "Salidas");
  assert.equal(await A.texto(page, "#catTotal"), "20 €");
});

// Escenario: lo aprendido sigue
t.test("lo aprendido sigue", async () => {
  const { page } = await abrir({ datos: base({ reglas: { "g|bar ejemplo": "Ocio" } }) });
  await enCategorias(page);
  await abrirCategoria(page, "Ocio");
  await page.fill("#ceNombre", "Salidas");
  await page.click('#sheetCatEd button[type="submit"]');
  await A.aviso(page, "Categoría guardada");
  await page.click("#ccCerrar");
  await importar(page, [{ fecha: "2026-10-05", desc: "Bar Ejemplo", importe: -12 }]);
  assert.equal(await que(page, "Bar Ejemplo"), "g|Salidas");
});

// Escenario: cambiar el color
t.test("cambiar el color", async () => {
  const { page } = await abrir({ datos: base({ movs: [mov("2026-10-05", 20, "Ocio", "cine", 1)] }) });
  await enCategorias(page);
  await abrirCategoria(page, "Ocio");
  await page.click('#ceColores [data-color="9"]');
  await page.click('#sheetCatEd button[type="submit"]');
  await A.aviso(page, "Categoría guardada");
  await page.click("#ccCerrar");
  await A.ir(page, "inicio");
  assert.match(await page.$eval('#torta circle[data-cat="Ocio"]', (c) => c.getAttribute("style")), /--cat9/);
  assert.match(await page.$eval('#cats [data-cat="Ocio"] .dot', (d) => d.getAttribute("style")), /--cat9/);
  await A.ir(page, "movs");
  assert.match(await page.$eval('[data-mov="1"]', (m) => m.getAttribute("style")), /--cat9/);
});

// Escenario: borrar con movimientos
t.test("borrar con movimientos", async () => {
  const { page } = await abrir({ datos: base({ movs: [mov("2026-10-05", 20, "Ocio", "a", 1), mov("2026-10-06", 30, "Ocio", "b", 2)], reglas: { "g|bar ejemplo": "Ocio" } }) });
  await enCategorias(page);
  await abrirCategoria(page, "Ocio");
  await page.click("#ceBorrar");
  assert.equal(await A.texto(page, "#ceBorrar"), "Tocá de nuevo: sus 2 movimientos pasan a Otros");
  await page.click("#ceBorrar");
  await A.aviso(page, "Categoría borrada");
  assert.ok(!(await nombres(page, "#ccGasto")).includes("Ocio"));
  const d = await A.guardados(page);
  assert.deepEqual(d.movs.map((m) => m.cat), ["Otros", "Otros"]);
  assert.equal(d.reglas["g|bar ejemplo"], undefined);
});

// Escenario: un solo toque no borra
t.test("un solo toque no borra", async () => {
  const { page } = await abrir({ datos: base() });
  await enCategorias(page);
  await abrirCategoria(page, "Ocio");
  await page.click("#ceBorrar");
  await page.click("#ceCerrar");
  assert.ok((await nombres(page, "#ccGasto")).includes("Ocio"));
});

// Escenario: no se puede borrar Otros
t.test("no se puede borrar Otros", async () => {
  const { page } = await abrir({ datos: base() });
  await enCategorias(page);
  await abrirCategoria(page, "Otros");
  assert.equal(await A.texto(page, "#cePropia"), "Esta categoría tiene un comportamiento propio y no se puede cambiar.");
  assert.equal(await page.isVisible("#ceBorrar"), false);
  assert.equal(await page.isVisible("#ceNombre"), false);
});

// Escenario: activar siempre fija
t.test("activar siempre fija", async () => {
  const movs = [mov("2026-08-05", 40, "Servicios mensuales", "luz", 1), mov("2026-09-05", 80, "Servicios mensuales", "gas", 2), mov("2026-10-05", 45, "Servicios mensuales", "agua", 3)];
  const { page } = await abrir({ datos: base({ movs }) });
  assert.deepEqual(await esFijoTodos(page), [false, false, false]);
  await enCategorias(page);
  await abrirCategoria(page, "Servicios mensuales");
  await page.check("#ceFija");
  await page.click('#sheetCatEd button[type="submit"]');
  await A.aviso(page, "Categoría guardada");
  await page.click("#ccCerrar");
  assert.deepEqual(await esFijoTodos(page), [true, true, true]);
  await A.ir(page, "movs");
  assert.match(await A.texto(page, '[data-mov="3"]'), /Fijo/);
  await A.ir(page, "inicio");
  assert.match(await A.texto(page, "#fv"), /Fijos/);
});

// Escenario: la categoría con interruptor viene marcada
t.test("la categoría con interruptor viene marcada", async () => {
  const cats = (await abrir({ datos: base() })).page;
  await cats.close();
  const datos = base(); datos.categorias = { gasto: GASTO_BASE.map((n, i) => ({ nombre: n, color: i + 1, ...(n === "Alquiler" ? { fija: true } : {}) })), ingreso: INGRESO_BASE.map((n) => ({ nombre: n })) };
  const { page } = await abrir({ datos });
  await page.click("#fab");
  await A.enfocado(page, "mImporte");
  await A.elegir(page, "segCat", "Alquiler");
  assert.equal(await page.isChecked("#mFijo"), true);
});

// Escenario: excepción en un gasto
t.test("excepción en un gasto", async () => {
  const datos = base({ movs: [mov("2026-10-05", 40, "Servicios mensuales", "luz", 1), mov("2026-10-06", 80, "Servicios mensuales", "gas", 2)] });
  datos.categorias = { gasto: GASTO_BASE.map((n, i) => ({ nombre: n, color: i + 1, ...(n === "Servicios mensuales" ? { fija: true } : {}) })), ingreso: INGRESO_BASE.map((n) => ({ nombre: n })) };
  const { page } = await abrir({ datos });
  await A.ir(page, "movs");
  await page.click('[data-mov="1"] .linea');
  await A.enfocado(page, "mImporte");
  assert.equal(await page.isChecked("#mFijo"), true);
  await page.uncheck("#mFijo");
  await page.click("#mGuardar");
  await A.aviso(page, "Gasto guardado");
  assert.deepEqual(await esFijoTodos(page), [false, true]);
});

// Escenario: crear al anotar un gasto
t.test("crear al anotar un gasto", async () => {
  const { page } = await abrir({ datos: base() });
  await page.click("#fab");
  await A.enfocado(page, "mImporte");
  await page.fill("#mImporte", "25");
  await page.selectOption("#mCat", "n|categoria");
  await page.waitForSelector("#sheetCatEd", { state: "visible" });
  await A.enfocado(page, "ceNombre");
  await page.fill("#ceNombre", "Mascotas");
  await page.click('#sheetCatEd button[type="submit"]');
  await page.waitForSelector("#sheet", { state: "visible" });
  assert.equal(await page.inputValue("#mImporte"), "25");
  assert.equal(await page.inputValue("#mCat"), "Mascotas");
});

// Escenario: crear al revisar un extracto
t.test("crear al revisar un extracto", async () => {
  const { page } = await abrir({ datos: base() });
  await importar(page, [{ fecha: "2026-10-05", desc: "Pet Shop", importe: -28 }, { fecha: "2026-10-06", desc: "Consum", importe: -40 }]);
  const antes = await que(page, "Consum");
  const i = await page.evaluate(() => imp.d.find((d) => d.nota === "Pet Shop").i);
  await page.selectOption(`[data-que="${i}"]`, "n|categoria");
  await A.enfocado(page, "ceNombre");
  await page.fill("#ceNombre", "Mascotas");
  await page.click('#sheetCatEd button[type="submit"]');
  await page.waitForSelector("#sheetI", { state: "visible" });
  assert.equal(await que(page, "Pet Shop"), "g|Mascotas");
  assert.equal(await que(page, "Consum"), antes);
});

// Escenario: cancelar la creación
t.test("cancelar la creación", async () => {
  const { page } = await abrir({ datos: base() });
  await page.click("#fab");
  await A.enfocado(page, "mImporte");
  const antes = await page.inputValue("#mCat");
  await page.selectOption("#mCat", "n|categoria");
  await A.enfocado(page, "ceNombre");
  await page.click("#ceCerrar");
  await page.waitForSelector("#sheet", { state: "visible" });
  assert.equal(await page.inputValue("#mCat"), antes);
  assert.equal((await guardadas(page)).gasto.length, 19);
});

// --- datos: categorías guardadas antes de poder editarlas

// Escenario: datos de la versión anterior
t.test("datos de la versión anterior (categorías)", async () => {
  const { page } = await abrir({ datos: base({ movs: [mov("2026-10-05", 20, "Ocio", "", 1), mov("2026-10-06", 64.3, "Supermercado", "", 2)] }) });
  assert.equal(await A.texto(page, "#gasMes"), "Gastos 84,3 €");
  assert.equal(await page.locator("#torta circle").count(), 2);
  await enCategorias(page);
  assert.deepEqual(await nombres(page, "#ccGasto"), GASTO_BASE);
});

// Escenario: categoría que no está en la lista
t.test("categoría que no está en la lista", async () => {
  const { page } = await abrir();
  await restaurar(page, JSON.stringify(base({ movs: [mov("2026-10-05", 15, "Mascotas", "", 1)] })));
  await A.aviso(page, "Copia restaurada");
  await enCategorias(page);
  const n = await nombres(page, "#ccGasto");
  assert.equal(n[n.length - 2], "Mascotas");
  assert.equal((await A.guardados(page)).movs[0].cat, "Mascotas");
});

// Escenario: copia de seguridad vieja
t.test("copia de seguridad vieja (categorías)", async () => {
  const { page, errores } = await abrir();
  await restaurar(page, JSON.stringify(base()));
  await A.aviso(page, "Copia restaurada");
  await enCategorias(page);
  assert.deepEqual(await nombres(page, "#ccGasto"), GASTO_BASE);
  assert.deepEqual(errores, []);
});

// Escenario: las categorías viajan en la copia
t.test("las categorías viajan en la copia", async () => {
  const { page } = await abrir({ datos: base() });
  await enCategorias(page);
  await nueva(page, { nombre: "Mascotas" });
  await A.aviso(page, "Categoría guardada");
  await abrirCategoria(page, "Alquiler");
  await page.check("#ceFija");
  await page.click('#sheetCatEd button[type="submit"]');
  await page.click("#ccCerrar");
  await page.click("#catsCard", { trial: true }).catch(() => {});
  await A.ir(page, "ajustes");
  await page.click("#copiarBackup");
  const copia = await A.portapapeles(page);
  const { page: otra } = await abrir();
  await restaurar(otra, copia);
  await A.aviso(otra, "Copia restaurada");
  const c = await guardadas(otra);
  assert.ok(c.gasto.some((x) => x.nombre === "Mascotas"));
  assert.equal(c.gasto.find((x) => x.nombre === "Alquiler").fija, true);
});

// Escenario: categorías con datos inválidos
t.test("categorías con datos inválidos", async () => {
  const { page, errores } = await abrir();
  const datos = base({ movs: [mov("2026-10-05", 15, "Mascotas", "", 1)] });
  datos.categorias = { gasto: [{ nombre: "" }, { nombre: "Ocio", color: 3 }, { nombre: "ocio", color: 4 }, { nombre: "Salud", color: 99 }, { color: 2 }, { nombre: "Luz|Gas", color: 1 }, null], ingreso: [{ nombre: "Sueldo" }, { nombre: "Sueldo" }, 7] };
  await restaurar(page, JSON.stringify(datos));
  await A.aviso(page, "Copia restaurada");
  const c = await guardadas(page);
  const n = c.gasto.map((x) => x.nombre);
  assert.deepEqual(n.filter((x) => x !== "Mascotas" && x !== "Trabajo (reembolsable)"), ["Ocio", "Salud", "Otros"]);
  assert.ok(n.includes("Mascotas"));
  assert.ok(c.gasto.every((x) => x.color >= 1 && x.color <= 19));
  assert.deepEqual(c.ingreso.map((x) => x.nombre), ["Sueldo", "Reembolso", "Otros"]);
  assert.deepEqual(errores, []);
});

// --- movimientos

// Escenario: gasto en una categoría nueva
t.test("gasto en una categoría nueva", async () => {
  const { page } = await abrir({ datos: base() });
  await A.nuevoGasto(page, { importe: "30", cat: "Carga móvil", cuenta: "Banco A" });
  await A.aviso(page, "Gasto guardado");
  await A.ir(page, "movs");
  assert.match(await A.texto(page, "#movs .mov"), /Carga móvil/);
  assert.match(await A.texto(page, "#movs .mov"), /−30 €/);
});

// Escenario: elegir la categoría en el desplegable
t.test("elegir la categoría en el desplegable", async () => {
  const { page } = await abrir({ datos: base() });
  await page.click("#fab");
  await A.enfocado(page, "mImporte");
  await page.selectOption("#mCat", { label: "Alquiler" });
  assert.equal(await page.inputValue("#mCat"), "Alquiler");
  const ops = await page.$$eval("#mCat option", (o) => o.map((x) => x.textContent));
  assert.equal(ops[ops.length - 1], "Nueva categoría…");
});

// Escenario: categoría siempre fija con importe que cambia
t.test("categoría siempre fija con importe que cambia", async () => {
  const datos = base({ movs: [mov("2026-08-05", 40, "Servicios mensuales", "luz", 1), mov("2026-09-05", 80, "Servicios mensuales", "gas", 2)] });
  datos.categorias = { gasto: GASTO_BASE.map((n, i) => ({ nombre: n, color: i + 1, ...(n === "Servicios mensuales" ? { fija: true } : {}) })), ingreso: INGRESO_BASE.map((n) => ({ nombre: n })) };
  const { page } = await abrir({ datos, hoy: "2026-09-15T12:00:00" });
  await A.ir(page, "movs");
  assert.match(await A.texto(page, '[data-mov="2"]'), /Fijo/);
  await A.ir(page, "inicio");
  assert.match(await A.texto(page, "#fv"), /Fijos\s*80 €/);
});

// Escenario: categoría siempre fija no se sugiere
t.test("categoría siempre fija no se sugiere", async () => {
  const movs = [mov("2026-08-05", 30, "Salud", "gimnasio", 1), mov("2026-09-05", 30, "Salud", "gimnasio", 2), mov("2026-10-05", 32, "Salud", "gimnasio", 3)];
  const datos = base({ movs });
  datos.categorias = { gasto: GASTO_BASE.map((n, i) => ({ nombre: n, color: i + 1, ...(n === "Salud" ? { fija: true } : {}) })), ingreso: INGRESO_BASE.map((n) => ({ nombre: n })) };
  const { page } = await abrir({ datos });
  assert.equal(await page.isVisible("#sugFijo"), false);
});

// Pruebas extra: texto escapado y 390 px
t.test("el nombre de una categoría se escapa y nada se desborda", async () => {
  const sucio = '<b id="inyectado">x</b>';
  for (const apariencia of ["oscura", "clara"]) {
    const { page, errores } = await abrir({ datos: base({ settings: { apariencia }, movs: [mov("2026-10-05", 20, "Ocio", "", 1)] }) });
    await enCategorias(page);
    await nueva(page, { nombre: sucio });
    await A.aviso(page, "Categoría guardada");
    assert.equal(await page.locator("#inyectado").count(), 0);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth) <= 390, apariencia);
    await page.click("#ccCerrar");
    await page.click("#fab");
    await A.enfocado(page, "mImporte");
    assert.equal(await page.locator("#inyectado").count(), 0);
    assert.deepEqual(errores, []);
  }
});
