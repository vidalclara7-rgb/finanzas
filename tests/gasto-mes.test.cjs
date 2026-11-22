// Capacidad: graficos — lista de «Gasto del mes» y hoja «Gasto por categoría»
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 5000);
const datos = (movs, extra = {}) => A.v2({ cuentas: [BANCO], movs, ...extra });
const tres = () => datos([A.gasto(1, "2026-10-03", 60, 1, "Supermercado"), A.gasto(2, "2026-10-04", 30, 1, "Comida fuera"), A.gasto(3, "2026-10-05", 10, 1, "Transporte")]);
const siete = () => datos(["Supermercado", "Comida fuera", "Transporte", "Ocio", "Delivery", "Salud", "Ropa"].map((c, i) => A.gasto(i + 1, "2026-10-03", 70 - i * 5, 1, c)));
const lum = (rgb) => { const [r, g, b] = rgb.match(/[\d.]+/g).slice(0, 3).map((x) => { x = Number(x) / 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contraste = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
// Los tres puntos del degradado de un elemento (radial-gradient(… A 0%, B 45%, C 100%))
const paradas = (g) => (g.match(/rgba?\([^)]*\)/g) || []);

// Escenario: lista con tres categorías
t.test("lista con tres categorías", async () => {
  const { page } = await abrir({ datos: tres() });
  assert.equal(await A.texto(page, "#gastoTot"), "100 € ›");
  const filas = await page.$$eval("#lcat .fila[data-cat]", (fs) => fs.map((f) => ({ cat: f.dataset.cat, txt: f.querySelector(".imp").innerText.replace(/\s+/g, " "), barra: f.querySelector(".bar i").getBoundingClientRect().width })));
  assert.deepEqual(filas.map((f) => f.cat), ["Supermercado", "Comida fuera", "Transporte"]);
  assert.match(filas[0].txt, /^60 €\s*60 %$/);
  assert.ok(Math.abs(filas[0].barra / filas[1].barra - 2) < 0.05, `proporción ${filas[0].barra / filas[1].barra}`);
});

// Escenario: más de cinco categorías
t.test("más de cinco categorías", async () => {
  const { page } = await abrir({ datos: siete() });
  assert.equal(await page.locator("#lcat .fila[data-cat]").count(), 5);
  assert.equal(await page.locator('#lcat [data-ui="fila-resto"]').count(), 1);
  assert.match(await A.texto(page, '#lcat [data-ui="fila-resto"]'), /Resto \(2 categorías\)\s+85 €/);
});

// Escenario: lista sin gastos
t.test("lista sin gastos", async () => {
  const { page } = await abrir({ datos: datos([]) });
  assert.equal(await page.locator("#lcat").isVisible(), false);
  assert.equal(await A.texto(page, "#lcatVacio"), "Todavía no anotaste gastos este mes. Tocá + para empezar.");
});

// Escenario: un nombre largo no se pisa
t.test("un nombre largo no se pisa", async () => {
  const largo = "Una categoría con nombre largo";
  const d = siete();d.movs[0].cat = largo;d.categorias = { gasto: [{ nombre: largo, color: 6 }], ingreso: [] };
  const { page } = await abrir({ datos: d });
  const r = await page.$eval(`#lcat [data-cat="${largo}"]`, (f) => { const n = f.querySelector(".nom"), i = f.querySelector(".imp"), a = n.getBoundingClientRect(), b = i.getBoundingClientRect(); return { corta: n.scrollWidth > n.clientWidth && getComputedStyle(n).textOverflow === "ellipsis", pisa: a.right > b.left + 0.5 }; });
  assert.equal(r.pisa, false);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= 390));
});

