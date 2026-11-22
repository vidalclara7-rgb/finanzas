// Capacidad: apariencia
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 1000);
const datos = (extra = {}) => A.v2({ cuentas: [BANCO, A.cta(2, "Tarjeta Y", 0, { tipo: "tarjeta", tope: 500 })], movs: [A.ingreso(1, "2026-10-01", 1700, 1), A.gasto(2, "2026-10-03", 64.3, 2), A.gasto(3, "2026-10-05", 18, 1, "Comida fuera", "Cena")], ...extra });
const conApariencia = (a, paleta) => datos({ settings: { ...(a ? { apariencia: a } : {}), ...(paleta ? { paleta } : {}) } });
const attr = (page) => page.evaluate(() => document.documentElement.dataset.apariencia);
const fondoCuerpo = (page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
const lum = (rgb) => { const [r, g, b] = rgb.match(/[\d.]+/g).slice(0, 3).map((x) => { x = Number(x) / 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contraste = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const rgb = (hex) => { const h = hex.replace("#", ""); return `rgb(${[0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(", ")})`; };
const marcada = (page) => page.$eval('#segApariencia button[aria-pressed="true"]', (b) => b.dataset.v);
const elegirAp = async (page, v) => { await A.ir(page, "ajustes"); await page.click(`#segApariencia button[data-v="${v}"]`); };
const estilo = (page, sel, prop) => page.$eval(sel, (e, p) => getComputedStyle(e)[p], prop);

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

// Escenario: fondo de cada apariencia
t.test("fondo de cada apariencia", async () => {
  const { page } = await abrir({ datos: conApariencia("oscura") });
  assert.equal(await fondoCuerpo(page), rgb("#000000"));
  assert.equal(await page.locator(".fondo").count(), 0, "no queda el fondo fluido");
  await elegirAp(page, "clara");
  assert.equal(await fondoCuerpo(page), rgb("#FFFFFF"));
});

// Escenario: tarjetas de cada apariencia
t.test("tarjetas de cada apariencia", async () => {
  const { page } = await abrir({ datos: conApariencia("clara") });
  assert.equal(await estilo(page, '[data-ui="gasto-categorias"]', "backgroundColor"), rgb("#F4F4F6"));
  assert.equal(await estilo(page, '[data-ui="gasto-categorias"]', "boxShadow"), "none");
  assert.ok(parseFloat(await estilo(page, '[data-ui="gasto-categorias"]', "borderTopLeftRadius")) >= 22);
  await elegirAp(page, "oscura");
  await A.ir(page, "inicio");
  assert.equal(await estilo(page, '[data-ui="gasto-categorias"]', "backgroundColor"), rgb("#141416"));
  assert.equal(await estilo(page, '[data-ui="gasto-categorias"]', "boxShadow"), "none");
});

// Escenario: nada se mueve solo
t.test("nada se mueve solo", async () => {
  const { page } = await abrir({ datos: conApariencia("clara") });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForTimeout(2000);
  assert.equal(await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running" && !(a instanceof CSSTransition)).length), 0);
  for (const v of A.VISTAS) {
    await A.ir(page, v);
    assert.equal(await page.evaluate(() => [...document.querySelectorAll("*")].filter((e) => getComputedStyle(e).animationName !== "none" || getComputedStyle(e, "::after").animationName !== "none").length), 0, v);
  }
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
  assert.equal(await barra(), "#000000");
  assert.equal(await page.$eval('meta[name="apple-mobile-web-app-status-bar-style"]', (m) => m.content), "black-translucent");
  await elegirAp(page, "clara");
  assert.equal(await barra(), "#ffffff");
  await page.reload();
  assert.equal(await page.$eval('meta[name="apple-mobile-web-app-status-bar-style"]', (m) => m.content), "default");
});

const colorDe = (page, sel) => page.$eval(sel, (e) => getComputedStyle(e).color);

// Escenario: los colores de la clara
t.test("los colores de la clara", async () => {
  const { page } = await abrir({ datos: conApariencia("clara") });
  assert.equal(await fondoCuerpo(page), rgb("#FFFFFF"));
  assert.equal(await colorDe(page, "body"), rgb("#0B0B0F"));
});

// Escenario: los colores de la oscura
t.test("los colores de la oscura", async () => {
  const { page } = await abrir({ datos: conApariencia("oscura") });
  assert.equal(await fondoCuerpo(page), rgb("#000000"));
  assert.equal(await colorDe(page, "body"), rgb("#F5F5F7"));
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--muted").trim().toUpperCase()), "#9A9AA2");
});

// Escenario: texto secundario legible
t.test("texto secundario legible", async () => {
  for (const ap of ["clara", "oscura"]) {
    const { page } = await abrir({ datos: conApariencia(ap) });
    for (const v of ["inicio", "movs", "cuentas"]) {
      await A.ir(page, v);
      const malos = await page.evaluate(() => {
        const lumC = (rgb) => { const k = rgb.startsWith("color(") ? 1 : 255; const [r, g, b] = rgb.match(/[\d.]+/g).slice(0, 3).map((x) => { x = Number(x) / k; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
        // Fondo detrás del texto: el primero opaco hacia arriba, con las capas translúcidas de encima mezcladas
        const canal = (c) => { const k = c.startsWith("color(") ? 255 : 1, v = c.match(/[\d.]+/g).map(Number); return [v[0] * k, v[1] * k, v[2] * k, /\/|rgba/.test(c) ? (v[3] ?? 1) : 1]; };
        const fondoDe = (e) => { const capas = []; let base = getComputedStyle(document.body).backgroundColor;
          for (let n = e; n; n = n.parentElement) { const c = getComputedStyle(n).backgroundColor; if (!c || /rgba\(.*, 0\)$|transparent/.test(c)) continue; if (canal(c)[3] < 1) capas.unshift(c); else { base = c; break; } }
          let [r, g, b] = canal(base); for (const c of capas) { const [x, y, z, al] = canal(c); r = x * al + r * (1 - al); g = y * al + g * (1 - al); b = z * al + b * (1 - al); }
          return `rgb(${r}, ${g}, ${b})`; };
        const out = [];
        for (const e of document.querySelectorAll(".sub, .det, .mini .t, .ejes span, .pat small, .cta .d, .mov .det span")) {
          if (!e.offsetParent || e.closest(".destacada") || e.closest("[hidden]")) continue;
          const a = lumC(getComputedStyle(e).color), b = lumC(fondoDe(e)), c = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
          if (c < 4.5) out.push([e.className, e.textContent.slice(0, 20), c.toFixed(2)]);
        }
        return out;
      });
      assert.deepEqual(malos, [], `${ap} ${v}`);
    }
  }
});

// Escenario: una paleta vieja guardada
t.test("una paleta vieja guardada", async () => {
  const errores = [];
  const { page } = await abrir({ datos: conApariencia(undefined, "pastel") });
  page.on("pageerror", (e) => errores.push(String(e)));
  await page.reload();
  assert.equal(await fondoCuerpo(page), rgb("#000000"));
  assert.deepEqual(errores, []);
});
