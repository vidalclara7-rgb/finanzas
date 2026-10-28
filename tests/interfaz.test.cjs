// Capacidad: interfaz
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 1000);
// Los colores calculados llegan como rgb(…), rgba(…) o color(srgb …) (las mezclas): se pasan a tres canales de 0 a 255
const canales = (c) => { const m = c.match(/color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)/); return m ? m.slice(1, 4).map((x) => Math.round(parseFloat(x) * 255)) : c.match(/[\d.]+/g).slice(0, 3).map(Number); };
const luminancia = (rgb) => { const [r, g, b] = canales(rgb); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };
// Relación de contraste WCAG entre dos colores rgb()
const contraste = (a, b) => {
  const lum = (rgb) => { const v = canales(rgb).map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
// Color del texto y fondo efectivo (el del primer contenedor con fondo)
const colores = (page, sel) => page.$eval(sel, (el) => {
  let f = el; while (f && getComputedStyle(f).backgroundColor === "rgba(0, 0, 0, 0)") f = f.parentElement;
  return [getComputedStyle(el).color, getComputedStyle(f || document.body).backgroundColor];
});
const EJEMPLO = () => A.v2({ cuentas: [BANCO, A.cta(2, "Tarjeta", 0, { tipo: "tarjeta", tope: 500 })],
  movs: [A.ingreso(1, "2026-10-01", 1700, 1), A.gasto(2, "2026-10-03", 64.3, 2), A.gasto(3, "2026-10-05", 18, 1, "Comida fuera")] });

// Escenario: ninguna pantalla se desborda
t.test("ninguna pantalla se desborda", async () => {
  const { page, errores } = await abrir({ datos: A.datosEjemplo() });
  for (const v of A.VISTAS) {
    await A.ir(page, v);
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
    assert.ok(ancho <= 390, `«${v}» se desborda: ${ancho}px`);
  }
  assert.deepEqual(errores, []);
});

// Escenario: el más según la pantalla
t.test("el más según la pantalla", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await page.click("#fab");
  assert.ok(await page.isVisible("#sheet"));
  assert.equal(await A.texto(page, "#mTitulo"), "Nuevo movimiento");
  await page.click("#cerrar");
  await A.ir(page, "cuentas");
  await page.click("#fab");
  assert.ok(await page.isVisible("#sheetC"));
  assert.equal(await A.texto(page, "#cTitulo"), "Nueva cuenta");
  assert.equal(await page.isVisible("#sheet"), false);
});

// Escenario: ajustes desde el engranaje
t.test("ajustes desde el engranaje", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await page.click('header [data-v="ajustes"]');
  assert.equal(await A.texto(page, "#title"), "Ajustes");
  assert.ok(await page.isVisible("#aporte"));
});

// Escenario: nombres de las pestañas
t.test("nombres de las pestañas", async () => {
  const { page } = await abrir();
  const nombres = await page.locator("nav button[data-v]").allInnerTexts();
  assert.deepEqual(nombres.map((x) => x.trim()), ["Inicio", "Movimientos", "Cuentas", "Cierre"]);
});

// Escenario: títulos con la letra del texto
t.test("títulos con la letra del texto", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  const letra = (sel) => page.$eval(sel, (el) => getComputedStyle(el).fontFamily);
  const cuerpo = await letra("body");
  assert.equal(await letra("#title"), cuerpo);
  await page.click("#fab");
  assert.equal(await letra("#sheet h2"), cuerpo);
});

const fondoDe = (page, sel) => page.$eval(sel, (el) => getComputedStyle(el).backgroundColor);
// El color de la categoría es el de la tarjeta; el ícono va en un círculo translúcido encima
const icoDe = (page, id) => page.$eval(`[data-mov="${id}"]`, (el) => getComputedStyle(el).backgroundColor);

