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
- Modelo (versión 2, `v: 2`): `{v, settings:{paleta?, aporte, objetivoFondo, inicio:"AAAA-MM", saltos:"AAAA-MM, ..."}, cuentas:[{id, tipo, nombre, saldoInicial, desde:"AAAA-MM-DD", tope?, fondo?, aportado?, limite?, cuota?, cuotas?}], movs:[{id, tipo:"gasto"|"ingreso"|"transferencia"|"ajuste", fecha, importe, cuenta, destino?, cat?, nota, reembolso?:{estado:"pendiente"|"aprobado"|"pagado", cobro?:idIngreso}}], tareas:[{id, texto}], meses:{"AAAA-MM":{checks, neto?, fondo?, conc?:{<idCuenta>:{real, fecha, ok}}}}}`.
- `norm()` convierte lo guardado por versiones anteriores (al cargar y al restaurar una copia): crea las cuentas Tarjeta, Revolut, Débito/efectivo (las que tengan gastos o tope) y «Fondo de emergencia» (con el último saldo anotado), pasa `gastos` a `movs`, las cinco tareas fijas a `tareas` (con sus ids, para conservar lo marcado) y el `saldo` escrito a mano de la versión con cuentas a `saldoInicial`. Si `v` ya es 2 no toca nada.
- Tipos de cuenta: `liquidez`, `inversion`, `tarjeta`, `financiacion` y `compartida`. El saldo se calcula (`valorCuenta()`) en «valor con signo»: lo que tenés en positivo y lo que debés en negativo. Parte de `saldoInicial` (las deudas en positivo) y suma los movimientos con fecha desde `desde`: el gasto resta, el ingreso suma, la transferencia pasa de `cuenta` a `destino` y el ajuste suma su importe con signo.
- Conciliación: en Cierre se carga el saldo real de cada cuenta a la fecha de cierre (último día del mes, u hoy en el mes en curso). Si no coincide, la diferencia se registra como movimiento `ajuste` o queda pendiente. Crear, editar o borrar un movimiento borra la marca de conciliación de sus cuentas en ese mes (`desconciliar()`).
- Reembolsos: los gastos de «Trabajo (reembolsable)» tienen `reembolso.estado` (Pendiente, Aprobado, Pagado; `reembolsos()` en `norm()` pone Pendiente a los que no lo tienen). Un ingreso de Reembolso marca los gastos que cubre (quedan Pagados con `cobro` = id del ingreso); si se borra o deja de cubrirlos, vuelven a Aprobado. Inicio muestra lo que falta cobrar y Movimientos filtra por estado (`filtroR`).
- Los ajustes y las transferencias no cuentan como gasto ni ingreso. Los gastos de «Trabajo (reembolsable)» no cuentan para los topes.
- Topes por cuenta (bancos y tarjetas); una cuenta de bancos puede ser el fondo de emergencia. El plan del fondo (`planMap()`) acumula el aporte mensual desde `inicio`, sin sumar en los meses de `saltos`, hasta el objetivo, y se compara con el saldo de esa cuenta (o con lo anotado antes de que existiera).
- Al cambiar una cuenta o un movimiento se anota el patrimonio neto del mes en `meses[mes].neto`.
- Pantallas: Inicio (forma del gasto del mes y resultado, últimos gastos, disponible por cuenta con tope, torta, barras por semana, ingresos contra gastos de seis meses, patrimonio), Movimientos (tarjetas apiladas), Cuentas, Cierre (conciliación, checklist propio, plan del fondo) y Ajustes (paleta de colores, plan del fondo, resumen para copiar, copia de seguridad), que se abre con el engranaje. El «+» abre «Nuevo movimiento» (gasto, ingreso o transferencia), o «Nueva cuenta» si se está en Cuentas.
- Estilo editorial con paleta viva: fondo gris muy claro y tarjetas de color según su contenido (disponibles y grupos de Cuentas en el color de su tipo, `COLOR` y `tipoOsc()`; «Por semana» rosa claro, «Ingresos y gastos» salvia, conciliación verde oliva, checklist y «Por cobrar» rosa, patrimonio cherry); «Gasto del mes» es blanca para que se lea la torta. Paleta: rojo anaranjado, cherry, frambuesa, rosa chicle, fucsia, verde oliva oscuro y salvia; una sola letra del sistema, importes grandes con los decimales en gris (`monto()`), botones píldora negros y barra de navegación blanca flotante. Cada categoría tiene su color fijo (`--cat1` a `--cat12`, en el orden de `CATS`; Trabajo (reembolsable) en frambuesa), el mismo en la torta, la lista y las tarjetas; `.card.color` y `.mov` toman el color de `--c` con texto oscuro, y con la clase `osc` (categorías de `CATS_OSC`, inversiones, tarjetas, patrimonio y conciliación) el texto es `--on-osc` (blanco; oscuro en Pastel crema). Transferencias y ajustes son tarjetas `neutro`. Colores como variables en `:root`, con versión para modo oscuro. Paletas elegibles en Ajustes (`PALETAS`: Viva, Editorial, Lima y lavanda, Pastel crema): `aplicarPaleta()` pone `data-paleta` en `<html>` según `settings.paleta` (sin valor, Viva, que es la base de `:root`) y cada paleta redefine las variables en claro y en oscuro; toda paleta nueva tiene que dar contraste 4,5 a 1 en los importes y en las tarjetas `osc`. La app no carga nada de otros sitios.
- Gráficos en SVG dibujado por la app, sin librerías: forma del gasto del mes (`forma()`), anillo del tope (`anillo()`), torta (`torta()`), barras por semana (`barras()`) e ingresos contra gastos (`mesesIG()`).

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
