// Capacidad: interfaz (el diseño: tarjetas blancas, tarjeta destacada, botón principal, tendencia, colores, Inicio y Cuentas)
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 1000, { desde: "2026-01-01" });
const CATS = ["Supermercado", "Comida fuera", "Delivery", "Transporte", "Ocio", "Compras", "Belleza", "Casa/Splitwise", "Salud", "Viajes", "Trabajo (reembolsable)", "Otros", "Regalos", "Ropa", "Salidas bar/disco", "Plan Iberia", "Servicios mensuales", "Alquiler", "Carga móvil"];
const datos = (extra = {}, ap) => A.v2({ settings: ap ? { apariencia: ap } : {}, cuentas: [BANCO], movs: [A.ingreso(1, "2026-10-01", 1700, 1), A.gasto(2, "2026-10-03", 64.3, 1)], ...extra });
const estilo = (page, sel, prop, pseudo) => page.$eval(sel, (e, [p, ps]) => getComputedStyle(e, ps || null)[p], [prop, pseudo]);
const rgb = (hex) => { const h = hex.replace("#", ""); return `rgb(${[0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(", ")})`; };
const canales = (c) => c.match(/[\d.]+/g).slice(0, 3).map(Number);
const lum = (c) => { const q = canales(c).map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * q[0] + 0.7152 * q[1] + 0.0722 * q[2]; };
const contraste = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const colores = (grad) => grad.match(/rgb\([^)]*\)/g) || [];

// --- tarjetas blancas

// Escenario: tarjeta blanca con sombra
t.test("tarjeta blanca con sombra", async () => {
  const { page } = await abrir({ datos: datos({}, "clara") });
  const sel = '[data-ui="gasto-categorias"]';
  assert.equal(await estilo(page, sel, "backgroundColor"), "rgb(255, 255, 255)");
  assert.notEqual(await estilo(page, sel, "boxShadow"), "none");
  const filtro = (await estilo(page, sel, "backdropFilter")) || "none";
  assert.equal(filtro, "none");
});

// Escenario: la etiqueta es sólo el título
t.test("la etiqueta es sólo el título", async () => {
  const { page } = await abrir({ datos: A.datosEjemplo() });
  const r = await page.evaluate(() => {
    const c = document.querySelector('[data-ui="tarjeta-transferir"]') || document.querySelector('.card.color:not([hidden])');
    const extra = document.createElement("span"); extra.className = "lbl"; extra.id = "lblExtra"; extra.textContent = "Otra etiqueta"; c.appendChild(extra);
    const tit = c.querySelector(".lbl"), c0 = getComputedStyle(tit, "::before").content, c1 = getComputedStyle(extra, "::before").content;
    const q = (e) => { const s = getComputedStyle(e); return [s.fontSize, s.fontWeight]; };
    return { tituloPunto: c0, extraPunto: c1, tit: q(tit), extra: q(extra) };
  });
  assert.notEqual(r.tituloPunto, "none");
  assert.ok(r.extraPunto === "none" || r.extraPunto === "normal", r.extraPunto);
  assert.notDeepEqual(r.tit, r.extra);
});

// Escenario: el texto de las tarjetas botón se lee
t.test("el texto de las tarjetas botón se lee", async () => {
  for (const ap of ["clara", "oscura"]) {
    const { page } = await abrir({ datos: A.v2({ ...JSON.parse(JSON.stringify(A.datosEjemplo())), settings: { ...A.datosEjemplo().settings, apariencia: ap } }) });
    const filas = await page.evaluate(() => ["tarjeta-transferir", "tarjeta-cuotas"].map((u) => { const c = document.querySelector(`[data-ui="${u}"]`); if (!c || c.hidden) return null; const fondo = getComputedStyle(c).backgroundColor; return [u, fondo, ...[...c.querySelectorAll(".lbl,.sub,.big,.item span")].map((e) => getComputedStyle(e).color)]; }).filter(Boolean));
    assert.ok(filas.length >= 1, `${ap}: hay tarjetas botón`);
    for (const [u, fondo, ...textos] of filas) for (const x of textos) assert.ok(contraste(fondo, x) >= 4.5, `${ap} ${u}: ${contraste(fondo, x).toFixed(2)}`);
  }
});

// --- tarjeta destacada

