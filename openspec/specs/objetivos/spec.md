# Capacidad: objetivos

## Requisito: lista de objetivos

La hoja «Objetivos» lista los objetivos de ahorro. Cada uno muestra su nombre, lo ahorrado frente al monto, el porcentaje, el estado del
mes en curso y, si tiene fecha límite, si llega a tiempo. Un botón «Nuevo objetivo» abre el formulario y tocar un objetivo lo abre para
editarlo. Sin objetivos, la hoja lo dice.

### Escenario: objetivo con su progreso
- **Dado** que hoy es 2026-10-15, el objetivo «Vacaciones» de 1000 € con aporte de 100 € desde 2026-09 y «Ahorro A» como cuenta destino con 400 €
- **Cuando** la persona abre la hoja «Objetivos»
- **Entonces** ve «Vacaciones», «400 de 1000 €» y «40 %»
- **Y** el estado «En plan»

### Escenario: sin objetivos
- **Dado** que la persona no tiene objetivos
- **Cuando** abre la hoja «Objetivos»
- **Entonces** ve «Todavía no tenés objetivos. Creá uno para seguir lo que ahorrás.» y el botón «Nuevo objetivo»

### Escenario: objetivo sin cuenta destino
- **Dado** un objetivo «Vacaciones» sin cuenta destino
- **Cuando** la persona abre la hoja «Objetivos»
- **Entonces** «Vacaciones» dice «Elegí una cuenta destino» en lugar del progreso

## Requisito: crear y editar un objetivo

El formulario pide nombre, monto, cuenta destino (de bancos o de inversiones), aporte mensual y mes del primer aporte. Además se puede
elegir el día del mes en que toca transferir (de 1 a 28, por defecto el 1), los meses sin aporte (separados por coma) y una fecha límite.
El nombre es obligatorio, el monto y el aporte tienen que ser mayores que 0, la cuenta y el mes de inicio son obligatorios. Los meses sin
aporte y la fecha límite con formato distinto de AAAA-MM se descartan.

### Escenario: objetivo completo
- **Dado** la cuenta «Ahorro A» y la hoja «Objetivos» abierta
- **Cuando** la persona crea «Vacaciones» de 1000 € con «Ahorro A», aporte de 100 € y primer aporte en 2026-09, y guarda
- **Entonces** la app avisa «Objetivo guardado» y «Vacaciones» aparece en la lista
- **Y** el día queda en 1

### Escenario: sin nombre
- **Dado** el formulario de objetivo abierto
- **Cuando** la persona guarda sin nombre
- **Entonces** la app avisa «Poné un nombre para el objetivo» y no guarda nada

### Escenario: monto o aporte inválido
- **Dado** el formulario de objetivo con nombre, cuenta y mes de inicio
- **Cuando** la persona guarda con monto 0 o con aporte vacío
- **Entonces** la app avisa «El monto y el aporte tienen que ser mayores que 0» y no guarda nada

### Escenario: sin cuenta destino
- **Dado** el formulario de objetivo con nombre, monto, aporte y mes de inicio
- **Cuando** la persona guarda sin elegir cuenta
- **Entonces** la app avisa «Elegí la cuenta destino» y no guarda nada

### Escenario: sin mes de inicio
- **Dado** el formulario de objetivo con nombre, monto, cuenta y aporte
- **Cuando** la persona guarda sin mes de inicio
- **Entonces** la app avisa «Elegí el mes del primer aporte» y no guarda nada

### Escenario: día fuera de rango
- **Dado** el formulario de objetivo completo
- **Cuando** la persona escribe el día 31 y guarda
- **Entonces** la app avisa «El día tiene que estar entre 1 y 28» y no guarda nada

### Escenario: meses sin aporte con formato inválido
- **Dado** el formulario de objetivo completo
- **Cuando** la persona escribe «2026-12, diciembre» en los meses sin aporte y guarda
- **Entonces** los meses sin aporte quedan como «2026-12»

### Escenario: editar un objetivo
- **Dado** el objetivo «Vacaciones» con aporte de 100 €
- **Cuando** la persona lo abre, cambia el aporte a 200 € y guarda
- **Entonces** la lista muestra el objetivo con el aporte nuevo en su plan

### Escenario: sin cuentas de bancos ni de inversión
- **Dado** que la persona sólo tiene una tarjeta de crédito
- **Cuando** abre el formulario de objetivo
- **Entonces** el formulario dice «Creá una cuenta de bancos o de inversión en Cuentas para elegirla como destino.»

## Requisito: el progreso es el saldo de la cuenta destino

