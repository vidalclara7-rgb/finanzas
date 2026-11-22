// Capacidades: categorias (ícono), datos (íconos guardados) y movimientos (fila con su ícono)
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 1000);
const base = (extra = {}) => A.v2({ cuentas: [BANCO], ...extra });
async function enCategorias(page) { await A.ir(page, "ajustes"); await page.click("#catsCard"); }
async function abrirCategoria(page, nombre) { await page.click(`#sheetCats [data-ed="g"][data-n="${nombre}"]`); await page.waitForSelector("#sheetCatEd", { state: "visible" }); }
const guardar = (page) => page.click('#sheetCatEd button[type="submit"]');
// Ícono del cuadradito de la fila de un gasto en Movimientos (o su inicial)
const icono = (page, id) => page.$eval(`#movs .mov[data-mov="${id}"] .ico`, (e) => { const u = e.querySelector("use"); return u ? u.getAttribute("href").slice(3) : e.textContent.trim(); });
async function restaurar(page, texto) { await A.ir(page, "ajustes"); await page.fill("#backupIn", texto); await page.click("#restaurar"); await page.click("#restaurar"); }

// Escenario: elegir un ícono
t.test("elegir un ícono", async () => {
  const { page } = await abrir({ datos: base({ movs: [A.gasto(1, "2026-10-05", 15, 1, "Mascotas")] }) });
  await enCategorias(page);
  await abrirCategoria(page, "Mascotas");
  await page.click('#ceIconos [data-icono="huella"]');
  await guardar(page);
  await A.aviso(page, "Categoría guardada");
  await page.click("#ccCerrar");
  await A.ir(page, "movs");
  assert.equal(await icono(page, 1), "huella");
  assert.equal((await A.guardados(page)).categorias.gasto.find((c) => c.nombre === "Mascotas").icono, "huella");
});

// Escenario: las de siempre traen el suyo
t.test("las de siempre traen el suyo", async () => {
  const { page } = await abrir({ datos: base({ movs: [A.gasto(1, "2026-10-05", 15, 1, "Comida fuera")] }) });
  await A.ir(page, "movs");
  assert.equal(await icono(page, 1), "cafe");
});

// Escenario: cambiar el ícono de una de siempre
t.test("cambiar el ícono de una de siempre", async () => {
  const { page } = await abrir({ datos: base({ movs: [A.gasto(1, "2026-10-05", 15, 1, "Ocio")] }) });
  await enCategorias(page);
  await abrirCategoria(page, "Ocio");
  assert.equal(await page.$eval('#ceIconos [aria-pressed="true"]', (b) => b.dataset.icono), "entrada");
  await page.click('#ceIconos [data-icono="copa"]');
  await guardar(page);
  assert.equal(await page.$eval('#sheetCats [data-n="Ocio"] use', (u) => u.getAttribute("href")), "#i-copa");
  await page.click("#ccCerrar");
  assert.equal(await page.$eval('#lcat [data-cat="Ocio"] use', (u) => u.getAttribute("href")).catch(async () => { await A.ir(page, "inicio"); return page.$eval('#lcat [data-cat="Ocio"] use', (u) => u.getAttribute("href")); }), "#i-copa");
  await A.ir(page, "movs");
  assert.equal(await icono(page, 1), "copa");
});

// Escenario: sin ícono
t.test("sin ícono", async () => {
  const { page } = await abrir({ datos: base({ movs: [A.gasto(1, "2026-10-05", 15, 1, "Ocio")] }) });
  await enCategorias(page);
  await abrirCategoria(page, "Ocio");
  await page.click('#ceIconos [data-icono=""]');
  await guardar(page);
  await page.click("#ccCerrar");
  await A.ir(page, "movs");
  assert.equal(await icono(page, 1), "O");
});

// Escenario: renombrar conserva el ícono
t.test("renombrar conserva el ícono", async () => {
  const { page } = await abrir({ datos: base({ movs: [A.gasto(1, "2026-10-05", 15, 1, "Ocio")] }) });
  await enCategorias(page);
  await abrirCategoria(page, "Ocio");
  await page.fill("#ceNombre", "Salidas");
  await guardar(page);
  await page.click("#ccCerrar");
  await A.ir(page, "movs");
  assert.equal(await icono(page, 1), "entrada");
});

