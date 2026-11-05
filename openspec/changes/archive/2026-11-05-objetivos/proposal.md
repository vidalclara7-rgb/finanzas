---
cambio: objetivos
estado: archivado
datos: migra
archivado: 2026-11-05
---
# Objetivos de ahorro con recordatorio de transferencia

## Por qué

La app sólo tiene un objetivo: el plan del fondo de emergencia, escondido en Ajustes (aporte, objetivo, mes de inicio) y visible en
Cierre. La persona esperaba ver sus objetivos y que la app le avisara cuándo transferir, pero hoy **la app no avisa de nada**: sólo
hay una casilla «Transferir X al fondo» en el checklist de Cierre, que se marca a mano. Tampoco hay forma de tener más de un objetivo
(vacaciones, una entrada, un viaje).

## Qué cambia

- **Varios objetivos de ahorro.** Cada uno tiene nombre, monto, cuenta destino, aporte mensual, mes del primer aporte, día del mes en que
  toca transferir (por defecto el 1), meses sin aporte (opcional) y fecha límite (opcional).
- **El fondo de emergencia pasa a ser un objetivo más.** El plan que hoy se carga en Ajustes se convierte, sin perder nada, en un objetivo
  «Fondo de emergencia». La tarjeta «Plan del fondo de emergencia» de Ajustes desaparece.
- **Progreso por el saldo de la cuenta destino**: lo que ya calcula la app y cuadra con la conciliación.
- **Plan mes a mes** (como el del fondo): lo que debería haber acumulado cada mes, con su estado («En plan», «Atrasado X €»,
  «Pendiente», «Sin dato»). Si hay fecha límite, dice si llegás a tiempo o cuántos meses tarde.
- **Recordatorios, sin servidor:**
  - una tarjeta en Inicio, «Toca transferir», con lo que falta transferir a cada cuenta para estar en plan, desde el día elegido del mes;
  - un botón que baja un archivo de calendario (.ics) con un recordatorio mensual: el Calendario del teléfono sí avisa.
- **Dónde:** entrada «Objetivos» en el panel de análisis (con la lista y su edición), tarjeta en Inicio y el estado de cada objetivo en Cierre.

## A quién afecta

A todas las personas que usan la app. Quien ya tiene cargado el plan del fondo lo encuentra convertido en un objetivo. Quien no lo tenía
no ve cambios de datos. En Ajustes ya no está el plan del fondo.

## Pantallas

Panel de análisis (nueva entrada), hoja «Objetivos» (lista), hoja de edición de un objetivo (con el plan mes a mes), tarjeta «Toca
transferir» en Inicio, tarjeta «Objetivos» en Cierre (en lugar de «Plan del fondo») y Ajustes (sin el plan del fondo).

## Fuera de alcance

- **Notificaciones push al teléfono.** Necesitan un servidor que las envíe: es una conversación de arquitectura aparte. El
  calendario .ics es la forma de que el teléfono avise.
- Medir el progreso por transferencias o a mano: sólo cuenta el saldo de la cuenta destino. Si dos objetivos comparten cuenta, cada uno ve
  el saldo entero de esa cuenta.
- Hacer la transferencia desde la app ni elegir una cuenta de origen.
- Cambiar el diseño de la app (la persona lo hace después, aparte).
- Quitar la casilla «Es mi fondo de emergencia» de las cuentas: se conserva (la migración la usa).
