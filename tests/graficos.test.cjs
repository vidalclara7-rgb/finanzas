// Capacidad: graficos
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 1000);
const con = (movs, cuentas = [BANCO]) => ({ datos: A.v2({ cuentas, movs }) });
const TRES = [A.gasto(1, "2026-10-03", 64.3, 1), A.gasto(2, "2026-10-08", 42, 1, "Trabajo (reembolsable)"), A.gasto(3, "2026-10-05", 18, 1, "Comida fuera")];

// Escenario: torta con tres categorías
t.test("torta con tres categorías", async () => {
  const { page } = await abrir(con(TRES));
  const porciones = await page.locator("#torta circle").evaluateAll((cs) => cs.map((c) => [c.dataset.cat, parseFloat(c.style.strokeDasharray)]));
  assert.equal(porciones.length, 3);
  assert.equal(await A.texto(page, "#torta .centro b"), "124,3 €");
  assert.equal(porciones.reduce((a, b) => (b[1] > a[1] ? b : a))[0], "Supermercado");
});

// Escenario: torta sin gastos
t.test("torta sin gastos", async () => {
  const { page } = await abrir(con([]));
  assert.equal(await page.isVisible("#torta"), false);
  assert.equal(await A.texto(page, "#cats"), "Todavía no anotaste gastos este mes. Tocá + para empezar.");
});

// Escenario: tope usado en parte
t.test("tope usado en parte", async () => {
  const { page } = await abrir(con([A.gasto(1, "2026-10-03", 64.3, 7)], [A.cta(7, "Tarjeta", 0, { tipo: "tarjeta", tope: 500 })]));
  assert.equal(await A.texto(page, '[data-disp="7"] .ring b'), "13 %");
  assert.doesNotMatch(await page.getAttribute('[data-disp="7"] .ring', "class"), /\b(bad|warn)\b/);
});

// Escenario: tope superado en el anillo
t.test("tope superado en el anillo", async () => {
  const { page } = await abrir(con([A.gasto(1, "2026-10-03", 320, 8, "Ocio")], [A.cta(8, "Revolut", 1000, { tope: 300 })]));
  assert.equal(await A.texto(page, '[data-disp="8"] .ring b'), "107 %");
  assert.match(await page.getAttribute('[data-disp="8"] .ring', "class"), /\bbad\b/);
});

// Escenario: gasto repartido en semanas
t.test("gasto repartido en semanas", async () => {
  const { page } = await abrir(con([A.gasto(1, "2026-10-03", 64.3, 1), A.gasto(2, "2026-10-05", 18, 1), A.gasto(3, "2026-10-08", 42, 1), A.gasto(4, "2026-10-11", 25.5, 1)]));
  const cols = await page.locator("#barras .col").evaluateAll((cs) => cs.map((c) => [c.querySelector("small").textContent, c.querySelector("em").textContent, c.classList.contains("hoy")]));
  assert.deepEqual(cols, [["1–7", "82,3 €", false], ["8–14", "67,5 €", false], ["15–21", "", true], ["22–28", "", false], ["29–31", "", false]]);
});

// Escenario: barras sin gastos
t.test("barras sin gastos", async () => {
  const { page } = await abrir(con([]));
  assert.equal(await page.isVisible("#barrasCard"), false);
});

// Escenario: dos meses con datos
t.test("dos meses con datos", async () => {
  const { page } = await abrir(con([A.ingreso(1, "2026-09-01", 1500, 1), A.gasto(2, "2026-09-10", 900, 1), A.ingreso(3, "2026-10-01", 1700, 1), A.gasto(4, "2026-10-03", 82.3, 1)], [A.cta(1, "Banco A", 1000, { desde: "2026-09-01" })]));
  const cols = await page.locator("#meses .col").evaluateAll((cs) => cs.map((c) => [c.dataset.mes, +c.dataset.ing, +c.dataset.gas]));
  assert.deepEqual(cols, [["2026-05", 0, 0], ["2026-06", 0, 0], ["2026-07", 0, 0], ["2026-08", 0, 0], ["2026-09", 1500, 900], ["2026-10", 1700, 82.3]]);
});

