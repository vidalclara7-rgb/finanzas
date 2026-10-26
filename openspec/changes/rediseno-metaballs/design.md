# Diseño: rediseno-metaballs

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
