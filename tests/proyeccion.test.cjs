// Capacidades: proyeccion (Forecast a 12 meses) e interfaz (panel de análisis)
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 0, { desde: "2026-06-01" });
const FIN = (extra = {}) => A.cta(2, "Financiera Z", 0, { tipo: "financiacion", cuota: 50, cuotas: 4, cuotasMes: "2026-10", desde: "2026-06-01", ...extra });
const TARJ = A.cta(3, "Tarjeta Y", 0, { tipo: "tarjeta", desde: "2026-06-01" });
const ING = (id, fecha, importe, cat = "Sueldo") => A.ingreso(id, fecha, importe, 1, cat);
const BASE = [ING(1, "2026-07-10", 2000), ING(2, "2026-08-10", 2000), ING(3, "2026-09-10", 2000)];
const FIJO = (importe = 600) => ({ ...A.gasto(20, "2026-09-10", importe, 1, "Casa/Splitwise", "Alquiler"), fijo: true });
const COMPRA = { ...A.gasto(30, "2026-10-05", 720, 3, "Compras", "notebook"), cuotas: { n: 3, cuota: 240 } };

// Abre la app y la hoja Forecast desde el panel
async function conForecast(datos = {}) {
  const r = await abrir({ datos: A.v2({ cuentas: [BANCO], ...datos }) });
  await r.page.click("#menuBtn");
  await r.page.click("#panelFore");
  await r.page.waitForSelector("#sheetFore:not([hidden])");
  return r;
}
const fila = (page, mes) => page.evaluate((m) => { const x = document.querySelector(`#foreLista [data-mes="${m}"]`); return x && x.innerText.replace(/\s+/g, " "); }, mes);
const barra = (page, mes) => page.evaluate((m) => { const x = document.querySelector(`#foreBarras [data-mes="${m}"]`); return x && { ing: +x.dataset.ing, comp: +x.dataset.comp, neg: x.classList.contains("neg") }; }, mes);
const ingreso = (page) => page.inputValue("#foreIng");

// --- proyección a 12 meses

// Escenario: cuotas que se liberan
t.test("cuotas que se liberan", async () => {
  const { page } = await conForecast({ cuentas: [BANCO, FIN(), TARJ], movs: [...BASE, FIJO(), COMPRA] });
  assert.match(await fila(page, "2026-11"), /Fijos 600 € · cuotas 290 € 1110 € Libre/);
  assert.equal((await barra(page, "2026-11")).comp, 890);
  assert.match(await fila(page, "2027-01"), /Fijos 600 € · cuotas 50 € 1350 € Libre/);
  assert.equal((await barra(page, "2027-01")).comp, 650);
  assert.match(await fila(page, "2027-02"), /Fijos 600 € · cuotas 0 € 1400 € Libre/);
  assert.equal((await barra(page, "2027-02")).comp, 600);
});

// Escenario: son doce meses desde el que viene
t.test("son doce meses desde el que viene", async () => {
  const { page } = await conForecast({ movs: BASE });
  const meses = await page.$$eval("#foreLista [data-mes]", (xs) => xs.map((x) => x.dataset.mes));
  assert.equal(meses.length, 12);
  assert.deepEqual([meses[0], meses[11]], ["2026-11", "2027-10"]);
  assert.match(await page.innerText("#foreLista"), /noviembre 2026/);
  assert.match(await page.innerText("#foreLista"), /octubre 2027/);
});

// Escenario: un mes en que se gasta más de lo que entra
t.test("un mes en que se gasta más de lo que entra", async () => {
  const movs = [ING(1, "2026-07-10", 1000), ING(2, "2026-08-10", 1000), ING(3, "2026-09-10", 1000), FIJO(800)];
  const { page } = await conForecast({ cuentas: [BANCO, FIN({ cuota: 300, cuotas: undefined })], movs });
  assert.match(await fila(page, "2026-11"), /-100 € En rojo/);
  assert.equal((await barra(page, "2026-11")).neg, true);
  assert.match(await page.innerText("#foreResumen"), /Libre el mes que viene\s*-100 €/);
});

// --- el ingreso constante

// Escenario: promedio de tres meses
t.test("promedio de tres meses", async () => {
  const { page } = await conForecast({ movs: [ING(1, "2026-07-10", 1800), ING(2, "2026-08-10", 2100), ING(3, "2026-09-10", 2400)] });
  assert.equal(await ingreso(page), "2100");
  assert.match(await page.innerText("#foreResumen"), /Entra por mes\s*2100 €/);
});

