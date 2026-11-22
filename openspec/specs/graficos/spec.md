# Capacidad: graficos

## Requisito: anillo del tope

La tarjeta de disponible de cada cuenta con tope muestra un anillo con el porcentaje del tope mensual
ya usado, sin contar los gastos reembolsables, los ingresos, las transferencias ni los ajustes. Al
superar el tope, el anillo se completa y se marca como excedido.

### Escenario: tope usado en parte
- **Dado** «Tarjeta» con tope de 500 € y 64,30 € gastados con esa tarjeta este mes
- **Cuando** la persona abre Inicio
- **Entonces** el anillo de Tarjeta dice «13 %»

### Escenario: tope superado en el anillo
- **Dado** «Revolut» con tope de 300 € y 320 € gastados con esa cuenta este mes
- **Cuando** la persona abre Inicio
- **Entonces** el anillo de Revolut dice «107 %» y se marca como excedido

## Requisito: ingresos contra gastos por mes

Inicio muestra, para los últimos seis meses incluido el actual, dos curvas suaves, una verde de ingresos y otra en el color del texto de gastos, con un punto por mes. Al tocar un mes, un globo dice sus ingresos y sus gastos. Los meses que cerraron en negativo se marcan en el rosa de aviso. Transferencias y ajustes no cuentan.

### Escenario: dos meses con datos
- **Dado** que hoy es 2026-10-15, en septiembre 1500 € de ingresos y 900 € de gastos, y en octubre 1700 € de ingresos y 82,30 € de gastos
- **Cuando** la persona abre Inicio
- **Entonces** el gráfico muestra seis meses, de mayo a octubre 2026
- **Y** septiembre y octubre tienen su punto verde y su punto del color del texto, y los demás meses están en cero

### Escenario: globo con el mes tocado
- **Dado** el gráfico con datos de septiembre y octubre
- **Cuando** la persona toca octubre
- **Entonces** un globo dice «Ingresos 1700 €» y «Gastos 82,3 €»

### Escenario: mes que cerró en negativo
- **Dado** en septiembre 2026 ingresos de 800 € y gastos de 950 €
- **Cuando** la persona abre Inicio
- **Entonces** septiembre se marca en rosa en el gráfico

### Escenario: sin ingresos ni gastos
- **Dado** que no hay ingresos ni gastos en los últimos seis meses
- **Cuando** la persona abre Inicio
- **Entonces** no se dibuja el gráfico de ingresos contra gastos

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

## Requisito: porcentaje de lo que entró

En la tarjeta del resultado del mes, debajo del título, una línea de texto dice qué parte de lo que entró en el mes ya se gastó. Si el gasto supera lo ingresado, la línea se marca. Transferencias y ajustes no cuentan, y tampoco los gastos de «Trabajo (reembolsable)» ni los ingresos de Reembolso: no son plata propia.

### Escenario: gasto chico frente a lo que entró
- **Dado** ingresos de 1700 € y gastos de 149,80 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** el resultado dice «Te sobraron 1550,2 €»
- **Y** debajo se lee «Gastaste el 9 % de lo que entró»

### Escenario: gasto mayor que lo que entró
- **Dado** ingresos de 100 € y gastos de 150 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** se lee «Gastaste el 150 % de lo que entró» y la línea se marca como excedida

### Escenario: mes sin ingresos
- **Dado** gastos de 50 € y ningún ingreso este mes
- **Cuando** la persona abre Inicio
- **Entonces** se lee «Todavía no anotaste ingresos este mes»

### Escenario: reembolsos fuera del porcentaje
- **Dado** un ingreso de 1000 € en Sueldo y otro de 50 € en Reembolso, y gastos de 200 € en Supermercado y 50 € en Trabajo (reembolsable) este mes
- **Cuando** la persona abre Inicio
- **Entonces** se lee «Gastaste el 20 % de lo que entró»

## Requisito: abrir una categoría

Tocar una fila de «Gasto del mes» o una tarjeta de «Gasto por categoría» abre la hoja de esa categoría en el mes que se está viendo, con su nombre, el total gastado y el mes. Cuenta lo mismo que la lista: los gastos de la categoría, sin ingresos, transferencias ni ajustes.

### Escenario: abrir desde la lista
- **Dado** que hoy es 2026-10-15 y este mes 64,30 € en Supermercado y 18 € en Comida fuera
- **Cuando** la persona toca la fila de Supermercado en «Gasto del mes»
- **Entonces** se abre la hoja «Supermercado» con 64,3 € y «octubre 2026»

### Escenario: abrir desde la pila
- **Dado** este mes 64,30 € en Supermercado y 18 € en Comida fuera
- **Cuando** la persona abre «Gasto por categoría» y toca Comida fuera
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

