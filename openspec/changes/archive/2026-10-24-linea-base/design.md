# Diseño: linea-base

## Decisiones (2026-10-24)

- **Se especifica lo que hay, no lo que debería haber.** Los textos de la interfaz se citan tal cual
  aparecen hoy. Si algo parece un error (por ejemplo, que «Por categoría» sume también los gastos
  reembolsables), se documenta como está y se marca abajo para un cambio propio.
- **Fecha fija en los escenarios**: hoy es 2026-10-15. Los tests fijan esa fecha (`tests/ayuda.cjs`)
  para que los meses del plan y de las financiaciones sean previsibles.
- **Datos de ejemplo inventados** («Banco A», «Broker X»), porque el repo es público.
- **Formato de importes**: la app usa el formato español sin separador de miles en cifras de cuatro
  dígitos («1200 €», «12,5 €»). Los escenarios lo citan así.
- **Tests con Playwright** sobre la app real servida en local, a 390 × 844, en claro salvo los
  escenarios de modo oscuro. El service worker se bloquea salvo en el escenario sin conexión.

## Descartado

- Tests unitarios de funciones sueltas: la lógica vive dentro de `index.html` y sacarla a módulos
  cambiaría la estructura de la app sin necesidad. Los escenarios se prueban desde la interfaz.
- Escribir la especificación viva a mano: rompería la regla de que sólo `/sdd:archive` la escribe.

## Para cambios futuros (detectado al escribir esto)

- «Por categoría» y el total del mes incluyen los gastos reembolsables; los topes no.
- El resumen para copiar no excluye los reembolsables de Tarjeta y Revolut, la pantalla de Inicio sí.
- Con el importe vacío, el gasto no se guarda por la validación propia del navegador (su aviso, en
  el idioma del teléfono), no por el aviso de la app. Con 0 sí sale «Poné un importe mayor que 0».
  Lo destapó el test al construir este cambio (2026-10-24); la spec se corrigió para describirlo.
- Los gastos sólo admiten tres cuentas fijas; las cuentas de la pestaña Cuentas no se usan al cargar
  un gasto.
