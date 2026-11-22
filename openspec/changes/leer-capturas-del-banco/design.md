# Diseño: leer capturas del banco

Fecha: 2026-11-22.

## Qué falla hoy (y lo que falta confirmar)

La persona cuenta que la app dice «leyendo» y después no avisa de nada. Por el código, el camino de una foto es `leerArchivo()` → `ocrImagen()` → `lectorGenerico()`. Éste sólo toma una fila como movimiento si tiene una fecha reconocible por `fechaDe()` y un importe; `fechaDe()` entiende `AAAA-MM-DD` y `d/m/a`, no `21 NOV 2026`. Con estas capturas el resultado esperado es `null` y por tanto el aviso «No encontré movimientos en este archivo.», que dura 4 s y puede pasar desapercibido. **No pude ejecutar el OCR aquí** (se denegó lanzar el navegador de prueba), así que no vi el texto real que devuelve el motor con las capturas. Primera tarea de `/sdd:apply`: sacar las filas que devuelve `ocrImagen()` con las dos capturas de `inbox/` y construir los tests con ese resultado (inventado, sin datos reales, pero con la misma forma). Si el fallo es otro (por ejemplo, una excepción que no llega a avisar), se corrige también y queda cubierto por el requisito de avisar siempre.

## Decisiones

1. **Un lector nuevo para listas por día, `lectorListaPorDia(filas)`**, que `leerArchivo()` prueba antes del genérico para fotos, PDF escaneados y texto. Recorre las filas: una fila cuyo único contenido es una fecha (`fechaDe()` ampliada) abre un grupo; una fila con descripción e importe al final (`importeTxt()`, que ya acepta «−», coma decimal y «€») es un movimiento con la fecha del grupo. Filas que no son ni lo uno ni lo otro (cabeceras como «Select the month», botones) se ignoran. Si no hay ningún grupo con movimientos devuelve `null` y se sigue con el genérico. Devuelve la misma forma que `lectorGenerico()` (`fmt:"archivo"`), para que revisión, signo, ref y «Ya está» funcionen sin tocar.
   - Descartado: un lector específico de Santander. El formato lo comparten otros bancos y la regla «fecha-encabezado + filas» es más general; el reconocimiento por banco no aporta nada aquí.
2. **Fechas con mes en letras**: `fechaDe()` suma `d MMM aaaa` con abreviaturas en castellano e inglés (ene/jan, abr/apr, ago/aug, dic/dec, el resto coincide) y mes completo, sin mayúsculas ni tildes ni punto final. Sin año no se acepta (fuera de alcance).
3. **Varias capturas**: el selector de Movimientos (`#pdfIn`) pasa a `multiple`. Con más de un archivo, todos deben ser fotos; si no, aviso «Elegí varias fotos o un solo archivo.» y no cambia nada. Se leen en secuencia (el OCR corre de a una) con «Leyendo N fotos…» y se juntan las filas de cada captura ya convertidas en movimientos.
4. **Solapes entre capturas**: no se deduplica toda fila igual (dos compras idénticas el mismo día son reales). Se deduplica **sólo la secuencia solapada**: para cada par de capturas se busca el mayor tramo de movimientos consecutivos (fecha, descripción normalizada, importe) que es el final de una y el principio de la otra, en cualquiera de los dos órdenes (la lista va de lo nuevo a lo viejo, pero la persona puede elegir en otro orden), y se cuenta una vez. Si dos capturas no comparten ninguna secuencia, se concatenan. Se compara con la descripción normalizada porque el OCR puede variar mayúsculas o espacios.
   - Descartado: pedir a la persona que ordene las capturas; descartado también deduplicar por igualdad simple, que se come compras repetidas.
5. **Duplicados con lo ya guardado y con el PDF del cierre**: decidido con la persona, tolerancia de ±3 días. Es lo que ya hace `yaEsta()` en los extractos de banco con dos fechas; se aplica a este origen. Sin cambios en la lógica de «Ya está» salvo habilitar esa tolerancia para `fmt:"archivo"`.
6. **Aviso siempre**: `leerConAviso()` ya devuelve error o resultado; se asegura que ningún camino termine sin aviso ni revisión (incluidas excepciones fuera de `ErrLectura`), y el aviso de «sin movimientos» se mantiene visible mientras la persona lo necesite (se alarga de 4 s a 6 s). El texto «Leyendo la foto…» pasa a «Leyendo N fotos…» con N ≥ 2.
7. **Adjuntos**: cada captura se guarda como adjunto de la cuenta, con el mes del último movimiento, igual que hoy con un archivo importado. Las capturas no entran en la copia de seguridad (como todo adjunto).
8. **Cuenta**: las capturas no traen número de cuenta, así que `ref` es `null`; la primera vez la persona elige la cuenta, como con cualquier archivo sin referencia. Se mantiene.
9. **Signo**: importes con «−» son gastos y sin signo son ingresos, mezclados en la misma captura. Si todos fueran positivos, se mantiene la pregunta actual.

## Datos y migración

`datos: sin-cambios`. No se agregan campos a `S`, no se toca `finanzas-v1` ni `norm()`. Los movimientos guardados tienen la misma forma que los de cualquier importación.

## Implementación en `index.html`

- `fechaDe()`: mes en letras. `lectorListaPorDia()` junto a `lectorGenerico()`. `leerArchivo()` lo prueba antes en foto, PDF escaneado y texto.
- `importarArchivo()` pasa a recibir una lista de archivos; con uno, el camino de hoy. Nueva función que une capturas y quita el solape.
- `#pdfIn`: atributo `multiple`; `abrirRevision()` recibe varios archivos para adjuntar.
- `MSG_LECTURA`: «Elegí varias fotos o un solo archivo.».
- Versión de `CACHE` en `sw.js`: sumar uno. No hay ficheros nuevos.

## Pruebas

Un test por escenario, en 390 px, claro y oscuro. Las capturas de prueba se generan con una imagen inventada dibujada en el propio test (descripciones genéricas, importes redondos), nunca las de `inbox/`.
