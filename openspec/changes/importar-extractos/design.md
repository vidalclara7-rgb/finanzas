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
