# Diseño: categorias-propias

## Decisiones de la persona (2026-10-26)

- Pantalla en **Ajustes más atajo en los selectores** (descartadas: sólo atajo, que no permite renombrar ni
  borrar; y sólo pantalla, que obliga a salir de lo que se está haciendo).
- Lo fijo con importe variable se resuelve con una categoría **«siempre fija»** (descartadas: sugerencia
  por nota sin límite de importe, que falla si la nota cambia cada mes; y las dos a la vez).

- **Categoría en un desplegable** (2026-10-26, a pedido de la persona al ver las categorías de siempre más las
  propias): un selector desplegable en lugar de los botones, porque la grilla queda muy cargada.

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- **Identidad por nombre.** Los movimientos guardan el nombre de la categoría, como hoy; renombrar
  reescribe lo que la usa. No se permiten nombres repetidos (sin distinguir mayúsculas ni espacios de más)
  ni vacíos ni con «|» (esa barra separa partes en lo fijo y en lo aprendido).
- **Categorías con comportamiento propio, no editables:** «Otros» (gasto e ingreso: es el destino al borrar),
  «Trabajo (reembolsable)» (estados de reembolso) y, en ingresos, «Reembolso» (cubre gastos).
- **Colores:** los 19 que ya existen de la paleta única (19), elegibles. Una categoría nueva recibe el primero
  libre y, si no queda ninguno, repite. Si el color es oscuro, el texto de la tarjeta es blanco (según el
  color, ya no según el nombre). Las categorías de ingreso no llevan color propio.
- **Siempre fija:** el gasto cuenta como fijo y la casilla «Gasto fijo» viene marcada; si la persona la
  desmarca en un gasto concreto, ese gasto queda variable (`fijo: false`). No se sugiere nada de estas
  categorías y los gastos anteriores cuentan como fijos al activarla (no se reescriben: se calcula).
- **Al borrar:** los movimientos pasan a «Otros»; lo aprendido para esa categoría y las reglas de fijos con
  su nombre se descartan (se volverían a proponer).
- **Al renombrar:** se reescriben movimientos, lo aprendido y las reglas de fijos.
- **El desplegable** es el selector del sistema (en iPhone, la rueda), como ya es el del importador. No muestra el
  color de cada categoría: el color se ve en la torta, la lista y las tarjetas. Orden: las de siempre, las nuevas,
  «Otros» y, al final, «Nueva categoría…». Al volver de crear una, queda elegida.
- **Orden:** las de siempre, luego las nuevas por orden de creación, y «Otros» al final.

## Cómo se implementa en index.html

- Nuevo en los datos: `categorias: {gasto:[{nombre, color, fija?}], ingreso:[{nombre}]}`. `norm()` lo crea con
  las listas de siempre y sus colores si falta, y agrega cualquier `cat` de un movimiento que no esté en la
  lista (así una copia vieja o rara no pierde información). Sin cambiar `v` ni la clave de `localStorage`.
- `CATS`, `INGRESOS`, `NUM_CAT` y `CATS_OSC` dejan de ser constantes y pasan a salir de `S.categorias`
  (`catsGasto()`, `catsIngreso()`, `colorCat()`, `osc()`); lo que hoy mira nombres sueltos (`REEMB`,
  «Reembolso», «Otros», «Regalos» al importar) sigue por nombre y se ignora si la categoría no existe.
- `esFijo(m)` = `m.fijo === true || (m.fijo !== false && categoría siempre fija)`; lo usan fijos y variables,
  la etiqueta «Fijo», la casilla de la hoja y el importador.
- La hoja de movimiento cambia `#segCat` (botones) por un `<select>` con las categorías y `"+ Nueva categoría…"`;
  al elegirla abre `sheetCat` y vuelve con la nueva elegida. Los tests que elegían la categoría por botón pasan a
  elegirla en el selector.
- Hojas nuevas `sheetCats` y `sheetCat` en `HOJAS`; textos de la persona con `esc()`.
- Sube la versión de `CACHE` en `sw.js`.
