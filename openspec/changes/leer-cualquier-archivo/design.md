# Diseño: leer-cualquier-archivo

## Decisiones de la persona (2026-10-28)

- **Fotos con OCR dentro de la app** (descartado: sólo adjuntar la foto). Es una dependencia nueva, decidida aquí.
- **Un solo botón** en la hoja de la cuenta; **adjunta y ofrece importar** si hay movimientos (descartado: importar directo).
- **Cualquier tipo de archivo** se puede adjuntar, también en los documentos de gastos.

## Lo que no se puede (dicho a la persona)

«Interpretar» una foto como lo haría una IA requiere un servidor y una clave: fuera de la arquitectura. Lo que sí se hace es
reconocer el texto (OCR) y leerlo con el mismo lector genérico, siempre con revisión.

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- **Orden de lectura:** (1) los tres lectores conocidos, por sus textos fijos; (2) si no, el lector genérico sobre las filas del
  documento; (3) si un PDF no tiene texto, se pinta cada página (hasta 10) y se lee como una foto.
- **Filas del documento:** PDF → las líneas de `lineasPdf()`, con la posición de cada texto (columnas por huecos); Excel →
  filas y celdas de la hoja (todas las hojas, las celdas con fecha en número de serie se convierten); CSV y texto → línea a
  línea, separador `;`, tab o `,` (el que más aparece, fuera de comillas), o 2+ espacios en texto plano; foto → líneas del OCR.
- **Lector genérico (`lectorGenerico(filas)`):** una fila es un movimiento si tiene una fecha y un importe.
  - Fecha: `dd/mm/aaaa`, `dd-mm-aaaa`, `dd.mm.aaaa`, `aaaa-mm-dd` y `dd/mm/aa`; siempre día primero. Las filas con fecha
    imposible se ignoran.
  - Importe: `1.234,56`, `1,234.56`, `12,00`, `12.5`, con `-`, `−` (U+2212), paréntesis o `-` final como negativo, y con `€`
    o `EUR` pegados. Si hay encabezado (`Importe`, `Amount`, `Cantidad`, `Monto`), se usa esa columna; con `Debe`/`Haber`,
    `Cargo`/`Abono` o `Debit`/`Credit` el cargo es negativo; sin encabezado, la última columna con importe. Un entero sin
    decimales no cuenta como importe (evita confundir cantidades y números de documento).
  - Descripción: el texto más largo de la fila que no sea fecha ni importe; varias celdas de texto se unen con espacio.
  - Signo: negativo = gasto (sale), positivo = ingreso (entra), como los lectores actuales. Si **todos** los importes son
    positivos, la app pregunta «Todos los importes son positivos. ¿Son gastos o ingresos?» antes de revisar.
  - Cuenta: si en las primeras 15 filas hay un número de 13 a 19 dígitos (tarjeta) o un IBAN, los últimos cuatro dígitos
    son la `ref` (misma regla que hoy: si coincide con una cuenta, se propone; si no, se elige).
  - Banco/formato en la hoja: «Archivo» y el nombre del archivo; el periodo, del primer al último movimiento.
- **Excel (.xlsx):** un ZIP con XML. Se lee con `DecompressionStream("deflate-raw")` del navegador y un lector de ZIP propio
  de unas 40 líneas (directorio central + entradas deflate/stored): `xl/sharedStrings.xml`, `xl/workbook.xml` y
  `xl/worksheets/sheetN.xml`. Sin librería. Si el navegador no tiene `DecompressionStream`, aviso de que no se puede leer.
- **OCR (Tesseract):** `vendor/tesseract/` con `tesseract.min.js` (v7.0.0), `worker.min.js`, el núcleo WASM con y sin SIMD
  (`tesseract-core-simd-lstm.wasm.js` y `tesseract-core-lstm.wasm.js`, 6.1.2, unos 4 MB cada uno) y `spa.traineddata.gz` (modelo
  español `4.0.0_best_int`, 2 MB). Licencias Apache-2.0 y MIT, con sus LICENSE. Se carga sólo al leer una foto (como pdf.js),
  con rutas locales (`workerPath`, `corePath`, `langPath`), sin red externa. La foto se reduce a 2000 px de lado mayor antes de
  leerla. Mientras lee, «Leyendo la foto…». Total en el repo: unos 10 MB.
- **Caché:** los ficheros del OCR no entran en `FILES` (no se bajan en la instalación); el service worker los guarda la primera
  vez que se usan (ya guarda lo que baja). Consecuencia: la primera lectura de fotos necesita conexión, y cada versión nueva de
  la caché (`CACHE`) los vuelve a bajar al usarlos.
- **Adjuntos:** el registro de IndexedDB gana tipos: `pdf`, `foto`, `excel`, `texto` y `otro` (antes sólo `pdf` y `foto`). Sin
  migración: los registros viejos se leen igual. El adjunto de la hoja de cuenta se guarda con el mes en curso al elegir el
  archivo; si la persona importa sus movimientos, pasa al mes del último movimiento. Un solo botón `#cAdjuntar`; desaparece
  `#cImportar`. `#adjIn` y `#docIn` aceptan `*/*`.
- **Preguntar al encontrar movimientos:** una hoja pequeña «Encontré N movimientos. ¿Querés revisarlos?» con «Revisar» y
  «Ahora no» (no se importa nada y el adjunto se queda).
- **Mensajes:** sin movimientos → «No encontré movimientos en este archivo.»; archivo roto → «No pude leer este archivo.»; foto
  sin texto → «No pude leer texto en la foto.»; lector de fotos que no carga → «No pude cargar el lector de fotos. Probá de
  nuevo con conexión.»; archivo vacío → «El archivo está vacío.»
- **El mensaje viejo** «No reconozco este extracto. Por ahora leo Revolut…» desaparece.
- **Privacidad:** el repo es público. Los archivos de ejemplo de la persona (un PDF y un Excel de una tarjeta, con su
  número y su nombre) **no se suben**; los tests fabrican archivos con datos inventados.

## Cómo se implementa en index.html

- `filasDe(archivo)` devuelve filas y texto según el tipo (`pdf`, `xlsx`, `csv/txt`, imagen); `leerArchivo(f)` prueba
  `leerExtracto()` y, si no, `lectorGenerico()`. `importarArchivo()` pasa por ahí y deja de avisar «No reconozco…».
- `tipoArchivo(f)` clasifica por mime y extensión. El OCR en `ocrImagen(blob)` con `cargarTesseract()`.
- Pregunta de importar: `sheetAdjQ`. Tests con archivos fabricados en el propio test (ZIP/xlsx con `zlib` de Node, CSV, PNG
  dibujado en un canvas).
- Sube la versión de `CACHE`; `CLAUDE.md` pasa a nombrar Tesseract como dependencia de `vendor/` y a describir lo nuevo.