// Escenario: mes que cerró en negativo
t.test("mes que cerró en negativo", async () => {
  const { page } = await abrir(con([A.ingreso(1, "2026-09-01", 800, 1), A.gasto(2, "2026-09-10", 950, 1)], [A.cta(1, "Banco A", 1000, { desde: "2026-09-01" })]));
  assert.match(await page.getAttribute('#meses [data-mes="2026-09"]', "class"), /\bneg\b/);
  assert.doesNotMatch(await page.getAttribute('#meses [data-mes="2026-10"]', "class"), /\bneg\b/);
});

// Escenario: sin ingresos ni gastos
t.test("sin ingresos ni gastos", async () => {
  const { page } = await abrir(con([A.transf(1, "2026-10-02", 100, 1, 2)], [BANCO, A.cta(2, "Banco B", 0)]));
  assert.equal(await page.isVisible("#mesesCard"), false);
});

// Escenario: gasto chico frente a lo que entró
t.test("gasto chico frente a lo que entró", async () => {
  const { page } = await abrir(con([A.ingreso(1, "2026-10-01", 1700, 1), A.gasto(2, "2026-10-03", 149.8, 1)]));
  assert.equal(await A.texto(page, "#formaTxt"), "Gastaste el 9 % de lo que entró");
  assert.equal(await A.texto(page, "#resultado"), "1550,2 €");
  assert.doesNotMatch(await page.getAttribute("#formaTxt", "class"), /\bexc\b/);
});

// Escenario: gasto mayor que lo que entró
t.test("gasto mayor que lo que entró", async () => {
  const { page } = await abrir(con([A.ingreso(1, "2026-10-01", 100, 1), A.gasto(2, "2026-10-03", 150, 1)]));
  assert.equal(await A.texto(page, "#formaTxt"), "Gastaste el 150 % de lo que entró");
  assert.match(await page.getAttribute("#formaTxt", "class"), /\bexc\b/);
});

// Escenario: mes sin ingresos
t.test("mes sin ingresos", async () => {
  const { page } = await abrir(con([A.gasto(2, "2026-10-03", 50, 1)]));
  assert.equal(await A.texto(page, "#formaTxt"), "Todavía no anotaste ingresos este mes");
});

const fijo = (id, fecha, importe, cat, nota = "") => ({ ...A.gasto(id, fecha, importe, 1, cat, nota), fijo: true });
const grupo = (page, k) => page.locator(`#fv [data-grupo="${k}"] span`).allInnerTexts();
const rank = (page) => page.locator("#fvHoja .rank > *").evaluateAll((els) => els.map((e) => e.dataset.rankGrupo || e.dataset.rank));
const CUATRO = () => [fijo(1, "2026-10-01", 600, "Casa/Splitwise", "alquiler"), fijo(2, "2026-10-02", 40, "Ocio", "streaming"),
  A.gasto(3, "2026-10-03", 300, 1), A.gasto(4, "2026-10-04", 60, 1, "Comida fuera")];

// Escenario: reparto entre fijos y variables
t.test("reparto entre fijos y variables", async () => {
  const { page } = await abrir(con(CUATRO()));
  assert.deepEqual((await grupo(page, "fij")).map((x) => x.trim()), ["Fijos", "640 € · 64 %"]);
  assert.deepEqual((await grupo(page, "var")).map((x) => x.trim()), ["Variables", "360 € · 36 %"]);
  assert.equal(await page.locator("#fv .rank, #fv [data-rank]").count(), 0);
  await page.click("#fvCard");
  assert.ok(await page.isVisible("#sheetFV"));
  assert.deepEqual(await rank(page), ["fij", "Casa/Splitwise", "Ocio", "var", "Supermercado", "Comida fuera"]);
});

