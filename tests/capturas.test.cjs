// Capacidad: importacion — capturas del historial de un banco
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");
const F = require("./archivos.cjs");

const abrir = A.preparar(t);
const BANCO = A.cta(1, "Banco A", 1000, { desde: "2026-10-01" });
const cuentas = (extra = {}) => A.v2({ cuentas: [BANCO], ...extra });

const DOS_DIAS = [
  { fecha: "21 NOV 2026", movs: [["TIENDA A", "−5,80€"], ["TIENDA B", "−6,50€"]] },
  { fecha: "19 NOV 2026", movs: [["PREMIO BANCO A", "0,28€"]] },
];
const png = (buf, n = 1) => F.PNG(buf, `captura-${n}.png`);

// Elige uno o varios archivos desde Movimientos y espera la hoja de importación, la pregunta de signo o un aviso de lectura
async function importa(page, archivos) {
  await A.ir(page, "movs");
  await page.setInputFiles("#pdfIn", archivos);
  await page.waitForFunction(() => !document.getElementById("sheetI").hidden || !document.getElementById("sheetSigno").hidden || window.__avisos.some((a) => !/^Leyendo/.test(a)), null, { timeout: 90000 });
}
const eligeBanco = async (page) => { await page.click('#segIElegir button:has-text("Banco A")'); await page.click("#iSeguir"); };
const movs = (page) => page.evaluate(() => imp.r.movs.map((m) => [m.fecha, m.importe]));
const revisa = (page) => A.texto(page, "#iRevisa");

// Escenario: captura con dos días
t.test("captura con dos días", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await importa(page, png(await F.imagenLista(page, DOS_DIAS)));
  await eligeBanco(page);
  assert.equal(await revisa(page), "Revisá 3 movimientos");
  assert.deepEqual(await movs(page), [["2026-11-21", -5.8], ["2026-11-21", -6.5], ["2026-11-19", 0.28]]);
  assert.deepEqual(await page.evaluate(() => imp.d.map((x) => [x.fecha, x.s < 0 ? "g" : "i"]).sort().map((x) => x.join(" "))), ["2026-11-19 i", "2026-11-21 g", "2026-11-21 g"]);
});

// Escenario: mes en letras en castellano
t.test("mes en letras en castellano", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await importa(page, png(await F.imagenLista(page, [{ fecha: "3 ENE 2027", movs: [["TIENDA A", "−10,00€"]] }])));
  await eligeBanco(page);
  assert.deepEqual(await movs(page), [["2027-01-03", -10]]);
});

// Escenario: textos que no son movimientos
t.test("textos que no son movimientos", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await importa(page, png(await F.imagenLista(page, [{ fecha: "21 NOV 2026", movs: [["TIENDA A", "−12,50€"]] }])));
  await eligeBanco(page);
  assert.equal(await revisa(page), "Revisá 1 movimiento");
});

// Escenario: fecha sin año
t.test("fecha sin año", async () => {
  const { page } = await abrir({ datos: cuentas() });
  const antes = await A.guardados(page);
  await importa(page, png(await F.imagenLista(page, [{ fecha: "21 NOV", movs: [["TIENDA A", "−12,50€"]] }])));
  await A.aviso(page, "No encontré movimientos en este archivo.");
  assert.equal(await page.isVisible("#sheetI"), false);
  assert.deepEqual(await A.guardados(page), antes);
});

// Escenario: una tabla con fecha en cada fila sigue igual
t.test("una tabla con fecha en cada fila sigue igual", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await importa(page, F.CSV("Fecha;Concepto;Importe\n05/10/2026;Tienda A;-12,50\n06/10/2026;Tienda B;1.200,00\n"));
  await eligeBanco(page);
  assert.deepEqual(await movs(page), [["2026-10-05", -12.5], ["2026-10-06", 1200]]);
});

const A_ = { fecha: "20 NOV 2026", movs: [["TIENDA A", "−11,00€"]] };
const B_ = { fecha: "18 NOV 2026", movs: [["TIENDA B", "−22,00€"]] };
const C_ = { fecha: "16 NOV 2026", movs: [["TIENDA C", "−33,00€"]] };
const D_ = { fecha: "14 NOV 2026", movs: [["TIENDA D", "−44,00€"]] };

// Escenario: dos capturas solapadas
t.test("dos capturas solapadas", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await importa(page, [png(await F.imagenLista(page, [A_, B_, C_]), 1), png(await F.imagenLista(page, [B_, C_, D_]), 2)]);
  await eligeBanco(page);
  assert.equal(await revisa(page), "Revisá 4 movimientos");
  assert.deepEqual((await movs(page)).map((m) => m[1]), [-11, -22, -33, -44]);
});

// Escenario: orden inverso
t.test("orden inverso", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await importa(page, [png(await F.imagenLista(page, [B_, C_, D_]), 2), png(await F.imagenLista(page, [A_, B_, C_]), 1)]);
  await eligeBanco(page);
  assert.equal(await revisa(page), "Revisá 4 movimientos");
});