Lo ahorrado en un objetivo es el saldo de su cuenta destino. Un saldo negativo cuenta como 0. Al llegar al monto, el porcentaje queda en 100 %
y el objetivo dice «Lo lograste».

### Escenario: el progreso sigue al saldo
- **Dado** el objetivo «Vacaciones» de 1000 € con «Ahorro A» en 400 €
- **Cuando** la persona anota un ingreso de 100 € en «Ahorro A»
- **Entonces** la lista muestra «500 de 1000 €» y «50 %»

### Escenario: saldo negativo
- **Dado** el objetivo «Vacaciones» de 1000 € y «Ahorro A» con −50 €
- **Cuando** la persona abre la lista
- **Entonces** muestra «0 de 1000 €» y «0 %»

### Escenario: objetivo cumplido
- **Dado** el objetivo «Vacaciones» de 1000 € y «Ahorro A» con 1200 €
- **Cuando** la persona abre la lista
- **Entonces** muestra «100 %» y «Lo lograste»

## Requisito: plan mes a mes

El plan de un objetivo acumula el aporte mensual desde el mes de inicio hasta llegar al monto, sin pasarlo. En los meses sin aporte el acumulado
se repite. Cada mes del plan se compara con el saldo de la cuenta destino al cierre de ese mes: «En plan» si llega, «Atrasado X €» si no, «Pendiente»
si el mes todavía no llegó y «Sin dato» si la cuenta es posterior a ese mes. El plan se ve en la hoja de edición del objetivo.

### Escenario: plan hasta el monto
- **Dado** un objetivo con aporte de 100 €, monto de 250 € e inicio en 2026-09
- **Cuando** la persona abre su plan
- **Entonces** tiene tres meses: septiembre 2026 con 100 €, octubre 2026 con 200 € y noviembre 2026 con 250 €

### Escenario: mes sin aporte
- **Dado** un objetivo con aporte de 100 €, monto de 1000 €, inicio en 2026-09 y 2026-10 como mes sin aporte
- **Cuando** la persona abre su plan
- **Entonces** septiembre y octubre 2026 tienen 100 € y noviembre 2026 tiene 200 €

### Escenario: en plan
- **Dado** que hoy es 2026-10-15, un plan de 200 € para octubre 2026 y la cuenta destino con 200 €
- **Cuando** la persona abre la lista
- **Entonces** el objetivo muestra «En plan»

### Escenario: atrasado
- **Dado** que hoy es 2026-10-15, un plan de 200 € para octubre 2026 y la cuenta destino con 150 €
- **Cuando** la persona abre la lista
- **Entonces** el objetivo muestra «Atrasado 50 €»

### Escenario: meses que todavía no llegaron
- **Dado** que hoy es 2026-10-15 y un plan que sigue hasta diciembre de 2026
- **Cuando** la persona abre su plan
- **Entonces** noviembre y diciembre de 2026 muestran «Pendiente»

## Requisito: fecha límite

Un objetivo con fecha límite dice si llega a tiempo: «Llegás a tiempo» si el plan llega al monto en ese mes o antes, y «Llegás N meses tarde» si no. Sin fecha
límite no dice nada.

### Escenario: llega a tiempo
- **Dado** un objetivo con aporte de 100 €, monto de 250 €, inicio en 2026-09 y fecha límite 2026-12
- **Cuando** la persona abre la lista
- **Entonces** el objetivo dice «Llegás a tiempo»

### Escenario: llega tarde
- **Dado** el mismo objetivo con fecha límite 2026-10
- **Cuando** la persona abre la lista
- **Entonces** el objetivo dice «Llegás 1 mes tarde»

### Escenario: sin fecha límite
- **Dado** un objetivo sin fecha límite
- **Cuando** la persona abre la lista
- **Entonces** el objetivo no dice nada sobre llegar a tiempo

## Requisito: aviso de transferencia en Inicio

Inicio muestra la tarjeta «Toca transferir» cuando, desde el día elegido del mes, la cuenta destino de un objetivo tiene menos que el plan de este
mes. Dice cuánto falta transferir a cada cuenta (el plan del mes menos el saldo; los atrasos de meses anteriores suman). Un objetivo que llegó
a su monto, o que va en plan, no avisa. Sin nada que transferir, la tarjeta no aparece.

### Escenario: toca transferir
- **Dado** que hoy es 2026-10-15, el objetivo «Vacaciones» con día 1, plan de 200 € para octubre y «Ahorro A» con 150 €
- **Cuando** la persona abre Inicio
- **Entonces** ve la tarjeta «Toca transferir» con «Transferí 50 € a Ahorro A para Vacaciones»