// Escenario: de fijos y variables a una categoría
t.test("de fijos y variables a una categoría", async () => {
  const { page } = await abrir(con(CUATRO()));
  await page.click("#fvCard");
  await page.click('#fvHoja [data-rank="Supermercado"]');
  assert.ok(await page.isVisible("#sheetCat"));
  assert.equal(await A.texto(page, "#catTitulo"), "Supermercado");
});

// Escenario: reembolsables fuera del reparto
t.test("reembolsables fuera del reparto", async () => {
  const { page } = await abrir(con([A.gasto(1, "2026-10-03", 100, 1), A.gasto(2, "2026-10-04", 50, 1, "Trabajo (reembolsable)")]));
  assert.deepEqual((await grupo(page, "var")).map((x) => x.trim()), ["Variables", "100 € · 100 %"]);
  await page.click("#fvCard");
  assert.deepEqual(await rank(page), ["var", "Supermercado"]);
  assert.doesNotMatch(await A.texto(page, "#fvHoja"), /Trabajo/);
});

// Escenario: todavía sin gastos fijos
t.test("todavía sin gastos fijos", async () => {
  const { page } = await abrir(con([A.gasto(1, "2026-10-03", 150, 1), A.gasto(2, "2026-10-04", 50, 1, "Ocio")]));
  assert.deepEqual(await page.locator("#fv .partida i").evaluateAll((is) => is.map((i) => i.className)), ["var"]);
  assert.equal(await A.texto(page, "#fv [data-pista]"), "Marcá tus gastos fijos al anotarlos: alquiler, cuotas, suscripciones.");
});

// Escenario: sin gastos para repartir
t.test("sin gastos para repartir", async () => {
  const { page } = await abrir(con([A.gasto(1, "2026-10-03", 30, 1, "Trabajo (reembolsable)")]));
  assert.equal(await page.locator("#fv .partida").count(), 0);
  assert.equal(await A.texto(page, "#fv"), "Todavía no anotaste gastos este mes.");
  await page.click("#fvCard");
  assert.equal(await page.isVisible("#sheetFV"), false);
});

