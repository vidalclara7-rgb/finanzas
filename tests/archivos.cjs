// Archivos inventados para probar la lectura de cualquier archivo: Excel (.xlsx, armado a mano con zlib), CSV, imágenes y PDF
// escaneados. Los dibuja el navegador de los tests: ningún archivo real entra al repo.
const zlib = require("node:zlib");

const crc32 = (b) => { let c, crc = 0xffffffff; for (let i = 0; i < b.length; i++) { c = (crc ^ b[i]) & 0xff; for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1; crc = (crc >>> 8) ^ c; } return (crc ^ 0xffffffff) >>> 0; };
// [[nombre, Buffer, método]] con método 8 (deflate) o 0 (sin comprimir)
function zip(archivos) {
  const locales = [], centrales = []; let off = 0;
  for (const [n, d, met = 8] of archivos) {
    const nb = Buffer.from(n), dat = met === 8 ? zlib.deflateRawSync(d) : d, crc = crc32(d);
    const lh = Buffer.alloc(30); lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(met, 8); lh.writeUInt32LE(crc, 14); lh.writeUInt32LE(dat.length, 18); lh.writeUInt32LE(d.length, 22); lh.writeUInt16LE(nb.length, 26);
    locales.push(lh, nb, dat);
    const ch = Buffer.alloc(46); ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6); ch.writeUInt16LE(met, 10); ch.writeUInt32LE(crc, 16); ch.writeUInt32LE(dat.length, 20); ch.writeUInt32LE(d.length, 24); ch.writeUInt16LE(nb.length, 28); ch.writeUInt32LE(off, 42);
    centrales.push(ch, nb); off += 30 + nb.length + dat.length;
  }
  const cd = Buffer.concat(centrales), eo = Buffer.alloc(22);
  eo.writeUInt32LE(0x06054b50, 0); eo.writeUInt16LE(archivos.length, 8); eo.writeUInt16LE(archivos.length, 10); eo.writeUInt32LE(cd.length, 12); eo.writeUInt32LE(off, 16);
  return Buffer.concat([...locales, cd, eo]);
}
const colLetra = (i) => String.fromCharCode(65 + i);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const serie = (f) => Math.round(Date.parse(f + "T00:00:00Z") / 864e5) + 25569;
// filas: arrays de celdas: texto, { f: "AAAA-MM-DD" } (fecha con formato de fecha) o { n: 12.5 } (número). "" deja la celda vacía
function xlsx(filas) {
  const ss = []; const idx = (t) => { let i = ss.indexOf(t); if (i < 0) { i = ss.length; ss.push(t); } return i; };
  const sheet = filas.map((fila, r) => `<row r="${r + 1}">${fila.map((c, k) => {
    const ref = colLetra(k) + (r + 1);
    if (c === "" || c == null) return "";
    if (typeof c === "object" && c.f) return `<c r="${ref}" s="1"><v>${serie(c.f)}</v></c>`;
    if (typeof c === "object" && c.n != null) return `<c r="${ref}"><v>${c.n}</v></c>`;
    return `<c r="${ref}" t="s"><v>${idx(String(c))}</v></c>`;
  }).join("")}</row>`).join("");
  const X = (s) => Buffer.from('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + s);
  return zip([
    ["[Content_Types].xml", X('<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/></Types>'), 8],
    ["xl/workbook.xml", X('<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheets><sheet name="Hoja1" sheetId="1"/></sheets></workbook>'), 0],
    ["xl/styles.xml", X('<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cellXfs count="2"><xf numFmtId="0"/><xf numFmtId="14"/></cellXfs></styleSheet>'), 8],
    ["xl/sharedStrings.xml", X(`<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${ss.map((t) => `<si><t>${esc(t)}</t></si>`).join("")}</sst>`), 8],
    ["xl/worksheets/sheet1.xml", X(`<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheet}</sheetData></worksheet>`), 8],
  ]);
}
const XLSX = (buffer, name = "movimientos.xlsx") => ({ name, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", buffer });
const CSV = (texto, name = "movimientos.csv") => ({ name, mimeType: "text/csv", buffer: Buffer.from(texto, "utf-8") });
const TXT = (texto, name = "notas.txt") => ({ name, mimeType: "text/plain", buffer: Buffer.from(texto, "utf-8") });

// Una imagen con una tabla de fecha, descripción e importe (filas: [fecha, descripción, importe]); sin filas, una hoja en blanco
async function imagenTabla(page, filas) {
  const b64 = await page.evaluate((fs) => {
    const c = document.createElement("canvas"); c.width = 900; c.height = 300; const x = c.getContext("2d");
    x.fillStyle = "#fff"; x.fillRect(0, 0, 900, 300); x.fillStyle = "#000"; x.font = "28px sans-serif";
    fs.forEach((f, i) => { x.fillText(f[0], 30, 60 + i * 70); x.fillText(f[1], 250, 60 + i * 70); x.fillText(f[2], 700, 60 + i * 70); });
    return c.toDataURL("image/png").split(",")[1];
  }, filas);
  return Buffer.from(b64, "base64");
}
const FOTO_TABLA = [["05/10/2026", "Supermercado Uno", "-12,50 €"], ["06/10/2026", "Cafeteria Dos", "-3,20 €"], ["07/10/2026", "Taller Tres", "-45,00 €"]];
const PNG = (buffer, name = "foto.png") => ({ name, mimeType: "image/png", buffer });
// Un PDF que es sólo una imagen (sin texto): como un documento escaneado
async function pdfEscaneado(page, buffer) {
  const p = await page.context().newPage();
  await p.setContent(`<html><body style="margin:0"><img style="width:900px;display:block" src="data:image/png;base64,${buffer.toString("base64")}"></body></html>`);
  const pdf = await p.pdf({ width: "900px", height: "300px", printBackground: true });
  await p.close();
  return pdf;
}

module.exports = { zip, xlsx, XLSX, CSV, TXT, imagenTabla, FOTO_TABLA, PNG, pdfEscaneado };