const mono = (page, sel) => page.$eval(sel, (el) => getComputedStyle(el).fontFamily);
const DATOS_COLOR = () => { const d = EJEMPLO(); d.cuentas[0].tope = 300; d.cuentas.push(A.cta(3, "Financiera Z", 600, { tipo: "financiacion", cuota: 50, cuotas: 12, cuotasMes: "2026-10" })); return d; };

// Escenario: los números en monoespaciada
t.test("los números en monoespaciada", async () => {
  const { page } = await abrir({ datos: EJEMPLO() });
  const cuerpo = await mono(page, "body");
  assert.match(await mono(page, "#resultado"), /mono/i);
  assert.doesNotMatch(cuerpo, /mono/i);
  await A.ir(page, "movs");
  assert.match(await mono(page, '[data-mov="2"] .num, [data-mov="2"] .monto'), /mono/i);
});

// Escenario: sin letras de otros sitios
t.test("sin letras de otros sitios", async () => {
  const { page } = await abrir({ datos: A.datosEjemplo() });
  const afuera = [];
  page.on("request", (r) => { const u = new URL(r.url()); if (u.protocol.startsWith("http") && u.origin !== new URL(page.url()).origin) afuera.push(r.url()); });
  await page.reload();
  for (const v of A.VISTAS) await A.ir(page, v);
  assert.deepEqual(afuera, []);
});

// Escenario: logo en Inicio
t.test("logo en Inicio", async () => {
  const { page } = await abrir({ datos: EJEMPLO() });
  assert.equal(await page.isVisible("#logoHdr"), true);
  assert.equal((await page.$eval("#logoHdr", (e) => e.textContent)).trim(), "mf.");
  assert.equal(await page.$eval("#logoHdr i", (e) => getComputedStyle(e).color), "rgb(238, 220, 91)");
  await A.ir(page, "movs");
  assert.equal(await page.isVisible("#logoHdr"), false);
});

// Escenario: el logo sigue a la apariencia
t.test("el logo sigue a la apariencia", async () => {
  const datos = EJEMPLO(); datos.settings.apariencia = "clara";
  const { page } = await abrir({ datos });
  assert.equal(await page.$eval("#logoHdr", (e) => getComputedStyle(e).color), "rgb(69, 14, 21)");
  assert.equal(await page.$eval("#logoHdr i", (e) => getComputedStyle(e).color), "rgb(221, 85, 51)");
});

// Escenario: el disponible lleva el color de su tipo
t.test("el disponible lleva el color de su tipo", async () => {
  for (const ap of ["oscura", "clara"]) {
    const d = DATOS_COLOR(); d.settings.apariencia = ap;
    const { page } = await abrir({ datos: d });
    await page.waitForFunction(() => ["1", "2"].every((i) => getComputedStyle(document.querySelector(`[data-disp="${i}"]`)).backgroundColor));
    const [a, b] = [await fondoDe(page, '[data-disp="1"]'), await fondoDe(page, '[data-disp="2"]')];
    assert.ok(canales(a).length === 3 && !a.endsWith(", 0)"), `${ap}: ${a}`);
    assert.notEqual(a, b, ap);
    assert.notEqual(a, await fondoDe(page, "body"), ap);
  }
});

// Escenario: títulos en píldora
t.test("títulos en píldora", async () => {
  const { page } = await abrir({ datos: DATOS_COLOR() });
  await page.waitForSelector('[data-disp="1"] .lbl', { state: "visible" });
  await page.waitForFunction(() => getComputedStyle(document.querySelector('[data-disp="1"] .lbl')).borderTopStyle === "solid");
  const r = await page.$eval('[data-disp="1"] .lbl', (e) => { const s = getComputedStyle(e); return [s.borderTopWidth, s.borderTopStyle, parseFloat(s.borderTopLeftRadius) >= e.getBoundingClientRect().height / 2 - 1]; });
  assert.deepEqual(r, ["1px", "solid", true]);
});