## Requisito: las barras de categoría se ven

En las barras por categoría y por cuenta, la parte llena se distingue de su pista (al menos 1,5 a 1)
en cualquier categoría, también Otros, en claro y en oscuro.

### Escenario: Otros se ve en su barra
- **Dado** un gasto en Otros este mes
- **Cuando** la persona recorre las apariencias Clara y Oscura y abre «Fijos y variables»
- **Entonces** la barra de Otros se distingue de su pista en las dos

## Requisito: lista de gastos por categoría

En «Gasto del mes», Inicio muestra el gasto del mes que se ve por categoría en una lista, de mayor a menor: una fila por categoría con el cuadradito de su color y su ícono, su nombre, su importe y su porcentaje del mes, y debajo una barra de su color proporcional a lo gastado (la más grande llega al ancho entero). El encabezado dice el total del mes. Entran las cinco categorías con más gasto; si hay más, las demás se suman en una fila gris «Resto (N categorías)». Cada nombre tiene su renglón: si es largo, se corta con puntos suspensivos y nunca se pisa con el importe. Ingresos, transferencias y ajustes no cuentan; los gastos reembolsables sí.

### Escenario: lista con tres categorías
- **Dado** 60 € en Supermercado, 30 € en Comida fuera y 10 € en Transporte este mes
- **Cuando** la persona abre Inicio
- **Entonces** «Gasto del mes» dice 100 € y la lista tiene tres filas: Supermercado, Comida fuera y Transporte, en ese orden
- **Y** la fila de Supermercado dice «60 €» y «60 %», y su barra es el doble de larga que la de Comida fuera

### Escenario: más de cinco categorías
- **Dado** gastos en siete categorías este mes
- **Cuando** la persona abre Inicio
- **Entonces** la lista tiene cinco filas de color y una gris «Resto (2 categorías)» con la suma de las otras dos

### Escenario: lista sin gastos
- **Dado** que no hay gastos en el mes que se ve
- **Cuando** la persona abre Inicio
- **Entonces** no se dibuja la lista y se lee «Todavía no anotaste gastos este mes. Tocá + para empezar.»

### Escenario: un nombre largo no se pisa
- **Dado** gastos en una categoría con un nombre de 30 caracteres
- **Cuando** la persona abre Inicio a 390 px
- **Entonces** el nombre se corta con puntos suspensivos, no se superpone con el importe y la pantalla no tiene desplazamiento horizontal

## Requisito: gasto por categoría en tarjetas apiladas

Tocar el encabezado de «Gasto del mes» o la fila «Resto» abre la hoja «Gasto por categoría» del mes que se ve: todas las categorías con gasto, de mayor a menor, cada una en una tarjeta de su color con degradado, apiladas de modo que cada una asoma por debajo de la anterior. Cada tarjeta lleva el ícono y el nombre de la categoría, su total, su porcentaje del mes, cuántos gastos tiene, la marca «Fijo» si es una categoría siempre fija, y el cambio frente al mes anterior en porcentaje. Tocar una tarjeta abre la hoja de esa categoría.

### Escenario: categorías apiladas de mayor a menor
- **Dado** que hoy es 2026-10-15, este mes 60 € en Supermercado en tres gastos, 30 € en Comida fuera y 10 € en Transporte
- **Cuando** la persona toca «Gasto del mes» en Inicio
- **Entonces** se abre «Gasto por categoría» con «octubre 2026» y tres tarjetas: Supermercado, Comida fuera y Transporte, en ese orden
- **Y** la de Supermercado dice 60 €, «60 %» y «3 gastos»

### Escenario: cambio frente al mes anterior
- **Dado** 100 € en Supermercado en octubre 2026 y 80 € en septiembre 2026
- **Cuando** la persona abre «Gasto por categoría» en octubre
- **Entonces** la tarjeta de Supermercado dice «+25 % vs sep.»

### Escenario: sin gasto el mes anterior
- **Dado** 50 € en Supermercado en octubre 2026 y nada en septiembre 2026
- **Cuando** la persona abre «Gasto por categoría» en octubre
- **Entonces** la tarjeta de Supermercado no muestra cambio frente al mes anterior

### Escenario: desde Resto
- **Dado** gastos en siete categorías este mes
- **Cuando** la persona toca «Resto» en «Gasto del mes»
- **Entonces** se abre «Gasto por categoría» con las siete categorías

### Escenario: el texto de cada tarjeta se lee
- **Dado** un gasto en cada una de las 19 categorías
- **Cuando** la persona abre «Gasto por categoría» en las apariencias Clara y Oscura
- **Entonces** el texto de cada tarjeta tiene contraste de al menos 4,5 a 1 en el punto de su degradado donde peor se lee
