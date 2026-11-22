// Capacidades: interfaz y apariencia — estilo del rediseño con tarjetas de color, barra flotante y carrusel de cuentas
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 1200);
const TARJ = A.cta(2, "Tarjeta Y", 350, { tipo: "tarjeta", tope: 300 });
const BROKER = A.cta(3, "Broker X", 2100, { tipo: "inversion" });
const datos = (extra = {}) => A.v2({ cuentas: [BANCO, TARJ, BROKER], movs: [A.ingreso(1, "2026-10-01", 1000, 1), A.gasto(2, "2026-10-03", 64.3, 1), A.gasto(3, "2026-10-05", 18, 1, "Comida fuera", "Cena")], ...extra });
const lum = (rgb) => { const [r, g, b] = rgb.match(/[\d.]+/g).slice(0, 3).map((x) => { x = Number(x) / 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contraste = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const rgb = (hex) => { const h = hex.replace("#", ""); return `rgb(${[0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(", ")})`; };
const paradas = (g) => (g.match(/rgba?\([^)]*\)/g) || []);
const estilo = (page, sel, prop) => page.$eval(sel, (e, p) => getComputedStyle(e)[p], prop);
const ESQ = [["light", "clara"], ["dark", "oscura"]];

// Escenario: barra flotante
t.test("barra flotante", async () => {
  for (const [esquema] of ESQ) {
    const { page } = await abrir({ datos: datos(), esquema });
    const b = await page.$eval("nav", (n) => { const r = n.getBoundingClientRect(), s = getComputedStyle(n); return { l: r.left, r: innerWidth - r.right, b: innerHeight - r.bottom, rad: parseFloat(s.borderRadius), bg: s.backgroundColor }; });
    assert.ok(b.l >= 10 && b.r >= 10 && b.b >= 6, `${esquema}: separada de los bordes`);
    assert.ok(b.rad >= 30, "píldora");
    assert.ok(lum(b.bg) < 0.05, "oscura");
    const on = await page.$eval('nav [aria-current="page"]', (x) => [getComputedStyle(x).backgroundColor, getComputedStyle(x).color]);
    const off = await page.$eval('nav [data-v="movs"]', (x) => getComputedStyle(x).color);
    assert.ok(contraste(on[0], b.bg) >= 3, `${esquema}: activa se distingue`);
    assert.notEqual(on[1], off);
  }
});

// Escenario: la barra no tapa el contenido
t.test("la barra no tapa el contenido", async () => {
  const { page } = await abrir({ datos: datos() });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const r = await page.evaluate(() => { const cs = [...document.querySelectorAll('#v-inicio > .card, #v-inicio > .grid2')].filter((c) => c.offsetParent); const u = cs[cs.length - 1].getBoundingClientRect(); return { ult: u.bottom, nav: document.querySelector("nav").getBoundingClientRect().top }; });
  assert.ok(r.ult <= r.nav, `última tarjeta ${r.ult} por encima de la barra ${r.nav}`);
});

// Escenario: título grande
t.test("título grande", async () => {
  const { page } = await abrir({ datos: datos() });
  await A.ir(page, "movs");
  const t1 = await page.$eval("#title", (h) => ({ fs: parseFloat(getComputedStyle(h).fontSize), fw: +getComputedStyle(h).fontWeight, txt: h.textContent, left: h.getBoundingClientRect().left }));
  assert.equal(t1.txt, "Movimientos");
  assert.ok(t1.fs >= 28 && t1.fw >= 700);
  assert.ok(t1.left <= 80, "a la izquierda, después del botón del panel");
});

// Escenario: la letra del sistema primero
t.test("la letra del sistema primero", async () => {
  const { page } = await abrir({ datos: datos() });
  const fam = (sel) => page.$eval(sel, (e) => getComputedStyle(e).fontFamily);
  for (const f of [await fam("body"), await fam("#title")]) { assert.match(f, /^-apple-system/); assert.match(f, /Roboto/); }
  await page.click("#fab");
  assert.match(await fam("#sheet h2"), /^-apple-system.*Roboto/);
});

// Escenario: cifras de ancho fijo
t.test("cifras de ancho fijo", async () => {
  const { page } = await abrir({ datos: datos() });
  await A.ir(page, "movs");
  assert.match(await estilo(page, "#movs .mov .num", "fontVariantNumeric"), /tabular-nums/);
});

// Escenario: el respaldo funciona sin conexión
t.test("el respaldo funciona sin conexión", async () => {
  const { page, ctx } = await abrir({ datos: datos(), sw: true });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.evaluate(() => document.fonts.load("700 32px Roboto"));
  await ctx.setOffline(true);
  await page.reload();
  await page.evaluate(() => document.fonts.load("700 32px Roboto"));
  assert.equal(await page.evaluate(() => document.fonts.check("700 32px Roboto")), true);
});

// Escenario: color en la lista y en la fila
t.test("color en la lista y en la fila", async () => {
  const { page } = await abrir({ datos: datos({ movs: [A.gasto(1, "2026-10-03", 30, 1, "Alquiler"), A.gasto(2, "2026-10-04", 10, 1)] }) });
  const enMosaico = await (await page.waitForFunction(() => { const b = document.querySelector('#lcat [data-cat="Alquiler"] .tile'); const g = b && getComputedStyle(b).backgroundImage; return g && g !== "none" ? g : false; })).jsonValue();
  await page.click("#gastoHdr");
  const enPila = await page.$eval('#pila [data-cat="Alquiler"]', (b) => getComputedStyle(b).backgroundImage);
  await page.click("#pilaCerrar");
  await A.ir(page, "movs");
  const enFila = await page.$eval('#movs .mov[data-mov="1"] .ico', (b) => getComputedStyle(b).backgroundImage);
  const otra = await page.$eval('#movs .mov[data-mov="2"] .ico', (b) => getComputedStyle(b).backgroundImage);
  assert.equal(enMosaico, enPila);assert.equal(enMosaico, enFila);assert.notEqual(enFila, otra);
});

// Escenario: ícono legible en el cuadradito
t.test("ícono legible en el cuadradito", async () => {
  const cats = Array.from({ length: 19 }, (_, i) => ({ nombre: `Cat ${i + 1}`, color: i + 1 }));
  for (const [esquema] of ESQ) {
    const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: cats.map((c, i) => A.gasto(i + 1, "2026-10-03", 10, 1, c.nombre)), categorias: { gasto: cats, ingreso: [] } }), esquema });
    await A.ir(page, "movs");
    const xs = await page.$$eval("#movs .mov .ico", (is) => is.map((i) => ({ g: getComputedStyle(i).backgroundImage, c: getComputedStyle(i).color })));
    assert.equal(xs.length, 19);
    for (const x of xs) for (const p of paradas(x.g)) assert.ok(contraste(x.c, p) >= 4.5, `${esquema} ${x.c} sobre ${p}`);
  }
});