// Escenario: los reembolsos no cuentan
t.test("los reembolsos no cuentan", async () => {
  const { page } = await conForecast({ movs: [ING(1, "2026-09-10", 2000), ING(2, "2026-09-12", 300, "Reembolso")] });
  assert.equal(await ingreso(page), "2000");
});

// Escenario: un mes sin ingresos no baja el promedio
t.test("un mes sin ingresos no baja el promedio", async () => {
  const { page } = await conForecast({ movs: [ING(2, "2026-08-10", 2000), ING(3, "2026-09-10", 2000)] });
  assert.equal(await ingreso(page), "2000");
});

// Escenario: probar otro ingreso
t.test("probar otro ingreso", async () => {
  const { page } = await conForecast({ cuentas: [BANCO, FIN(), TARJ], movs: [...BASE, FIJO(), COMPRA] });
  assert.equal(await ingreso(page), "2000");
  await page.fill("#foreIng", "1500");
  assert.match(await fila(page, "2026-11"), /610 € Libre/);
  await page.click("#foreCerrar");
  await page.click("#menuBtn");
  await page.click("#panelFore");
  await page.waitForSelector("#sheetFore:not([hidden])");
  assert.equal(await ingreso(page), "2000");
});

// Escenario: monto inválido
t.test("monto inválido", async () => {
  const { page } = await conForecast({ movs: BASE });
  await page.fill("#foreIng", "abc");
  await page.press("#foreIng", "Tab");
  await A.aviso(page, "Poné un importe válido");
  assert.equal(await ingreso(page), "2000");
});

// Escenario: sin ingresos todavía
t.test("sin ingresos todavía", async () => {
  const { page } = await conForecast();
  assert.equal(await page.isVisible("#foreSinIng"), true);
  assert.match(await page.innerText("#foreSinIng"), /Todavía no hay ingresos para promediar\. Escribí uno para ver la proyección\./);
  assert.equal(await ingreso(page), "0");
  assert.match(await page.innerText("#foreResumen"), /Entra por mes\s*0 €/);
});

// --- gastos fijos y cuotas en la proyección

// Escenario: financiación sin fin
t.test("financiación sin fin", async () => {
  const { page } = await conForecast({ cuentas: [BANCO, FIN({ cuotas: undefined })], movs: BASE });
  const filas = await page.$$eval("#foreLista [data-mes]", (xs) => xs.map((x) => x.innerText.replace(/\s+/g, " ")));
  assert.equal(filas.length, 12);
  assert.ok(filas.every((f) => /cuotas 50 €/.test(f)));
});

// Escenario: lo variable no entra
t.test("lo variable no entra", async () => {
  const { page } = await conForecast({ movs: [...BASE, A.gasto(21, "2026-09-12", 300, 1, "Supermercado")] });
  assert.equal((await barra(page, "2026-11")).comp, 0);
});

// Escenario: la compra en cuotas no se cuenta dos veces
t.test("la compra en cuotas no se cuenta dos veces", async () => {
  const compra = { ...A.gasto(31, "2026-09-05", 720, 3, "Compras", "notebook"), cuotas: { n: 3, cuota: 240 }, fijo: true };
  const { page } = await conForecast({ cuentas: [BANCO, TARJ], movs: [...BASE, compra] });
  assert.equal((await barra(page, "2026-11")).comp, 240);
  assert.match(await fila(page, "2026-11"), /Fijos 0 € · cuotas 240 €/);
});

// Escenario: sin cuotas ni gastos fijos
t.test("sin cuotas ni gastos fijos", async () => {
  const { page } = await conForecast({ movs: BASE });
  assert.equal(await page.isVisible("#foreSinComp"), true);
  assert.match(await page.innerText("#foreSinComp"), /No hay cuotas ni gastos fijos para proyectar\./);
  assert.match(await fila(page, "2026-11"), /2000 € Libre/);
});

// --- gráfico de lo comprometido