// Escenario: tarjetas destacadas
t.test("tarjetas destacadas", async () => {
  const { page } = await abrir({ datos: datos() });
  assert.equal(await page.$eval('[data-ui="resultado-mes"]', (e) => e.classList.contains("destacada")), true);
  assert.equal(await page.$eval('[data-ui="gasto-categorias"]', (e) => e.classList.contains("destacada")), false);
  assert.equal(await page.locator("#v-inicio .card.destacada").count(), 1);
  assert.match(await estilo(page, '[data-ui="resultado-mes"]', "backgroundImage"), /linear-gradient/);
  assert.equal(await estilo(page, '[data-ui="gasto-categorias"]', "backgroundImage"), "none");
  await A.ir(page, "cuentas");
  assert.equal(await page.$eval("#netoBox", (e) => e.classList.contains("destacada")), true);
  assert.match(await estilo(page, "#netoBox", "backgroundImage"), /linear-gradient/);
  assert.equal(await page.locator("#v-cuentas .card.destacada:visible").count(), 1);
});

// Escenario: el texto de la destacada se lee
t.test("el texto de la destacada se lee", async () => {
  for (const ap of ["clara", "oscura"]) {
    const { page } = await abrir({ datos: datos({}, ap) });
    const r = await page.evaluate(() => { const c = document.querySelector('[data-ui="resultado-mes"]'); return { grad: getComputedStyle(c).backgroundImage, textos: [...c.querySelectorAll("*")].filter((e) => e.textContent.trim() && !e.children.length).map((e) => getComputedStyle(e).color) }; });
    const stops = colores(r.grad);
    assert.ok(stops.length >= 3, r.grad);
    for (const x of r.textos) for (const s of stops) assert.ok(contraste(x, s) >= 4.5, `${ap} ${x} sobre ${s}: ${contraste(x, s).toFixed(2)}`);
  }
});

// Escenario: la destacada no se mueve
t.test("la destacada no se mueve", async () => {
  const { page } = await abrir({ datos: datos() });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const sel = '[data-ui="resultado-mes"]';
  const caja = await page.locator(sel).boundingBox();
  const antes = await page.$eval(sel, (e) => [getComputedStyle(e).backgroundImage, getComputedStyle(e, "::after").content, e.className]);
  await page.mouse.move(caja.x + 60, caja.y + 40);
  await page.mouse.down();
  await page.waitForTimeout(500);
  assert.equal(await page.locator(`${sel} .foco`).count(), 0);
  assert.deepEqual(await page.$eval(sel, (e) => [getComputedStyle(e).backgroundImage, getComputedStyle(e, "::after").content, e.className]), antes);
  await page.mouse.up();
});

// --- botón principal

const abrirHoja = async (page) => { await page.click("#fab"); await page.waitForSelector("#sheet:not([hidden])"); };

// Escenario: botón con degradado
t.test("botón con degradado", async () => {
  const { page } = await abrir({ datos: datos() });
  await abrirHoja(page);
  assert.match(await estilo(page, "#mGuardar", "backgroundImage"), /linear-gradient/);
  assert.equal(await estilo(page, "#mGuardar", "color"), "rgb(255, 255, 255)");
  assert.ok(parseFloat(await estilo(page, "#mGuardar", "borderTopLeftRadius")) >= 20);
  const stops = colores(await estilo(page, "#mGuardar", "backgroundImage"));
  for (const s of stops) assert.ok(contraste("rgb(255, 255, 255)", s) >= 4.5, `${s}: ${contraste("rgb(255, 255, 255)", s).toFixed(2)}`);
});

// Escenario: el botón no se anima
t.test("el botón no se anima", async () => {
  const { page } = await abrir({ datos: datos() });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await abrirHoja(page);
  assert.equal(await estilo(page, "#mGuardar", "animationName"), "none");
  const sombra = () => estilo(page, "#mGuardar", "boxShadow");
  const a = await sombra();
  await page.waitForTimeout(700);
  assert.equal(await sombra(), a);
});

// Escenario: botón secundario
t.test("botón secundario", async () => {
  const { page } = await abrir({ datos: datos() });
  await abrirHoja(page);
  assert.equal(await estilo(page, "#cerrar", "backgroundImage"), "none");
  assert.equal(await estilo(page, "#cerrar", "animationName"), "none");
  assert.notEqual(await estilo(page, "#cerrar", "boxShadow"), "none");
});

// --- tendencia del mes

const tendencia = (page) => page.evaluate(() => document.documentElement.dataset.tendencia);
const puntoMarca = (page) => page.$eval("#tendMarca", (e) => getComputedStyle(e, "::before").backgroundColor);

// Escenario: tendencia positiva
t.test("tendencia positiva", async () => {
  const { page } = await abrir({ datos: datos({ movs: [A.ingreso(1, "2026-10-01", 1500, 1), A.gasto(2, "2026-10-03", 100, 1)] }) });
  assert.equal(await tendencia(page), "positiva");
  assert.equal(await puntoMarca(page), rgb("#41FF8B"));
  assert.equal(await estilo(page, "#resultado", "color"), "rgb(255, 255, 255)");
});

