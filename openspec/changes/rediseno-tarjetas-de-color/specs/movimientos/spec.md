# Capacidad: movimientos

## Requisito: ver los movimientos del mes

La pestaña Movimientos muestra los movimientos del mes elegido (por defecto, el mes en curso) agrupados por semana (días 1 a 7,
8 a 14, 15 a 21, 22 a 28 y 29 a fin de mes), de la más reciente a la más antigua. Cada semana lleva su total de gastos
(con «−») y, si los hay, de ingresos (con «+»). Dentro de la semana, cada día, también del más reciente al más antiguo, lleva su
fecha («Jueves 15») y el total de lo gastado ese día; dentro del día, los movimientos van juntos por categoría, en un grupo de
esquinas redondeadas con las filas separadas por una línea fina. Una semana o un día sin movimientos no aparece. Cada movimiento es
una fila con un cuadradito de esquinas redondeadas a la izquierda (el color de su categoría con su ícono, o su inicial si no tiene;
verde con una flecha de entrada en los ingresos; gris con flechas en las transferencias y gris con una cruz en los ajustes), el
concepto (la nota o, si no hay, la categoría) y el importe a la derecha; debajo del concepto, en letra pequeña, la categoría
cuando hay nota y las marcas del movimiento (documento, cuota, reembolso, fijo). Los gastos llevan el importe en el color del texto
con «−», los ingresos en verde con «+», y las transferencias y los ajustes en el color del texto, con la cuenta de origen y la de
destino como concepto en las transferencias. Si el movimiento no es en euros, el importe lleva su moneda. Arriba, dos tarjetas,
«Gastado» (punto del color del texto) e «Ingresado» (punto verde), con el total de gastos y el de ingresos del mes; transferencias
y ajustes no suman en ninguno, ni en el mes, ni en la semana, ni en el día. Inicio no repite la lista de gastos recientes: para
verlos, se abre Movimientos.

### Escenario: movimientos de otro mes no aparecen
- **Dado** que hoy es 2026-10-15, un gasto del 2026-09-28 y otro del 2026-10-03
- **Cuando** la persona abre Movimientos
- **Entonces** sólo ve el gasto del 2026-10-03

### Escenario: Inicio sin gastos recientes
- **Dado** seis gastos este mes
- **Cuando** la persona abre Inicio
- **Entonces** no ve filas con los últimos gastos
- **Y** Movimientos muestra los seis, el más reciente primero

### Escenario: mes sin movimientos
- **Dado** que no hay movimientos en el mes en curso
- **Cuando** la persona abre Movimientos
- **Entonces** ve «Sin movimientos este mes.»

### Escenario: totales sin transferencias
- **Dado** un ingreso de 1500 €, un gasto de 80 € y una transferencia de 300 € este mes
- **Cuando** la persona abre Movimientos
- **Entonces** ve «Ingresado» 1500 € y «Gastado» 80 €

### Escenario: movimiento en otra moneda
- **Dado** un gasto de 20 USD este mes
- **Cuando** la persona abre Movimientos
- **Entonces** el movimiento muestra «−20 USD»

### Escenario: cada movimiento en una fila con su ícono
- **Dado** diez gastos este mes, uno de ellos con nota y uno en Comida fuera
- **Cuando** la persona abre Movimientos con un teléfono de 390 px de ancho
- **Entonces** cada fila sin marcas mide como máximo 64 px de alto, tiene un cuadradito redondeado a la izquierda y no se solapa con la siguiente
- **Y** el de Comida fuera lleva el ícono del café
- **Y** el que tiene nota muestra la nota como concepto y su categoría debajo, en letra pequeña

### Escenario: categoría sin ícono
- **Dado** una categoría «Mascotas» sin ícono elegido y un gasto en ella
- **Cuando** la persona abre Movimientos
- **Entonces** el cuadradito del gasto lleva la «M» en el color de Mascotas

### Escenario: ingresos, transferencias y ajustes
- **Dado** un ingreso, una transferencia y un ajuste este mes
- **Cuando** la persona abre Movimientos
- **Entonces** el ingreso lleva un cuadradito verde con una flecha de entrada, la transferencia uno gris con flechas y el ajuste uno gris con una cruz

### Escenario: sin nota se ve la categoría
- **Dado** un gasto de Transporte sin nota
- **Cuando** la persona abre Movimientos
- **Entonces** el concepto del movimiento es «Transporte»

### Escenario: marcas bajo el concepto
- **Dado** un gasto con un documento adjunto y otro sin marcas
- **Cuando** la persona abre Movimientos
- **Entonces** el primero muestra su marca de documento bajo el concepto
- **Y** el segundo no muestra ninguna marca

### Escenario: importes verdes y del color del texto
- **Dado** un ingreso y un gasto este mes
- **Cuando** la persona abre Movimientos
- **Entonces** el ingreso se escribe en verde con «+» y el gasto en el color del texto con «−»

### Escenario: una descripción larga no desborda
- **Dado** un gasto con una nota de 80 caracteres
- **Cuando** la persona abre Movimientos
- **Entonces** la nota se corta con puntos suspensivos y el importe sigue completo a la derecha
- **Y** la pantalla no se desplaza hacia los lados

## Requisito: gasto por categoría

Inicio muestra lo gastado en el mes por categoría, de mayor a menor, en el mosaico de «Gasto del mes», incluidos los gastos
reembolsables; la hoja «Gasto por categoría» las muestra todas. Ingresos, transferencias y ajustes no aparecen.

### Escenario: categorías ordenadas
- **Dado** 64,30 € en Supermercado, 42 € en Trabajo (reembolsable), 18 € en Comida fuera y un ingreso de 1500 € este mes
- **Cuando** la persona abre «Gasto por categoría» desde Inicio
- **Entonces** ve Supermercado, Trabajo (reembolsable) y Comida fuera, en ese orden

### Escenario: sin gastos por categoría
- **Dado** que no hay gastos en el mes en curso
- **Cuando** la persona abre Inicio
- **Entonces** «Gasto del mes» dice «Todavía no anotaste gastos este mes. Tocá + para empezar.»

## Requisito: resultado del mes

Inicio muestra los ingresos, los gastos y el resultado del mes en curso (ingresos menos gastos).
Transferencias y ajustes no cuentan, y tampoco los gastos de «Trabajo (reembolsable)» ni los ingresos de
Reembolso: el resultado es el de la plata propia. Los totales de Movimientos sí los incluyen.

### Escenario: resultado con ingresos y gastos
- **Dado** ingresos de 1500 € en Sueldo y 200 € en Venta o trabajo extra, y gastos de 64,30 € y 18 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** el resultado dice «Te sobraron 1617,7 €» y «de 1700 € que entraron»

### Escenario: mes en negativo
- **Dado** un ingreso de 100 € y gastos por 150 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** el resultado dice «Te faltaron 50 €» y se marca en rosa

### Escenario: reembolsos fuera del resultado
- **Dado** un ingreso de 1000 € en Sueldo y otro de 50 € en Reembolso, y gastos de 200 € en Supermercado y 50 € en Trabajo (reembolsable) este mes
- **Cuando** la persona abre Inicio
- **Entonces** el resultado dice «Te sobraron 800 €» y «de 1000 € que entraron»
- **Y** en Movimientos, los totales son ingresos 1050 € y gastos 250 €
