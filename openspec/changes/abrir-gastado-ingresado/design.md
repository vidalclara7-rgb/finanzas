# Diseño: abrir «Gastado» e «Ingresado»

Fecha: 2026-11-22. Origen: la persona pidió que «Gastado» e «Ingresado» tengan el título en negrita, el tamaño de «Por cobrar» y que se puedan abrir.

## Decisiones

| Tema | Decisión | Descartado |
|---|---|---|
| Forma | Ancho completo, una debajo de otra, como «Por cobrar» (título 20 px en 700, importe 28 px, «Ver») | Lado a lado con la letra de «Por cobrar»: los importes de cinco cifras quedan justos en 390 px |
| Qué abre «Gastado» | La hoja «Gasto por categoría» existente | Lista plana de gastos (elegido por la persona: por categoría) |
| Qué abre «Ingresado» | Hoja nueva «Ingresos por categoría» con la misma pila de tarjetas | Lista plana de ingresos |
| Totales que no coinciden | La hoja muestra el mismo total que la tarjeta; lo reembolsable («Trabajo (reembolsable)», «Reembolso») va al final con «No suma en …» | Esconderlo (la persona no sabría dónde quedó) o sumarlo (el total no coincidiría con la tarjeta) |
| Color de ingresos | Todas las categorías de ingreso con el color 7 (el de «Ingresado») | Colores por categoría de ingreso: necesita datos nuevos |
| Ícono de ingresos | El de siempre por nombre si existe en `ICONO_BASE`, si no `entra` | La inicial |

## Implementación en `index.html`

- Inicio: el `grid2` `data-ui="gastado-ingresado"` pasa a dos `.card.par` de ancho completo con `.row` (`.lbl` título + `.btn.sec` «Ver»: `#verGas`, `#verIng`) y `.big` (`#miniGas`, `#miniIng`); toda la tarjeta abre. `data-ui` nuevos: `tarjeta-gastado`, `tarjeta-ingresado`.
- `pintarPila()`: el subtítulo suma sin `REEMB`; la tarjeta de `REEMB` va última y lleva el chip «No suma en Gastado»; su porcentaje no se calcula sobre el total (no lleva %).
- Hoja nueva `#sheetPilaI` (`data-pantalla="ingreso-categorias"`), `abrirPilaI(mes)`, `pintarPilaI()`: misma marcación `.sc` con `--cat7*`; «Reembolso» al final con «No suma en Ingresado». Se agrega a `HOJAS`.
- Hoja de categoría: `catTipo` ("gasto" | "ingreso"); `movsCat(c, mes, tipo)` generaliza `gastosCat()`; textos «No gastaste…/No entró nada de…», «En septiembre no gastaste en X» / «En septiembre no entró nada de X», «Gastos, de mayor a menor» / «Ingresos, de mayor a menor». `volverPila` guarda también el tipo para volver a la pila correcta.
- `sw.js`: `CACHE` a `finanzas-v55`.
- Tests: `tests/gastado-ingresado.test.cjs`, uno por escenario; `estilo.test.cjs` ya cubre negrita, contraste y que nada se pise en Inicio.