// Escenario: tarjetas sin degradado
t.test("tarjetas sin degradado", async () => {
  const { page } = await abrir({ datos: DATOS_COLOR() });
  for (const sel of ['[data-disp="2"]', "#cuotasCard"]) assert.doesNotMatch(await page.$eval(sel, (e) => getComputedStyle(e).backgroundImage), /gradient/, sel);
  assert.equal(await page.$eval("#cuotasCard", (e) => e.classList.contains("color")), true);
  const gasto = await fondoDe(page, '[data-ui="gasto-categorias"]');
  const surface = await page.evaluate(() => { const d = document.createElement("i"); d.style.background = "var(--surface)"; document.body.append(d); const c = getComputedStyle(d).backgroundColor; d.remove(); return c; });
  assert.equal(gasto, surface, "«Gasto del mes» es neutra");
  assert.doesNotMatch(await page.$eval('[data-ui="gasto-categorias"]', (e) => getComputedStyle(e).backgroundImage), /gradient/);
});

// Escenario: el texto se lee sobre cada color
t.test("el texto se lee sobre cada color", async () => {
  for (const ap of ["clara", "oscura"]) {
    const d = DATOS_COLOR(); d.settings.apariencia = ap;
    d.cuentas.push(A.cta(4, "Broker", 500, { tipo: "inversion" }), A.cta(5, "Tarjeta W", 200, { tipo: "tarjeta" }), A.cta(6, "Depósito", 100, { tipo: "compartida" }));
    const { page } = await abrir({ datos: d });
    for (const v of ["inicio", "cuentas"]) {
      await A.ir(page, v);
      const r = await page.evaluate((vista) => {
        const num = (c) => (c.match(/[\d.]+/g) || []).map(Number);
        const rgb = (c) => { const m = c.match(/color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)(?: \/ ([\d.]+))?/); return m ? [m.slice(1, 4).map((x) => parseFloat(x) * 255), m[4] == null ? 1 : parseFloat(m[4])] : [num(c).slice(0, 3), num(c).length > 3 ? num(c)[3] : 1]; };
        const L = (c) => { const q = c.map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * q[0] + 0.7152 * q[1] + 0.0722 * q[2]; };
        const out = [];
        for (const card of document.querySelectorAll(`#v-${vista} .card.color`)) {
          if (!card.offsetParent) continue;
          const [b] = rgb(getComputedStyle(card).backgroundColor);
          for (const sel of [".lbl", ".big", ".sub", ".num", ".neg", ".badc", ".warnc"]) for (const el of card.querySelectorAll(sel)) {
            if (!el.offsetParent) continue;
            const [t, a] = rgb(getComputedStyle(el).color), m = t.map((x, i) => x * a + b[i] * (1 - a));
            const [x, y] = [L(m), L(b)].sort((p, q) => q - p);
            out.push([card.querySelector(".lbl")?.textContent.trim() + " " + sel, (x + 0.05) / (y + 0.05)]);
          }
        }
        return out;
      }, v);
      assert.ok(r.length >= 6 && (v !== "cuentas" || r.some(([q]) => q.endsWith(".neg"))), `${ap} ${v}: ${r.length} textos`);
      for (const [que, c] of r) assert.ok(c >= 4.5, `${ap} ${v} ${que}: ${c.toFixed(2)}`);
    }
  }
});

// Escenario: mismo color por categoría
t.test("mismo color por categoría", async () => {
  const { page } = await abrir({ datos: EJEMPLO() });
  await page.waitForFunction(() => { const c = document.querySelector('#torta circle[data-cat="Supermercado"]'); return c && getComputedStyle(c).stroke.startsWith("rgb"); });
  const porcion = await page.$eval('#torta circle[data-cat="Supermercado"]', (c) => getComputedStyle(c).stroke);
  await A.ir(page, "movs");
  assert.equal(porcion, await icoDe(page, 2));
});

