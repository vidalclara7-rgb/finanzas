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

// Abre la app con `datos` ya guardados (sólo en la primera carga: al recargar se conserva lo que hizo el test).
// `hoy` fija la fecha para que los meses sean previsibles. `sw: true` deja registrar el service worker.
async function pagina(ent, { datos, esquema = "light", hoy = HOY, sw = false } = {}) {
  const ctx = await ent.browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: esquema, serviceWorkers: sw ? "allow" : "block" });
  if (datos) {
    await ctx.addInitScript(([k, d]) => {
      if (!sessionStorage.getItem("sembrado")) { localStorage.setItem(k, JSON.stringify(d)); sessionStorage.setItem("sembrado", "1"); }
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

function datosEjemplo() {
  const f = "2026-10-";
  return {
    settings: { topeTarjeta: 500, topeRevolut: 300, aporte: 100, objetivoFondo: 1000, inicio: "2026-09", saltos: "" },
    gastos: [
      { id: 1, fecha: f + "03", importe: 64.3, cuenta: "tarjeta", cat: "Súper", nota: "" },
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

module.exports = { iniciar, pagina, guardados, ir, datosEjemplo, CLAVE, HOY, VISTAS, RAIZ };
