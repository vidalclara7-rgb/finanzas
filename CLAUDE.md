# Mis finanzas

App web instalable (PWA) de presupuesto personal. Publicada con GitHub Pages desde la rama `main`, carpeta raíz: https://vidalclara7-rgb.github.io/mis-finanzas/

Se desarrolla **dirigida por especificación (SDD, con OpenSpec)**: una idea entra por `/sdd:propose` como un cambio con su especificación, `/sdd:apply` enseña el preview y la construye, y `/sdd:archive` la funde en la especificación viva. Este fichero es el contrato: leelo entero antes de tocar código.

## Archivos

```
index.html            toda la app (HTML, CSS y JS en un solo archivo, sin dependencias ni build)
sw.js                 service worker: red primero, caché de respaldo para uso sin conexión
manifest.webmanifest, icon-*.png   instalación en pantalla de inicio
kit.py                check · specs · tests · preview · capturas · archive · servir · instalar
openspec/
  specs/<capacidad>/spec.md   lo que la app hace HOY. Sólo lo escribe /sdd:archive
  changes/<cambio>/           un cambio en curso: proposal · design · specs (delta) · tasks · preview
  changes/archive/            los cambios cerrados, con todo lo que se decidió
tests/                *.test.cjs: navegador real a 390 px (Playwright), uno o más por escenario
scripts/              comprobaciones (reglas de la app, specs, preview) y capturas
templates/preview.html   esqueleto del preview del Gate 2
inbox/                material de entrada para /sdd:propose. No se sube al repo
.claude/commands/sdd/ propose · apply · archive
```

Lo que sirve GitHub Pages a quien usa la app es `index.html`, `sw.js`, el manifiesto y los iconos. El resto es del proceso de desarrollo (también queda público, como todo el repo).

## El flujo

```
/sdd:propose  →  proposal + design + delta de specs                → GATE 1 (requisitos)  → aprobada
/sdd:apply    →  tasks + preview (capturas a 390 px)               → GATE 2 (diseño)      → diseno-aprobado
              →  código + tests + check + capturas de la app real  → GATE 3 (resultado)   → construida
/sdd:archive  →  delta fundido en openspec/specs/, cambio archivado                        → archivado
              →  PR a main sólo si la persona lo pide: publicar le llega a todas las personas
```

Tres puntos en los que decide una persona, y el estado de cada cambio en `proposal.md` dice en cuál está. **No se escribe código de la app antes del Gate 2.** El silencio no es aprobación. El formato completo está en `openspec/specs/README.md`.

Se trabaja en una rama, nunca directo en `main`. Un cambio pequeño de texto o de un color también pasa por el flujo, pero puede ir con `preview: no` si no cambia ninguna pantalla de forma visible.

## Cómo funciona
- Los datos se guardan solo en el dispositivo (`localStorage`, clave `finanzas-v1`). No hay backend ni sincronización.
- Modelo: `{settings:{topeTarjeta, topeRevolut, aporte, objetivoFondo, inicio:"AAAA-MM", saltos:"AAAA-MM, ..."}, gastos:[{id, fecha, importe, cuenta, cat, nota}], cuentas:[{id, tipo, nombre, saldo, actualizado, aportado?, limite?, cuota?, cuotas?}], meses:{"AAAA-MM":{fondo, checks, neto?}}}`.
- `cuentas` las crea cada persona desde la pestaña Cuentas (nombre libre). Tipos: `liquidez`, `inversion` (activos), `tarjeta`, `financiacion` (deudas, `saldo` en positivo) y `compartida` (`saldo` con signo: positivo te deben, negativo debés). `norm()` agrega `cuentas: []` a datos y copias viejas. Al guardar una cuenta se anota el patrimonio neto del mes en `meses[mes].neto`.
- El plan del fondo se calcula en `planMap()` a partir de los ajustes: aporte mensual acumulado desde `inicio`, sin sumar en los meses de `saltos`, hasta llegar al objetivo.
- Los gastos de la categoría "Trabajo (reembolsable)" no cuentan para los topes.
- Pantallas: Inicio (disponible por cuenta, fondo, patrimonio neto, categorías), Gastos, Cuentas (patrimonio neto y cuentas por tipo), Mes (checklist, saldo del fondo, plan) y Ajustes (topes, plan, resumen para copiar, copia de seguridad), que se abre con el engranaje del encabezado. El botón "+" central agrega un gasto, o una cuenta si se está en Cuentas.
- Estilo: fondo blanco, tarjeta principal negra (`hero`), tarjetas de acento verde lima (`lime`) y lavanda (`lav`) que redefinen sus colores internos, una sola letra del sistema (los títulos en negrita), botones píldora negros y barra de navegación negra flotante con el «+» lima. Colores definidos como variables en `:root`, con versión para modo oscuro; cada categoría de gasto tiene su color fijo (`--cat1` a `--cat12`, en el orden de `CATS`). La app no carga nada de otros sitios.
- Gráficos en SVG dibujado por la app, sin librerías: anillo del tope (`anillo()`), torta de gastos por categoría (`torta()`) y barras de gasto por semana (`barras()`).

## Reglas que no se rompen sin hablarlo

1. **La especificación manda.** Se construye lo que dice el cambio; lo que no dice, se pregunta y se escribe en su delta antes de construirlo. `openspec/specs/` no se edita a mano.
2. **El repo es público**: ni importes, ni nombres, ni datos personales en código, specs, tests o ejemplos. Todo lo personal se carga desde la app. `inbox/` no se sube.
3. **Lo usan otras personas con el mismo link**: cualquier cambio les llega a todas. Todo cambio declara `datos:` en su propuesta. No se cambia la clave de `localStorage` ni el formato de datos sin migrar lo existente en `norm()`, que se aplica al cargar y al restaurar una copia.
4. **Toda modificación de la app sube la versión de `CACHE` en `sw.js`**, y todo fichero nuevo va a `FILES`.
5. **Lo que escribe la persona se pinta con `esc()`** (nombres, notas, categorías).
6. **Cada escenario tiene su test**, marcado `// Escenario: <título>` en `tests/`, y se prueba en ancho de iPhone (390 px), en claro y en oscuro.
7. **La app conserva el preview aprobado**: los mismos `data-pantalla` y `data-ui`.
8. Interfaz en castellano rioplatense, con voseo. Títulos en sentence case.

`python3 kit.py check` comprueba de la 2 a la 7 (la 2, en parte: correos, IBAN e `inbox/`). La 1 y la 8 dependen de vos.

## Comprobar

```
python3 kit.py instalar   # una vez: Node y Playwright
python3 kit.py check      # reglas de la app + especificaciones + preview + tests en el navegador
python3 kit.py capturas   # capturas de la app real a 390 px en .capturas/app/
```

**No se da nada por terminado con `check` en rojo**, y nunca se desactiva una comprobación para ponerlo en verde. Un `check` en verde no es «visto en el navegador»: son cosas distintas y se dicen distinto.

## Qué no trae este flujo, a propósito

Backend, cuentas de usuario, sincronización entre dispositivos, dependencias o paso de compilación en la app, CI/CD. Si un cambio necesita alguna de esas cosas, es una conversación de arquitectura antes que un cambio.