// Escenario: texto legible en las tarjetas
t.test("texto legible en las tarjetas", async () => {
  const datos = EJEMPLO();
  datos.movs.push(A.gasto(9, "2026-10-06", 48, 1, "Compras", "zapatillas"));
  for (const ap of ["oscura", "clara"]) {
    const { page } = await abrir({ datos: { ...datos, settings: { ...datos.settings, apariencia: ap } } });
    await A.ir(page, "movs");
    const [texto, detras] = await colores(page, '[data-mov="9"] .linea');
    assert.ok(contraste(texto, detras) >= 4.5, `${ap}: contraste ${contraste(texto, detras).toFixed(2)}`);
    const [fecha, tarjeta] = await colores(page, '[data-mov="9"] .fecha');
    assert.ok(contraste(fecha, tarjeta) >= 4.5, `${ap}: fecha ${contraste(fecha, tarjeta).toFixed(2)}`);
  }
});

// Escenario: teléfono en modo oscuro
t.test("teléfono en modo oscuro", async () => {
  const datos = EJEMPLO(); datos.settings.apariencia = "auto";
  const { page } = await abrir({ datos, esquema: "dark" });
  const fondo = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  assert.ok(luminancia(fondo) < 0.1, `fondo ${fondo}`);
  for (const sel of ["#resultado", '[data-disp="2"] .big', "#netoIni", "#torta .centro b"]) {
    const [texto, detras] = await colores(page, sel);
    assert.ok(contraste(texto, detras) >= 4.5, `${sel}: ${texto} sobre ${detras} = ${contraste(texto, detras).toFixed(2)}`);
  }
  await A.ir(page, "movs");
  const [texto, detras] = await colores(page, '[data-mov="2"] .linea');
  assert.ok(contraste(texto, detras) >= 4.5, `tarjeta de movimiento: ${contraste(texto, detras).toFixed(2)}`);
});

// Escenario: abrir sin conexión
t.test("abrir sin conexión", async () => {
  const { page, ctx } = await abrir({ datos: EJEMPLO(), sw: true });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await ctx.setOffline(true);
  await page.reload();
  assert.equal(await A.texto(page, "#title"), "Este mes");
  assert.equal(await A.texto(page, "#resultado"), "1617,7 €");
});

// Escenario: reembolsos distinguibles
t.test("reembolsos distinguibles", async () => {
  const datos = EJEMPLO();
  datos.movs.push(A.gasto(9, "2026-10-06", 12, 1, "Trabajo (reembolsable)", "parking"), A.gasto(8, "2026-10-06", 48, 1, "Compras", "zapatillas"));
  const { page } = await abrir({ datos });
  await A.ir(page, "movs");
  assert.notEqual(await icoDe(page, 9), await icoDe(page, 8));
});

// Escenario: contraste en las dos apariencias
t.test("contraste en las dos apariencias", async () => {
  const datos = EJEMPLO();
  datos.cuentas.push(A.cta(3, "Broker", 2000, { tipo: "inversion" }), A.cta(4, "Préstamo", 800, { tipo: "financiacion" }));
  datos.movs.push(A.gasto(9, "2026-10-06", 48, 1, "Compras"), A.gasto(10, "2026-10-07", 12, 1, "Trabajo (reembolsable)"),
    { ...A.gasto(12, "2026-10-01", 600, 1, "Casa/Splitwise", "alquiler"), fijo: true },
    A.transf(11, "2026-10-08", 100, 1, 3));
  for (const ap of ["clara", "oscura"]) {
    const { page } = await abrir({ datos: { ...datos, settings: { ...datos.settings, apariencia: ap } } });
    for (const sel of ["#resultado", '[data-disp="2"] .big', "#netoIni"]) {
      const [texto, detras] = await colores(page, sel);
      assert.ok(contraste(texto, detras) >= 4.5, `${ap} ${sel}: ${texto} sobre ${detras} = ${contraste(texto, detras).toFixed(2)}`);
    }
    for (const k of ["fij", "var"]) {
      const [parte, tarjeta] = await page.$eval(`#fv .partida .${k}`, (el) => [getComputedStyle(el).backgroundColor, getComputedStyle(el.closest(".card")).backgroundColor]);
      assert.ok(contraste(parte, tarjeta) >= 1.5, `${ap} barra ${k}: ${parte} sobre ${tarjeta} = ${contraste(parte, tarjeta).toFixed(2)}`);
    }
    await A.ir(page, "movs");
    for (const id of [2, 3, 9, 10, 11]) {
      const [texto, detras] = await colores(page, `[data-mov="${id}"] .linea`);
      assert.ok(contraste(texto, detras) >= 4.5, `${ap} movimiento ${id}: ${texto} sobre ${detras} = ${contraste(texto, detras).toFixed(2)}`);
    }
  }
});