// Escenario: los íconos de las categorías propias
t.test("los íconos de las categorías propias", async () => {
  const { page } = await abrir({ datos: base() });
  await enCategorias(page);
  await abrirCategoria(page, "Otros");
  assert.equal(await page.isVisible("#cePropia"), true);
  assert.equal(await page.$eval("#ceVista use", (u) => u.getAttribute("href")), "#i-puntos");
  assert.equal(await page.isVisible("#ceIconos"), false);
});

// Escenario: el ícono viaja en la copia
t.test("el ícono viaja en la copia", async () => {
  const datos = base({ movs: [A.gasto(1, "2026-10-05", 15, 1, "Mascotas")] });
  datos.categorias = { gasto: [{ nombre: "Mascotas", color: 6, icono: "huella" }], ingreso: [] };
  const { page } = await abrir({ datos });
  await A.ir(page, "ajustes");
  await page.click("#copiarBackup");
  const copia = await A.portapapeles(page);
  const { page: otra } = await abrir();
  await restaurar(otra, copia);
  await A.aviso(otra, "Copia restaurada");
  assert.equal((await A.guardados(otra)).categorias.gasto.find((c) => c.nombre === "Mascotas").icono, "huella");
});

// Escenario: ícono inválido en la copia
t.test("ícono inválido en la copia", async () => {
  const { page, errores } = await abrir();
  const datos = base({ movs: [A.gasto(1, "2026-10-05", 15, 1, "Ocio")] });
  datos.categorias = { gasto: [{ nombre: "Ocio", color: 5, icono: "<img src=x>" }], ingreso: [] };
  await restaurar(page, JSON.stringify(datos));
  await A.aviso(page, "Copia restaurada");
  assert.equal("icono" in (await A.guardados(page)).categorias.gasto.find((c) => c.nombre === "Ocio"), false);
  await A.ir(page, "movs");
  assert.equal(await icono(page, 1), "entrada");
  assert.deepEqual(errores, []);
});

// Escenario: datos de la versión anterior
t.test("datos de la versión anterior (íconos)", async () => {
  const datos = base({ movs: [A.gasto(1, "2026-10-05", 15, 1, "Supermercado"), A.gasto(2, "2026-10-06", 20, 1, "Mascotas")] });
  datos.categorias = { gasto: [{ nombre: "Supermercado", color: 1 }, { nombre: "Mascotas", color: 6 }, { nombre: "Otros", color: 12 }], ingreso: [{ nombre: "Sueldo" }] };
  const { page } = await abrir({ datos });
  await A.ir(page, "movs");
  assert.equal(await icono(page, 1), "carrito");
  assert.equal(await icono(page, 2), "M");
  assert.equal(await A.texto(page, "#totGas"), "35 €");
  const g = (await A.guardados(page)).categorias.gasto;
  assert.ok(g.every((c) => !("icono" in c)), "no reescribe lo guardado");
  assert.equal(g.find((c) => c.nombre === "Mascotas").color, 6);
});

// Escenario: copia de seguridad vieja
t.test("copia de seguridad vieja (íconos)", async () => {
  const { page } = await abrir();
  await restaurar(page, JSON.stringify(base({ movs: [A.gasto(1, "2026-10-05", 15, 1, "Delivery")] })));
  await A.aviso(page, "Copia restaurada");
  await A.ir(page, "movs");
  assert.equal(await icono(page, 1), "moto");
});

