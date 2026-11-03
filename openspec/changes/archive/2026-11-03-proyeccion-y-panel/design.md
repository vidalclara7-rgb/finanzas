# Diseño: proyeccion-y-panel

## Decisiones (con la persona, 2026-11-03)

- **Panel izquierdo, no una pestaña más.** La barra inferior ya tiene cuatro pestañas y el «+»; una quinta aprieta a 390 px. La
  persona quiere un lugar que crezca (inversiones, radar de noticias, forecast), y un panel lateral lo permite. Se descartan la
  tarjeta en Inicio (no escala a más análisis) y una sección dentro de Cierre (queda escondida).
- **Contenido ahora:** Forecast, Inversiones (atajo al rendimiento que ya existe) y Radar de noticias deshabilitado con
  «Próximamente». El radar no se construye: necesita internet y la app no carga nada de otros sitios (CLAUDE.md, «Qué no trae este
  flujo»). Se descarta dejar el panel con sólo Forecast: no enseña el rumbo.
- **Botón «≡» a la izquierda del encabezado, en todas las pantallas.** Se descartan «sólo en Inicio» (el panel dejaría de estar a
  mano) y deslizar desde el borde (no se descubre y choca con el gesto de volver de iOS).
- **Ingreso constante = promedio de hasta tres meses cerrados** (los tres anteriores al actual) en que entró algo. Cuenta el
  gasto de tipo ingreso salvo la categoría «Reembolso» (plata que se devuelve, no es sueldo). Un mes sin ingresos no entra al
  promedio (no lo baja a 0). Se descartan el último mes solo (un mes raro lo distorsiona todo) y un monto guardado (agrega un dato).
  - Se puede escribir otro monto en la hoja para probar un escenario. **No se guarda**: al cerrar vuelve al promedio. Por eso
    `datos: sin-cambios`.
- **Qué entra:** cuotas y gastos fijos. Lo variable queda fuera: es la parte que la persona decide, y la proyección responde a
  «cuánto tengo comprometido».
  - **Gastos fijos**: los gastos con `esFijo()` del último mes cerrado (el mes anterior al actual), agrupados y sumados; se repiten
    al mismo valor los 12 meses. Se excluyen las compras en cuotas (ya entran por las cuotas) y «Trabajo (reembolsable)». Si el
    mes anterior no tiene gastos fijos, no hay fijos que proyectar.
  - **Cuotas**: `cuotasDelMes(mes)` para cada mes: financiaciones con cuota (una sin fin cuenta todos los meses) y compras en cuotas
    hasta su última cuota. Las cuotas que faltan bajan solas mes a mes, como en «Cuotas del mes».
- **Horizonte: 12 meses a partir del mes que viene.** Se descartan 6 meses (no alcanza a ver terminar las cuotas largas) y «hasta
  que terminen» (largo o infinito con una financiación sin fin).
- **Libre = ingreso − fijos − cuotas** de cada mes. Si da negativo, el mes se marca en rojo (como un mes de gasto mayor que el
  ingreso en «Ingresos y gastos»).

## Cómo se implementa en index.html

- Sin datos nuevos: `datos: sin-cambios`. Sube la versión de `CACHE`.
- Cálculo, sin estado propio: `ingresoPromedio()` (tres meses anteriores a `mesId()`, `sumaTipo` de `movsMes`, menos «Reembolso»),
  `fijosBase()` (gastos `esFijo` y sin `cuotas` del mes anterior), `proyeccion(ingreso)` (12 filas con `cuotasDelMes(mesSig(mesId(), i))`).
- Encabezado: `#menuBtn` («≡», `data-ui="boton-menu"`) antes del logo/título, visible en todas las vistas.
- Panel: `#panel` (cajón fijo a la izquierda) y `#panelBg` (fondo que cierra al tocar). Entradas `#panelFore`, `#panelInv`,
  `#panelRadar` (`disabled`, «Próximamente»). Se cierra al elegir una entrada, al tocar el fondo o con Escape.
- Hoja Forecast: `#sheetFore` (se suma a `HOJAS`) con el campo `#foreIng`, las barras `#foreBarras` y la lista `#foreLista`. Barras
  dibujadas por la app (HTML), sin librerías.
- Inversiones: el panel llama a `abrirInv()`; sin cuentas de inversión avisa «No tenés cuentas de inversión. Agregá una en Cuentas.»
  y no abre la hoja.
- Todo lo que escribe la persona (nombres) se pinta con `esc()`.