// Escenario: tendencia negativa
t.test("tendencia negativa", async () => {
  const { page } = await abrir({ datos: datos({ movs: [A.ingreso(1, "2026-10-01", 100, 1), A.gasto(2, "2026-10-03", 300, 1)] }) });
  assert.equal(await tendencia(page), "negativa");
  assert.equal(await puntoMarca(page), rgb("#FF5984"));
});

// Escenario: tendencia neutra
t.test("tendencia neutra", async () => {
  const { page } = await abrir({ datos: datos({ movs: [] }) });
  assert.equal(await tendencia(page), "neutra");
  assert.equal(await puntoMarca(page), "rgb(255, 255, 255)");
});

// Escenario: la tendencia cambia con el mes que se ve
t.test("la tendencia cambia con el mes que se ve", async () => {
  const { page } = await abrir({ datos: datos({ movs: [A.ingreso(1, "2026-10-01", 100, 1), A.gasto(2, "2026-10-03", 300, 1), A.ingreso(3, "2026-09-01", 2000, 1), A.gasto(4, "2026-09-03", 100, 1)] }) });
  assert.equal(await tendencia(page), "negativa");
  await page.click("#mesAnterior");
  await page.waitForFunction(() => document.documentElement.dataset.tendencia === "positiva");
});

// --- Inicio con la tarjeta de resultado

// Escenario: gastado e ingresado
t.test("gastado e ingresado", async () => {
  const movs = [A.ingreso(1, "2026-10-01", 1500, 1), A.gasto(2, "2026-10-03", 80, 1), A.transf(3, "2026-10-04", 300, 1, 2)];
  const { page } = await abrir({ datos: datos({ cuentas: [BANCO, A.cta(2, "Cuenta ahorro", 0)], movs }) });
  assert.equal(await A.texto(page, "#miniGas"), "80 €");
  assert.equal(await A.texto(page, "#miniIng"), "1500 €");
  const r = await page.$eval('[data-ui="gastado-ingresado"]', (e) => [e.textContent.includes("Gastado"), e.textContent.includes("Ingresado"), getComputedStyle(e.querySelector(".dot"), null).backgroundColor]);
  assert.deepEqual(r, [true, true, rgb("#FF5984")]);
});

// Escenario: sin movimientos
t.test("sin movimientos", async () => {
  const { page } = await abrir({ datos: datos({ movs: [] }) });
  assert.equal(await A.texto(page, "#miniGas"), "0 €");
  assert.equal(await A.texto(page, "#miniIng"), "0 €");
});

// --- color por categoría y muestras de color

const TODAS = () => CATS.map((c, i) => A.gasto(i + 1, "2026-10-03", 10 + i, 1, c));
const catColores = (page) => page.evaluate(() => Array.from({ length: 19 }, (_, i) => getComputedStyle(document.documentElement).getPropertyValue("--cat" + (i + 1)).trim().toUpperCase()));

// Escenario: inicial legible en el círculo
t.test("inicial legible en el círculo", async () => {
  for (const ap of ["oscura", "clara"]) {
    const { page } = await abrir({ datos: datos({ movs: TODAS() }, ap) });
    await A.ir(page, "movs");
    const filas = await page.evaluate(() => [...document.querySelectorAll("#movs .mov")].map((m) => { const i = m.querySelector(".ico"); return [m.textContent.slice(0, 18), getComputedStyle(i).backgroundColor, getComputedStyle(i).color, i.textContent]; }));
    assert.equal(filas.length, 19);
    for (const [n, fondo, texto, ini] of filas) {
      assert.ok(contraste(fondo, texto) >= 4.5, `${ap} ${n}: ${contraste(fondo, texto).toFixed(2)}`);
      assert.match(ini, /^\p{L}$/u, n);
    }
  }
});

// Escenario: filas blancas
t.test("filas blancas", async () => {
  const { page } = await abrir({ datos: datos({}, "clara") });
  await A.ir(page, "movs");
  const r = await page.evaluate(() => { const f = document.querySelector('#movs .mov[data-tipo="gasto"]'); return [getComputedStyle(f).backgroundColor, getComputedStyle(document.querySelector('[data-ui="totales-mes"] .card')).backgroundColor, getComputedStyle(f.querySelector(".ico")).backgroundColor]; });
  assert.equal(r[0], r[1]);
  assert.notEqual(r[2], r[0]);
});

