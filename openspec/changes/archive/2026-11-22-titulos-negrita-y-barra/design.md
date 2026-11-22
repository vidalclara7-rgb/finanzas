# Diseño: títulos en negrita y más aire en la barra inferior

Fecha: 2026-11-22. Origen: la persona probó la versión publicada del rediseño (PR #22).

## Decisiones

| Tema | Decisión | Descartado |
|---|---|---|
| Títulos | Peso 700 en `.card>.lbl:first-child`, `.card>.row:first-child>.lbl:first-child`, `.grupo-cta .lbl`, los `h2` de hojas y panel (ya en 700) | Agrandarlos |
| Barra inferior | Padding horizontal en los botones de la barra y columnas que reparten el ancho según el contenido, para que «Movimientos» entre con aire | Acortar el nombre a «Movs.» |

## Implementación en `index.html`

- `.lbl` sigue en 500 para etiquetas sueltas; los títulos de tarjeta suben a 700.
- `nav`: `grid-template-columns:repeat(2,auto) 56px repeat(2,auto)` con `justify-content:space-between`, botones con `padding:6px 10px` y `letter-spacing:-.01em` en el nombre; el `+` baja a 52 px.
- Test: mide el rectángulo del nombre contra el de la píldora activa en cada pestaña (≥ 6 px a cada lado) y el peso de los títulos.
- `sw.js`: `CACHE` a `finanzas-v54`.