// Escenario: tarjeta destacada
t.test("tarjeta destacada", async () => {
  for (const [esquema, , fondo] of [["light", "clara", "#0B0B0F"], ["dark", "oscura", "#E8F94B"]]) {
    const { page } = await abrir({ datos: datos(), esquema });
    await A.ir(page, "cuentas");
    const bg = await estilo(page, "#netoBox", "backgroundColor"), c = await estilo(page, "#neto", "color");
    assert.equal(bg, rgb(fondo), esquema);
    assert.equal(await estilo(page, "#netoBox", "backgroundImage"), "none");
    assert.ok(contraste(bg, c) >= 4.5);
    await A.ir(page, "inicio");
    assert.equal(await page.locator('[data-ui="resultado-mes"].destacada').count(), 0, "el resultado ya no es destacada");
  }
});

// Escenario: botón principal
t.test("botón principal", async () => {
  for (const [esquema, , fondo] of [["light", "clara", "#0B0B0F"], ["dark", "oscura", "#E8F94B"]]) {
    const { page } = await abrir({ datos: datos(), esquema });
    await page.click("#fab");
    const s = await page.$eval("#mGuardar", (b) => { const e = getComputedStyle(b); return { bg: e.backgroundColor, c: e.color, r: parseFloat(e.borderRadius), h: b.offsetHeight }; });
    assert.equal(s.bg, rgb(fondo), esquema);
    assert.ok(s.r >= s.h / 2 - 1, "píldora");
    assert.ok(contraste(s.bg, s.c) >= 4.5);
  }
});