// Escenario: barras por mes
t.test("barras por mes", async () => {
  const { page } = await conForecast({ cuentas: [BANCO, FIN(), TARJ], movs: [...BASE, FIJO(), COMPRA] });
  assert.equal(await page.locator("#foreBarras .col").count(), 12);
  const nov = await page.$eval('#foreBarras [data-mes="2026-11"] .gas', (i) => i.getBoundingClientRect().height);
  const ene = await page.$eval('#foreBarras [data-mes="2027-01"] .gas', (i) => i.getBoundingClientRect().height);
  assert.ok(ene < nov);
});

// --- panel de análisis

// Escenario: abrir y cerrar el panel
t.test("abrir y cerrar el panel", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await page.click("#menuBtn");
  assert.equal(await page.isVisible("#panel"), true);
  const txt = await page.innerText("#panel");
  assert.match(txt, /Objetivos/);
  assert.match(txt, /Forecast/);
  assert.match(txt, /Inversiones/);
  assert.match(txt, /Radar de noticias/);
  await page.click("#panelBg", { position: { x: 375, y: 400 } });
  assert.equal(await page.isVisible("#panel"), false);
  await page.click("#menuBtn");
  await page.keyboard.press("Escape");
  assert.equal(await page.isVisible("#panel"), false);
});

// Escenario: el botón está en todas las pantallas
t.test("el botón está en todas las pantallas", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  for (const v of ["inicio", "movs", "cuentas", "mes", "ajustes"]) {
    await A.ir(page, v);
    assert.equal(await page.isVisible("#menuBtn"), true, v);
  }
});

// Escenario: ir a Objetivos
t.test("ir a Objetivos", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await page.click("#menuBtn");
  await page.click("#panelObj");
  assert.equal(await page.isVisible("#panel"), false);
  assert.equal(await page.isVisible("#sheetObj"), true);
});

// Escenario: ir a Forecast
t.test("ir a Forecast", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await page.click("#menuBtn");
  await page.click("#panelFore");
  assert.equal(await page.isVisible("#panel"), false);
  assert.equal(await page.isVisible("#sheetFore"), true);
});

// Escenario: ir a Inversiones
t.test("ir a Inversiones", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, A.cta(4, "Broker X", 0, { tipo: "inversion" })] }) });
  await page.click("#menuBtn");
  await page.click("#panelInv");
  assert.equal(await page.isVisible("#panel"), false);
  assert.equal(await page.isVisible("#sheetInv"), true);
});

// Escenario: Inversiones sin cuentas de inversión
t.test("Inversiones sin cuentas de inversión", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await page.click("#menuBtn");
  await page.click("#panelInv");
  await A.aviso(page, "No tenés cuentas de inversión. Agregá una en Cuentas.");
  assert.equal(await page.isVisible("#sheetInv"), false);
});

// Escenario: el radar todavía no está
t.test("el radar todavía no está", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await page.click("#menuBtn");
  assert.equal(await page.isDisabled("#panelRadar"), true);
  assert.match(await page.innerText("#panelRadar"), /Próximamente/);
  await page.evaluate(() => document.getElementById("panelRadar").click());
  assert.equal(await page.isVisible("#panel"), true);
  assert.equal(await page.isVisible("#sheetFore"), false);
  assert.equal(await page.isVisible("#sheetInv"), false);
});

// Escenario: el encabezado cabe en 390 px
t.test("el encabezado cabe en 390 px", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  for (const v of ["inicio", "movs"]) {
    await A.ir(page, v);
    const r = await page.evaluate(() => {
      const box = (s) => { const e = document.querySelector(s); return e && !e.hidden && e.getClientRects().length ? e.getBoundingClientRect() : null; };
      const partes = ["#menuBtn", "header .tit", "header .acc"].map(box);
      return { ancho: document.documentElement.scrollWidth, vp: window.innerWidth, partes: partes.map((b) => b && [Math.round(b.left), Math.round(b.right)]), sel: box(".selmes") && Math.round(box(".selmes").right), tit: Math.round(box("header .tit").right) };
    });
    assert.ok(r.ancho <= r.vp, `${v}: sin desborde horizontal`);
    const [menu, tit, acc] = r.partes;
    assert.ok(menu[1] <= tit[0] + 1 && tit[1] <= acc[0] + 1, `${v}: las partes no se pisan ${JSON.stringify(r.partes)}`);
    assert.ok(acc[1] <= r.vp, `${v}: los botones de la derecha caben`);
    if (r.sel) assert.ok(r.sel <= r.tit + 1, `${v}: el selector de mes cabe en su bloque`);
  }
});
