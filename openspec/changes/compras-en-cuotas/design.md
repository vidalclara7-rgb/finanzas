# Diseño: compras-en-cuotas

## Decisiones de la persona (2026-10-26)

- Registrar la **compra con cuotas** y lo que toca este mes, no sólo la cuota suelta de cada mes.
  (Descartada: anotar a mano cada cuota como gasto, que deja la deuda sin el resto por pagar.)
- La **cuota la escribe la persona**, no se divide el total entre n: con intereses no coincidiría con
  el extracto. (Descartado: total / n.)
- No se pidió que el importador lo detecte: queda fuera de esta versión.

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- La cuota 1 cae en el mes de la fecha de la compra, y las siguientes en los meses consecutivos.
- La deuda de la tarjeta sube el importe total desde la fecha de la compra, como hoy.
- Las cuotas cuentan en el mes como un gasto en la categoría de la compra, para torta, topes y
  resultado del mes. «Disponible» de la tarjeta sigue calculándose con la deuda total.
- No se puede indicar un número de cuotas menor que 2 ni una cuota mayor que el total.
- Borrar la compra borra todas sus cuotas.
- Riesgo asumido: quien importe un extracto con «cuota fraccionar compra» y además anote la compra en
  cuotas contará la cuota dos veces. El aviso va en la hoja de importar, y el cambio posterior que
  automatice esto lo resolvería.

## Cómo se implementa en index.html

- `movs[i].cuotas?: {n, cuota}` sólo en gastos de cuentas tipo `tarjeta`. Ausente = como hoy.
- `valorCuenta()` no cambia: usa `importe` entero. Una función única `importeEnMes(m, mes)` devuelve
  `cuota` si el mes cae en [mes de `fecha`, +n-1] y `importe` en los demás gastos sin cuotas;
  todos los cálculos por mes (totales, `catsMes`, topes, resultado, `fijosVar`, `torta`, `barras`,
  `mesesIG`, resumen para copiar) pasan por ella.
- Ni `norm()` ni `localStorage` cambian: lo guardado sigue valiendo y las copias viejas no tienen
  `cuotas`. Sube la versión de `CACHE` en `sw.js`.