// Escenario: los primeros colores de la paleta
t.test("los primeros colores de la paleta", async () => {
  const { page } = await abrir({ datos: datos({ movs: [A.gasto(1, "2026-10-03", 30, 1, "Supermercado"), A.gasto(2, "2026-10-03", 20, 1, "Comida fuera"), A.gasto(3, "2026-10-03", 10, 1, "Delivery")] }), esquema: "light" });
  // Espera a que la lista esté pintada (con la máquina cargada se puede leer entre dos repintados)
  const fondo = async (c) => (await page.waitForFunction((cat) => { const b = document.querySelector(`#lcat [data-cat="${cat}"] .tile`); const m = b && getComputedStyle(b).backgroundImage.match(/rgba?\([^)]*\)/g); return m && m[1] ? m[1] : false; }, c)).jsonValue();
  // verde agua, lima y azul: el punto medio de cada degradado
  const [l, li, az] = [await fondo("Supermercado"), await fondo("Comida fuera"), await fondo("Delivery")];
  const hsl = (s) => { const [r, g, b] = s.match(/[\d.]+/g).map(Number); const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0; if (mx !== mn) { const d = mx - mn; h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; } return (h * 60 + 360) % 360; };
  assert.ok(hsl(l) > 160 && hsl(l) < 185, `verde agua ${l}`);
  assert.ok(hsl(li) > 55 && hsl(li) < 80, `lima ${li}`);
  assert.ok(hsl(az) > 195 && hsl(az) < 240, `azul ${az}`);
});

// Escenario: el orden de Inicio
t.test("el orden de Inicio", async () => {
  const d = datos({ movs: [A.ingreso(1, "2026-10-01", 1000, 1), A.gasto(2, "2026-10-03", 64.3, 2), { ...A.gasto(3, "2026-10-04", 40, 1, "Alquiler"), fijo: true }, A.ingreso(4, "2026-09-01", 900, 1)] });
  const { page } = await abrir({ datos: d });
  const orden = await page.$$eval("#v-inicio > *", (xs) => xs.filter((x) => x.offsetParent && x.dataset.ui).map((x) => x.dataset.ui));
  const quiero = ["fijos-variables", "resultado-mes", "gastado-ingresado", "disponibles-color", "gasto-categorias", "ingresos-gastos", "patrimonio-inicio"];
  assert.deepEqual(orden.filter((u) => quiero.includes(u)), quiero);
  assert.equal(await page.locator('[data-ui="barras-semana"]').count(), 0, "sin «Por semana»");
});

// Escenario: tres cuentas en el carrusel
t.test("tres cuentas en el carrusel", async () => {
  const { page } = await abrir({ datos: datos() });
  await A.ir(page, "cuentas");
  assert.equal(await page.locator("#carDots i").count(), 3);
  assert.equal(await page.locator("#carDots i.on").count(), 1);
  assert.equal(await page.$eval("#carCtas .tcta", (b) => b.dataset.cta), "1");
  assert.equal(await A.texto(page, "#carSaldo"), "2.117,7 €");
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= 390));
});

// Escenario: deslizar a la siguiente cuenta
t.test("deslizar a la siguiente cuenta", async () => {
  const { page } = await abrir({ datos: datos() });
  await A.ir(page, "cuentas");
  const antes = await A.texto(page, "#carSaldo");
  await page.$eval("#carCtas", (el) => { el.scrollLeft = el.firstElementChild.offsetWidth + 12; });
  await page.waitForFunction((a) => document.getElementById("carSaldo").textContent !== a, antes);
  assert.equal(await page.$eval("#carDots", (d) => [...d.children].findIndex((i) => i.classList.contains("on"))), 1);
});

// Escenario: ver movimientos de la cuenta centrada
t.test("ver movimientos de la cuenta centrada", async () => {
  const { page } = await abrir({ datos: datos() });
  await A.ir(page, "cuentas");
  await page.click("#carMovs");
  await page.waitForSelector("#sheetMovsCta:not([hidden])");
  assert.match(await page.locator("#sheetMovsCta").innerText(), /Banco A/);
});

// Escenario: rendimiento de una inversión
t.test("rendimiento de una inversión", async () => {
  const { page } = await abrir({ datos: datos() });
  await A.ir(page, "cuentas");
  assert.equal(await page.isVisible("#carRend"), false);
  await A.saldoCta(page, 3);
  assert.equal(await page.isVisible("#carRend"), true);
  assert.equal(await page.isVisible("#carMovs"), true);
  assert.equal(await A.texto(page, "#carRend"), "Ver rendimiento");
});

// Escenario: abrir la cuenta desde la tarjeta
t.test("abrir la cuenta desde la tarjeta", async () => {
  const { page } = await abrir({ datos: datos() });
  await A.ir(page, "cuentas");
  await page.click('#carCtas .tcta[data-cta="1"]');
  await page.waitForSelector("#sheetC:not([hidden])");
  assert.equal(await page.inputValue("#cNombre"), "Banco A");
});

