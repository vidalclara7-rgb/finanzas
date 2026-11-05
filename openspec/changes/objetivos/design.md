# Diseño: objetivos

## Decisiones (con la persona, 2026-11-05)

- **Varios objetivos; el fondo pasa a ser uno más** (se descarta que convivan: quedarían dos formas de hacer lo mismo). Eso obliga a migrar
  el plan del fondo de `settings` a un objetivo, sin perder nada.
- **Progreso = saldo de la cuenta destino** (`valorCuenta()`); no por transferencias ni a mano. Es lo que ya cuadra con la conciliación. Si
  dos objetivos apuntan a la misma cuenta, cada uno ve el saldo entero: es lo que la persona elige.
- **Recordatorios sin servidor:** tarjeta en Inicio + archivo de calendario (.ics). Se descartan «sólo en la app» (sólo se ve si se abre) y
  push (necesita backend: CLAUDE.md, «Qué no trae este flujo»).
- **Dónde:** «Objetivos» en el panel de análisis (que ya existe), tarjeta en Inicio y estado en Cierre. Se descarta «sólo en Ajustes».
- **Qué es «Toca transferir»:** para cada objetivo con cuenta destino, si hoy es el día elegido o después y el saldo de la cuenta está por
  debajo del plan de este mes, la tarjeta dice cuánto falta (plan del mes menos saldo). Atrasos de meses anteriores suman: el plan es
  acumulado. Un objetivo que ya llegó a su monto no avisa.
- **Fecha límite opcional**, sólo informativa: se compara con el mes en que el plan llega al monto («Llegás a tiempo» o «Llegás N meses
  tarde»). No cambia el aporte.
- **Día del mes** de 1 a 28 (por defecto 1): evita meses cortos.
- **Cuenta destino:** cuentas de bancos (`liquidez`) e inversiones (`inversion`). Una deuda no es un destino de ahorro.
- La casilla «Es mi fondo de emergencia» de la cuenta se conserva; sólo la usa la migración para saber a qué cuenta apuntar.

## Modelo de datos

`objetivos: [{id, nombre, monto, cuenta, aporte, inicio:"AAAA-MM", dia?:1..28, saltos?:"AAAA-MM, ...", limite?:"AAAA-MM"}]`.
`cuenta` es el id de la cuenta destino, o `null` si no hay (o se borró).

## Migración (`objetivosNorm()` en `norm()`, al cargar y al restaurar una copia)

- Si `objetivos` ya es una lista: se queda con los válidos (nombre no vacío, monto y aporte mayores que 0, `inicio` con formato AAAA-MM,
  ids únicos), pone `dia` en 1 si falta o no es válido, descarta de `saltos` lo que no sea AAAA-MM y `limite` si no es AAAA-MM, y
  pone `cuenta: null` si la cuenta no existe o no es de bancos ni de inversión.
- Si `objetivos` no existe: si `settings` trae `aporte` > 0, `objetivoFondo` > 0 e `inicio` con formato, crea un objetivo
  «Fondo de emergencia» con esos datos (`dia: 1`, mismos `saltos`) y por cuenta la marcada como fondo (o `null`). Si no, lista vacía.
- **Los campos viejos de `settings` no se borran** (`aporte`, `objetivoFondo`, `inicio`, `saltos`): una copia hecha con la versión nueva
  los lleva igual y una app vieja que la lea sigue funcionando. La app nueva ya no los lee ni los escribe, salvo para migrar.
- Idempotente: con `objetivos` presente no vuelve a migrar. Una copia vieja (sin `objetivos`) se migra al restaurarla.
- El orden en `norm()`: después de crear la cuenta «Fondo de emergencia» de los datos de la primera versión, para que apunte a ella.

## Cómo se implementa en index.html

- Cálculo: `planDe(o)` (la cuenta de `planMap()` con los datos del objetivo; sirve a `planMap()` actual), `saldoObjetivoEn(o, k)` (el saldo de la
  cuenta destino al cierre del mes k; para el objetivo del fondo conserva lo anotado a mano en `meses[k].fondo` si la cuenta es posterior),
  `estadoObjetivo(o, k)` («En plan»/«Atrasado X»/«Pendiente»/«Sin dato»), `pendientesTransferir()` (para Inicio) y `llegaA(o)` (mes en que el
  plan llega al monto).
- Pantallas: entrada `#panelObj` en el panel; hojas `#sheetObj` (lista) y `#sheetObjEd` (formulario + plan mes a mes, «Agregar al calendario»,
  «Borrar objetivo» en dos toques); tarjeta `#objCard` en Inicio (sólo si hay pendientes); tarjeta «Objetivos» en Cierre en lugar de `#plan`;
  se quita la tarjeta del plan de Ajustes y `#guardarAjustes`. `copiarResumen` lista cada objetivo.
- Calendario: `icsObjetivo(o)` arma un VEVENT mensual (`RRULE:FREQ=MONTHLY;BYMONTHDAY=<dia>;COUNT=<n>`, `EXDATE` para los meses sin aporte, alarma
  a la hora del evento, texto escapado) y se entrega por la hoja de compartir o la descarga, como la copia de seguridad.
- Todo lo que escribe la persona (nombre) se pinta con `esc()`.
- Sube la versión de `CACHE`. Se reescribe `tests/fondo.test.cjs` como tests de objetivos y se ajusta lo de Ajustes en `tests/interfaz.test.cjs`.
