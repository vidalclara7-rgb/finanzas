---
cambio: proyeccion-y-panel
estado: aprobada
datos: sin-cambios
---
# Proyección a 12 meses y panel de análisis

## Por qué

Hoy la app muestra lo que se paga en cuotas este mes, pero no cómo se ve el año que viene: cuándo se liberan las cuotas, cuánto
queda libre cada mes si el ingreso sigue igual. La persona quiere ver ese futuro con lo que ya tiene comprometido, y quiere un
lugar donde sumar más análisis (inversiones y, más adelante, un radar de noticias) sin recargar la barra inferior.

## Qué cambia

- Un **panel izquierdo** («Análisis») que se abre con un botón «≡» a la izquierda del encabezado, en todas las pantallas. Tiene tres
  entradas: **Forecast** (la proyección nueva), **Inversiones** (abre el rendimiento que ya existe) y **Radar de noticias**
  (deshabilitada, con el rótulo «Próximamente»).
- La hoja **Forecast**: una proyección de los próximos 12 meses con el ingreso constante. Para cada mes muestra el ingreso, lo
  comprometido (gastos fijos y cuotas) y lo que queda libre, con un gráfico de barras de comprometido contra ingreso.
  - **Ingreso constante**: el promedio de los últimos meses cerrados (hasta tres) en que entró algo, sin contar reembolsos. Se
    puede cambiar el monto en la hoja para probar otro escenario; no se guarda.
  - **Gastos fijos**: los gastos marcados como fijos del último mes cerrado, al mismo valor todos los meses.
  - **Cuotas**: las de las financiaciones y las compras en cuotas de tarjeta que hay hoy, mes por mes hasta que terminan.
- Las barras de abajo no cambian.

## A quién afecta

A cualquier persona que use la app: aparece el botón «≡» en el encabezado. Lo que ya tiene guardado no cambia ni se migra.

## Pantallas

Encabezado (botón «≡»), panel de análisis, hoja Forecast. Inversiones usa la hoja que ya existe.

## Fuera de alcance

- El **radar de noticias**: necesita bajar datos de internet, algo que la app no hace hoy (no tiene backend ni carga nada de otros
  sitios). Es una conversación de arquitectura aparte; aquí sólo queda su lugar, deshabilitado.
- Gastos variables, subidas de ingreso, inflación o intereses en la proyección. Sólo lo que ya está comprometido.
- Guardar el escenario o el ingreso que la persona pruebe en la hoja.
- Proyectar el patrimonio o las inversiones.