### Escenario: todavía no es el día
- **Dado** el mismo objetivo con día 20
- **Cuando** la persona abre Inicio
- **Entonces** no ve la tarjeta «Toca transferir»

### Escenario: los atrasos suman
- **Dado** que hoy es 2026-10-15, un plan de 200 € para octubre y la cuenta destino con 50 €
- **Cuando** la persona abre Inicio
- **Entonces** la tarjeta dice «Transferí 150 €»

### Escenario: va en plan
- **Dado** un objetivo con la cuenta destino en el plan de este mes
- **Cuando** la persona abre Inicio
- **Entonces** no ve la tarjeta «Toca transferir»

### Escenario: dos objetivos
- **Dado** «Vacaciones» atrasado 50 € hacia «Ahorro A» y «Viaje» atrasado 30 € hacia «Ahorro B»
- **Cuando** la persona abre Inicio
- **Entonces** la tarjeta lista «Transferí 50 € a Ahorro A para Vacaciones» y «Transferí 30 € a Ahorro B para Viaje»

### Escenario: objetivo cumplido sin aviso
- **Dado** un objetivo cuya cuenta destino ya llegó al monto
- **Cuando** la persona abre Inicio
- **Entonces** no ve la tarjeta «Toca transferir»

## Requisito: recordatorio en el calendario

En la hoja de un objetivo, «Agregar al calendario» entrega un archivo de calendario con un recordatorio mensual el día elegido, desde el mes en
que toca el próximo aporte hasta el último del plan, que dice cuánto transferir y a qué cuenta. Los meses sin aporte no llevan recordatorio. Si el
objetivo ya llegó a su monto, la app avisa «Este objetivo ya llegó a su monto.» y no entrega nada.

### Escenario: recordatorio mensual
- **Dado** que hoy es 2026-10-15 y el objetivo «Vacaciones» de 1000 € con aporte de 100 €, día 5, «Ahorro A» y primer aporte en 2026-09
- **Cuando** la persona toca «Agregar al calendario»
- **Entonces** el archivo tiene un recordatorio mensual el día 5, desde el 2026-11-05, que se repite 8 veces
- **Y** su título dice «Transferir 100 € a Ahorro A (Vacaciones)»

### Escenario: mes sin aporte en el calendario
- **Dado** el mismo objetivo con 2026-12 como mes sin aporte
- **Cuando** la persona toca «Agregar al calendario»
- **Entonces** el archivo no tiene recordatorio el 2026-12-05

### Escenario: objetivo cumplido en el calendario
- **Dado** un objetivo cuya cuenta destino ya llegó al monto
- **Cuando** la persona toca «Agregar al calendario»
- **Entonces** la app avisa «Este objetivo ya llegó a su monto.» y no entrega ningún archivo

### Escenario: nombre con caracteres especiales
- **Dado** un objetivo llamado «Casa; ahorro, año 1»
- **Cuando** la persona toca «Agregar al calendario»
- **Entonces** el archivo se puede leer y el título conserva el nombre completo

## Requisito: borrar un objetivo

«Borrar objetivo» pide confirmación con un segundo toque. Borrar un objetivo no toca su cuenta destino ni sus movimientos.

### Escenario: borrar con confirmación
- **Dado** la hoja del objetivo «Vacaciones»
- **Cuando** la persona toca «Borrar objetivo»
- **Entonces** el botón dice «Tocá de nuevo para borrar el objetivo»
- **Y** al tocarlo otra vez, «Vacaciones» ya no está en la lista y «Ahorro A» conserva su saldo

### Escenario: un solo toque no borra
- **Dado** la hoja del objetivo «Vacaciones»
- **Cuando** la persona toca «Borrar objetivo» una vez y cierra
- **Entonces** «Vacaciones» sigue en la lista

## Requisito: objetivos en Cierre

Cierre muestra la tarjeta «Objetivos» con cada objetivo y su estado en el mes que se ve («En plan», «Atrasado X €», «Pendiente» o «Sin dato»). Tocar
un objetivo lo abre. Sin objetivos, la tarjeta lo dice.

### Escenario: estado en Cierre
- **Dado** que hoy es 2026-10-15, un plan de 200 € para octubre y «Ahorro A» con 150 €
- **Cuando** la persona abre Cierre
- **Entonces** la tarjeta «Objetivos» muestra «Vacaciones» con «Atrasado 50 €»

### Escenario: sin objetivos en Cierre
- **Dado** que la persona no tiene objetivos
- **Cuando** abre Cierre
- **Entonces** la tarjeta «Objetivos» dice «Todavía no tenés objetivos. Creá uno desde el panel.»