// Escenario: aviso con la hoja abierta
t.test("aviso con la hoja abierta", async () => {
  const X = require("./extractos.cjs");
  const { page } = await abrir({ datos: A.v2({ cuentas: [{ ...BANCO, ref: "4321" }] }) });
  await A.ir(page, "movs");
  const buf = await X.santanderCuenta(page, { ref: "4321", inicial: 1000, movs: [{ fecha: "2026-10-05", desc: "Comercio Uno", importe: -30 }, { fecha: "2026-10-09", desc: "Comercio Dos", importe: -20 }] });
  await page.setInputFiles("#pdfIn", { name: "extracto.pdf", mimeType: "application/pdf", buffer: buf });
  await page.waitForFunction(() => !document.getElementById("sheetI").hidden, null, { timeout: 20000 });
  await page.click("#iGuardar");
  await page.waitForFunction(() => !document.getElementById("sheetIC").hidden && [...document.querySelectorAll(".toast")].some((t) => t.textContent === "2 movimientos importados"));
  const choques = await page.evaluate(() => {
    const t = [...document.querySelectorAll(".toast")].find((x) => x.textContent === "2 movimientos importados").getBoundingClientRect();
    return [...document.querySelectorAll("#sheetIC button")].filter((b) => b.offsetParent).map((b) => [b.textContent, b.getBoundingClientRect()])
      .filter(([, r]) => r.left < t.right && t.left < r.right && r.top < t.bottom && t.top < r.bottom).map(([n]) => n);
  });
  assert.deepEqual(choques, []);
});

// Escenario: gasto con coma
t.test("gasto con coma", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  assert.equal(await page.getAttribute("#mImporte", "inputmode"), "decimal");
  await A.nuevoGasto(page, { importe: "12,50", cuenta: "Banco A" });
  await A.aviso(page, "Gasto guardado");
  assert.equal((await A.guardados(page)).movs[0].importe, 12.5);
});

// Escenario: saldo de una cuenta con coma
t.test("saldo de una cuenta con coma", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }) });
  await A.ir(page, "cuentas");
  await A.nuevaCuenta(page, { nombre: "Banco B", saldo: "1.234,56" });
  await A.aviso(page, "Cuenta guardada");
  const b = (await A.guardados(page)).cuentas.find((c) => c.nombre === "Banco B");
  assert.equal(b.saldoInicial, 1234.56);
  assert.equal(await A.texto(page, `[data-cta="${b.id}"] .v .num`), "1234,56 €");
});

// Escenario: importe guardado al editar
t.test("importe guardado al editar", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO], movs: [A.gasto(7, "2026-10-03", 12.5, 1)] }) });
  await A.ir(page, "movs");
  await page.click('[data-mov="7"] .linea');
  assert.equal(await page.inputValue("#mImporte"), "12,5");
});