// Escenario: capturas sin solapamiento
t.test("capturas sin solapamiento", async () => {
  const { page } = await abrir({ datos: cuentas() });
  const otro = { fecha: "10 NOV 2026", movs: [["TIENDA E", "−1,10€"], ["TIENDA F", "−2,20€"], ["TIENDA G", "−3,30€"]] };
  await importa(page, [png(await F.imagenLista(page, [A_, B_]), 1), png(await F.imagenLista(page, [otro]), 2)]);
  await eligeBanco(page);
  assert.equal(await revisa(page), "Revisá 5 movimientos");
});

// Escenario: dos compras iguales el mismo día
t.test("dos compras iguales el mismo día", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await importa(page, png(await F.imagenLista(page, [{ fecha: "21 NOV 2026", movs: [["TIENDA A", "−2,00€"], ["TIENDA A", "−2,00€"]] }])));
  await eligeBanco(page);
  assert.equal(await revisa(page), "Revisá 2 movimientos");
});

// Escenario: aviso mientras lee
t.test("aviso mientras lee", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await page.evaluate(() => { window.__leyendo = false; const e = document.getElementById("leyendoFoto"); new MutationObserver(() => { if (!e.hidden && e.textContent === "Leyendo 2 fotos…") window.__leyendo = true; }).observe(e, { attributes: true }); });
  await importa(page, [png(await F.imagenLista(page, [A_, B_]), 1), png(await F.imagenLista(page, [C_, D_]), 2)]);
  assert.equal(await page.evaluate(() => window.__leyendo), true, "mostró «Leyendo 2 fotos…»");
  assert.equal(await page.isVisible("#leyendoFoto"), false);
});

// Escenario: una foto y un PDF a la vez
t.test("una foto y un PDF a la vez", async () => {
  const { page } = await abrir({ datos: cuentas() });
  const antes = await A.guardados(page);
  await importa(page, [png(await F.imagenLista(page, [A_]), 1), { name: "extracto.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4") }]);
  await A.aviso(page, "Elegí varias fotos o un solo archivo.");
  assert.equal(await page.isVisible("#sheetI"), false);
  assert.deepEqual(await A.guardados(page), antes);
});

// Escenario: las capturas quedan adjuntas
t.test("las capturas quedan adjuntas", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await importa(page, [png(await F.imagenLista(page, [A_, B_]), 1), png(await F.imagenLista(page, [C_, D_]), 2)]);
  await eligeBanco(page);
  await page.click("#iGuardar");
  await A.aviso(page, "4 movimientos importados");
  const adj = await page.evaluate(async () => (await adjTodos()).map((a) => [a.nombre, a.mes, a.cuenta]).sort());
  assert.deepEqual(adj, [["captura-1.png", "2026-11", 1], ["captura-2.png", "2026-11", 1]]);
});

// Escenario: el extracto del cierre después de las capturas
t.test("el extracto del cierre después de las capturas", async () => {
  const { page } = await abrir({ datos: cuentas({ movs: [A.gasto(1, "2026-11-14", 12, 1, "Supermercado", "Tienda A")] }) });
  await importa(page, png(await F.imagenLista(page, [{ fecha: "16 NOV 2026", movs: [["TIENDA A", "−12,00€"]] }])));
  await eligeBanco(page);
  assert.equal(await page.evaluate(() => imp.d[0].marca), "ya");
});

// Escenario: más de tres días de diferencia
t.test("más de tres días de diferencia", async () => {
  const { page } = await abrir({ datos: cuentas({ movs: [A.gasto(1, "2026-11-02", 12, 1, "Supermercado", "Tienda A")] }) });
  await importa(page, png(await F.imagenLista(page, [{ fecha: "14 NOV 2026", movs: [["TIENDA A", "−12,00€"]] }])));
  await eligeBanco(page);
  assert.equal(await page.evaluate(() => imp.d[0].marca), null);
});

// Escenario: la captura no trae movimientos
t.test("la captura no trae movimientos", async () => {
  const { page } = await abrir({ datos: cuentas() });
  const antes = await A.guardados(page);
  await importa(page, png(await F.imagenLista(page, [])));
  await A.aviso(page, "No encontré movimientos en este archivo.");
  assert.equal(await page.isVisible("#sheetI"), false);
  assert.deepEqual(await A.guardados(page), antes);
});

// Escenario: el aviso dura seis segundos
t.test("el aviso dura seis segundos", async () => {
  const { page } = await abrir({ datos: cuentas() });
  await importa(page, png(await F.imagenLista(page, [{ fecha: "21 NOV", movs: [["TIENDA A", "−12,50€"]] }])));
  await page.waitForSelector('[data-ui="aviso-lectura"]');
  await page.waitForTimeout(5000);
  assert.equal(await page.locator('[data-ui="aviso-lectura"]').count(), 1);
});

// Escenario: algo falla al leer
t.test("algo falla al leer", async () => {
  const { page } = await abrir({ datos: cuentas() });
  const antes = await A.guardados(page);
  await page.evaluate(() => { window.aplicarSigno = async () => { throw new Error("fallo inesperado"); }; });
  await importa(page, png(await F.imagenLista(page, DOS_DIAS)));
  await A.aviso(page, "No pude leer este archivo.");
  assert.equal(await page.isVisible("#sheetI"), false);
  assert.deepEqual(await A.guardados(page), antes);
});
