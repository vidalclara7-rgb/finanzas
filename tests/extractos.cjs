// Extractos inventados en PDF que imitan los tres formatos que lee la app (Revolut cuenta en euros,
// Santander movimientos de cuenta y Santander tarjeta de crédito). Los genera el navegador de los tests:
// los extractos reales nunca entran al repo. Posiciones en puntos, «y» desde abajo como en el PDF.
const MES_C = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];
const MES_L = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const partes = (f) => f.split("-").map(Number);
const corta = (f) => { const [a, m, d] = partes(f); return `${d} ${MES_C[m - 1]} ${a}`; };
const larga = (f) => { const [a, m, d] = partes(f); return `${d} ${MES_L[m - 1]} ${a}`; };
const deLargo = (f) => { const [a, m, d] = partes(f); return `${d} de ${MES_L[m - 1].toLowerCase()} de ${a}`; };
const barra = (f) => { const [a, m, d] = partes(f); return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${a}`; };
const guion = (f) => barra(f).replace(/\//g, "-");
const dinero = (v) => Math.abs(v).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true });
const saldo$ = (v) => (v < 0 ? "-" : "") + dinero(v);
// Una cuenta inventada que termina en esos dígitos (se arma en ejecución: nada con forma de cuenta real en el código)
const cuentaFalsa = (ref) => "ES" + "00" + "0".repeat(16) + ref;

// paginas: [[[x, y, texto], …], …]
async function pdf(page, paginas) {
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const html = `<html><head><style>@page{size:595pt 842pt;margin:0}body{margin:0;font:8pt Helvetica,Arial,sans-serif}
    .p{position:relative;width:595pt;height:842pt;page-break-after:always;overflow:hidden}.p span{position:absolute;white-space:nowrap}</style></head><body>${
    paginas.map((items) => `<div class="p">${items.map(([x, y, s]) => `<span style="left:${x}pt;top:${842 - y - 8}pt">${esc(s)}</span>`).join("")}</div>`).join("")}</body></html>`;
  const p = await page.context().newPage();
  await p.setContent(html);
  const buf = await p.pdf({ preferCSSPageSize: true, printBackground: false });
  await p.close();
  return buf;
}
// Reparte filas en páginas, repitiendo la cabecera
function enPaginas(primera, cabecera, filas, alto, desde, hasta = 130) {
  const pags = [[...primera, ...cabecera(desde + 30)]];
  let y = desde;
  for (const f of filas) {
    if (y - alto < hasta) { pags.push([...cabecera(760)]); y = 730; }
    pags[pags.length - 1].push(...f(y));
    y -= alto;
  }
  return pags;
}

// Revolut en inglés («EUR Statement»): fechas «Oct 5, 2026» e importes «€10.00».
// movs: [{ fecha, desc, importe, extra?, pegado? }]; con pegado el importe va dentro de la descripción, como en las descripciones largas
const MES_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MES_EN_L = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const enCorta = (f) => { const [a, m, d] = partes(f); return `${MES_EN[m - 1]} ${d}, ${a}`; };
const enLarga = (f) => { const [a, m, d] = partes(f); return `${MES_EN_L[m - 1]} ${d}, ${a}`; };
const euros = (v, s = "€") => (v < 0 ? "-" : "") + s + Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
function revolutEn(page, { ref = "7788", titular = "Persona Ejemplo", inicial = 0, desde = "2026-10-01", hasta = "2026-10-24", movs = [], usd = false }) {
  const salidas = movs.filter((m) => m.importe < 0).reduce((a, m) => a - m.importe, 0), entradas = movs.filter((m) => m.importe > 0).reduce((a, m) => a + m.importe, 0);
  const fin = movs.reduce((a, m) => a + m.importe, inicial);
  const cabecera = (moneda, sec) => [[418, 757, `${moneda} Statement`], [443, 744, `Generated on the ${enCorta(hasta)}`], [416, 731, "Revolut Bank UAB Sucursal En España"],
    [40, 689, titular], [40, 666, "Calle Falsa 1"], [353, 665, "IBAN"], [376, 665, cuentaFalsa(ref)],
    [40, 587, "Balance summary"], [526, 561, "Closing"], [43, 555, "Product"], [253, 555, "Opening balance"], [335, 555, "Money out"], [417, 555, "Money in"], [527, 548, "balance"],
    [43, 529, "Account (Current Account)"], ...sec];
  const resumen = [[253, 529, euros(inicial)], [335, 529, euros(salidas)], [417, 529, euros(entradas)], [530, 529, euros(fin)],
    [43, 510, "Total"], [253, 510, euros(inicial)], [335, 510, euros(salidas)], [417, 510, euros(entradas)], [530, 510, euros(fin)],
    [40, 446, `Account transactions from ${enLarga(desde)} to ${enLarga(hasta)}`]];
  const cab = (y) => [[43, y + 6, "Transaction"], [104, y, "Value date"], [166, y, "Description"], [335, y, "Money out"], [417, y, "Money in"], [526, y, "Balance"], [43, y - 6, "date"]];
  let saldo = inicial;
  const filas = movs.map((m) => (y) => { saldo += m.importe;
    const base = [[43, y, enCorta(m.fecha)], [104, y, enCorta(m.fecha)], [530, y, euros(saldo)]];
    if (m.pegado) base.push([166, y, `${m.desc} ${euros(Math.abs(m.importe))}`]);
    else base.push([166, y, m.desc], [m.importe < 0 ? 335 : 417, y, euros(Math.abs(m.importe))]);
    return [...base, ...(m.extra ? [[166, y - 8, m.extra]] : [])]; });
  const primera = cabecera("EUR", resumen);
  // la cabecera de resumen ya lleva la fila de la cuenta: se saca de `cabecera` para no repetirla en las siguientes páginas
  const pags = enPaginas(primera, cab, filas, 30, 372);
  if (usd) pags.push([...cabecera("USD", [[253, 529, "$0.00"], [335, 529, "$0.00"], [417, 529, "$0.00"], [535, 529, "$0.00"]])]);
  return pdf(page, pags);
}

// Santander en inglés (app del teléfono): movs [{ fecha (operación), valor?, desc, importe, extra? }]; el saldo disponible es el del último movimiento (el primero de la lista, que va de lo nuevo a lo viejo)
function santanderCuentaEn(page, { ref = "4321", titular = "EJEMPLO PERSONA", saldo = 0, hoy = "2026-11-11", movs = [] }) {
  const primera = [[186, 805, "Holder"], [227, 805, titular], [186, 792, "Account"], [232, 792, cuentaFalsa(ref)], [310, 781, `(on ${corta(hoy)})`], [186, 780, "Available balance"], [278, 780, dinero(saldo)], [304, 780, "€"],
    [37, 744, "Your account activity"]];
  const cab = (y) => [[40, y, "Transaction date"], [144, y, "Transaction"], [434, y, "Amount"], [518, y, "Balance"]];
  let sal = saldo;
  const orden = [...movs].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const filas = orden.map((m) => (y) => { const s = sal; sal -= m.importe;
    return [[40, y, corta(m.fecha)], [144, y, m.desc], ...(m.importe < 0 ? [[432, y, "−"]] : []), [445, y, dinero(m.importe)], [482, y, "€"], [512, y, dinero(s)], [549, y, "€"],
      [40, y - 12, `Value date: ${corta(m.valor || m.fecha)}`], ...(m.extra ? [[143, y - 12, m.extra]] : [])]; });
  return pdf(page, enPaginas(primera, cab, filas, 30, 704, 100));
}

// movs: [{ fecha, desc, importe (+ entra, − sale), extra? }]
function revolut(page, { ref = "7788", titular = "Persona Ejemplo", inicial = 0, desde = "2026-10-01", hasta = "2026-10-24", movs = [] }) {
  const fin = movs.reduce((a, m) => a + m.importe, inicial);
  const primera = [[409, 757, "Extracto en EUR"], [464, 744, "Generado el 24 oct 2026"], [416, 731, "Revolut Bank UAB Sucursal En España"],
    [40, 689, titular], [40, 666, "Calle Falsa 1"], [353, 665, "IBAN"], [376, 665, cuentaFalsa(ref)],
    [40, 587, "Resumen del saldo"], [43, 561, "Producto"], [253, 561, "Saldo inicial"], [335, 561, "Dinero saliente"], [417, 561, "Dinero entrante"], [517, 561, "Saldo final"],
    [43, 542, "Cuenta (Cuenta Corriente)"], [253, 542, dinero(inicial) + "€"], [335, 542, "0,00€"], [417, 542, "0,00€"], [531, 542, saldo$(fin) + "€"],
    [40, 434, `Transacciones de la cuenta desde el ${deLargo(desde)} al ${deLargo(hasta)}`]];
  const cab = (y) => [[43, y + 6, "Fecha de la"], [104, y, "Fecha valor"], [166, y, "Descripción"], [335, y, "Dinero saliente"], [417, y, "Dinero entrante"], [535, y, "Saldo"], [43, y - 6, "transacción"]];
  let saldo = inicial;
  const filas = movs.map((m) => (y) => { saldo += m.importe;
    return [[43, y, corta(m.fecha)], [104, y, corta(m.fecha)], [166, y, m.desc], [m.importe < 0 ? 335 : 417, y, dinero(m.importe) + "€"], [526, y, saldo$(saldo) + "€"],
      ...(m.extra ? [[166, y - 7, m.extra]] : [])]; });
  const pags = enPaginas(primera, cab, filas, 30, 372);
  pags[pags.length - 1].push([40, 120, `Transacciones de depósito desde el ${deLargo(desde)} al ${deLargo(hasta)}`], [43, 100, corta(hasta)], [104, 100, corta(hasta)], [166, 100, "Interés neto pagado"], [417, 100, "0,01€"]);
  return pdf(page, pags);
}

// movs: [{ fecha, desc, importe, extra? }]; el saldo de la cabecera es el final
function santanderCuenta(page, { ref = "4321", titular = "EJEMPLO PERSONA", inicial = 0, desde = "2026-10-01", hasta = "2026-10-24", movs = [] }) {
  const fin = movs.reduce((a, m) => a + m.importe, inicial);
  const primera = [[193, 797, "TITULAR:"], [236, 797, titular], [193, 786, "CUENTA SANTANDER:"], [292, 786, cuentaFalsa(ref)],
    [193, 774, "Saldo:"], [221, 774, saldo$(fin) + " EUR"], [265, 774, "("], [268, 774, `a fecha ${barra(hasta)}`], [346, 774, ")"],
    [36, 737, "Movimientos de cuenta"], [173, 737, `del ${larga(desde)} al ${larga(hasta)}`], [345, 737, "Ordenados por fecha"]];
  const cab = (y) => [[39, y, "Fecha operación"], [144, y, "Operación"], [442, y, "Importe"], [536, y, "Saldo"]];
  let saldo = fin;
  const orden = [...movs].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const filas = orden.map((m) => (y) => { const s = saldo; saldo -= m.importe;
    return [[39, y, barra(m.fecha)], [144, y, m.desc], [430, y, (m.importe < 0 ? "-" : "") + dinero(m.importe) + " EUR"], [510, y, saldo$(s) + " EUR"],
      [39, y - 12, `Fecha valor: ${barra(m.fecha)}`], ...(m.extra ? [[144, y - 12, m.extra]] : [])]; });
  return pdf(page, enPaginas(primera, cab, filas, 30, 686));
}

// compras: [{ fecha, desc, importe (positivo: compra) }], pagos: [{ fecha, importe }]
function santanderTarjeta(page, { ref = "5566", titular = "EJEMPLO PERSONA", anterior = 0, desde = "2026-09-01", hasta = "2026-09-30", pagos = [], compras = [], fraccionadas = [], intereses = [] }) {
  const aPagar = anterior - pagos.reduce((a, p) => a + p.importe, 0) + compras.reduce((a, c) => a + c.importe, 0);
  const p1 = [[403, 739, "CREDITO SANTANDER"], [403, 731, "Extracto de movimientos"], [61, 692, "Contrato número"], [132, 692, "0049 0000 000 000" + ref],
    [40, 679, "Periodo de liquidación"], [132, 679, `${barra(desde)} A ${barra(hasta)}`], [66, 653, "Importe a Pagar"], [132, 653, dinero(aPagar) + " €"]];
  const p2 = [[403, 739, "CREDITO SANTANDER"], [34, 674, "A - Movimientos del contrato"], [34, 637, "Fecha operación"], [111, 637, "Fecha valor"], [190, 637, "Concepto"], [410, 637, "Importe en euros"],
    [51, 618, guion(desde)], [130, 618, guion(desde)], [207, 618, "SALDO ANTERIOR"], [446, 618, dinero(anterior) + " €"]];
  pagos.forEach((p, i) => p2.push([51, 600 - i * 18, guion(p.fecha)], [130, 600 - i * 18, guion(p.fecha)], [207, 600 - i * 18, "PAGO"], [443, 600 - i * 18, "-" + dinero(p.importe) + " €"]));
  p2.push([34, 500, "B - Movimientos"], [34, 482, `Crédito – TITULAR ${titular}`], [34, 464, "Fecha operación"], [111, 464, "Fecha valor"], [190, 464, "Concepto"], [410, 464, "Importe en euros"]);
  compras.forEach((c, i) => p2.push([34, 446 - i * 18, guion(c.fecha)], [111, 446 - i * 18, guion(c.fecha)], [190, 446 - i * 18, c.desc], [454, 446 - i * 18, dinero(c.importe)]));
  // Sección C: intereses de financiación, uno por compra fraccionada; el pie de página del banco va al final de la página
  const pC = [];
  if (intereses.length) {
    pC.push([403, 739, "CREDITO SANTANDER"], [34, 457, "C - Comisiones, Gastos e Intereses"], [34, 420, "Fecha"], [87, 420, "Concepto"], [234, 420, "Importe"], [449, 420, "Importe"]);
    let yc = 393;
    for (const i of intereses) {
      const e = (v) => dinero(v) + " €", yi = i.partido ? yc - 1 : yc;
      pC.push([39, yc, guion(i.fecha)], [95, yc, "INTERESES FINANCIACION FC"]);
      pC.push([246, yi, e(i.base || 20)], [313, yi, "--"], [364, yi, "--"], [400, yi, "18,00"], [449, yi, e(i.importe)]);
      pC.push([95, yc - 9, i.comercio]);
      yc -= 25;
    }
    pC.push([20, 184, "BANCO SANTANDER, S.A. Domicilio social: Paseo de Pereda, 9-12. 39004 Santander. R.M. Cantabria"]);
  }
  const pags = pC.length ? [p1, p2, pC] : [p1, p2];
  if (!fraccionadas.length) return pdf(page, pags);
  // Tabla de operaciones fraccionadas: fecha, descripción (puede partirse en varias líneas), total, «k de m», cuota, intereses, comisiones, total de la cuota y pendiente
  const p3 = [[403, 739, "CREDITO SANTANDER"], [34, 691, "Operaciones Fraccionadas (Compras, Efectivo al Instante, Recibos, Bizum, Transferencias...)"],
    [37, 673, "Fecha"], [77, 673, "Descripción"], [138, 673, "Importe"], [194, 673, "Cuota"], [242, 673, "Importe"], [292, 673, "Intereses"], [338, 673, "Comi-"], [384, 673, "Total"], [435, 673, "Importe"]];
  let y = 646;
  for (const f of fraccionadas) {
    const [a, mo, d] = [f.fecha.slice(0, 4), f.fecha.slice(5, 7), f.fecha.slice(8)];
    const e = (v) => dinero(v) + " €";
    p3.push([34, y, `${d}/${mo}/${a}`], [80, y, f.partes[0]], [148, y, e(f.total)], [195, y, `${f.k} de ${f.m}`], [257, y, e(f.cuota)], [307, y, e(f.intereses || 0)], [341, y, e(0)], [393, y, e(f.cuota + (f.intereses || 0))], [450, y, e(f.pendiente)]);
    f.partes.slice(1).forEach((t, i) => p3.push([80, y - 9 - i * 9, t]));
    y -= 36 + (f.partes.length - 1) * 9;
  }
  p3.push([34, 300, "Detalle de importe pendiente de pago"]);
  return pdf(page, [...pags, p3]);
}

// Un PDF que no es ninguno de los formatos
const otroPdf = (page) => pdf(page, [[[40, 760, "Factura de la luz"], [40, 740, "Importe 45,00 €"]]]);

module.exports = { pdf, revolut, revolutEn, santanderCuentaEn, santanderCuenta, santanderTarjeta, otroPdf };