// Píxeles de un ícono en puntos relativos (0 a 1), leídos en el navegador
async function pixeles(page, archivo, puntos) {
  return page.evaluate(async ([f, ps]) => {
    const img = await createImageBitmap(await (await fetch(f)).blob());
    const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
    const g = c.getContext("2d"); g.drawImage(img, 0, 0);
    return ps.map(([x, y]) => [...g.getImageData(Math.floor(x * img.width), Math.floor(y * img.height), 1, 1).data.slice(0, 3)]);
  }, [archivo, puntos]);
}
const PUNTOS = { fondo: [0.05, 0.05], abajo: [0.5, 0.9], punto: [0.816, 0.637] };
const COLORES = { fondo: [243, 166, 218], abajo: [243, 166, 218], punto: [240, 90, 44] };
const cerca = (a, b) => a.every((v, i) => Math.abs(v - b[i]) <= 10);

// Escenario: ícono en la pantalla de inicio
t.test("ícono en la pantalla de inicio", async () => {
  const { page } = await abrir();
  assert.equal(await page.getAttribute('link[rel="apple-touch-icon"]', "href"), "icon-180.png");
  const m = await page.evaluate(async () => (await fetch("manifest.webmanifest")).json());
  assert.deepEqual(m.icons.map((i) => i.src), ["icon-192.png", "icon-512.png"]);
  const ks = Object.keys(PUNTOS), vs = await pixeles(page, "icon-180.png", ks.map((k) => PUNTOS[k]));
  ks.forEach((k, i) => assert.ok(cerca(vs[i], COLORES[k]), `${k}: ${vs[i]}`));
  // Las letras «mf» en tinta: buena parte de la franja de las letras es negra
  const zona = [];
  for (let x = 0.12; x <= 0.72; x += 0.03) for (let y = 0.45; y <= 0.66; y += 0.03) zona.push([x, y]);
  const negros = (await pixeles(page, "icon-180.png", zona)).filter((p) => p.every((v) => v < 60)).length;
  assert.ok(negros / zona.length > 0.25, `letras: ${negros} de ${zona.length} puntos negros`);
});

// Escenario: mismo ícono en todos los tamaños
t.test("mismo ícono en todos los tamaños", async () => {
  const { page } = await abrir();
  const ps = Object.values(PUNTOS);
  const [a, b, c] = await Promise.all(["icon-180.png", "icon-192.png", "icon-512.png"].map((f) => pixeles(page, f, ps)));
  a.forEach((p, i) => { assert.ok(cerca(p, b[i]) && cerca(p, c[i]), `punto ${i}: ${p} / ${b[i]} / ${c[i]}`); });
});

// Escenario: color en la torta y en la tarjeta
t.test("color en la torta y en la tarjeta", async () => {
  const { page } = await abrir({ datos: A.v2({ cuentas: [A.cta(1, "Banco A", 1000)], movs: [A.gasto(1, "2026-10-03", 30, 1, "Alquiler"), A.gasto(2, "2026-10-04", 20, 1, "Supermercado")] }) });
  const torta = await page.$eval('#torta circle[data-cat="Alquiler"]', (c) => c.style.stroke);
  assert.ok(torta.includes("--cat18"));
  await A.ir(page, "movs");
  const fondo = await page.evaluate(() => { const m = [...document.querySelectorAll("#movs .mov")].find((x) => x.textContent.includes("Alquiler")); return getComputedStyle(m).backgroundColor; });
  const esperado = await page.evaluate(() => { const e = document.createElement("i"); e.style.background = "var(--cat18)"; document.body.append(e); const c = getComputedStyle(e).backgroundColor; e.remove(); return c; });
  assert.equal(fondo, esperado);
  const otras = await page.evaluate(() => Array.from({ length: 19 }, (_, i) => getComputedStyle(document.documentElement).getPropertyValue("--cat" + (i + 1)).trim().toUpperCase()));
  assert.equal(new Set(otras).size, 19, "las 19 categorías tienen colores distintos");
});

