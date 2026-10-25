---
description: Abre un cambio en openspec/changes/ a partir de una idea y de lo que haya en inbox/ — propuesta, decisiones y especificaciones. Termina en el Gate 1.
---

Conviertes una idea en un **cambio** con su propuesta y sus especificaciones, y la persona lo
aprueba. A partir de aquí, `/sdd:apply` no vuelve a preguntar qué significan las cosas: construye
contra lo que quede escrito.

Idea o contexto que acompaña al comando: $ARGUMENTS

## Antes de preguntar

1. Lee `CLAUDE.md` y `openspec/specs/README.md` enteros: el segundo es el formato, y `check` lo exige
   al pie de la letra.
2. Lee `inbox/` entero (capturas, referencias, notas) y lo que la persona haya adjuntado en el chat.
3. Lee `openspec/specs/` (lo que la app ya hace) y `openspec/changes/` (lo que está en curso). Si ya
   hay capacidades, este cambio las amplía o las modifica; no empieza de cero.
4. Lee las partes de `index.html` que el cambio toca, para saber qué existe hoy.

## Preguntar lo que falte

Con `AskUserQuestion`, máximo cuatro preguntas por tanda: primero lo que cambia la forma de la app
(qué pantallas, qué datos) y después el detalle. Cada opción explica su consecuencia en una frase; si
una es claramente mejor, va primera y marcada como recomendada.

- **Nunca se pregunta lo que ya está en `inbox/`, en el chat o en las specs.**
- **Lo que hay que leer va en el mensaje; en la pregunta sólo va la decisión.**

Lo que tiene que quedar cerrado:

- **Qué pantallas** cambian o aparecen, y qué se hace en cada una.
- **Qué datos** se guardan y **qué le pasa a lo que ya tienen guardado** quienes usan la app
  (`datos: sin-cambios | amplia | migra`). Con `amplia` o `migra`, requisitos en la capacidad `datos`
  con escenarios para datos de la versión anterior y para copias de seguridad viejas.
- **Qué pasa cuando algo falla**: dato inválido, campo vacío, copia rota.
- **Que sirva a cualquier persona**: nada pensado para un banco, un importe o una situación
  concreta. Lo personal se carga desde la app.
- **Qué queda fuera** de esta versión, explícito.

## Escribir el cambio

Nombre en kebab-case, por lo que aporta (`cuentas-en-gastos`, `evolucion-patrimonio`). En
`openspec/changes/<cambio>/`:

- `proposal.md` con su cabecera (`cambio`, `estado: propuesta`, `datos`; y `preview: no` si el
  cambio no toca ninguna pantalla).
- `design.md` con lo decidido y por qué, incluidas las opciones descartadas, y cómo se va a
  implementar en `index.html` (modelo de datos, migración en `norm()`, versión de la caché). Es lo
  que salva la siguiente sesión. Fechas absolutas (AAAA-MM-DD).
- `specs/<capacidad>/spec.md`, uno por capacidad que el cambio toca. Ejemplos con datos inventados.

`python3 kit.py specs` en verde. Si falla, corrige y repite.

## Gate 1

En el mensaje, seis u ocho líneas: qué se va a construir, las pantallas por nombre, qué le pasa a los
datos guardados, qué queda fuera, y **cuántos requisitos y escenarios** hay por capacidad (la señal
de si el alcance es el esperado). Y qué ficheros abrir para leerlos enteros.

`AskUserQuestion`: **Aprobar** · **Quiero cambiar algo** · **Dejarlo aquí**.

- **Aprobar**: `estado: propuesta` → `estado: aprobada`, commit y push a la rama de trabajo. El
  siguiente paso es `/sdd:apply`.
- **Quiero cambiar algo**: se recoge, se reescribe y se vuelve a enseñar. Sin límite de rondas: es
  mucho más barato discutir aquí que después de construir.

## Lo que no haces

No escribes código, ni tareas, ni el preview: eso es de `/sdd:apply`. No rellenas un hueco con lo que
parece razonable: si algo no está decidido, se pregunta.

Conversación en castellano, directa, sin jerga ni nombres de fichero salvo los que la persona tenga
que abrir.
