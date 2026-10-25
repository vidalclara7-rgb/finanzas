# Capacidad: graficos

## Requisito: abrir una categoría

En «Gasto del mes» de Inicio, tocar una porción de la torta o una fila de la lista abre la hoja de
esa categoría en el mes que se está viendo, con su nombre, el total gastado y el mes. Cuenta lo mismo
que la torta: los gastos de la categoría, sin ingresos, transferencias ni ajustes.

### Escenario: abrir desde la lista
- **Dado** que hoy es 2026-10-15 y este mes 64,30 € en Supermercado y 18 € en Comida fuera
- **Cuando** la persona toca Supermercado en «Gasto del mes»
- **Entonces** se abre la hoja «Supermercado» con 64,3 € y «octubre 2026»

### Escenario: abrir desde la torta
- **Dado** este mes 64,30 € en Supermercado y 18 € en Comida fuera
- **Cuando** la persona toca la porción de Comida fuera en la torta
- **Entonces** se abre la hoja «Comida fuera» con 18 €

## Requisito: comparación con el mes anterior

Debajo del total, la hoja dice cuánto cambió frente al mes anterior en esa categoría, en euros y en
porcentaje.

### Escenario: más que el mes anterior
- **Dado** 100 € en Supermercado en octubre 2026 y 80 € en septiembre 2026
- **Cuando** la persona abre Supermercado en octubre
- **Entonces** se lee «20 € más que en septiembre (+25 %)»

### Escenario: menos que el mes anterior
- **Dado** 60 € en Supermercado en octubre 2026 y 80 € en septiembre 2026
- **Cuando** la persona abre Supermercado en octubre
- **Entonces** se lee «20 € menos que en septiembre (−25 %)»

### Escenario: sin gasto el mes anterior
- **Dado** 50 € en Supermercado en octubre 2026 y nada en septiembre 2026
- **Cuando** la persona abre Supermercado en octubre
- **Entonces** se lee «En septiembre no gastaste en Supermercado»

## Requisito: reparto por cuenta

La hoja muestra, de mayor a menor, cuánto de la categoría se pagó con cada cuenta, con importe,
porcentaje del total y una barra proporcional. Con más de cinco cuentas, muestra las cinco primeras y
suma las demás en «Resto», que al tocarlo muestra las que agrupa.

### Escenario: dos cuentas
- **Dado** 60 € en Supermercado con Banco A y 40 € con Tarjeta este mes
- **Cuando** la persona abre Supermercado
- **Entonces** las barras dicen Banco A «60 € · 60 %» y Tarjeta «40 € · 40 %», en ese orden

### Escenario: más de cinco cuentas
- **Dado** gastos en Supermercado con siete cuentas distintas este mes
- **Cuando** la persona abre Supermercado
- **Entonces** ve cinco barras y una más, «Resto (2 cuentas)», con la suma de las otras dos
- **Y** al tocar «Resto» ve las dos cuentas que agrupa

## Requisito: gastos de la categoría

Debajo del reparto, los gastos de la categoría en ese mes, de mayor a menor importe. Tocar uno abre
«Editar movimiento».

### Escenario: ordenados por importe
- **Dado** gastos en Supermercado de 5 €, 30 € y 12 € este mes
- **Cuando** la persona abre Supermercado
- **Entonces** la lista muestra 30 €, 12 € y 5 €, en ese orden

### Escenario: editar desde el detalle
- **Dado** la hoja de Supermercado con un gasto de 30 €
- **Cuando** la persona lo toca, lo cambia a Ocio y guarda
- **Entonces** ese gasto queda en Ocio y al volver a abrir Supermercado ya no aparece

## Requisito: cambiar de mes en el detalle

Con las flechas ‹ y › la hoja pasa al mes anterior o al siguiente, sin pasar del mes en curso. En un
mes sin gastos de la categoría, lo dice y no dibuja barras.

### Escenario: mes anterior
- **Dado** que hoy es 2026-10-15 y 40 € en Supermercado en septiembre 2026
- **Cuando** la persona abre Supermercado y toca ‹
- **Entonces** la hoja muestra «septiembre 2026» con 40 €

### Escenario: no pasa del mes en curso
- **Dado** la hoja de Supermercado en octubre 2026, el mes en curso
- **Cuando** la persona mira la flecha ›
- **Entonces** está desactivada

### Escenario: mes sin gastos en la categoría
- **Dado** gastos en Supermercado en octubre 2026 y ninguno en agosto 2026
- **Cuando** la persona va hasta agosto con ‹
- **Entonces** se lee «No gastaste en Supermercado en agosto 2026.» y no hay barras

## Requisito: fijos y variables del mes

Arriba de Inicio, «Fijos y variables» muestra el gasto del mes en curso partido en dos, fijos y
variables, con una barra partida y, debajo, cada parte con su importe y su porcentaje del total, sin
más detalle. Al tocarla se abre la hoja «Fijos y variables», con las categorías de cada grupo
ordenadas de mayor a menor, con su importe y una barra proporcional; tocar una categoría abre su hoja.
Los gastos de «Trabajo (reembolsable)», los ingresos, las transferencias y los ajustes no cuentan.

### Escenario: reparto entre fijos y variables
- **Dado** este mes 600 € en Casa/Splitwise y 40 € en Ocio marcados como fijos, y 300 € en Supermercado y 60 € en Comida fuera sin marcar
- **Cuando** la persona abre Inicio
- **Entonces** «Fijos y variables» dice «Fijos 640 € · 64 %» y «Variables 360 € · 36 %», sin la lista de categorías
- **Y** al tocarla, la hoja muestra bajo Fijos Casa/Splitwise y Ocio, en ese orden, y bajo Variables Supermercado y Comida fuera

### Escenario: de fijos y variables a una categoría
- **Dado** la hoja «Fijos y variables» abierta con Supermercado entre los variables
- **Cuando** la persona toca Supermercado
- **Entonces** se abre la hoja «Supermercado»

### Escenario: reembolsables fuera del reparto
- **Dado** este mes 100 € en Supermercado y 50 € en Trabajo (reembolsable)
- **Cuando** la persona abre Inicio
- **Entonces** «Fijos y variables» dice «Variables 100 € · 100 %» y en su hoja no aparece Trabajo (reembolsable)

### Escenario: todavía sin gastos fijos
- **Dado** este mes sólo gastos sin marcar como fijos, por 200 €
- **Cuando** la persona abre Inicio
- **Entonces** la barra es entera de variables
- **Y** se lee «Marcá tus gastos fijos al anotarlos: alquiler, cuotas, suscripciones.»

### Escenario: sin gastos para repartir
- **Dado** que este mes sólo hay un gasto de 30 € en Trabajo (reembolsable)
- **Cuando** la persona abre Inicio
- **Entonces** no se dibuja la barra, se lee «Todavía no anotaste gastos este mes.» y no se abre nada al tocar

## Requisito: las barras de categoría se ven

En las barras por categoría y por cuenta, la parte llena se distingue de su pista (al menos 1,5 a 1)
en cualquier categoría, también Otros, en las cuatro paletas, en claro y en oscuro.

### Escenario: Otros se ve en su barra
- **Dado** un gasto en Otros este mes
- **Cuando** la persona recorre las cuatro paletas en claro y en oscuro y abre «Fijos y variables»
- **Entonces** la barra de Otros se distingue de su pista en todas