// Escenario: contraste con cada categoría nueva
t.test("contraste con cada categoría nueva", async () => {
  const NUEVAS = ["Salidas bar/disco", "Plan Iberia", "Servicios mensuales", "Alquiler", "Carga móvil"];
  const movs = NUEVAS.map((c, i) => A.gasto(i + 1, "2026-10-03", 10 + i, 1, c));
  for (const apariencia of ["clara", "oscura"]) {
    const datos = A.v2({ settings: { apariencia }, cuentas: [A.cta(1, "Banco A", 1000)], movs });
    const { page } = await abrir({ datos });
    await A.ir(page, "movs");
    const ratios = await page.evaluate(() => {
      const lum = (rgb) => { const [r, g, b] = rgb.match(/[\d.]+/g).slice(0, 3).map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
      const par = (a, b) => { const [hi, lo] = a > b ? [a, b] : [b, a]; return (hi + 0.05) / (lo + 0.05); };
      return [...document.querySelectorAll("#movs .mov")].map((m) => {
        const ico = m.querySelector(".fecha");
        return [m.textContent.slice(0, 20), par(lum(getComputedStyle(m).backgroundColor), lum(getComputedStyle(m.querySelector(".desc")).color)), par(lum(getComputedStyle(m).backgroundColor), lum(getComputedStyle(ico).color))];
      });
    });
    assert.equal(ratios.length, 5);
    for (const [n, r, ri] of ratios) { assert.ok(r >= 4.5, `${apariencia} ${n}: ${r.toFixed(2)}`); assert.ok(ri >= 4.5, `${apariencia} fecha ${n}: ${ri.toFixed(2)}`); }
  }
});

// --- los campos de fecha caben en el ancho
const holgura = (page, sel) => page.evaluate((s) => {
  const c = document.querySelector(s).getBoundingClientRect();
  const hoja = document.querySelector(s).closest(".sheet, .card, main").getBoundingClientRect();
  return { derecha: Math.round(c.right), hojaDerecha: Math.round(hoja.right), ancho: document.documentElement.scrollWidth, vista: document.documentElement.clientWidth };
}, sel);

for (const esquema of ["light", "dark"]) {
  // Escenario: fecha de un movimiento
  t.test(`fecha de un movimiento (${esquema})`, async () => {
    const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }), esquema });
    await page.click("#fab");
    await A.hojaLista(page);
    const h = await holgura(page, "#mFecha");
    assert.ok(h.derecha <= h.hojaDerecha, `fecha ${h.derecha} > hoja ${h.hojaDerecha}`);
    assert.ok(h.ancho <= h.vista, `desplazamiento horizontal ${h.ancho} > ${h.vista}`);
    assert.equal(await page.$eval("#mFecha", (e) => getComputedStyle(e).textAlign), "left");
  });

  // Escenario: fecha de una operación de inversión
  t.test(`fecha de una operación de inversión (${esquema})`, async () => {
    const datos = A.v2({ cuentas: [A.cta(3, "Broker X", 1000, { tipo: "inversion" })], activos: [{ id: 10, cuenta: 3, nombre: "Fondo A" }] });
    const { page } = await abrir({ datos, esquema });
    await A.ir(page, "cuentas");
    await page.click("[data-ver-rend]");
    await page.click("[data-nueva-op]");
    await A.enfocado(page, "oCant");
    const h = await holgura(page, "#oFecha");
    assert.ok(h.derecha <= h.hojaDerecha, `fecha ${h.derecha} > hoja ${h.hojaDerecha}`);
  });

  // Escenario: mes en Ajustes
  t.test(`mes en Ajustes (${esquema})`, async () => {
    const { page } = await abrir({ datos: A.v2({ cuentas: [BANCO] }), esquema });
    await A.ir(page, "ajustes");
    const h = await holgura(page, "#inicio");
    assert.ok(h.derecha <= h.hojaDerecha, `mes ${h.derecha} > tarjeta ${h.hojaDerecha}`);
    assert.ok(h.ancho <= h.vista);
  });
}
