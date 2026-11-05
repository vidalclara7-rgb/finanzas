// Capacidad: apariencia
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 1000);
const datos = (extra = {}) => A.v2({ cuentas: [BANCO, A.cta(2, "Tarjeta Y", 0, { tipo: "tarjeta", tope: 500 })], movs: [A.ingreso(1, "2026-10-01", 1700, 1), A.gasto(2, "2026-10-03", 64.3, 2), A.gasto(3, "2026-10-05", 18, 1, "Comida fuera")], ...extra });
const conApariencia = (a, paleta) => datos({ settings: { ...(a ? { apariencia: a } : {}), ...(paleta ? { paleta } : {}) } });
const attr = (page) => page.evaluate(() => document.documentElement.dataset.apariencia);
const fondoCuerpo = (page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
const lum = (rgb) => { const [r, g, b] = rgb.match(/[\d.]+/g).slice(0, 3).map((x) => { x = Number(x) / 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const marcada = (page) => page.$eval('#segApariencia button[aria-pressed="true"]', (b) => b.dataset.v);
const elegirAp = async (page, v) => { await A.ir(page, "ajustes"); await page.click(`#segApariencia button[data-v="${v}"]`); };

// Escenario: oscura por defecto
t.test("oscura por defecto", async () => {
  const { page } = await abrir({ datos: conApariencia(), esquema: "light", sinApariencia: true });
  assert.equal(await attr(page), "oscura");
  assert.ok(lum(await fondoCuerpo(page)) < 0.05);
  await A.ir(page, "ajustes");
  assert.equal(await marcada(page), "oscura");
  assert.deepEqual((await page.locator("#segApariencia button").allInnerTexts()).map((x) => x.trim()), ["Oscura", "Clara", "Automática"]);
  assert.equal(await page.locator("[data-paleta-op]").count(), 0, "ya no se elige paleta");
});

// Escenario: elegir clara
t.test("elegir clara", async () => {
  const { page } = await abrir({ datos: conApariencia() });
  await elegirAp(page, "clara");
  assert.equal(await attr(page), "clara");
  assert.ok(lum(await fondoCuerpo(page)) > 0.7);
  assert.equal(await marcada(page), "clara");
  assert.equal((await A.guardados(page)).settings.apariencia, "clara");
});

// Escenario: automática sigue al teléfono
t.test("automática sigue al teléfono", async () => {
  const { page } = await abrir({ datos: conApariencia("auto"), esquema: "light" });
  assert.equal(await attr(page), "clara");
  await page.emulateMedia({ colorScheme: "dark" });
  await page.waitForFunction(() => document.documentElement.dataset.apariencia === "oscura");
  await page.emulateMedia({ colorScheme: "light" });
  await page.waitForFunction(() => document.documentElement.dataset.apariencia === "clara");
});

// Escenario: la apariencia se recuerda
t.test("la apariencia se recuerda", async () => {
  const { page } = await abrir({ datos: conApariencia() });
  await elegirAp(page, "clara");
  await page.reload();
  assert.equal(await attr(page), "clara");
  await A.ir(page, "ajustes");
  assert.equal(await marcada(page), "clara");
});

// Escenario: el fondo está en todas las pantallas
t.test("el fondo está en todas las pantallas", async () => {
  const { page } = await abrir({ datos: A.datosEjemplo() });
  for (const v of A.VISTAS) {
    await A.ir(page, v);
    const f = await page.evaluate(() => { const e = document.querySelector(".fondo"), r = e.getBoundingClientRect(), s = getComputedStyle(e); return { pos: s.position, z: s.zIndex, ancho: r.width, alto: r.height, lobulos: e.querySelectorAll("#fluidoMasa circle").length, visible: s.display !== "none" && s.visibility !== "hidden" }; });
    assert.deepEqual([f.pos, f.z, f.lobulos, f.visible], ["fixed", "-1", 3, true], v);
    assert.ok(f.ancho >= 390 && f.alto >= 844, `${v}: ${f.ancho}x${f.alto}`);
  }
});

// Escenario: una sola forma de tres lóbulos
t.test("una sola forma de tres lóbulos", async () => {
  const { page } = await abrir({ datos: conApariencia() });
  for (const ap of ["oscura", "clara"]) {
    await page.evaluate((a) => { document.documentElement.dataset.apariencia = a; }, ap);
    const f = await page.evaluate(() => { const e = document.querySelector(".fondo"); return { lobulos: e.querySelectorAll("#fluidoMasa circle").length, filtros: e.querySelectorAll("filter").length, manchas: e.querySelectorAll("i").length, estrellas: e.querySelectorAll("b").length, vars: [1, 2, 3, 4, 5].map((i) => getComputedStyle(document.documentElement).getPropertyValue("--mancha" + i).trim()).filter(Boolean).length }; });
    assert.deepEqual(f, { lobulos: 3, filtros: 1, manchas: 0, estrellas: 0, vars: 0 }, ap);
  }
});

// Escenario: color de fondo de cada apariencia
t.test("color de fondo de cada apariencia", async () => {
  const { page } = await abrir({ datos: conApariencia("oscura") });
  assert.equal(await fondoCuerpo(page), "rgb(11, 11, 16)");
  await elegirAp(page, "clara");
  assert.equal(await fondoCuerpo(page), "rgb(243, 243, 248)");
});

// Escenario: el texto se lee sobre el fondo
t.test("el texto se lee sobre el fondo", async () => {
  const { page } = await abrir({ datos: conApariencia() });
  for (const ap of ["oscura", "clara"]) {
    await page.evaluate((a) => { document.documentElement.dataset.apariencia = a; }, ap);
    // peor caso: cada color de la forma en su intensidad máxima bajo el texto, con y sin el vidrio de una tarjeta encima
    const r = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement), v = (n) => cs.getPropertyValue(n).trim();
      const hex = (h) => { const x = h.replace("#", ""); return [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16) / 255); };
      const mix = (a, b, t) => a.map((x, i) => x * (1 - t) + b[i] * t);
      const L = (c) => { const [r, g, b] = c.map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
      const par = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
      const bg = hex(v("--bg")), ink = hex(v("--ink")), muted = hex(v("--muted")), cuerpo = parseFloat(v("--fondo-cuerpo")), halo = parseFloat(v("--fondo-halo"));
      const sm = v("--surface").match(/[\d.]+/g).map(Number), surf = sm.slice(0, 3).map((x) => x / 255), sa = sm[3];
      const formas = [["--flow-silver", 1], ["--flow-tint", 1], ["--glow-pos", 0.55], ["--glow-neg", 0.55], ["--glow-neu", 0.55]];
      let peor = { suelto: 99, sueltoMudo: 99, vidrio: 99, vidrioMudo: 99 };
      for (const [n, al] of formas) {
        const a = 1 - (1 - cuerpo * al) * (1 - halo * al), base = mix(bg, hex(v(n)), a), vid = mix(base, surf, sa);
        peor.suelto = Math.min(peor.suelto, par(ink, base)); peor.sueltoMudo = Math.min(peor.sueltoMudo, par(muted, base));
        peor.vidrio = Math.min(peor.vidrio, par(ink, vid)); peor.vidrioMudo = Math.min(peor.vidrioMudo, par(muted, vid));
      }
      return peor;
    });
    for (const [k, c] of Object.entries(r)) assert.ok(c >= 4.5, `${ap} ${k}: ${c.toFixed(2)}`);
  }
});

// Escenario: se mueve despacio
t.test("se mueve despacio", async () => {
  const { page } = await abrir({ datos: conApariencia() });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const pos = () => page.evaluate(() => ["lobulo1", "lobulo2", "lobulo3"].map((i) => { const c = document.getElementById(i); return [+c.getAttribute("cx"), +c.getAttribute("cy"), +c.getAttribute("r")]; }));
  await page.waitForTimeout(300);
  const a = await pos();
  await page.waitForTimeout(500);
  const b = await pos();
  const mueve = a.flat().some((v, i) => Math.abs(v - b.flat()[i]) > 0.01);
  assert.ok(mueve, "los lóbulos cambian de lugar");
  // despacio: en medio segundo ningún lóbulo se desplaza más de una décima parte del ancho
  assert.ok(a.every(([x, y], i) => Math.hypot(x - b[i][0], y - b[i][1]) < 10), `${JSON.stringify(a)} -> ${JSON.stringify(b)}`);
});

// Escenario: reducir movimiento
t.test("reducir movimiento", async () => {
  const { page } = await abrir({ datos: conApariencia() });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const pos = () => page.evaluate(() => ["lobulo1", "lobulo2", "lobulo3"].map((i) => { const c = document.getElementById(i); return [c.getAttribute("cx"), c.getAttribute("cy"), c.getAttribute("r")].join(","); }).join("|"));
  await page.waitForTimeout(300);
  const a = await pos();
  await page.waitForTimeout(600);
  assert.equal(await pos(), a, "los lóbulos están quietos");
});

// Escenario: la app no está visible
t.test("la app no está visible", async () => {
  const { page } = await abrir({ datos: conApariencia() });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const pos = () => page.evaluate(() => document.getElementById("lobulo1").getAttribute("cx") + "," + document.getElementById("lobulo2").getAttribute("r"));
  const oculta = (v) => page.evaluate((h) => { Object.defineProperty(document, "hidden", { value: h, configurable: true }); document.dispatchEvent(new Event("visibilitychange")); }, v);
  await page.waitForTimeout(300);
  const a = await pos();
  await page.waitForTimeout(300);
  assert.notEqual(await pos(), a, "se mueve con la app visible");
  await oculta(true);
  await page.waitForTimeout(150);
  const b = await pos();
  await page.waitForTimeout(500);
  assert.equal(await pos(), b, "pausado con la app oculta");
  await oculta(false);
  await page.waitForTimeout(500);
  assert.notEqual(await pos(), b, "vuelve a moverse");
});

// Escenario: sin cargar nada de otros sitios
t.test("sin cargar nada de otros sitios", async () => {
  const { page } = await abrir({ datos: A.datosEjemplo() });
  const afuera = [];
  page.on("request", (r) => { const u = new URL(r.url()); if (u.protocol.startsWith("http") && u.origin !== new URL(page.url()).origin) afuera.push(r.url()); });
  await page.reload();
  for (const v of A.VISTAS) await A.ir(page, v);
  await elegirAp(page, "clara");
  assert.deepEqual(afuera, []);
});

// Escenario: barra oscura y clara
t.test("barra oscura y clara", async () => {
  const { page } = await abrir({ datos: conApariencia("oscura") });
  const barra = () => page.$eval('meta[name="theme-color"]', (m) => m.content.toLowerCase());
  assert.equal(await barra(), "#0b0b10");
  assert.equal(await page.$eval('meta[name="apple-mobile-web-app-status-bar-style"]', (m) => m.content), "black-translucent");
  await elegirAp(page, "clara");
  assert.equal(await barra(), "#f3f3f8");
  await page.reload();
  assert.equal(await page.$eval('meta[name="apple-mobile-web-app-status-bar-style"]', (m) => m.content), "default");
});

const variable = (page, nombre) => page.evaluate((n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim().toUpperCase(), nombre);
const colorDe = (page, sel) => page.$eval(sel, (e) => getComputedStyle(e).color);

// Escenario: los colores de la oscura
t.test("los colores de la oscura", async () => {
  const { page } = await abrir({ datos: conApariencia("oscura") });
  assert.equal(await fondoCuerpo(page), "rgb(11, 11, 16)");
  assert.equal(await colorDe(page, "body"), "rgb(244, 244, 246)");
  assert.deepEqual([await variable(page, "--accent"), await variable(page, "--label")], ["#B2FF00", "#C4A5F7"]);
});

// Escenario: los colores de la clara
t.test("los colores de la clara", async () => {
  const { page } = await abrir({ datos: conApariencia("clara") });
  assert.equal(await fondoCuerpo(page), "rgb(243, 243, 248)");
  assert.equal(await colorDe(page, "body"), "rgb(19, 19, 26)");
  assert.deepEqual([await variable(page, "--accent"), await variable(page, "--accent-ink"), await variable(page, "--label")], ["#B2FF00", "#13131A", "#5B2BD1"]);
});

// Escenario: positivo y negativo
t.test("positivo y negativo", async () => {
  for (const [ap, pos, neg] of [["oscura", "#B2FF00", "#F2546A"], ["clara", "#367300", "#C72543"]]) {
    const { page } = await abrir({ datos: conApariencia(ap) });
    assert.deepEqual([await variable(page, "--positive"), await variable(page, "--negative")], [pos, neg], ap);
  }
});

// Escenario: una paleta vieja guardada
t.test("una paleta vieja guardada", async () => {
  const errores = [];
  const { page } = await abrir({ datos: conApariencia(undefined, "pastel") });
  page.on("pageerror", (e) => errores.push(String(e)));
  await page.reload();
  assert.equal(await fondoCuerpo(page), "rgb(11, 11, 16)");
  assert.deepEqual(errores, []);
});
