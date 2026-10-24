---
cambio: linea-base
estado: propuesta
datos: sin-cambios
preview: no
---
# Línea base: lo que Mis finanzas hace hoy

## Por qué

La app creció sin especificación: lo que hace está sólo en el código. Para desarrollar con SDD, cada
cambio tiene que construirse sobre algo escrito y comprobado. Este cambio no agrega nada: describe
el comportamiento actual (incluida la pestaña Cuentas y el estilo nuevo, todavía sin publicar) y lo
ata a tests en el navegador, para que un cambio futuro no rompa nada sin que salte una alarma.

## Qué cambia

- Nada en la app ni en los datos de nadie.
- Se escriben siete capacidades: gastos, presupuesto, fondo, cierre-mes, cuentas, datos e interfaz.
- Al construirlo (`/sdd:apply`) se escribe un test por escenario. Si un test destapa un error de la
  app, no se corrige aquí: se anota y va a un cambio propio.

## A quién afecta

A nadie que use la app: no hay cambio visible. Afecta a cómo se trabaja: desde aquí, todo cambio pasa
por propuesta, preview y tests.

## Pantallas

Ninguna nueva ni modificada (`preview: no`).

## Fuera de alcance

- Corregir comportamientos discutibles que aparezcan al escribir los tests: cada uno, su cambio.
- Unificar las cuentas de los gastos (Tarjeta, Revolut, Débito/efectivo) con las de la pestaña
  Cuentas: es el siguiente cambio candidato.
- La instalación en la pantalla de inicio (depende del sistema del teléfono, no se puede probar aquí).
