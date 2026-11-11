# Capacidad: movimientos

## Requisito: ver los movimientos del mes

La pestaña Movimientos muestra los movimientos del mes elegido (por defecto, el mes en curso) agrupados por semana (días 1 a 7,
8 a 14, 15 a 21, 22 a 28 y 29 a fin de mes), de la más reciente a la más antigua. Cada semana lleva su total de gastos
(con «−») y, si los hay, de ingresos (con «+»). Dentro de la semana, cada día, también del más reciente al más antiguo, lleva su
fecha («Jueves 15») y el total de lo gastado ese día; dentro del día, los movimientos van juntos por categoría. Una semana o un
día sin movimientos no aparece. Cada movimiento es una fila blanca con un círculo a la izquierda (el color de su categoría con su
inicial; verde en los ingresos y gris en las transferencias y los ajustes), el concepto (la nota o, si no hay, la categoría) y el
importe a la derecha; debajo del concepto, en letra pequeña, la categoría cuando hay nota y las marcas del movimiento (documento,
cuota, reembolso, fijo). Los gastos llevan el importe en rosa con «−», los ingresos en verde con «+», y las transferencias y los
ajustes en el color del texto, con la cuenta de origen y la de destino como concepto en las transferencias. Si el movimiento no es
en euros, el importe lleva su moneda. Sólo los ajustes llevan una cruz en la fila. Arriba, dos tarjetas, «Gastado» (punto rosa) e
«Ingresado» (punto verde), con el total de gastos y el de ingresos del mes; transferencias y ajustes no suman en ninguno, ni en el
mes, ni en la semana, ni en el día. Inicio no repite la lista de gastos recientes: para verlos, se abre Movimientos.

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

### Escenario: cada movimiento en una fila con círculo
- **Dado** diez gastos este mes, uno de ellos con nota
- **Cuando** la persona abre Movimientos con un teléfono de 390 px de ancho
- **Entonces** cada fila sin marcas mide como máximo 72 px de alto, tiene un círculo a la izquierda y no se solapa con la siguiente
- **Y** el que tiene nota muestra la nota como concepto y su categoría debajo, en letra pequeña

### Escenario: sin nota se ve la categoría
- **Dado** un gasto de Transporte sin nota
- **Cuando** la persona abre Movimientos
- **Entonces** el concepto del movimiento es «Transporte»

### Escenario: marcas bajo el concepto
- **Dado** un gasto con un documento adjunto y otro sin marcas
- **Cuando** la persona abre Movimientos
- **Entonces** el primero muestra su marca de documento bajo el concepto
- **Y** el segundo no muestra ninguna marca

### Escenario: importes verdes y rosas
- **Dado** un ingreso y un gasto este mes
- **Cuando** la persona abre Movimientos
- **Entonces** el ingreso se escribe en verde con «+» y el gasto en rosa con «−»

### Escenario: una descripción larga no desborda
- **Dado** un gasto con una nota de 80 caracteres
- **Cuando** la persona abre Movimientos
- **Entonces** la nota se corta con puntos suspensivos y el importe sigue completo a la derecha
- **Y** la pantalla no se desplaza hacia los lados