// Escenario: Otros se ve en su barra
t.test("Otros se ve en su barra", async () => {
  const contraste = (a, b) => { const lum = (rgb) => { const v = rgb.match(/\d+/g).slice(0, 3).map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  for (const apariencia of ["clara", "oscura"]) {
    const base = con([A.gasto(1, "2026-10-03", 30, 1, "Otros"), A.gasto(2, "2026-10-04", 70, 1)]);
    const { page } = await abrir({ datos: { ...base.datos, settings: { ...base.datos.settings, apariencia } } });
    await page.click("#fvCard");
    const [lleno, pista] = await page.$eval('#fvHoja [data-rank="Otros"] .bar', (b) => [getComputedStyle(b.firstElementChild).backgroundColor, getComputedStyle(b).backgroundColor]);
    assert.ok(contraste(lleno, pista) >= 1.5, `${apariencia}: ${lleno} sobre ${pista} = ${contraste(lleno, pista).toFixed(2)}`);
  }
});

// Abrir una categoría: datos de ejemplo con dos meses y dos cuentas
const TAR = A.cta(2, "Tarjeta", 0, { tipo: "tarjeta", desde: "2026-08-01" });
const B = { ...BANCO, desde: "2026-08-01" };
const conCat = (movs, cuentas = [B, TAR]) => ({ datos: A.v2({ cuentas, movs }) });
const total = (page) => A.texto(page, "#catTotal");

// Escenario: abrir desde la lista
t.test("abrir desde la lista", async () => {
  const { page } = await abrir(conCat([A.gasto(1, "2026-10-03", 64.3, 1), A.gasto(2, "2026-10-05", 18, 1, "Comida fuera")]));
  await page.click('#cats [data-cat="Supermercado"]');
  assert.equal(await A.texto(page, "#catTitulo"), "Supermercado");
  assert.equal(await total(page), "64,3 €");
  assert.equal(await A.texto(page, "#catMes"), "octubre 2026");
});

// Escenario: abrir desde la torta
t.test("abrir desde la torta", async () => {
  const { page } = await abrir(conCat([A.gasto(1, "2026-10-03", 64.3, 1), A.gasto(2, "2026-10-05", 18, 1, "Comida fuera")]));
  await page.evaluate(() => document.getElementById("torta").scrollIntoView({ block: "center" }));
  const caja = await page.locator('#torta circle[data-cat="Comida fuera"]').boundingBox();
  // Un punto del anillo dentro de la porción: se toca donde el trazo es de esa categoría
  const punto = await page.evaluate(() => { const c = document.querySelector('#torta circle[data-cat="Comida fuera"]'), svg = c.ownerSVGElement.getBoundingClientRect();
    const [l] = c.style.strokeDasharray.split(" ").map(parseFloat), off = -parseFloat(c.style.strokeDashoffset || 0), a = ((off + l / 2) / (2 * Math.PI * 77)) * 2 * Math.PI - Math.PI / 2, k = svg.width / 180;
    return [svg.left + (90 + 77 * Math.cos(a)) * k, svg.top + (90 + 77 * Math.sin(a)) * k]; });
  assert.ok(caja);
  await page.mouse.click(punto[0], punto[1]);
  assert.equal(await A.texto(page, "#catTitulo"), "Comida fuera");
  assert.equal(await total(page), "18 €");
});

// Escenario: más que el mes anterior
t.test("más que el mes anterior", async () => {
  const { page } = await abrir(conCat([A.gasto(1, "2026-10-03", 100, 1), A.gasto(2, "2026-09-10", 80, 1)]));
  await page.click('#cats [data-cat="Supermercado"]');
  assert.equal(await A.texto(page, "#catComp"), "20 € más que en septiembre (+25 %)");
});

// Escenario: menos que el mes anterior
t.test("menos que el mes anterior", async () => {
  const { page } = await abrir(conCat([A.gasto(1, "2026-10-03", 60, 1), A.gasto(2, "2026-09-10", 80, 1)]));
  await page.click('#cats [data-cat="Supermercado"]');
  assert.equal(await A.texto(page, "#catComp"), "20 € menos que en septiembre (−25 %)");
});

// Escenario: sin gasto el mes anterior
t.test("sin gasto el mes anterior", async () => {
  const { page } = await abrir(conCat([A.gasto(1, "2026-10-03", 50, 1)]));
  await page.click('#cats [data-cat="Supermercado"]');
  assert.equal(await A.texto(page, "#catComp"), "En septiembre no gastaste en Supermercado");
});

const filasCat = (page) => page.locator("#catRank .fila .row").evaluateAll((rs) => rs.map((r) => [...r.children].map((x) => x.textContent.replace(/\s*›$/, "").trim())));

// Escenario: dos cuentas
t.test("dos cuentas", async () => {
  const { page } = await abrir(conCat([A.gasto(1, "2026-10-03", 40, 2), A.gasto(2, "2026-10-04", 60, 1)]));
  await page.click('#cats [data-cat="Supermercado"]');
  assert.deepEqual(await filasCat(page), [["Banco A", "60 € · 60 %"], ["Tarjeta", "40 € · 40 %"]]);
});

// Escenario: más de cinco cuentas
t.test("más de cinco cuentas", async () => {
  const cuentas = [1, 2, 3, 4, 5, 6, 7].map((i) => A.cta(i, `Cuenta ${i}`, 0, { desde: "2026-08-01" }));
  const movs = [70, 60, 50, 40, 30, 20, 10].map((v, i) => A.gasto(i + 1, "2026-10-03", v, i + 1));
  const { page } = await abrir(conCat(movs, cuentas));
  await page.click('#cats [data-cat="Supermercado"]');
  const f = await filasCat(page);
  assert.equal(f.length, 6);
  assert.deepEqual(f.slice(0, 5).map((x) => x[0]), ["Cuenta 1", "Cuenta 2", "Cuenta 3", "Cuenta 4", "Cuenta 5"]);
  assert.deepEqual(f[5], ["Resto (2 cuentas)", "30 € · 11 %"]);
  await page.click("#catRank [data-resto]");
  assert.deepEqual((await filasCat(page)).slice(5).map((x) => x[0]), ["Cuenta 6", "Cuenta 7"]);
});

// Escenario: ordenados por importe
t.test("ordenados por importe", async () => {
  const { page } = await abrir(conCat([A.gasto(1, "2026-10-03", 5, 1), A.gasto(2, "2026-10-04", 30, 1), A.gasto(3, "2026-10-05", 12, 1)]));
  await page.click('#cats [data-cat="Supermercado"]');
  assert.deepEqual(await page.locator("#catLista .item .num").allInnerTexts(), ["30 €", "12 €", "5 €"]);
});

// Escenario: editar desde el detalle
t.test("editar desde el detalle", async () => {
  const { page } = await abrir(conCat([A.gasto(1, "2026-10-03", 30, 1, "Supermercado", "pan"), A.gasto(2, "2026-10-04", 12, 1)]));
  await page.click('#cats [data-cat="Supermercado"]');
  await page.click('#catLista [data-edit="1"]');
  assert.equal(await A.texto(page, "#mTitulo"), "Editar movimiento");
  await A.elegir(page, "segCat", "Ocio");
  await page.click("#mGuardar");
  await A.aviso(page, "Gasto guardado");
  assert.equal((await A.guardados(page)).movs.find((m) => m.id === 1).cat, "Ocio");
  await page.click('#cats [data-cat="Supermercado"]');
  assert.equal(await page.locator('#catLista [data-edit="1"]').count(), 0);
});

// Escenario: mes anterior
t.test("mes anterior", async () => {
  const { page } = await abrir(conCat([A.gasto(1, "2026-10-03", 64, 1), A.gasto(2, "2026-09-10", 40, 1)]));
  await page.click('#cats [data-cat="Supermercado"]');
  await page.click("#catAnt");
  assert.equal(await A.texto(page, "#catMes"), "septiembre 2026");
  assert.equal(await total(page), "40 €");
});

// Escenario: no pasa del mes en curso
t.test("no pasa del mes en curso", async () => {
  const { page } = await abrir(conCat([A.gasto(1, "2026-10-03", 64, 1)]));
  await page.click('#cats [data-cat="Supermercado"]');
  assert.ok(await page.isDisabled("#catSig"));
  await page.click("#catAnt");
  assert.equal(await page.isDisabled("#catSig"), false);
});

// Escenario: mes sin gastos en la categoría
t.test("mes sin gastos en la categoría", async () => {
  const { page } = await abrir(conCat([A.gasto(1, "2026-10-03", 64, 1)]));
  await page.click('#cats [data-cat="Supermercado"]');
  await page.click("#catAnt");
  await page.click("#catAnt");
  assert.equal(await A.texto(page, "#catMes"), "agosto 2026");
  assert.equal(await A.texto(page, "#catVacioTxt"), "No gastaste en Supermercado en agosto 2026.");
  assert.equal(await page.isVisible("#catCuentas"), false);
});

// Escenario: reembolsos fuera del porcentaje
t.test("reembolsos fuera del porcentaje", async () => {
  const { page } = await abrir(con([A.ingreso(1, "2026-10-01", 1000, 1), A.ingreso(2, "2026-10-10", 50, 1, "Reembolso"),
    A.gasto(3, "2026-10-03", 200, 1), A.gasto(4, "2026-10-04", 50, 1, "Trabajo (reembolsable)")]));
  assert.equal(await A.texto(page, "#formaTxt"), "Gastaste el 20 % de lo que entró");
});
