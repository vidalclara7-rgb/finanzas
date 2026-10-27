// Utilidades para probar la app en un navegador real, en ancho de iPhone.
// Los datos de ejemplo son inventados: el repo es público.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const RAIZ = path.resolve(__dirname, "..");
const TIPOS = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".webmanifest": "application/manifest+json", ".png": "image/png", ".json": "application/json" };
const CLAVE = "finanzas-v1";
const HOY = "2026-10-15T12:00:00";
const VISTAS = ["inicio", "movs", "cuentas", "mes", "ajustes"];

function servidor() {
  return new Promise((ok) => {
    const s = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split("?")[0]);
      if (p.endsWith("/")) p += "index.html";
      const f = path.join(RAIZ, p);
      if (!f.startsWith(RAIZ) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { "Content-Type": TIPOS[path.extname(f)] || "application/octet-stream" });
      fs.createReadStream(f).pipe(res);
    });
    s.listen(0, "127.0.0.1", () => ok(s));
  });
}

// Un servidor y un navegador por archivo de test
async function iniciar() {
  const srv = await servidor();
  const browser = await chromium.launch();
  return { url: `http://127.0.0.1:${srv.address().port}/`, browser, async cerrar() { await browser.close(); srv.close(); } };
}

// Abre la app con `datos` ya guardados (sólo en la primera carga del contexto).
// `hoy` fija la fecha para que los meses sean previsibles. `sw: true` deja registrar el service worker.
async function pagina(ent, { datos, esquema: esquemaPedido, hoy = HOY, sw = false, sinApariencia = false } = {}) {
  const esquema = esquemaPedido || "light";
  // Si el test pide un esquema (claro u oscuro) y los datos no traen apariencia, la app se ve en esa apariencia
  if (!sinApariencia && datos && esquemaPedido && datos.settings && datos.settings.apariencia === undefined) datos = { ...datos, settings: { ...datos.settings, apariencia: esquemaPedido === "dark" ? "oscura" : "clara" } };
  const ctx = await ent.browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: esquema, serviceWorkers: sw ? "allow" : "block" });
  await ctx.grantPermissions(["clipboard-read", "clipboard-write"], { origin: ent.url });
  // Registra cada aviso al aparecer: duran 1,8 s y con la máquina cargada se pueden perder
  await ctx.addInitScript(() => {
    window.__avisos = [];
    new MutationObserver((ms) => { for (const m of ms) for (const n of m.addedNodes) if (n.classList && n.classList.contains("toast")) window.__avisos.push(n.textContent); })
      .observe(document, { childList: true, subtree: true });
  });
  if (datos) {
    await ctx.addInitScript(([k, d]) => {
      // Una sola vez por contexto: al recargar o abrir otra pestaña se conserva lo que hizo el test
      if (!localStorage.getItem("__sembrado")) { localStorage.setItem(k, JSON.stringify(d)); localStorage.setItem("__sembrado", "1"); }
    }, [CLAVE, datos]);
  }
  const page = await ctx.newPage();
  const errores = [];
  page.on("pageerror", (e) => errores.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errores.push(m.text()); });
  await page.clock.setFixedTime(new Date(hoy));
  await page.goto(ent.url);
  return { page, ctx, errores };
}

const guardados = (page) => page.evaluate((k) => JSON.parse(localStorage.getItem(k)), CLAVE);

// Ir a una pestaña: las de la barra y Ajustes (engranaje del encabezado)
async function ir(page, vista) {
  await page.click(`nav [data-v="${vista}"], header [data-v="${vista}"]`);
}

// Espera a que haya aparecido un aviso con ese texto
const aviso = (page, texto) => page.waitForFunction((t) => window.__avisos.some((a) => a.includes(t)), texto, { timeout: 5000 });
const texto = (page, sel) => page.locator(sel).innerText();
const portapapeles = (page) => page.evaluate(() => navigator.clipboard.readText());

// Botón de un selector por su texto (las cuentas se eligen por nombre)
const elegir = (page, seg, texto) => seg === "segCat" ? page.selectOption("#mCat", { label: texto }) : page.locator(`#${seg} button`, { hasText: new RegExp(`^${texto.replace(/[()]/g, "\\$&")}$`) }).click();

// Nuevo movimiento desde el «+»: tipo gasto, ingreso o transferencia; cuentas por nombre
// Al abrirse, la hoja pone el foco en el importe: se espera, para que lo que se escribe no caiga en otro campo
// Las hojas dan foco a su primer campo a los 50 ms: si el test rellena otro campo antes, el texto cae en el equivocado
const enfocado = (page, id) => page.waitForFunction((i) => document.activeElement && document.activeElement.id === i, id);
const hojaLista = (page) => page.waitForFunction(() => document.activeElement && document.activeElement.id === "mImporte");
async function nuevoMov(page, { tipo = "gasto", importe, cuenta, desde, hacia, cat, nota, fecha } = {}) {
  await page.click("#fab");
  await hojaLista(page);
  await page.click(`#segMov button[data-v="${tipo}"]`);
  if (importe !== undefined) await page.fill("#mImporte", String(importe));
  if (cuenta) await elegir(page, "segCuentaM", cuenta);
  if (desde) await elegir(page, "segDesde", desde);
  if (hacia) await elegir(page, "segHacia", hacia);
  if (cat) await elegir(page, "segCat", cat);
  if (nota) await page.fill("#mNota", nota);
  if (fecha) await page.fill("#mFecha", fecha);
  await page.click("#mGuardar");
}
const nuevoGasto = (page, o = {}) => nuevoMov(page, { ...o, tipo: "gasto" });

