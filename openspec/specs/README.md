# OpenSpec en Mis finanzas

Lo que la app hace, escrito para que lo entienda cualquiera y lo pueda comprobar una máquina. Es el
encargo: `/sdd:apply` construye contra estos ficheros, no contra una conversación.

## Dos capas

**`openspec/specs/<capacidad>/spec.md`** es la especificación viva: lo que la app hace **hoy**. Sólo
la escribe `/sdd:archive` (con `python3 kit.py archive`), nunca una persona ni un agente a mano.

**`openspec/changes/<cambio>/`** es un cambio en curso:

```
openspec/changes/<cambio>/
  proposal.md                  por qué y qué. Lleva el estado del cambio
  design.md                    decisiones tomadas y por qué, incluidas las descartadas
  specs/<capacidad>/spec.md    el delta: lo que este cambio añade, sustituye o retira
  tasks.md                     el plan de construcción, con casillas (lo escribe /sdd:apply)
  preview.html                 las pantallas antes de construirlas: el Gate 2
```

Al archivar, el delta se funde en la viva y la carpeta entera pasa a
`openspec/changes/archive/AAAA-MM-DD-<cambio>/`. Así queda registro de qué cambio movió cada
requisito, con su propuesta, su diseño y su preview.

Una **capacidad** es una parte de la app con nombre estable: `gastos`, `presupuesto`, `fondo`,
`cuentas`, `cierre-mes`, `datos`, `interfaz`. No es una pantalla ni una función.

## proposal.md

```markdown
---
cambio: cuentas-en-gastos
estado: propuesta
datos: migra
---
# Cargar cada gasto contra una cuenta propia

## Por qué
## Qué cambia
## A quién afecta
## Pantallas
## Fuera de alcance
```

`datos:` dice qué le pasa a lo guardado en los teléfonos de quienes ya usan la app:
`sin-cambios`, `amplia` (se agregan campos, lo viejo sigue valiendo) o `migra` (hay que transformar
lo existente). Con `amplia` o `migra`, hay al menos un requisito de la capacidad `datos` que lo cubre.

`estado` avanza en un solo sentido, y cada paso lo da una persona:

| Estado | Quién lo pone | Qué significa |
|---|---|---|
| `propuesta` | `/sdd:propose` | escrita, pendiente del Gate 1 |
| `aprobada` | Gate 1 | la persona aprueba propuesta y especificaciones |
| `diseno-aprobado` | Gate 2 | la persona aprueba el preview; ya se puede construir |
| `construida` | Gate 3 | la app la cumple, `check` en verde, la persona la da por buena |
| `archivado` | `/sdd:archive` | fundida en `openspec/specs/` |

Un cambio sin pantallas nuevas ni modificadas lleva `preview: no` y no pasa por el Gate 2.

## El delta: specs/&lt;capacidad&gt;/spec.md

```markdown
# Capacidad: gastos

## Requisito: un gasto necesita un importe mayor que cero

La persona anota el importe, la cuenta y la categoría. La fecha es la de hoy salvo que la cambie.

### Escenario: gasto válido
- **Dado** el mes de octubre de 2026 sin gastos
- **Cuando** la persona anota 12,50 € en Súper con la tarjeta
- **Entonces** el gasto aparece primero en la lista del mes
- **Y** el total del mes es 12,50 €

### Escenario: importe vacío
- **Dado** el formulario de gasto abierto
- **Cuando** la persona guarda sin importe
- **Entonces** la app avisa «Poné un importe mayor que 0» y no guarda nada

## Retirado: los gastos no tienen categoría
Lo sustituye la elección de categoría.
```

Al archivar:

- `## Requisito: X` que ya existe en la viva → **se sustituye** entero (con sus escenarios).
- `## Requisito: X` nuevo → **se añade**.
- `## Retirado: X` → **se quita** de la viva. Retirar algo que no existe es un error.

Para modificar un requisito se copia entero de la viva al delta y se cambia allí.

## Las reglas

- **Un requisito dice qué hace la app, no cómo.** Si aparece un fichero, una función o una
  tecnología, está en la capa equivocada: eso va en `design.md`. `check` lo rechaza.
- **Todo requisito lleva al menos un escenario**, con **Dado**, **Cuando** y **Entonces**, y un
  escenario se puede comprobar. «Es cómodo» no es un escenario; «no hay desplazamiento horizontal en
  390 px» sí.
- **Los caminos que fallan también son requisitos**: un importe vacío, una copia de seguridad rota,
  datos de una versión anterior. Si sólo se especifica el caso feliz, sólo se construye el caso feliz.
- **Cada escenario tiene su test** cuando el cambio está construido, marcado
  `// Escenario: <título exacto>` en `tests/*.test.cjs`.
- **Ningún dato real en los ejemplos.** El repo es público: importes redondos, nombres genéricos
  («Banco A», «Broker X»).
- Títulos en sentence case. Los textos de la interfaz se citan tal cual, en castellano rioplatense.

`python3 kit.py specs` comprueba todo esto; `python3 kit.py check` lo incluye.