// Escenario: cada movimiento en una fila con su ícono
t.test("cada movimiento en una fila con su ícono", async () => {
  const movs = Array.from({ length: 10 }, (_, i) => A.gasto(i + 1, `2026-10-${String(i + 2).padStart(2, "0")}`, 5 + i, 1, i === 3 ? "Comida fuera" : "Supermercado", i === 0 ? "Pan" : ""));
  const { page } = await abrir({ datos: base({ movs }) });
  await A.ir(page, "movs");
  const filas = await page.$$eval("#movs .mov", (fs) => fs.map((f) => { const r = f.getBoundingClientRect(), i = f.querySelector(".ico").getBoundingClientRect(); return { h: r.height, top: r.top, bottom: r.bottom, cuadrado: Math.abs(i.width - i.height) < 1 && parseFloat(getComputedStyle(f.querySelector(".ico")).borderRadius) < i.width / 2, marcas: !!f.querySelector(".marcas") }; }));
  assert.equal(filas.length, 10);
  for (const f of filas) { if (!f.marcas) assert.ok(f.h <= 64, `alto ${f.h}`); assert.ok(f.cuadrado, "cuadradito redondeado"); }
  const ord = [...filas].sort((a, b) => a.top - b.top);
  for (let i = 1; i < ord.length; i++) assert.ok(ord[i].top >= ord[i - 1].bottom - 1, "no se solapan");
  assert.equal(await icono(page, 4), "cafe");
  assert.equal(await A.texto(page, '#movs .mov[data-mov="1"] .desc'), "Pan");
  assert.match(await A.texto(page, '#movs .mov[data-mov="1"] .det'), /Supermercado/);
});

// Escenario: categoría sin ícono
t.test("categoría sin ícono", async () => {
  const datos = base({ movs: [A.gasto(1, "2026-10-05", 15, 1, "Mascotas")] });
  datos.categorias = { gasto: [{ nombre: "Mascotas", color: 6 }], ingreso: [] };
  const { page } = await abrir({ datos });
  await A.ir(page, "movs");
  assert.equal(await icono(page, 1), "M");
  assert.equal(await page.$eval('#movs .mov[data-mov="1"] .ico', (e) => e.style.getPropertyValue("--cg")), "var(--cat6g)");
});

// Escenario: ingresos, transferencias y ajustes
t.test("ingresos, transferencias y ajustes", async () => {
  const movs = [A.ingreso(1, "2026-10-02", 100, 1), A.transf(2, "2026-10-03", 50, 1, 2), { id: 3, tipo: "ajuste", fecha: "2026-10-04", importe: -5, cuenta: 1, nota: "" }];
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, A.cta(2, "Banco B", 0)], movs }) });
  await A.ir(page, "movs");
  const ico = (id) => page.$eval(`#movs .mov[data-mov="${id}"] .ico`, (e) => ({ href: e.querySelector("use").getAttribute("href"), bg: getComputedStyle(e).backgroundColor }));
  const i = await ico(1), tr = await ico(2), aj = await ico(3);
  assert.equal(i.href, "#i-entra");assert.equal(tr.href, "#i-transf");assert.equal(aj.href, "#i-cruz");
  const verde = await page.evaluate(() => { const d = document.createElement("i"); d.style.color = "var(--verde)"; document.body.append(d); const c = getComputedStyle(d).color; d.remove(); return c; });
  assert.equal(i.bg, verde);
  assert.equal(tr.bg, aj.bg, "transferencia y ajuste, el mismo gris");
});

// Escenario: importes verdes y del color del texto
t.test("importes verdes y del color del texto", async () => {
  const { page } = await abrir({ datos: base({ movs: [A.ingreso(1, "2026-10-02", 100, 1), A.gasto(2, "2026-10-03", 20, 1)] }), esquema: "light" });
  await A.ir(page, "movs");
  const c = await page.evaluate(() => ({ ing: getComputedStyle(document.querySelector('#movs .mov[data-tipo="ingreso"] .num')).color, gas: getComputedStyle(document.querySelector('#movs .mov[data-tipo="gasto"] .num')).color, txt: getComputedStyle(document.body).color, ingT: document.querySelector('#movs .mov[data-tipo="ingreso"] .num').textContent, gasT: document.querySelector('#movs .mov[data-tipo="gasto"] .num').textContent }));
  assert.equal(c.ing, "rgb(23, 119, 63)");
  assert.equal(c.gas, c.txt);
  assert.match(c.ingT, /^\+/);assert.match(c.gasT, /^−/);
});