// Escenario: categorías apiladas de mayor a menor
t.test("categorías apiladas de mayor a menor", async () => {
  const d = datos([A.gasto(1, "2026-10-03", 20, 1, "Supermercado"), A.gasto(2, "2026-10-04", 20, 1, "Supermercado"), A.gasto(3, "2026-10-05", 20, 1, "Supermercado"), A.gasto(4, "2026-10-04", 30, 1, "Comida fuera"), A.gasto(5, "2026-10-05", 10, 1, "Transporte")]);
  const { page } = await abrir({ datos: d });
  await page.click("#gastoHdr");
  await page.waitForSelector("#sheetPila:not([hidden])");
  assert.equal(await A.texto(page, "#pilaMes"), "octubre 2026");
  assert.deepEqual(await page.$$eval("#pila .sc", (s) => s.map((x) => x.dataset.cat)), ["Supermercado", "Comida fuera", "Transporte"]);
  const sup = await A.texto(page, '#pila .sc[data-cat="Supermercado"]');
  assert.match(sup, /60 €/);assert.match(sup, /60 %/);assert.match(sup, /3 gastos/);
  // apiladas: cada una asoma por debajo de la anterior
  const tops = await page.$$eval("#pila .sc", (s) => s.map((x) => x.getBoundingClientRect()));
  assert.ok(tops[1].top < tops[0].bottom, "la segunda se monta sobre la primera");
});

// Escenario: cambio frente al mes anterior
t.test("cambio frente al mes anterior", async () => {
  const { page } = await abrir({ datos: datos([A.gasto(1, "2026-10-03", 100, 1), A.gasto(2, "2026-09-10", 80, 1)]) });
  await page.click("#gastoHdr");
  assert.match(await A.texto(page, '#pila .sc[data-cat="Supermercado"]'), /\+25 % vs sep\./);
});

// Escenario: sin gasto el mes anterior
t.test("sin gasto el mes anterior", async () => {
  const { page } = await abrir({ datos: datos([A.gasto(1, "2026-10-03", 50, 1)]) });
  await page.click("#gastoHdr");
  assert.doesNotMatch(await A.texto(page, '#pila .sc[data-cat="Supermercado"]'), /vs/);
});

// Escenario: desde Resto
t.test("desde Resto", async () => {
  const { page } = await abrir({ datos: siete() });
  await page.click('#lcat [data-ui="fila-resto"]');
  await page.waitForSelector("#sheetPila:not([hidden])");
  assert.equal(await page.locator("#pila .sc").count(), 7);
});

// Escenario: el texto de cada tarjeta se lee
t.test("el texto de cada tarjeta se lee", async () => {
  const cats = Array.from({ length: 19 }, (_, i) => ({ nombre: `Cat ${i + 1}`, color: i + 1 }));
  const d = datos(cats.map((c, i) => A.gasto(i + 1, "2026-10-03", 10 + i, 1, c.nombre)), { categorias: { gasto: cats, ingreso: [] } });
  for (const esquema of ["light", "dark"]) {
    const { page } = await abrir({ datos: JSON.parse(JSON.stringify(d)), esquema });
    await page.click("#gastoHdr");
    const tarjetas = await page.$$eval("#pila .sc", (s) => s.map((x) => ({ g: getComputedStyle(x).backgroundImage, t: getComputedStyle(x.querySelector(".nm")).color })));
    assert.equal(tarjetas.length, 19);
    for (const x of tarjetas) for (const p of paradas(x.g)) assert.ok(contraste(x.t, p) >= 4.5, `${esquema} ${x.t} sobre ${p}: ${contraste(x.t, p).toFixed(2)}`);
  }
});

// Escenario: abrir desde la lista
t.test("abrir desde la lista", async () => {
  const { page } = await abrir({ datos: datos([A.gasto(1, "2026-10-03", 64.3, 1), A.gasto(2, "2026-10-04", 18, 1, "Comida fuera")]) });
  await page.click('#lcat .fila[data-cat][data-cat="Supermercado"]');
  await page.waitForSelector("#sheetCat:not([hidden])");
  assert.equal(await A.texto(page, "#catTitulo"), "Supermercado");
  assert.match(await A.texto(page, "#catTotal"), /64,3/);
  assert.equal(await A.texto(page, "#catMes"), "octubre 2026");
});

// Escenario: abrir desde la pila
t.test("abrir desde la pila", async () => {
  const { page } = await abrir({ datos: datos([A.gasto(1, "2026-10-03", 64.3, 1), A.gasto(2, "2026-10-04", 18, 1, "Comida fuera")]) });
  await page.click("#gastoHdr");
  await page.click('#pila .sc[data-cat="Comida fuera"]');
  await page.waitForSelector("#sheetCat:not([hidden])");
  assert.equal(await A.texto(page, "#catTitulo"), "Comida fuera");
  assert.match(await A.texto(page, "#catTotal"), /18/);
  await page.click("#catCerrar");
  await page.waitForSelector("#sheetPila:not([hidden])");
});
