// Capacidades: interfaz (Gastado e Ingresado como Por cobrar) y graficos (pilas de gastos e ingresos, categoría de ingreso)
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 5000);
const datos = (movs, extra = {}) => A.v2({ cuentas: [BANCO], movs, ...extra });
const REEMB = "Trabajo (reembolsable)";
const lum = (rgb) => { const [r, g, b] = rgb.match(/[\d.]+/g).slice(0, 3).map((x) => { x = Number(x) / 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contraste = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const paradas = (g) => (g.match(/rgba?\([^)]*\)/g) || []);
const cats = (page, sel) => page.$$eval(`${sel} .sc`, (s) => s.map((x) => x.dataset.cat));
async function abrirIng(page) { await page.click("#verIng"); await page.waitForSelector("#sheetPilaI:not([hidden])"); }

// Escenario: el mismo formato que «Por cobrar»
t.test("el mismo formato que «Por cobrar»", async () => {
  const movs = [A.gasto(1, "2026-10-03", 80, 1), A.ingreso(2, "2026-10-01", 1500, 1), { ...A.gasto(3, "2026-10-04", 50, 1, REEMB), reembolso: { estado: "pendiente" } }];
  const { page } = await abrir({ datos: datos(movs) });
  const m = await page.evaluate(() => ["#cardGas", "#cardIng", "#porCobrar"].map((s) => { const c = document.querySelector(s), r = c.getBoundingClientRect(), l = getComputedStyle(c.querySelector(".lbl")), b = getComputedStyle(c.querySelector(".big")); return { w: Math.round(r.width), top: r.top, bottom: r.bottom, tam: l.fontSize, peso: l.fontWeight, imp: b.fontSize, ver: [...c.querySelectorAll("button")].some((x) => x.textContent.trim() === "Ver") }; }));
  for (const x of m.slice(1)) { assert.equal(x.w, m[0].w); assert.equal(x.tam, m[0].tam); assert.equal(x.peso, m[0].peso); assert.equal(x.imp, m[0].imp); }
  assert.equal(m[0].peso, "700");
  assert.ok(m[1].top >= m[0].bottom, "Ingresado debajo de Gastado");
  assert.ok(m.every((x) => x.ver), "cada una lleva Ver");
});

// Escenario: abrir gastado
t.test("abrir gastado", async () => {
  const { page } = await abrir({ datos: datos([A.gasto(1, "2026-10-03", 80, 1)]) });
  await page.click("#cardGas .big");
  await page.waitForSelector("#sheetPila:not([hidden])");
  assert.equal(await A.texto(page, "#pilaMes"), "octubre 2026");
});

// Escenario: abrir ingresado
t.test("abrir ingresado", async () => {
  const { page } = await abrir({ datos: datos([A.ingreso(1, "2026-10-01", 1500, 1)]) });
  await abrirIng(page);
  assert.equal(await A.texto(page, "#pilaIMes"), "octubre 2026");
  assert.deepEqual(await cats(page, "#pilaI"), ["Sueldo"]);
});

// Escenario: lo reembolsable no suma en gastado
t.test("lo reembolsable no suma en gastado", async () => {
  const { page } = await abrir({ datos: datos([A.gasto(1, "2026-10-03", 80, 1), A.gasto(2, "2026-10-04", 200, 1, REEMB)]) });
  assert.equal(await A.texto(page, "#miniGas"), "80 €");
  await page.click("#verGas");
  await page.waitForSelector("#sheetPila:not([hidden])");
  assert.equal(await A.texto(page, "#pilaSub"), "80 € en 1 categoría");
  assert.deepEqual(await cats(page, "#pila"), ["Supermercado"]);
  const no = await page.$$eval("#pilaNo .sc", (s) => s.map((x) => ({ cat: x.dataset.cat, txt: x.textContent })));
  assert.equal(no.length, 1);
  assert.equal(no[0].cat, REEMB);
  assert.match(no[0].txt, /200 €/);
  assert.match(no[0].txt, /No suma en Gastado/);
  assert.doesNotMatch(no[0].txt, /%/);
  const [a, b] = await page.$$eval("#pila .sc, #pilaNo .sc", (s) => s.map((x) => x.getBoundingClientRect().top));
  assert.ok(b > a, "va última");
});

// Escenario: ingresos de mayor a menor
t.test("ingresos de mayor a menor", async () => {
  const { page } = await abrir({ datos: datos([A.ingreso(1, "2026-10-01", 1500, 1), A.ingreso(2, "2026-10-05", 300, 1, "Otros"), A.ingreso(3, "2026-10-08", 200, 1, "Otros")]) });
  await abrirIng(page);
  assert.equal(await A.texto(page, "#pilaIMes"), "octubre 2026");
  assert.equal(await A.texto(page, "#pilaISub"), "2.000 € en 2 categorías");
  assert.deepEqual(await cats(page, "#pilaI"), ["Sueldo", "Otros"]);
  const otros = await A.texto(page, '#pilaI .sc[data-cat="Otros"]');
  assert.match(otros, /500 €/); assert.match(otros, /25 %/); assert.match(otros, /2 ingresos/);
});

// Escenario: cambio de ingresos frente al mes anterior
t.test("cambio de ingresos frente al mes anterior", async () => {
  const { page } = await abrir({ datos: datos([A.ingreso(1, "2026-10-01", 1500, 1), A.ingreso(2, "2026-09-01", 1200, 1)]) });
  await abrirIng(page);
  assert.match(await A.texto(page, '#pilaI .sc[data-cat="Sueldo"]'), /\+25 % vs sep\./);
});

// Escenario: el reembolso no suma en ingresado
t.test("el reembolso no suma en ingresado", async () => {
  const { page } = await abrir({ datos: datos([A.ingreso(1, "2026-10-01", 1500, 1), A.ingreso(2, "2026-10-06", 200, 1, "Reembolso")]) });
  await abrirIng(page);
  assert.equal(await A.texto(page, "#pilaISub"), "1.500 € en 1 categoría");
  assert.deepEqual(await cats(page, "#pilaI"), ["Sueldo"]);
  const no = await A.texto(page, '#pilaINo .sc[data-cat="Reembolso"]');
  assert.match(no, /200 €/); assert.match(no, /No suma en Ingresado/); assert.doesNotMatch(no, /%/);
});

// Escenario: mes sin ingresos
t.test("mes sin ingresos", async () => {
  const { page } = await abrir({ datos: datos([A.gasto(1, "2026-10-03", 80, 1)]) });
  await abrirIng(page);
  assert.equal(await A.texto(page, "#pilaIVacio"), "Todavía no anotaste ingresos este mes. Tocá + para empezar.");
  assert.equal(await page.locator("#pilaI .sc, #pilaINo .sc").count(), 0);
});

// Escenario: otro mes en ingresos
t.test("otro mes en ingresos", async () => {
  const { page } = await abrir({ datos: datos([A.ingreso(1, "2026-10-01", 1500, 1), A.ingreso(2, "2026-09-01", 1200, 1)]) });
  await abrirIng(page);
  await page.click("#pilaIAnt");
  assert.equal(await A.texto(page, "#pilaIMes"), "septiembre 2026");
  assert.match(await A.texto(page, '#pilaI .sc[data-cat="Sueldo"]'), /1\.200 €/);
  await page.click("#pilaISig");
  assert.equal(await A.texto(page, "#pilaIMes"), "octubre 2026");
  assert.equal(await page.isDisabled("#pilaISig"), true);
});

// Escenario: el texto de cada tarjeta de ingreso se lee
t.test("el texto de cada tarjeta de ingreso se lee", async () => {
  const d = datos([A.ingreso(1, "2026-10-01", 1500, 1), A.ingreso(2, "2026-10-02", 300, 1, "Otros"), A.ingreso(3, "2026-10-03", 200, 1, "Reembolso")]);
  for (const esquema of ["light", "dark"]) {
    const { page } = await abrir({ datos: JSON.parse(JSON.stringify(d)), esquema });
    await abrirIng(page);
    const ts = await page.$$eval("#pilaI .sc, #pilaINo .sc", (s) => s.map((x) => ({ g: getComputedStyle(x).backgroundImage, t: getComputedStyle(x.querySelector(".nm")).color })));
    assert.equal(ts.length, 3);
    for (const x of ts) for (const p of paradas(x.g)) assert.ok(contraste(x.t, p) >= 4.5, `${esquema} ${x.t} sobre ${p}: ${contraste(x.t, p).toFixed(2)}`);
  }
});

// Escenario: abrir desde ingresos
t.test("abrir desde ingresos", async () => {
  const { page } = await abrir({ datos: datos([A.ingreso(1, "2026-10-01", 1500, 1), A.ingreso(2, "2026-10-05", 300, 1, "Otros")]) });
  await abrirIng(page);
  await page.click('#pilaI .sc[data-cat="Sueldo"]');
  await page.waitForSelector("#sheetCat:not([hidden])");
  assert.equal(await A.texto(page, "#catTitulo"), "Sueldo");
  assert.match(await A.texto(page, "#catTotal"), /1\.500/);
  assert.match(await A.texto(page, "#catRank"), /Banco A\s*1\.500 € · 100 %/);
  assert.equal(await A.texto(page, "#catListaLbl"), "Ingresos, de mayor a menor");
  assert.equal(await page.locator("#catLista .item").count(), 1);
});

// Escenario: comparación de un ingreso
t.test("comparación de un ingreso", async () => {
  const { page } = await abrir({ datos: datos([A.ingreso(1, "2026-10-05", 300, 1, "Otros")]) });
  await abrirIng(page);
  await page.click('#pilaI .sc[data-cat="Otros"]');
  assert.equal(await A.texto(page, "#catComp"), "En septiembre no entró nada de Otros");
});

// Escenario: categoría de ingreso sin movimientos ese mes
t.test("categoría de ingreso sin movimientos ese mes", async () => {
  const { page } = await abrir({ datos: datos([A.ingreso(1, "2026-10-01", 1500, 1)]) });
  await abrirIng(page);
  await page.click('#pilaI .sc[data-cat="Sueldo"]');
  await page.click("#catAnt");
  assert.equal(await A.texto(page, "#catVacioTxt"), "No entró nada de Sueldo en septiembre 2026.");
});

// Escenario: volver a ingresos
t.test("volver a ingresos", async () => {
  const { page } = await abrir({ datos: datos([A.ingreso(1, "2026-10-01", 1500, 1)]) });
  await abrirIng(page);
  await page.click('#pilaI .sc[data-cat="Sueldo"]');
  await page.waitForSelector("#sheetCat:not([hidden])");
  await page.click("#catCerrar");
  await page.waitForSelector("#sheetPilaI:not([hidden])");
  assert.equal(await page.isHidden("#sheetCat"), true);
});
