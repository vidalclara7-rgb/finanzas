# Diseño: ver-por-meses-y-semanas

## Decisiones de la persona (2026-11-01)

- **Selector de mes en Inicio, Movimientos y Cierre**, uno solo para las tres (descartado: sólo Inicio y Cierre).
- **Movimientos por semana, y dentro por día**, con total por semana; «por día y por categoría» para entender cuándo se hizo cada
  gasto.

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- **Estado:** una variable `mesVista` en memoria (no se guarda), que arranca en el mes en curso cada vez que se abre la app.
  `mesId()` sigue siendo el mes de hoy; las pantallas Inicio, Movimientos y Cierre usan `mesV()`.
- **Qué sigue al mes elegido:** en Inicio, los totales y el resultado, el porcentaje de lo que entró, fijos y variables, el
  disponible de cada cuenta con tope, la torta y las categorías (y su hoja), las barras por semana, «Cuotas del mes» y los seis
  meses de ingresos y gastos (terminan en el mes elegido); el patrimonio neto, al cierre del mes (`totales(hasta)`,
  `fechaCierre(mes)`: el último día, u hoy en el mes en curso). En Cierre, la conciliación, el checklist («Día de cobro» de
  ese mes) y el plan del fondo. «Resumen para copiar» (Ajustes) y la sugerencia de gasto fijo, los avisos de copia y «Por
  cobrar» siguen siendo de hoy.
- **Barras por semana:** resaltan la semana de hoy sólo en el mes en curso.
- **Anotar:** el «+» y el formulario siguen usando la fecha de hoy. Un movimiento con fecha de otro mes se ve al cambiar a ese mes.
- **Semanas:** 1–7, 8–14, 15–21, 22–28 y 29–fin (las mismas de `barras()`), de la más reciente a la más antigua. El encabezado
  dice «Semana del 15 al 21» y los totales: gastos en «−», ingresos en «+» (sólo si hay). Una semana sin movimientos no aparece.
- **Días:** dentro de la semana, del más reciente al más antiguo: «Jueves 15» y el gasto del día. **Orden dentro del día:** por
  categoría (A–Z) para que las iguales queden juntas, y al final los ingresos, las transferencias y los ajustes; a igual
  categoría, el importe mayor primero.
- **Totales:** como los del mes: transferencias y ajustes no suman; los gastos reembolsables sí suman en Movimientos (igual que
  hoy). Las compras en cuotas cuentan su cuota del mes.
- **Fila:** pierde la fecha corta (la dice el día). En la búsqueda y en la lista de una cuenta se mantiene, porque no tienen días.
- **Filtros y modo seleccionar** (reembolsos, «Con documento») siguen funcionando dentro de los grupos.
- **Sin datos nuevos.** Sube la versión de `CACHE`.

## Cómo se implementa en index.html

- `mesVista` y `mesV()`; en `render()` los `mesId()` de Inicio, Movimientos y Cierre pasan a `mesV()`; `totales(hasta)`.
- Selector `.mesnav` en el encabezado (visible en `inicio`, `movs` y `mes`; en las demás, el nombre del mes sin flechas).
- `agruparSemanas(lista)` devuelve semanas → días → movimientos y `movHTML()` acepta `sinFecha`.
- Los tests que daban por hecho el mes en curso siguen valiendo (el mes elegido es el mes en curso).
