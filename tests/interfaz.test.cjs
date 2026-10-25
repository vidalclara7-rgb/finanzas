// Capacidad: interfaz
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 1000);
const luminancia = (rgb) => { const [r, g, b] = rgb.match(/\d+/g).map(Number); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };
// Relación de contraste WCAG entre dos colores rgb()
const contraste = (a, b) => {
  const lum = (rgb) => { const v = rgb.match(/\d+/g).slice(0, 3).map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
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

// Escenario: fondo gris claro con tarjetas de color
t.test("fondo gris claro con tarjetas de color", async () => {
  const { page } = await abrir({ datos: EJEMPLO() });
  const fondo = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  assert.notEqual(fondo, "rgb(255, 255, 255)");
  assert.ok(luminancia(fondo) > 0.85, `fondo ${fondo}`);
  const tarjeta = await page.$eval('[data-ui="gasto-categorias"]', (el) => getComputedStyle(el).backgroundColor);
  assert.equal(tarjeta, "rgb(255, 255, 255)");
  const disponible = await page.$eval('[data-disp="2"]', (el) => getComputedStyle(el).backgroundColor);
  const cherry = await page.evaluate(() => { const d = document.createElement("div"); d.style.background = "var(--cherry)"; document.body.append(d); const c = getComputedStyle(d).backgroundColor; d.remove(); return c; });
  assert.equal(disponible, cherry);
  assert.equal(await A.texto(page, "#resultado .dec"), ",7 €");
  const [entero] = await colores(page, "#resultado");
  const [dec] = await colores(page, "#resultado .dec");
  assert.ok(luminancia(dec) > luminancia(entero) + 0.2, `decimales ${dec} contra ${entero}`);
});

// Escenario: texto legible sobre colores oscuros
t.test("texto legible sobre colores oscuros", async () => {
  const datos = EJEMPLO();
  datos.movs.push(A.gasto(9, "2026-10-06", 48, 1, "Compras", "zapatillas"));
  const { page } = await abrir({ datos });
  await A.ir(page, "movs");
  const [texto, detras] = await colores(page, '[data-mov="9"] .linea');
  assert.equal(texto, "rgb(255, 255, 255)");
  assert.ok(contraste(texto, detras) >= 4.5, `contraste ${contraste(texto, detras).toFixed(2)}`);
});

// Escenario: mismo color por categoría
t.test("mismo color por categoría", async () => {
  const { page } = await abrir({ datos: EJEMPLO() });
  const porcion = await page.$eval('#torta circle[data-cat="Supermercado"]', (c) => getComputedStyle(c).stroke);
  await A.ir(page, "movs");
  const tarjeta = await page.$eval('[data-mov="2"]', (el) => getComputedStyle(el).backgroundColor);
  assert.equal(porcion, tarjeta);
});

// Escenario: teléfono en modo oscuro
t.test("teléfono en modo oscuro", async () => {
  const { page } = await abrir({ datos: EJEMPLO(), esquema: "dark" });
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

// Escenario: reembolsos en frambuesa
t.test("reembolsos en frambuesa", async () => {
  const datos = EJEMPLO();
  datos.movs.push(A.gasto(9, "2026-10-06", 12, 1, "Trabajo (reembolsable)", "parking"));
  const { page } = await abrir({ datos });
  await A.ir(page, "movs");
  const fondo = await page.$eval('[data-mov="9"]', (el) => getComputedStyle(el).backgroundColor);
  assert.equal(fondo, "rgb(208, 56, 118)");
  const [texto] = await colores(page, '[data-mov="9"] .linea');
  assert.equal(texto, "rgb(255, 255, 255)");
});

const PALETAS = ["viva", "editorial", "lima", "pastel"];
const fondoBody = (page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
const marcada = (page) => page.$eval('[data-paleta-op][aria-pressed="true"]', (b) => b.dataset.paletaOp);
async function elegirPaleta(page, p) {
  await A.ir(page, "ajustes");
  await page.click(`[data-paleta-op="${p}"]`);
}

// Escenario: cambiar a pastel crema
t.test("cambiar a pastel crema", async () => {
  const { page } = await abrir({ datos: EJEMPLO() });
  assert.equal(await fondoBody(page), "rgb(236, 236, 234)");
  await elegirPaleta(page, "pastel");
  assert.equal(await fondoBody(page), "rgb(246, 240, 228)");
  assert.equal(await marcada(page), "pastel");
  assert.equal((await A.guardados(page)).settings.paleta, "pastel");
});

// Escenario: la paleta se recuerda
t.test("la paleta se recuerda", async () => {
  const datos = EJEMPLO();
  datos.settings.paleta = "editorial";
  const { page } = await abrir({ datos });
  await page.reload();
  assert.equal(await page.evaluate(() => document.documentElement.dataset.paleta), "editorial");
  assert.equal(await fondoBody(page), "rgb(255, 255, 255)");
  await A.ir(page, "ajustes");
  assert.equal(await marcada(page), "editorial");
});

// Escenario: paleta por defecto
t.test("paleta por defecto", async () => {
  const { page } = await abrir();
  await A.ir(page, "ajustes");
  assert.equal(await marcada(page), "viva");
  assert.equal(await page.locator("[data-paleta-op]").count(), 4);
  assert.deepEqual((await page.locator("[data-paleta-op] span:first-child").allInnerTexts()).map((x) => x.trim()),
    ["Viva", "Editorial", "Lima y lavanda", "Pastel crema"]);
});

// Escenario: contraste en las cuatro paletas
t.test("contraste en las cuatro paletas", async () => {
  const datos = EJEMPLO();
  datos.cuentas.push(A.cta(3, "Broker", 2000, { tipo: "inversion" }), A.cta(4, "Préstamo", 800, { tipo: "financiacion" }));
  datos.movs.push(A.gasto(9, "2026-10-06", 48, 1, "Compras"), A.gasto(10, "2026-10-07", 12, 1, "Trabajo (reembolsable)"),
    { ...A.gasto(12, "2026-10-01", 600, 1, "Casa/Splitwise", "alquiler"), fijo: true },
    A.transf(11, "2026-10-08", 100, 1, 3));
  for (const esquema of ["light", "dark"]) {
    const { page } = await abrir({ datos, esquema });
    for (const p of PALETAS) {
      await elegirPaleta(page, p);
      await A.ir(page, "inicio");
      for (const sel of ["#resultado", '[data-disp="2"] .big', "#netoIni"]) {
        const [texto, detras] = await colores(page, sel);
        assert.ok(contraste(texto, detras) >= 4.5, `${p}/${esquema} ${sel}: ${texto} sobre ${detras} = ${contraste(texto, detras).toFixed(2)}`);
      }
      for (const k of ["fij", "var"]) {
        const [parte, tarjeta] = await page.$eval(`#fv .partida .${k}`, (el) => [getComputedStyle(el).backgroundColor, getComputedStyle(el.closest(".card")).backgroundColor]);
        assert.ok(contraste(parte, tarjeta) >= 1.5, `${p}/${esquema} barra ${k}: ${parte} sobre ${tarjeta} = ${contraste(parte, tarjeta).toFixed(2)}`);
      }
      await A.ir(page, "movs");
      for (const id of [2, 3, 9, 10, 11]) {
        const [texto, detras] = await colores(page, `[data-mov="${id}"] .linea`);
        assert.ok(contraste(texto, detras) >= 4.5, `${p}/${esquema} movimiento ${id}: ${texto} sobre ${detras} = ${contraste(texto, detras).toFixed(2)}`);
      }
    }
  }
});

// Escenario: mismo color por categoría en otra paleta
t.test("mismo color por categoría en otra paleta", async () => {
  const { page } = await abrir({ datos: EJEMPLO() });
  const vivaPorcion = await page.$eval('#torta circle[data-cat="Supermercado"]', (c) => getComputedStyle(c).stroke);
  await elegirPaleta(page, "lima");
  await A.ir(page, "inicio");
  const porcion = await page.$eval('#torta circle[data-cat="Supermercado"]', (c) => getComputedStyle(c).stroke);
  assert.notEqual(porcion, vivaPorcion);
  await A.ir(page, "movs");
  const tarjeta = await page.$eval('[data-mov="2"]', (el) => getComputedStyle(el).backgroundColor);
  assert.equal(porcion, tarjeta);
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
const PUNTOS = { fondo: [0.05, 0.05], salvia: [0.5, 0.27], rosa: [0.5, 0.42], frente: [0.65, 0.68] };
const COLORES = { fondo: [95, 107, 78], salvia: [185, 189, 166], rosa: [243, 166, 218], frente: [240, 90, 44] };
const cerca = (a, b) => a.every((v, i) => Math.abs(v - b[i]) <= 10);

// Escenario: ícono en la pantalla de inicio
t.test("ícono en la pantalla de inicio", async () => {
  const { page } = await abrir();
  assert.equal(await page.getAttribute('link[rel="apple-touch-icon"]', "href"), "icon-180.png");
  const m = await page.evaluate(async () => (await fetch("manifest.webmanifest")).json());
  assert.deepEqual(m.icons.map((i) => i.src), ["icon-192.png", "icon-512.png"]);
  const ks = Object.keys(PUNTOS), vs = await pixeles(page, "icon-180.png", ks.map((k) => PUNTOS[k]));
  ks.forEach((k, i) => assert.ok(cerca(vs[i], COLORES[k]), `${k}: ${vs[i]}`));
  // El «€» en tinta oscura sobre la tarjeta de adelante
  const zona = [];
  for (let x = 0.28; x <= 0.42; x += 0.02) for (let y = 0.6; y <= 0.78; y += 0.02) zona.push([x, y]);
  assert.ok((await pixeles(page, "icon-180.png", zona)).some((p) => p.every((v) => v < 60)), "no se ve el €");
});

// Escenario: mismo ícono en todos los tamaños
t.test("mismo ícono en todos los tamaños", async () => {
  const { page } = await abrir();
  const ps = Object.values(PUNTOS);
  const [a, b, c] = await Promise.all(["icon-180.png", "icon-192.png", "icon-512.png"].map((f) => pixeles(page, f, ps)));
  a.forEach((p, i) => { assert.ok(cerca(p, b[i]) && cerca(p, c[i]), `punto ${i}: ${p} / ${b[i]} / ${c[i]}`); });
});