// Escenario: el color no cambia de un mes a otro
t.test("el color no cambia de un mes a otro", async () => {
  const movs = [A.gasto(1, "2026-10-03", 300, 1, "Alquiler"), A.gasto(2, "2026-10-04", 20, 1, "Ocio"), A.gasto(3, "2026-09-03", 100, 1, "Alquiler"), A.gasto(4, "2026-09-04", 500, 1, "Ocio")];
  const { page } = await abrir({ datos: datos({ movs }) });
  await A.ir(page, "movs");
  const alquiler = () => page.evaluate(() => getComputedStyle([...document.querySelectorAll("#movs .mov")].find((m) => m.textContent.includes("Alquiler")).querySelector(".ico")).backgroundColor);
  const oct = await alquiler();
  await page.click("#mesAnterior");
  await page.waitForFunction(() => document.querySelector("#mesLabel").textContent.toLowerCase().includes("septiembre"));
  assert.equal(await alquiler(), oct);
});

// Escenario: 19 colores distintos
t.test("19 colores distintos", async () => {
  for (const ap of ["oscura", "clara"]) {
    const { page } = await abrir({ datos: datos({}, ap) });
    assert.equal(new Set(await catColores(page)).size, 19, ap);
  }
});

// Escenario: 5 colores por tipo de cuenta
t.test("5 colores por tipo de cuenta", async () => {
  for (const ap of ["oscura", "clara"]) {
    const { page } = await abrir({ datos: datos({}, ap) });
    const ks = await page.evaluate(() => [1, 2, 3, 4, 5].map((i) => getComputedStyle(document.documentElement).getPropertyValue("--k" + i).trim().toUpperCase()));
    assert.equal(new Set(ks).size, 5, ap);
  }
});

// Escenario: colores de la paleta de gráficos
t.test("colores de la paleta de gráficos", async () => {
  const movs = ["Supermercado", "Comida fuera", "Delivery"].map((c, i) => A.gasto(i + 1, "2026-10-03", 10 + i, 1, c));
  const { page } = await abrir({ datos: datos({ movs }, "oscura") });
  await A.ir(page, "movs");
  const col = (n) => page.evaluate((x) => getComputedStyle([...document.querySelectorAll("#movs .mov")].find((m) => m.textContent.includes(x)).querySelector(".ico")).backgroundColor, n);
  assert.deepEqual([await col("Supermercado"), await col("Comida fuera"), await col("Delivery")], [rgb("#8450FC"), rgb("#B2FF00"), rgb("#1AAEFC")]);
});

// --- Cuentas con el patrimonio por mes

const cuentas5 = () => datos({ cuentas: [A.cta(1, "Banco A", 1000, { desde: "2026-06-01" }), A.cta(2, "Cuenta ahorro", 500, { desde: "2026-06-01" }), A.cta(3, "Tarjeta Y", 0, { tipo: "tarjeta" })], movs: [A.ingreso(1, "2026-08-10", 700, 1), A.gasto(2, "2026-10-03", 64.3, 1)] });

// Escenario: barras de cinco meses
t.test("barras de cinco meses", async () => {
  const { page } = await abrir({ datos: cuentas5() });
  await A.ir(page, "cuentas");
  const cols = await page.$$eval("#pat .col", (cs) => cs.map((c) => [c.dataset.mes, c.classList.contains("on"), !!c.querySelector(".globo"), c.querySelector("small").textContent]));
  assert.deepEqual(cols.map((c) => c[0]), ["2026-06", "2026-07", "2026-08", "2026-09", "2026-10"]);
  assert.deepEqual(cols.map((c) => c[3]), ["jun", "jul", "ago", "sep", "oct"]);
  assert.deepEqual(cols.filter((c) => c[1]).map((c) => c[0]), ["2026-10"]);
  assert.deepEqual(cols.filter((c) => c[2]).map((c) => c[0]), ["2026-10"]);
  assert.match(await A.texto(page, "#pat .globo"), /2135,7 €/);
  assert.equal(await estilo(page, "#pat .col.on i", "backgroundImage").then((x) => /linear-gradient/.test(x)), true);
  assert.equal(await estilo(page, "#pat .col:not(.on) i", "backgroundImage"), "none");
});

// Escenario: cuentas numeradas
t.test("cuentas numeradas", async () => {
  const { page } = await abrir({ datos: cuentas5() });
  await A.ir(page, "cuentas");
  assert.deepEqual(await page.$$eval("#grupos .cta .n", (ns) => ns.map((n) => n.textContent.trim())), ["01", "02", "03"]);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  const sc = await page.$eval("#grupos .carrusel", (c) => [getComputedStyle(c).overflowX, getComputedStyle(c).scrollSnapType]);
  assert.equal(sc[0], "auto");
  assert.match(sc[1], /x/);
});

// Escenario: Cuentas sin cuentas
t.test("Cuentas sin cuentas", async () => {
  const { page } = await abrir({ datos: datos({ cuentas: [], movs: [] }) });
  await A.ir(page, "cuentas");
  assert.equal(await page.locator("#patCard:visible").count(), 0);
  assert.equal(await page.locator("#pat .col").count(), 0);
});
