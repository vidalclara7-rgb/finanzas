# Diseño: sistema-de-diseno

## Decisiones (con la persona, 2026-11-05)

- **Se adopta todo el sistema**: paleta, tipografía, tarjetas de vidrio, borde cónico, fondo fluido y botón con pulso. Se descartan «todo menos el fondo animado» y «sólo paleta y
  tipografía». Esto reemplaza los requisitos de «tarjetas de color sólido, sin degradados» y «fondo de manchas».
- **Archivo dentro del repo.** Se guarda en `vendor/archivo/` (variable, latín, licencia libre OFL con su texto) y se carga de ahí; va a `FILES` para que funcione sin conexión. Si el entorno no puede
  descargarla, la persona pasa el archivo. Se descarta la fuente del sistema en heavy.
- **Colores de la persona.** Los 19 colores de categoría son los de la paleta de gráficos (`ChartPalette`) de su sistema, con versión clara y oscura; las marcas de tipo de cuenta usan los principales (violeta, cielo, coral, lavanda, lima). Se descartan los que yo había derivado.
  aprueban en el preview (una pantalla de muestras). Se descarta esperar una lista de la persona.
- **Una sola paleta**, con versión clara y oscura. Se descarta mantener Jardín y Brûlée como temas: más código y más pruebas.

- **Asignación fija por categoría** (decidido el 2026-11-05): el color de una categoría es el de su posición (1 a 19, el índice que ya guarda la persona al elegirlo). Se descarta el ranking por tamaño que sugiere el sistema: haría que «Alquiler» cambiara de color de un mes a otro.
- **Texto sobre cada color:** blanco, `#13131A` o negro, el que dé más contraste (siempre ≥ 4,5 a 1). Tres colores están en el borde y llevan negro: cielo (claro), índigo (oscuro) y esmeralda (claro). Los colores oscuros que casi no se ven sobre el fondo oscuro (verde profundo, azul marino, ciruela, grafito) llevan un filo fino, como sugiere el sistema.

## Tokens (del sistema, tal cual)

| Variable | Clara | Oscura |
|---|---|---|
| `--bg` | #F3F3F8 | #0B0B10 |
| `--surface` (vidrio) | #FFFFFF al 56 % | #28282F al 42 % |
| `--glass-tint` (destacada) | #FFFFFF al 36 % | #28282F al 30 % |
| `--line` | #13131A al 9 % | #FFFFFF al 8 % |
| `--ink` | #13131A | #F4F4F6 |
| `--ink-secondary` | #13131A al 64 % | #FFFFFF al 66 % |
| `--label` | #5B2BD1 | #C4A5F7 |
| `--accent` / `--on-accent` | #B2FF00 / #13131A | #B2FF00 / #13131A |
| `--positive` | #367300 | #B2FF00 |
| `--negative` | #C72543 | #F2546A |
| `--violet` / `--lavender` / `--sky` / `--ring-lime` | #6A35E8 / #A98AF0 / #0A8FD6 / #8CCB00 | #8450FC / #C4A5F7 / #1AAEFC / #B2FF00 |
| `--flow-silver` / `--flow-tint` | #9A9AAE / #8F7BEA | #9696A8 / #8F7FC4 |

Brillos de tendencia: positiva #569600 (clara) / #B2FF00 (oscura); negativa #C72543 / #F2546A; neutra #6A35E8 / #8450FC.

## Cómo se traduce cada pieza a la web

- **Tarjeta estándar** (`.card`): fondo `--surface`, `backdrop-filter: blur(24px)` con prefijo `-webkit-`, borde de 1 px `--line`, radio 24 px. Sin degradado.
- **Tarjeta destacada** (`.card.destacada`): `--glass-tint`, borde de 1,5 px con `conic-gradient` (lima, violeta, lima al 10 %, lima) que gira con una propiedad `@property --ang` animada 12 s por vuelta,
  y un foco `radial-gradient` del brillo de la tendencia que sigue el dedo (`pointerdown`/`pointermove`) y se apaga al soltar. Con «Reducir movimiento», el borde queda quieto. Sin vibración (no existe en iPhone web).
