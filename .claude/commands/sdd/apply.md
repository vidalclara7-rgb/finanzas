---
description: Construye un cambio aprobado — tareas, preview (Gate 2), código, tests por escenario, check en verde y prueba en el navegador (Gate 3).
---

Construyes un cambio que ya pasó el Gate 1. Lo haces tú, en esta sesión, sin subagentes. Cambio, si
lo indican: $ARGUMENTS (si no, el único en curso).

## 1. Leer y planificar

1. Lee `CLAUDE.md`.
2. Lee el cambio entero: `proposal.md`, `design.md`, `specs/`, y la especificación viva de las
   capacidades que toca (`openspec/specs/`).
3. Según el `estado` de `proposal.md`:
   - `propuesta` → para: falta el Gate 1, el paso es `/sdd:propose`.
   - `aprobada` → empieza por el paso 2.
   - `diseno-aprobado` → el diseño ya está aprobado: salta al paso 4.
   - `construida` → ya está; el siguiente paso es `/sdd:archive`.
4. Escribe `tasks.md`: las tareas en casillas `- [ ]`, agrupadas (preview, datos y migración,
   pantallas, tests, prueba en el navegador, documentación). Cada tarea, pequeña y comprobable.
5. **En el mensaje**, cuatro o cinco líneas: qué se va a construir, en qué dos momentos decide la
   persona (diseño y resultado) y qué podrá probar al final. Después, `AskUserQuestion`:
   **Empezar** · **Cancelar**.

## 2. Preview (si el cambio tiene pantallas)

Si `proposal.md` lleva `preview: no`, salta al paso 4 y pon `estado: diseno-aprobado`.

1. `python3 kit.py preview <cambio> --esqueleto` crea `preview.html` con los estilos actuales de la app.
2. Rellena sus dos regiones, y nada fuera de ellas:
   - `nav`: los botones de la barra de la app, con `data-ir="<clave>"`.
   - `pantallas`: una `<section data-pantalla="<clave>" data-titulo="<título>">` por pantalla que el
     cambio toca, y dentro dos estados: `<div data-estado="normal">` (con datos) y `"vacio"` (primer
     uso). Si hay un formulario o una hoja nueva, va como pantalla propia.
3. **El HTML del preview es el de la app**: sólo sus clases (`.card`, `.p-pink`, `.item`, `.btn`,
   `.seg`…), textos definitivos en castellano rioplatense, datos de ejemplo inventados pero
   plausibles. Sin `<script>` ni estilos propios: el preview enseña formas, no calcula. Si hace falta
   una clase nueva, se agrega primero a `index.html` y se dice en el Gate 2.
4. Marca con `data-ui="<nombre>"` las piezas que la app tiene que conservar: la tarjeta, la lista,
   el formulario, el botón principal. Al construir, `check` comprueba que siguen ahí.
5. `python3 kit.py preview <cambio>` copia los estilos, lo comprueba y saca capturas a 390 px en
   claro y oscuro (`.capturas/<cambio>/`). Si la comprobación falla, se arregla antes de enseñarlo.

## 3. Gate 2: el diseño

Envía las capturas a la persona con `SendUserFile` (las de modo claro primero; las oscuras, si el
cambio toca colores). En el mensaje: qué pantallas son y qué mirar en cada una.

`AskUserQuestion`: **Aprobar el diseño** · **Pedir cambios** · **Cancelar**.

- **Aprobar**: `estado: aprobada` → `estado: diseno-aprobado`, marca las tareas del preview, commit y
  push.
- **Pedir cambios**: se recogen, se cambia el preview y se vuelve a enseñar. A la tercera ronda sin
  cuadrar, para y dilo: el problema no es el diseño, es la especificación, y se vuelve a
  `/sdd:propose`.
- **Cancelar**: el cambio se queda como está. No se borra nada.

**Nunca se escribe código de la app antes de este gate.**

## 4. Construir

En el orden de `tasks.md`, marcando `- [x]` cada tarea al terminarla:

1. **Datos**: si `datos:` es `amplia` o `migra`, primero la migración en `norm()` (se aplica al
   cargar y al restaurar una copia). La clave de guardado no cambia.
2. **Pantallas y lógica** en `index.html`: el marcado del preview aprobado, ahora con datos reales,
   con sus `data-pantalla` y `data-ui`. Todo lo que escribe la persona se pinta con `esc()`.
3. **Service worker**: subir la versión de `CACHE` en `sw.js`; si hay ficheros nuevos, a `FILES`.
4. **Tests** en `tests/*.test.cjs`: al menos uno por escenario, con `// Escenario: <título exacto>`
   encima. Usan `tests/ayuda.cjs` (navegador real a 390 px, fecha fija, datos inventados).
5. **`CLAUDE.md`**: el modelo de datos y las pantallas, si cambiaron.
6. `python3 kit.py check` en verde.
7. **En el navegador**: `python3 kit.py capturas` y mira las capturas de la app real, en claro y en
   oscuro, contra las del preview aprobado.

Avisa en una línea al empezar cada bloque («Estoy con la migración de datos»). No narres cada
fichero.

## Cuando algo falla

- Arreglas la causa, no el síntoma. **Nunca** se desactiva una comprobación, se borra un test o se
  añade `guard:allow` para pasar `check`. Si un test está mal respecto de la especificación, se
  corrige el test y se dice.
- Tres intentos sobre el mismo fallo. Si sigue, **paras** y explicas en palabras llanas qué no sale y
  qué opciones hay.
- Si construyendo aparece algo que la especificación no decide, **no lo decides tú**: preguntas, y lo
  decidido se escribe en el delta y en `design.md` antes de seguir.

## 5. Gate 3: el resultado

En el mensaje:

1. El resumen de `python3 kit.py check`, tal cual.
2. Una tabla escenario → test → resultado. Un escenario sin test es un hueco y se dice.
3. Las capturas de la app real (con `SendUserFile`), junto a las del preview aprobado.
4. Lo que haya quedado fuera o a medias, sin suavizarlo.

`AskUserQuestion`: **Darla por buena** · **Pedir cambios** · **Parar aquí**.

- **Darla por buena**: `estado: construida`, `python3 kit.py check` otra vez (ahora exige todas las
  tareas cerradas, un test por escenario y la paridad con el preview), commit y push. El siguiente
  paso es `/sdd:archive`.
- **Pedir cambios**: si el cambio altera lo que hace la app, primero el delta y se enseña, luego el
  código. Si altera una pantalla, primero el preview.

Un `check` en verde no es lo mismo que «probado en el navegador», y se dicen distinto. Nunca se
continúa tras una pregunta sin respuesta.
