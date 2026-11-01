# Capacidad: movimientos

## Requisito: ver los movimientos del mes

La pestaña Movimientos muestra los movimientos del mes elegido (por defecto, el mes en curso) agrupados por semana (días 1 a 7,
8 a 14, 15 a 21, 22 a 28 y 29 a fin de mes), de la más reciente a la más antigua. Cada semana lleva su total de gastos
(con «−») y, si los hay, de ingresos (con «+»). Dentro de la semana, cada día, también del más reciente al más antiguo, lleva su
fecha («Jueves 15») y el total de lo gastado ese día; dentro del día, los movimientos van juntos por categoría. Una semana o un
día sin movimientos no aparece. Cada movimiento ocupa una sola línea de poca altura: el concepto (la nota o, si no hay, la
categoría) y el importe, sin icono; la fecha la dice el día. Cada gasto lleva el color de su categoría, los ingresos van en
verde, y las transferencias y los ajustes en gris. Ingresos con «+», gastos con «−», transferencias con la cuenta de origen y la
de destino como concepto. Si el movimiento no es en euros, el importe lleva su moneda. Las marcas de un movimiento (documento,
cuota, reembolso, fijo) van en una segunda fila fina, sólo en los que las tienen. Sólo los ajustes llevan una cruz en la fila.
Arriba, el total de ingresos y el de gastos del mes; transferencias y ajustes no suman en ninguno, ni en el mes, ni en la semana,
ni en el día. Inicio no repite la lista de gastos recientes: para verlos, se abre Movimientos.

### Escenario: movimientos de otro mes no aparecen
- **Dado** que hoy es 2026-10-15, un gasto del 2026-09-28 y otro del 2026-10-03
- **Cuando** la persona abre Movimientos
- **Entonces** sólo ve el gasto del 2026-10-03

### Escenario: Inicio sin gastos recientes
- **Dado** seis gastos este mes
- **Cuando** la persona abre Inicio
- **Entonces** no ve tarjetas con los últimos gastos
- **Y** Movimientos muestra los seis, el más reciente primero

### Escenario: mes sin movimientos
- **Dado** que no hay movimientos en el mes en curso
- **Cuando** la persona abre Movimientos
- **Entonces** ve «Sin movimientos este mes.»

### Escenario: totales sin transferencias
- **Dado** un ingreso de 1500 €, un gasto de 80 € y una transferencia de 300 € este mes
- **Cuando** la persona abre Movimientos
- **Entonces** ve ingresos 1500 € y gastos 80 €

### Escenario: movimiento en otra moneda
- **Dado** un gasto de 20 USD este mes
- **Cuando** la persona abre Movimientos
- **Entonces** el movimiento muestra «−20 USD»

### Escenario: cada movimiento en una línea
- **Dado** diez gastos este mes, uno de ellos con nota
- **Cuando** la persona abre Movimientos con un teléfono de 390 px de ancho
- **Entonces** cada movimiento sin marcas mide como máximo 56 px de alto y no se solapa con el siguiente
- **Y** el que tiene nota muestra la nota y no muestra su categoría ni ningún icono

### Escenario: sin nota se ve la categoría
- **Dado** un gasto de Transporte sin nota
- **Cuando** la persona abre Movimientos
- **Entonces** el concepto del movimiento es «Transporte»

### Escenario: marcas en una segunda fila
- **Dado** un gasto con un documento adjunto y otro sin marcas
- **Cuando** la persona abre Movimientos
- **Entonces** el primero muestra su marca de documento en una segunda fila
- **Y** el segundo sigue en una sola línea

### Escenario: una descripción larga no desborda
- **Dado** un gasto con una nota de 80 caracteres
- **Cuando** la persona abre Movimientos
- **Entonces** la nota se corta con puntos suspensivos y el importe sigue completo a la derecha
- **Y** la pantalla no se desplaza hacia los lados

### Escenario: gastos agrupados por semana con su total
- **Dado** que hoy es 2026-10-24 y gastos de 10 € el día 3, 20 € el día 5, 30 € el día 9 y un ingreso de 100 € el día 10
- **Cuando** la persona abre Movimientos
- **Entonces** ve las semanas «Semana del 8 al 14» (ingresos +100 €, gastos −30 €) y «Semana del 1 al 7» (gastos −30 €), en ese orden

### Escenario: días con su total dentro de la semana
- **Dado** gastos de 10 € y 15 € el 2026-10-05 y de 20 € el 2026-10-03
- **Cuando** la persona abre Movimientos
- **Entonces** dentro de «Semana del 1 al 7» ve «Lunes 5» con −25 € y debajo «Sábado 3» con −20 €
- **Y** las filas ya no muestran su fecha

### Escenario: categorías juntas dentro del día
- **Dado** tres gastos del mismo día: 10 € en Ocio, 20 € en Compras y 5 € en Ocio
- **Cuando** la persona abre Movimientos
- **Entonces** ese día muestra primero Compras y después los dos de Ocio, uno junto al otro

### Escenario: transferencias y ajustes no suman
- **Dado** un gasto de 10 € y una transferencia de 300 € el mismo día
- **Cuando** la persona abre Movimientos
- **Entonces** el total del día y el de la semana es −10 €
- **Y** la transferencia aparece en el día sin sumar

### Escenario: las semanas vacías no aparecen
- **Dado** gastos sólo el día 3 y el día 20 del mes
- **Cuando** la persona abre Movimientos
- **Entonces** ve dos semanas, «Semana del 15 al 21» y «Semana del 1 al 7»

### Escenario: los filtros siguen agrupando
- **Dado** gastos reembolsables en dos semanas distintas
- **Cuando** la persona filtra por «Pendiente»
- **Entonces** ve sólo esos gastos, cada uno en su semana y su día

### Escenario: la búsqueda no agrupa
- **Dado** una búsqueda con resultados de varios meses
- **Cuando** la persona mira los resultados
- **Entonces** los ve en una lista, cada uno con su fecha completa
