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
    const f = await page.evaluate(() => { const e = document.querySelector(".fondo"), r = e.getBoundingClientRect(), s = getComputedStyle(e); return { pos: s.position, z: s.zIndex, ancho: r.width, alto: r.height, manchas: e.querySelectorAll("i").length, visible: s.display !== "none" }; });
    assert.deepEqual([f.pos, f.z, f.manchas, f.visible], ["fixed", "-1", 5, true], v);
    assert.ok(f.ancho >= 390 && f.alto >= 844, `${v}: ${f.ancho}x${f.alto}`);
  }
});

const manchas = (page) => page.evaluate(() => { const cs = getComputedStyle(document.documentElement); return [1, 2, 3, 4, 5].map((i) => cs.getPropertyValue("--mancha" + i).trim().toUpperCase()); });

// Escenario: los colores de la oscura
t.test("los colores de la oscura", async () => {
  const { page } = await abrir({ datos: conApariencia("oscura") });
  assert.equal(await fondoCuerpo(page), "rgb(7, 11, 12)");
  assert.deepEqual(await manchas(page), ["#136C51", "#E9B8DE", "#EEDC5B", "#B97DA8", "#113C42"]);
});

// Escenario: los colores de la clara
t.test("los colores de la clara", async () => {
  const { page } = await abrir({ datos: conApariencia("clara") });
  assert.equal(await fondoCuerpo(page), "rgb(255, 255, 255)");
  assert.deepEqual(await manchas(page), ["#FFA102", "#DD5533", "#432E6F", "#BC2D29", "#F5E9CE"]);
});

// Escenario: manchas de la paleta, sin estrellas
t.test("manchas de la paleta, sin estrellas", async () => {
  const { page } = await abrir({ datos: conApariencia() });
  for (const ap of ["oscura", "clara"]) {
    await page.evaluate((a) => { document.documentElement.dataset.apariencia = a; }, ap);
    const f = await page.evaluate(() => { const e = document.querySelector(".fondo"); return { b: e.querySelectorAll("b").length, antes: getComputedStyle(e, "::before").content, grad: [...e.querySelectorAll("i")].map((i) => getComputedStyle(i).backgroundImage.startsWith("radial-gradient")) }; });
    assert.equal(f.b, 0, ap);
    assert.ok(["none", "normal"].includes(f.antes), `${ap}: ${f.antes}`);
    assert.deepEqual(f.grad, [true, true, true, true, true], ap);
  }
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--estrellas").trim()), "");
});

// Escenario: el texto se lee sobre el fondo
t.test("el texto se lee sobre el fondo", async () => {
  const { page } = await abrir({ datos: conApariencia() });
  for (const ap of ["oscura", "clara"]) {
    {
      await page.evaluate((a) => { document.documentElement.dataset.apariencia = a; }, ap);
      // peor caso: la mancha más clara bajo el velo, y dos manchas superpuestas
      const r = await page.evaluate(() => {
        const cs = getComputedStyle(document.documentElement), v = (n) => cs.getPropertyValue(n).trim();
        const hex = (h) => { const x = h.replace("#", ""); return [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16) / 255); };
        const base = hex(v("--bg")), ink = hex(v("--ink")), op = parseFloat(v("--mancha-op"));
        const velo = v("--velo"), m = velo.match(/[\d.]+/g), veloA = velo.startsWith("rgba") ? parseFloat(m[3]) : 0, veloC = velo.startsWith("rgba") ? m.slice(0, 3).map((x) => x / 255) : base;
        const mix = (a, b, t) => a.map((x, i) => x * (1 - t) + b[i] * t);
        const L = (c) => { const [r, g, b] = c.map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
        const manchas = [1, 2, 3, 4, 5].map((i) => hex(v("--mancha" + i)));
        let peor = 99;
        for (const a of manchas) for (const b of manchas) {
          const c = mix(mix(mix(base, a, op), b, op), veloC, veloA);
          const [x, y] = [L(ink), L(c)].sort((p, q) => q - p);
          peor = Math.min(peor, (x + 0.05) / (y + 0.05));
        }
        return peor;
      });
      assert.ok(r >= 4.5, `${ap}: peor contraste del texto sobre las manchas ${r.toFixed(2)}`);
    }
  }
});

// Escenario: se mueve despacio
t.test("se mueve despacio", async () => {
  const { page } = await abrir({ datos: conApariencia() });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const a = await page.evaluate(() => { const s = getComputedStyle(document.querySelector(".fondo i")); return { n: s.animationName, d: parseFloat(s.animationDuration), p: s.animationPlayState }; });
  assert.equal(a.n, "flota");
  assert.ok(a.d >= 30, `duración ${a.d}s`);
  assert.equal(a.p, "running");
});

// Escenario: reducir movimiento
t.test("reducir movimiento", async () => {
  const { page } = await abrir({ datos: conApariencia() });
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector(".fondo i")).animationName), "none");
});

// Escenario: la app no está visible
t.test("la app no está visible", async () => {
  const { page } = await abrir({ datos: conApariencia() });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const estado = () => page.evaluate(() => getComputedStyle(document.querySelector(".fondo i")).animationPlayState);
  assert.equal(await estado(), "running");
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { value: true, configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
  assert.equal(await estado(), "paused");
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { value: false, configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
  assert.equal(await estado(), "running");
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
  assert.equal(await barra(), "#070b0c");
  assert.equal(await page.$eval('meta[name="apple-mobile-web-app-status-bar-style"]', (m) => m.content), "black-translucent");
  await elegirAp(page, "clara");
  assert.equal(await barra(), "#ffffff");
  await page.reload();
  assert.equal(await page.$eval('meta[name="apple-mobile-web-app-status-bar-style"]', (m) => m.content), "default");
});
