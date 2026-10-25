# Diseño: importar-extractos

## Decisiones de la persona (2026-10-25)

- Leer los PDF que ya descarga, con un lector de PDF incluido en la app. Es la primera dependencia
  de la app y se decidió a sabiendas: queda dentro del repo, no se conecta a ningún sitio y los
  datos siguen sin salir del teléfono. `CLAUDE.md` se actualiza para permitirla, sólo a ella.
- Los movimientos entran como borradores para revisar, no directo.
- El extracto importado queda adjunto; adjuntar a mano entra en este cambio (era el primer pedido).
- Revolut Trading queda para un módulo de inversiones (seguimiento de ganancias y noticias de la
  cartera). Las noticias requieren conectarse a internet: es una conversación de arquitectura.

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- **Formatos de esta versión**: los tres que la persona tiene. Se reconocen por textos fijos del
  documento (por ejemplo «Extracto en EUR» y «Revolut Bank» para Revolut; «Movimientos de cuenta»
  y «CUENTA SANTANDER» para la cuenta; «Extracto de movimientos» y «CREDITO SANTANDER» para la
  tarjeta). Cada lector está separado para sumar formatos sin tocar los otros.
- **Qué cuenta es**: por los últimos cuatro dígitos del IBAN o del contrato, que la app guarda en la
  cuenta la primera vez. No se guarda el número completo.
- **Ya está**: misma cuenta, misma fecha e importe que un movimiento existente.
- **Compra anulada**: una compra y una anulación del mismo importe y comercio el mismo día se
  proponen desmarcadas las dos.
- **Transferencia entre tus cuentas**: un importe opuesto en otra cuenta tuya dentro de los tres días
  anteriores o posteriores, o una descripción conocida (recarga de Revolut, pago a tu nombre, cargo
  de la tarjeta). Se propone como transferencia; si la otra mitad ya está cargada, llega como
  «Ya está».
- **Categorías**: palabras conocidas por categoría (por ejemplo Consum, Carrefour, Mercadona → Súper)
  y, antes que eso, lo que la persona eligió para el mismo comercio. El comercio es la descripción
  sin números, ciudad ni datos de tarjeta.
- **Reembolso**: un ingreso que dice «Gastos» en el concepto de una transferencia se propone como
  Reembolso.
- **Conciliar**: con el saldo final del extracto de cuenta, o con el importe a pagar del de tarjeta,
  a la fecha del último movimiento.
- **Adjuntos**: guardados en el almacenamiento de archivos del navegador, no en la copia de seguridad
  de texto (pesan demasiado). Ajustes lo avisa.

## Cómo se implementa en index.html

- Lector de PDF: `pdf.js` (Mozilla, licencia Apache 2.0), versión fijada, guardado en `vendor/` y
  sumado a `FILES` del service worker para que funcione sin conexión. Se carga sólo al importar.
- Del PDF se sacan las líneas con su posición, y cada lector arma los movimientos (fecha, texto,
  importe con signo, saldo) por columnas.
- Datos: `cuentas[i].ref` (últimos cuatro dígitos), `S.reglas = { comercio: categoría }`,
  `movs[i].origen = idDeImportación` para saber qué entró de qué extracto. Adjuntos en IndexedDB,
  con su cuenta, su mes, nombre y tipo; en `S.adjuntos` sólo el índice.
- Tests con extractos inventados que imitan los tres formatos, generados por los propios tests. Los
  extractos reales no entran nunca al repo.

## Al empezar a construir (2026-10-25)

- Gastos fijos (cambio archivado después de aprobar este): un borrador de gasto cuya categoría y
  descripción coinciden con una regla `fijos[clave] === true` llega con «Fijo», como al anotarlo a
  mano. La descripción del borrador es la nota del gasto. Decisión de la persona.

## Gate 2 (2026-10-25)

- Pantallas del preview: `movs` (botón «Importar extracto»), `hoja-importar` (revisión; en vacío,
  elegir la cuenta la primera vez), `hoja-importar-conciliar` (después de guardar), `hoja-cuenta`
  (adjuntos) y `ajustes` (aviso de adjuntos).