// Escenario: total por tipo
t.test("total por tipo", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO, A.cta(4, "Banco B", 300)] }) });
  await A.ir(page, "cuentas");
  const f = await page.$eval('#tipos [data-tipo-tot="liquidez"]', (x) => ({ t: x.innerText.replace(/\s+/g, " ").trim(), dot: x.querySelector(".dot").style.getPropertyValue("--c") }));
  assert.equal(f.t, "Bancos y efectivo 1.500 €");
  assert.equal(f.dot, "var(--k1)");
});

// Escenario: verde para lo que entra y texto para lo que sale
t.test("verde para lo que entra y texto para lo que sale", async () => {
  for (const [esquema, , verde] of [["light", "clara", "#17773F"], ["dark", "oscura", "#4ADE80"]]) {
    const { page } = await abrir({ datos: datos(), esquema });
    await A.ir(page, "movs");
    const c = await page.evaluate(() => { const f = (s) => { const n = document.querySelector(s); let b = n; while (b && /rgba\(.*, 0\)|transparent/.test(getComputedStyle(b).backgroundColor)) b = b.parentElement; return [getComputedStyle(n).color, getComputedStyle(b || document.body).backgroundColor]; }; return { ing: f("#movs .mov[data-tipo=ingreso] .num"), gas: f("#movs .mov[data-tipo=gasto] .num"), txt: getComputedStyle(document.body).color }; });
    assert.equal(c.ing[0], rgb(verde), esquema);
    assert.equal(c.gas[0], c.txt, esquema);
    assert.ok(contraste(c.ing[0], c.ing[1]) >= 4.5 && contraste(c.gas[0], c.gas[1]) >= 4.5, esquema);
  }
});

// Escenario: rosa sólo para avisos
t.test("rosa sólo para avisos", async () => {
  for (const [esquema, , rosa] of [["light", "clara", "#C81E4A"], ["dark", "oscura", "#FF8AA6"]]) {
    const d = A.v2({ cuentas: [BANCO, A.cta(2, "Tarjeta Y", 350, { tipo: "tarjeta" })], movs: [A.ingreso(1, "2026-09-01", 100, 1), A.gasto(2, "2026-09-03", 300, 1), A.ingreso(3, "2026-10-01", 500, 1)] });
    const { page } = await abrir({ datos: d, esquema });
    const mes = await page.$eval('#mesesEjes [class*="neg"]', (e) => [e.textContent, getComputedStyle(e).color, getComputedStyle(e.closest(".card")).backgroundColor]);
    assert.equal(mes[0], "sep");
    assert.equal(mes[1], rgb(rosa), esquema);
    assert.ok(contraste(mes[1], mes[2]) >= 4.5);
    await A.ir(page, "cuentas");
    const tar = await page.$eval('#tipos [data-tipo-tot="tarjeta"] .num', (e) => [getComputedStyle(e).color, getComputedStyle(e.closest(".card")).backgroundColor]);
    assert.equal(tar[0], rgb(rosa), esquema);
    assert.ok(contraste(tar[0], tar[1]) >= 4.5);
  }
});

// --- tarjetas de Inicio en parejas de color

const RESUMEN = () => A.v2({ cuentas: [BANCO, A.cta(2, "Tarjeta Y", 0, { tipo: "tarjeta", tope: 300 })], movs: [A.ingreso(1, "2026-10-01", 1000, 1), { ...A.gasto(2, "2026-10-03", 40, 1, "Alquiler"), fijo: true }, A.gasto(3, "2026-10-04", 64.3, 2)] });
const fondoDe = (page, sel) => page.$eval(sel, (e) => getComputedStyle(e).backgroundColor);
const SEL = { resultado: '[data-ui="resultado-mes"]', fijos: '[data-ui="fijos-variables"]', gastado: '[data-ui="gastado-ingresado"] .card:nth-child(1)', ingresado: '[data-ui="gastado-ingresado"] .card:nth-child(2)', tarjeta: '[data-disp="2"]', patrimonio: "#netoCard" };

// Escenario: el resumen de Inicio en color
t.test("el resumen de Inicio en color", async () => {
  const { page } = await abrir({ datos: RESUMEN(), esquema: "light" });
  const gris = await fondoDe(page, '[data-ui="gasto-categorias"]');
  assert.equal(gris, rgb("#F4F4F6"));
  assert.equal(await fondoDe(page, '[data-ui="ingresos-gastos"]'), gris);
  for (const [n, sel] of Object.entries(SEL)) assert.notEqual(await fondoDe(page, sel), gris, n);
});

