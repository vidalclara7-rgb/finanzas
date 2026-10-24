# Capacidad: gastos

## Requisito: anotar un gasto

La persona anota un gasto con el botón «+» desde cualquier pestaña salvo Cuentas: importe, cuenta
(Tarjeta, Revolut o Débito/efectivo), categoría, una nota opcional y la fecha, que por defecto es
hoy. Las categorías son: Súper, Comida fuera, Delivery, Transporte, Ocio, Compras, Belleza,
Casa/Splitwise, Salud, Viajes, Trabajo (reembolsable) y Otros.

### Escenario: gasto válido
- **Dado** que hoy es 2026-10-15 y no hay gastos en octubre
- **Cuando** la persona anota 12,50 € en Súper con Tarjeta y la nota «verdulería»
- **Entonces** la app avisa «Gasto guardado»
- **Y** el gasto aparece en Gastos y en «Últimos gastos» con la fecha 15/10
- **Y** el total del mes es 12,5 €

### Escenario: importe vacío o cero
- **Dado** el formulario de gasto abierto
- **Cuando** la persona guarda con el importe vacío o en 0
- **Entonces** la app avisa «Poné un importe mayor que 0»
- **Y** no se guarda ningún gasto

## Requisito: ver los gastos del mes en curso

La pestaña Gastos muestra sólo los gastos del mes en curso, del más reciente al más antiguo, y el
total del mes. Inicio muestra los cinco más recientes.

### Escenario: gastos de otro mes no aparecen
- **Dado** que hoy es 2026-10-15, un gasto del 2026-09-28 y otro del 2026-10-03
- **Cuando** la persona abre Gastos
- **Entonces** sólo ve el gasto del 2026-10-03
- **Y** el total del mes no incluye el de septiembre

### Escenario: mes sin gastos
- **Dado** que no hay gastos en el mes en curso
- **Cuando** la persona abre Gastos
- **Entonces** ve «Sin gastos este mes.»

## Requisito: borrar un gasto con confirmación

Borrar pide dos toques sobre la cruz del gasto: el primero la cambia por «Borrar» y el segundo
borra. Si no se confirma en dos segundos y medio, vuelve a la cruz.

### Escenario: borrar con dos toques
- **Dado** un gasto en la lista del mes
- **Cuando** la persona toca la cruz y después «Borrar»
- **Entonces** la app avisa «Gasto borrado» y el gasto desaparece de la lista

### Escenario: un solo toque no borra
- **Dado** un gasto en la lista del mes
- **Cuando** la persona toca la cruz una vez y espera tres segundos
- **Entonces** el gasto sigue en la lista y vuelve a mostrar la cruz

## Requisito: gasto por categoría

Inicio muestra lo gastado en el mes por categoría, de mayor a menor, incluidos los gastos
reembolsables.

### Escenario: categorías ordenadas
- **Dado** 64,30 € en Súper, 42 € en Trabajo (reembolsable) y 18 € en Comida fuera este mes
- **Cuando** la persona abre Inicio
- **Entonces** «Por categoría» muestra Súper, Trabajo (reembolsable) y Comida fuera, en ese orden

### Escenario: sin gastos por categoría
- **Dado** que no hay gastos en el mes en curso
- **Cuando** la persona abre Inicio
- **Entonces** «Por categoría» dice «Todavía no anotaste gastos este mes. Tocá + para empezar.»
