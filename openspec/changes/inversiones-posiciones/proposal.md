---
cambio: inversiones-posiciones
estado: diseno-aprobado
datos: amplia
---
# Inversiones: compras, ventas y rendimiento por activo

## Por qué

Una cuenta de inversión hoy es un saldo que se concilia a mano, más un «total aportado» para ver la
ganancia. No se puede decir qué se compró, cuántas participaciones se tienen, a qué precio, ni cuánto
rinde cada cosa por separado.

## Qué cambia

- Dentro de una cuenta de inversión, la persona da de alta **activos** (un fondo, una acción, un ETF…)
  y registra **compras y ventas** con fecha, cantidad, precio y comisión opcional.
- El precio actual de cada activo se anota a mano; la app no consulta cotizaciones.
- El valor de la cuenta pasa a ser el efectivo que queda más lo que valen las posiciones (cantidad por
  precio actual). Lo que no tiene activos sigue como hoy.
- **Rendimiento** de cada activo y de la cuenta, en euros y en porcentaje.
- Compras y ventas no son gasto ni ingreso: no tocan el resultado del mes.
- Se abre desde **Cuentas**, en el grupo de inversiones, con un botón «Ver rendimiento».

## A quién afecta

A quienes tienen cuentas de inversión. Las que ya existen siguen como hoy mientras no se les cargue un
activo: sin sorpresas en el patrimonio.

## Pantallas

- Cuentas: botón «Ver rendimiento» en el grupo de inversiones.
- Hoja «Inversiones»: activos con cantidad, valor y rendimiento; «Nuevo activo», «Nueva operación»,
  «Actualizar precio» e historial de operaciones.

## Fuera de alcance

- Cotizaciones automáticas, histórico de precios o gráfico de evolución del precio.
- Dividendos, intereses y splits (se anotan como ingreso en la categoría «Intereses y rendimientos»).
- Operaciones en monedas distintas del euro.
- Un método de costo promedio o FIFO: el rendimiento es el de caja (ver design.md).
- Un sexto botón en la barra de navegación.