// Escenario: tarjetas de color distintas
t.test("tarjetas de color distintas", async () => {
  const { page } = await abrir({ datos: RESUMEN() });
  const fs = [await fondoDe(page, SEL.resultado), await fondoDe(page, SEL.fijos), await fondoDe(page, SEL.gastado), await fondoDe(page, SEL.ingresado)];
  assert.equal(new Set(fs).size, 4, fs.join(" | "));
});

// Escenario: el texto de las tarjetas de color se lee
t.test("el texto de las tarjetas de color se lee", async () => {
  const d = RESUMEN(); d.objetivos = [{ id: 1, nombre: "Viaje", monto: 1000, cuenta: 1, aporte: 100, inicio: "2026-10", dia: 1 }];
  d.movs.push({ ...A.gasto(9, "2026-10-05", 30, 2, "Trabajo (reembolsable)"), reembolso: { estado: "pendiente" } });
  for (const esquema of ["light", "dark"]) {
    const { page } = await abrir({ datos: JSON.parse(JSON.stringify(d)), esquema });
    const malos = await page.evaluate(() => {
      // Los fondos con color-mix llegan como «color(srgb r g b)», con canales de 0 a 1
      const lum = (c) => { const k = c.startsWith("color(") ? 1 : 255; const [r, g, b] = c.match(/[\d.]+/g).slice(0, 3).map((x) => { x /= k; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
      const cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
      const out = [];
      for (const card of document.querySelectorAll("#v-inicio .card.par")) {
        if (!card.offsetParent) continue;
        const fondo = getComputedStyle(card).backgroundColor;
        for (const e of card.querySelectorAll("*")) {
          if (!e.offsetParent || e.closest(".ico,.tile") || ![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
          // Fondo detrás del texto: el de la tarjeta, con las capas translúcidas de encima (grupos, píldoras) mezcladas
          const canal = (c) => { const k = c.startsWith("color(") ? 255 : 1, v = c.match(/[\d.]+/g).map(Number), al = /\/|rgba/.test(c) ? v[3] ?? 1 : 1; return [v[0] * k, v[1] * k, v[2] * k, al]; };
          const capas = []; for (let f = e; f && f !== card; f = f.parentElement) { const c = getComputedStyle(f).backgroundColor; if (!/rgba\(.*, 0\)$|transparent/.test(c)) capas.unshift(c); }
          let [r0, g0, b0] = canal(fondo);
          for (const c of capas) { const [r, g, b, al] = canal(c); r0 = r * al + r0 * (1 - al); g0 = g * al + g0 * (1 - al); b0 = b * al + b0 * (1 - al); }
          const c = cr(getComputedStyle(e).color, `rgb(${r0}, ${g0}, ${b0})`);
          if (c < 4.5) out.push([card.dataset.ui || card.id, e.textContent.trim().slice(0, 20), c.toFixed(2)]);
        }
      }
      return out;
    });
    assert.deepEqual(malos, [], esquema);
  }
});

// Escenario: tope excedido en una tarjeta de color
t.test("tope excedido en una tarjeta de color", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [A.cta(2, "Tarjeta", 0, { tipo: "tarjeta", tope: 300 })], movs: [A.gasto(1, "2026-10-03", 320, 2)] }) });
  assert.equal(await A.texto(page, '[data-disp="2"] .big'), "-20 €");
  assert.equal(await A.texto(page, '[data-disp="2"] .ring b'), "107 %");
  assert.equal(await page.isVisible('[data-disp="2"] [data-ui="marca-excedido"]'), true);
  assert.equal(await A.texto(page, '[data-disp="2"] [data-ui="marca-excedido"]'), "Excedido");
});

// --- importes con punto de miles

// Escenario: miles con punto
t.test("miles con punto", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [A.cta(1, "Banco A", 1234.56 + 1284)], movs: [A.gasto(1, "2026-10-03", 1284, 1)] }) });
  assert.equal(await A.saldoCta(page, 1), "1.234,56 €");
  await A.ir(page, "movs");
  assert.equal(await A.texto(page, '#movs .mov[data-mov="1"] .num'), "−1.284 €");
});