- **Fondo fluido** (`.fondo`): tres lóbulos (círculos) que se mueven con las mismas fórmulas del sistema (seno y coseno de cada lóbulo), un filtro SVG `feGaussianBlur` + `feColorMatrix` (umbral) que los funde en una masa, relleno
  con el degradado plata → tinte → brillo de tendencia al 55 %, un cuerpo desenfocado 16 px y un halo desenfocado 46 px. A 30 fps como máximo. Se pausa con la app oculta o con «Reducir movimiento» (queda quieto en t = 0).
  - **Riesgo:** los filtros SVG animados pesan en un iPhone. Se mide al construir; si el costo es alto, se cambia por tres degradados radiales animados (sin el efecto de masa) y se avisa a la persona. No se cambia en silencio.
- **Botón principal** (`.btn`): píldora lima con texto `--on-accent`, sombra lima que pulsa 2,4 s (opacidad 0,2 → 0,55 y radio 10 → 22 px). El secundario es de vidrio. Con «Reducir movimiento», sin pulso.
- **Tendencia** de Inicio: resultado del mes que se ve (ingresos menos gastos): mayor que 0, positiva; menor que 0, negativa; igual a 0 o sin datos, neutra. La usan el fondo, la tarjeta destacada y el texto de variación.
- **Tipografía**: `--font-display` = Archivo (títulos de pantalla y de hojas, `.big`, `.monto`); `--font` (sistema) para el texto; `--font-num` (monoespaciada) para importes de listas, porcentajes y datos pequeños.
- **Tarjeta destacada**: el patrimonio neto de Cuentas y el resultado del mes de Inicio (a confirmar en el Gate 2).
- **Colores por tipo de cuenta** (`--k1` a `--k5`): pasan de ser el fondo de la tarjeta a ser un punto de color junto al título (el filo a la izquierda se descartó en el Gate 2). **Colores de categoría** (`--cat1` a `--cat19` y su texto `--cat1t` a `--cat19t`): por apariencia;
  la tarjeta de un gasto sigue siendo del color de su categoría y el ingreso usa `--ingreso` con su texto `--on-ingreso`.
- Se quitan `--mancha1` a `--mancha5`, `--velo`, las dos paletas y `.card.color` (sustituido por vidrio con un punto de color). `settings.paleta` de datos viejos sigue ignorándose.
- `theme-color` toma el `--bg` nuevo (la barra del sistema acompaña a la apariencia).

## Cómo se implementa

- Sin datos nuevos: `datos: sin-cambios`. Sube la versión de `CACHE`; `vendor/archivo/*` y su licencia van a `FILES`.
- CSS: se reemplaza el bloque de variables de `:root` y de `:root[data-apariencia="oscura"]`, `.card`, `.card.color`, `.btn`, `.fondo`, `.logo` y `.gear`. Se agrega `@font-face` de Archivo.
- JS: `tendenciaMes()` (positiva, negativa, neutra) en `render()`, `data-tendencia` en `<html>`, bucle del fondo (`requestAnimationFrame` a 30 fps, pausa con `visibilitychange` y `prefers-reduced-motion`),
  foco de la destacada. Todo lo que escribe la persona sigue pintándose con `esc()`.
- Tests: se reescriben los de apariencia (fondo y colores) y los de contraste de las tarjetas de color; se ajustan los de categorías que miran `--cat*`.
- La renovación pasa por el preview con una pantalla de muestras (colores de categoría y de tipo de cuenta) y todas las pantallas en claro y en oscuro.

## Cambios del Gate 2 (2026-11-05)

- Vidrio más translúcido que el del sistema (56 % y 42 % en vez de 78 % y 60 %; destacada 36 % y 30 %) y desenfoque de 24 px, a pedido de la persona; el contraste del texto se comprueba contra el peor caso del fondo.
- El filo de color a la izquierda de las tarjetas por tipo de cuenta se cambió por un punto de color junto al título.
