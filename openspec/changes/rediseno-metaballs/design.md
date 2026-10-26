# Diseño: rediseno-metaballs

## Replanteo del 2026-10-26 (Gate 3)

La persona vio la app con las cuatro paletas bajo el fondo de manchas y dijo que había «mucha mezcla de colores»: pidió
replantear todo con los colores de Paper (las capturas: azul oscuro #102F84, violeta/gris #2A273F, negro). Decidido:
**una sola paleta Paper** (descartadas: sumarla como quinta paleta, y mantener las cuatro con tarjetas neutras).

- **Oscura por defecto** otra vez (Paper es oscuro), con Clara y Automática. Se retira lo del Gate 3 anterior (clara por
  defecto, fondo tintado por paleta, tarjetas teñidas): ya no hay paletas que teñir.
- **Fondo oscuro:** azul casi negro (~#0A0B1E). **Manchas:** #102F84, un azul vivo (~#2A4BD7), un violeta (~#5B3FB5),
  índigo #2A273F y un azul petróleo; nada cálido.
- **Más galáctico (Gate 2, 2026-10-26):** manchas más intensas (azul #1E3FD0, violeta #5B3FD6, púrpura #8B3FD6, azul #2A6FD6, índigo #4F46E5: tonos cercanos entre sí, sin saltos de color, por pedido de la persona); las 19 categorías pasan a una gama continua de azules, índigos, violetas y púrpuras (más un turquesa y un magenta), distinguibles por tono y luminosidad, estrellas (dos capas de puntos con CSS que titilan sólo con opacidad; fuera en la clara) y un brillo leve en el borde de las tarjetas.
- **Clara (rehecha en el Gate 2):** azul hielo (#E4EEFF) con manchas frías (azul, índigo, cian, lila y turquesa, a .55), estrellas azules y tarjetas blancas al 70 % con borde y sombra violeta suaves (sin `backdrop-filter`).
- **Tarjetas neutras:** superficie translúcida oscura / blanca. Se retiran las clases de color de tarjeta (`.card.color`,
  `.p-*`, `COLOR`/`tipoOsc()` por tipo de cuenta): el tipo de cuenta se marca en su icono y las categorías en icono y
  borde. El patrimonio, el disponible y la conciliación pasan a tarjeta neutra con acento.
- **Categorías:** siguen siendo 19 colores fijos (`--cat1`…`--cat19`, `NUM_CAT`), ahora en una gama fría (azules,
  violetas, turquesas) con dos o tres cálidos para que la torta se distinga; los valores finales se fijan al construir y
  se comprueban (distintos entre sí, 4,5 a 1 del texto sobre la tarjeta en las dos apariencias).
- **Semánticos** (aviso, error, ingreso): se mantienen, ajustados al fondo azul.
- **Datos:** `settings.paleta` ya no se usa; no se borra ni migra (una copia que la traiga se restaura igual y la clave
  puede viajar sin efecto). Sin cambio de `v` ni de clave.
- **Qué se tira:** los bloques `[data-paleta=…]` (claros y oscuros), `PALETAS`, `aplicarPaleta()` y la tarjeta de Ajustes;
  los tests de paleta se reescriben para una sola.
- Sube `CACHE`. El preview se rehace con el nuevo diseño (Gate 2 otra vez).

Lo que sigue abajo es la decisión original del mecanismo (apariencia, fondo, movimiento), que se mantiene.

## Decisiones de la persona (2026-10-26)

- **Oscura con opción de claro** (descartadas: siempre oscura con paletas como colores del efecto, y
  seguir al teléfono como hoy).
- **Revisión en el Gate 3 (2026-10-26):** el negro casi puro chocaba con las paletas elegidas. Cambia: la apariencia
  por defecto pasa a **Clara**, y el fondo de la oscura es un tono muy oscuro del color de cada paleta (burdeos en Viva,
  verde en Editorial, violeta en Lima, marrón cálido en Pastel). En oscura, las tarjetas de color pasan a ser una mezcla del color con el fondo (texto claro) en vez de color pleno. Las manchas y el diseño no cambian.
- **Fondo detrás de toda la app** (descartadas: sólo en tarjetas destacadas, y sólo en Inicio).
- **Con CSS, degradados difuminados** (descartadas: shader de gráficos 3D propio, y copiar la librería de Paper en
  `vendor/`, que es una dependencia nueva cuya licencia y peso no se pudieron verificar).
- **Se mueve despacio y se detiene cuando conviene** (descartadas: siempre quieto, y sólo en Inicio).

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- **Apariencia ≠ paleta.** La paleta sigue eligiendo los colores (ahora también los de las manchas y los acentos);
  la apariencia elige oscuro o claro. Opciones: Oscura, Clara, Automática. Sin elección, Oscura.
- **Quien ya usaba la app** y no eligió apariencia pasa a ver Oscura, aunque su teléfono esté en claro: es el rediseño
  que se pidió. Puede volver a Clara o dejar Automática.
- **Claro con manchas más suaves:** el efecto también está en la apariencia clara, con menos intensidad, para no
  perder el aire del rediseño sin perder legibilidad.
- **Legibilidad primero:** las tarjetas llevan fondo casi opaco; las tarjetas de color mantienen colores sólidos y el
  texto blanco u oscuro que ya tienen. El contraste de 4,5 a 1 sigue siendo obligatorio en las cuatro paletas, en las
  dos apariencias.
- **Una sola capa de manchas** (cinco manchas): suficientes para el efecto y con costo bajo en un iPhone. Sin
  `backdrop-filter`, que es caro.
- **Movimiento:** sólo transformaciones (se mueven, no se redibujan). Se detiene con «Reducir movimiento» y cuando la
  pestaña no está visible.
- **Barra del sistema:** el color de la barra de estado de la app instalada acompaña a la apariencia elegida.

## Cómo se implementa en index.html

- `settings.apariencia?: "oscura"|"clara"|"auto"`; ausente o inválido = `"clara"`. `norm()` no cambia: el valor se
  interpreta al usarlo, así que lo guardado y las copias viejas siguen valiendo. Sin tocar `v` ni la clave de
  `localStorage`.
- `<html data-apariencia="oscura|clara">` (resuelto; con `auto` sigue a `matchMedia("(prefers-color-scheme: dark)")`
  y escucha los cambios). Un pequeño script en el `<head>` lo pone antes de pintar, leyendo `finanzas-v1`, para evitar
  el destello; con `try/catch`.
- Hoy las variables oscuras de cada paleta viven en bloques `@media (prefers-color-scheme: dark)`; pasan a
  selectores `[data-apariencia="oscura"]`. Variables nuevas por paleta y apariencia: `--fondo-base`, `--mancha1` a
  `--mancha5`, `--surface` (con transparencia leve) y sus contrastes.
- Capa `<div class="fondo" aria-hidden="true">` con cinco `<i>`: `position:fixed`, degradados radiales difuminados
  con `filter:blur()`, `animation` lenta sólo con `transform`; `@media (prefers-reduced-motion: reduce)` la quita;
  `visibilitychange` pone `animation-play-state:paused`.
- Meta `theme-color` y estilo de la barra de estado se actualizan con la apariencia.
- Todo lo que hoy asume «el fondo es gris claro» (tarjetas blancas, el preview, las capturas y los tests de contraste)
  se actualiza. Los tests que fijaban el modo con el esquema de color del navegador pasan a fijar la apariencia.
- Sube la versión de `CACHE` en `sw.js`.