// Escenario: millones y negativos
t.test("millones y negativos", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [A.cta(1, "Broker X", 1000000, { tipo: "inversion" }), A.cta(2, "Tarjeta Y", 1060, { tipo: "tarjeta" })] }) });
  assert.equal(await A.saldoCta(page, 1), "1.000.000 €");
  assert.equal(await A.texto(page, '#tipos [data-tipo-tot="tarjeta"] .num'), "-1.060 €");
});

// Escenario: importes chicos sin punto
t.test("importes chicos sin punto", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [A.gasto(1, "2026-10-03", 64.3, 1)] }) });
  await A.ir(page, "movs");
  assert.equal(await A.texto(page, '#movs .mov[data-mov="1"] .num'), "−64,3 €");
});

// --- ningún texto se pisa

// Busca, dentro de lo que se ve (la hoja abierta o la pantalla), textos que se superponen con otros o se salen de su tarjeta o su botón
const pisados = (page) => page.evaluate(() => {
  const hoja = [...document.querySelectorAll(".sheet")].find((s) => !s.hidden);
  const raiz = hoja || document.querySelector("main");
  const rects = [];
  const caja = (e) => e.closest(".card,button,.sheet,.grp,.mov,.item,.sc,.tcta,.fila");
  const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    if (!n.textContent.trim()) continue;
    const e = n.parentElement;
    if (!e || !e.checkVisibility() || e.closest("nav,[hidden],svg,.globo")) continue;
    const s = getComputedStyle(e);
    let rs;
    if (s.textOverflow === "ellipsis" || s.overflow === "hidden") rs = [e.getBoundingClientRect()];
    else { const r = document.createRange(); r.selectNodeContents(n); rs = [...r.getClientRects()]; }
    for (const q of rs) if (q.width > 0.5 && q.height > 0.5) rects.push({ e, q, t: n.textContent.trim().slice(0, 24) });
  }
  const malos = [];
  for (const a of rects) {
    const c = caja(a.e);
    if (c) { const b = c.getBoundingClientRect(); if (a.q.left < b.left - 1 || a.q.right > b.right + 1) malos.push(`se sale: «${a.t}»`); }
  }
  for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) {
    const a = rects[i], b = rects[j];
    if (a.e === b.e || a.e.contains(b.e) || b.e.contains(a.e)) continue;
    const x = Math.min(a.q.right, b.q.right) - Math.max(a.q.left, b.q.left), y = Math.min(a.q.bottom, b.q.bottom) - Math.max(a.q.top, b.q.top);
    if (x > 1 && y > 1) malos.push(`«${a.t}» pisa «${b.t}»`);
  }
  return [...new Set(malos)];
});

// Escenario: recorrido sin textos pisados
t.test("recorrido sin textos pisados", async () => {
  const largo = "Una categoría con un nombre larguísimo";
  const cuentas = [A.cta(1, "Cuenta corriente con un nombre muy largo", 245000), A.cta(2, "Tarjeta de crédito con nombre larguísimo", 125000.5, { tipo: "tarjeta", tope: 300000, limite: 500000 }), A.cta(3, "Broker internacional con nombre largo", 987654.32, { tipo: "inversion" })];
  const movs = [A.ingreso(1, "2026-10-01", 345678.9, 1), A.gasto(2, "2026-10-03", 123456.78, 1, largo, "Una nota también bastante larga para ver cómo corta"), A.gasto(3, "2026-10-04", 98765, 2, "Supermercado"), A.gasto(4, "2026-10-05", 5000, 2, "Comida fuera"), A.transf(5, "2026-10-06", 100000, 1, 3)];
  const datos = A.v2({ cuentas, movs, categorias: { gasto: [{ nombre: largo, color: 6 }], ingreso: [] } });
  for (const esquema of ["light", "dark"]) {
    const { page } = await abrir({ datos: JSON.parse(JSON.stringify(datos)), esquema });
    const revisar = async (donde) => assert.deepEqual(await pisados(page), [], `${esquema} ${donde}`);
    for (const v of A.VISTAS) { await A.ir(page, v); await revisar(v); }
    await A.ir(page, "inicio");
    await page.click("#gastoHdr"); await revisar("gasto por categoría");
    await page.click(`#pila [data-cat="${largo}"]`); await page.waitForSelector("#sheetCat:not([hidden])"); await revisar("hoja de categoría");
    await page.click("#catCerrar"); await page.click("#pilaCerrar");
    await A.ir(page, "cuentas"); await page.click('#carCtas [data-cta="2"]'); await page.waitForSelector("#sheetC:not([hidden])"); await revisar("hoja de cuenta");
  }
});
