# Diseño: estilo-blanco-y-graficos

## Decisiones de la persona (2026-10-24)

- Misma letra en los títulos que en el resto.
- Fondo blanco con los colores de la referencia (negro, verde lima, lavanda), sin los pasteles.
- Gráficos: torta por categoría, anillo del tope, barras de gasto por día o semana, barras de
  ingresos contra gastos por mes. Los dos que dependen de ingresos y de topes por cuenta van en
  movimientos-y-conciliacion.

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- **Barras por semana, no por día**: en 390 px, 31 barras quedan de 8 px y no se leen. Semanas del
  mes: 1–7, 8–14, 15–21, 22–28 y 29 a fin de mes.
- **Torta como anillo** (dona) con el total del mes en el centro, como el 72 % de la referencia.
  Cada categoría tiene su color fijo, y la lista de categorías debajo lleva el mismo color.
- **Paleta**: blanco de fondo; negro para la tarjeta principal (disponible) y la barra de
  navegación; verde lima como acento principal (anillo, barra de la semana actual, botón «+»);
  lavanda como acento secundario. Las tarjetas de grupos en Cuentas pasan a blanco con un punto de
  color por tipo.
- **Modo oscuro**: fondo casi negro, tarjetas gris oscuro, los mismos acentos.

## Cómo se implementa en index.html

- Gráficos en SVG dibujado por la propia app, sin librerías (la app no tiene dependencias).
- Variables de color nuevas en `:root` y en el modo oscuro; se quitan las clases `p-*` y `deco`.
- Se quitan la carga de Google Fonts y la variable de la letra con serifa.
- Sube la versión de la caché del service worker.

## Descartado

- Barras por día: ilegibles en el ancho de un iPhone.
- Una librería de gráficos: agregaría una dependencia externa y peso para tres gráficos simples.

## Ajuste al construir (2026-10-24)

- La especificación viva decía que el disponible tiene una barra que se marca en aviso y excedida.
  El preview aprobado en el Gate 2 reemplaza esa barra por el anillo, así que se sustituye el
  requisito «disponible del mes por cuenta» para que lo diga el anillo, con el mismo umbral del 75 %.