- Cada borrador tiene un único selector que dice qué es: «Gasto · <categoría>», «Ingreso ·
  <categoría>» o «Transferencia a/desde <cuenta>», según el signo del importe.
- Clases nuevas: `.borradores`, `.borr` (y `.off` para los desmarcados), `.adj`. Arreglo general:
  `.sheet>*{flex-shrink:0}`, porque en hojas largas las tarjetas se aplastaban y cortaban su contenido.

## Al construir (2026-10-25)

- pdf.js 3.11.174, build `legacy` (navegadores más viejos), en `vendor/pdfjs/` con su licencia y en
  `FILES` del service worker. Se carga con una etiqueta `<script>` la primera vez que se importa.
- Los adjuntos y su índice viven en IndexedDB, no en `S`: así la copia de seguridad (que reemplaza
  `S` al restaurar) no deja índices de archivos que no viajan. Cambia lo que decía arriba.
- Santander cuenta: la fecha del movimiento es la fecha valor (la del gasto); la fecha de operación es
  cuando se asienta, hasta cuatro días después, y no emparejaba las recargas con Revolut.
- Transferencias: además de lo previsto, el cargo «Liquidación de las tarjetas de crédito» va a la
  tarjeta cuando hay una sola. A nombre propio sin la otra mitad cargada, se propone la primera cuenta
  de bancos: la persona lo cambia en el selector si es otra (por ejemplo, una cuenta fuera de la app).
- La otra mitad de una transferencia sólo cuenta como «Ya está» si ya es una transferencia; un gasto o
  ingreso del mismo importe en otra cuenta no se toca.
- Tarjeta: las cuotas de compras fraccionadas («CUOTA FRACCIONAR COMPRA …») y los intereses de la
  sección C entran como gastos del mes, porque son parte del importe a pagar; el plan de cuotas queda
  fuera de alcance, como decía la propuesta.
- Desmarcar «Fijo» en un borrador deja la regla en «no es fijo», igual que en la hoja de gasto.
- Probado contra los tres extractos reales de la persona, fuera del repo: los totales cuadran al
  céntimo con el saldo de cada extracto. El de Revolut Trading se rechaza con el aviso.

## Gate 3, primera ronda (2026-10-25)

- La persona: las transferencias internacionales a su nombre son pagos de gastos en otro país,
  «principalmente regalos». Se agrega la categoría de gasto **Regalos** (para todas las personas,
  antes de Trabajo (reembolsable)) y una transferencia internacional a nombre del titular llega como
  gasto en Regalos, o con la categoría aprendida para ese destinatario. Descartado: Otros por defecto.
- Regalos tiene color propio `--cat13` en las cuatro paletas; `colorCat()` pasa a un mapa por nombre
  para que ninguna categoría existente cambie de color.
- «Arreglá el botón para que nada se solape»: con una hoja abierta los avisos van arriba.
- Prueba en iPhone: no hay un iPhone ni el motor de Safari en este entorno. Se publica una copia de
  prueba privada (Artifact de claude.ai) para que la persona la abra en Safari del teléfono; con datos
  aparte y sin instalación ni uso sin conexión. No le llega a nadie más.

## Gate 3, segunda ronda (2026-10-25, probando en el iPhone)

- «No me deja poner comas»: los campos `type="number"` de Safari rechazan la coma del teclado en
  castellano. Pasan a `type="text"` con `inputmode="decimal"`; `num()` acepta coma o punto y los
  miles con punto («1.234,56»), y al editar se muestra con coma (`aTexto()`).
- Categoría nueva **Ropa** (después de Compras, `--cat14`); las tiendas de ropa conocidas pasan de
  Compras a Ropa en `PALABRAS`.
- «Súper» → «Supermercado»: `categoriasNorm()` en `norm()` renombra la categoría en `movs`, en los
  valores de `reglas` y en las claves de `fijos`, también con `v: 2`. `datos: migra`.
- Para que la especificación viva no quede hablando de «Súper», este delta sustituye los requisitos
  vivos que lo nombraban, con el texto igual salvo el nombre.