async function nuevaCuenta(page, { tipo, nombre, saldo, signo, fondo, extra = {} } = {}) {
  await page.click("#addCuenta");
  await enfocado(page, "cNombre");
  if (tipo) await page.click(`#segTipo button[data-v="${tipo}"]`);
  if (signo) await page.click(`#segSigno button[data-v="${signo}"]`);
  if (nombre) await page.fill("#cNombre", nombre);
  if (saldo !== undefined) await page.fill("#cSaldo", String(saldo));
  for (const [id, v] of Object.entries(extra)) await page.fill("#" + id, String(v));
  if (fondo) await page.check("#cFondo");
  await page.click('#sheetC button[type="submit"]');
}

// Datos del modelo v2, armados a mano
const cta = (id, nombre, saldoInicial, extra = {}) => ({ id, tipo: "liquidez", nombre, saldoInicial, desde: "2026-10-01", ...extra });
const gasto = (id, fecha, importe, cuenta, cat = "Supermercado", nota = "") => ({ id, tipo: "gasto", fecha, importe, cuenta, cat, nota });
const ingreso = (id, fecha, importe, cuenta, cat = "Sueldo", nota = "") => ({ id, tipo: "ingreso", fecha, importe, cuenta, cat, nota });
const transf = (id, fecha, importe, cuenta, destino) => ({ id, tipo: "transferencia", fecha, importe, cuenta, destino, nota: "" });
const v2 = (extra = {}) => ({ v: 2, settings: {}, cuentas: [], movs: [], tareas: [], meses: {}, ...extra });

const AJUSTES = { topeTarjeta: 500, topeRevolut: 300, aporte: 100, objetivoFondo: 1000, inicio: "2026-09", saltos: "" };
// Datos mínimos: ajustes completos y lo que se pase encima
const con = (extra = {}) => ({ settings: { ...AJUSTES }, gastos: [], meses: {}, cuentas: [], ...extra });

function datosEjemplo() {
  const f = "2026-10-";
  return {
    settings: { topeTarjeta: 500, topeRevolut: 300, aporte: 100, objetivoFondo: 1000, inicio: "2026-09", saltos: "" },
    gastos: [
      { id: 1, fecha: f + "03", importe: 64.3, cuenta: "tarjeta", cat: "Supermercado", nota: "" },
      { id: 2, fecha: f + "05", importe: 18, cuenta: "revolut", cat: "Comida fuera", nota: "almuerzo" },
      { id: 3, fecha: f + "08", importe: 42, cuenta: "tarjeta", cat: "Trabajo (reembolsable)", nota: "taxi" },
      { id: 4, fecha: f + "11", importe: 25.5, cuenta: "santander", cat: "Transporte", nota: "" },
      { id: 5, fecha: "2026-09-28", importe: 30, cuenta: "tarjeta", cat: "Ocio", nota: "mes anterior" },
    ],
    meses: { "2026-09": { fondo: 100, checks: {} }, "2026-10": { fondo: 150, checks: { tr: true } } },
    cuentas: [
      { id: 11, tipo: "liquidez", nombre: "Banco A", saldo: 1200, actualizado: "2026-10-10" },
      { id: 12, tipo: "inversion", nombre: "Broker X", saldo: 2100, aportado: 2000, actualizado: "2026-10-10" },
      { id: 13, tipo: "tarjeta", nombre: "Tarjeta Y", saldo: 350, limite: 1500, actualizado: "2026-10-10" },
      { id: 14, tipo: "financiacion", nombre: "Financiera Z", saldo: 600, cuota: 50, cuotas: 12, actualizado: "2026-10-10" },
      { id: 15, tipo: "compartida", nombre: "Gastos del piso", saldo: -45, actualizado: "2026-10-10" },
    ],
  };
}

// Prepara un archivo de tests: un navegador para todos y un contexto nuevo por test
function preparar(nodeTest) {
  const estado = { ent: null, abiertos: [] };
  nodeTest.before(async () => { estado.ent = await iniciar(); });
  nodeTest.afterEach(async () => { for (const c of estado.abiertos.splice(0)) await c.close(); });
  nodeTest.after(async () => { if (estado.ent) await estado.ent.cerrar(); });
  return async (opciones) => { const r = await pagina(estado.ent, opciones); estado.abiertos.push(r.ctx); return r; };
}

module.exports = { enfocado, hojaLista, iniciar, pagina, preparar, guardados, ir, aviso, texto, portapapeles, elegir, nuevoMov, nuevoGasto, nuevaCuenta, cta, gasto, ingreso, transf, v2, con, datosEjemplo, AJUSTES, CLAVE, HOY, VISTAS, RAIZ };
