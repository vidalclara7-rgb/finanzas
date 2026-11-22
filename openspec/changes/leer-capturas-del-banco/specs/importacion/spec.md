# Capacidad: importacion

## Requisito: leer una lista de movimientos agrupada por día

Algunos historiales de movimientos, vistos en una captura o en un archivo, ponen la fecha una sola vez en un encabezado («21 NOV 2026») y debajo, sin fecha propia, cada movimiento con su descripción y su importe con signo («−5,80€»). La app los lee con la fecha del encabezado bajo el que están. Las fechas con el mes en letras, abreviado o completo, en castellano o en inglés, se reconocen. Con importe negativo el movimiento es un gasto y con importe positivo, un ingreso. Los textos que no son encabezado ni movimiento (título, botones, selector de mes) se ignoran. Sin año en la fecha no se lee.

### Escenario: captura con dos días
- **Dado** una captura con el encabezado «21 NOV 2026» y dos movimientos, «Tienda A −5,80€» y «Tienda B −6,50€», y el encabezado «19 NOV 2026» con «Banco A Premia 0,28€»
- **Cuando** la persona la importa y elige «Banco A» como cuenta
- **Entonces** la app dice «Revisá 3 movimientos»
- **Y** los dos primeros son gastos del 21/11/2026 de 5,80 € y 6,50 €, y el tercero es un ingreso del 19/11/2026 de 0,28 €

### Escenario: mes en letras en castellano
- **Dado** una captura con el encabezado «3 ENE 2027» y un movimiento «Tienda A −10,00€»
- **Cuando** la persona la importa
- **Entonces** el movimiento llega con fecha 2027-01-03

### Escenario: textos que no son movimientos
- **Dado** una captura con el título «Statement history», el selector «Select the month NOVEMBER», los botones «Purchase map» y «PDF statement» y un movimiento de 12,50 € bajo su encabezado de fecha
- **Cuando** la persona la importa
- **Entonces** la app dice «Revisá 1 movimiento»

### Escenario: fecha sin año
- **Dado** una captura con el encabezado «21 NOV» y un movimiento debajo
- **Cuando** la persona la importa
- **Entonces** la app avisa «No encontré movimientos en este archivo.» y no cambia nada

### Escenario: una tabla con fecha en cada fila sigue igual
- **Dado** un CSV con fecha e importe en cada fila
- **Cuando** la persona lo importa
- **Entonces** la app lo lee como siempre

## Requisito: importar varias capturas a la vez

Al importar desde Movimientos, la persona puede elegir varias fotos juntas. Se leen todas, se revisan en una sola hoja y, si el final de una captura repite el principio de otra (porque la persona las hizo solapadas), esos movimientos se cuentan una sola vez. Dos movimientos iguales que no vienen de un solapamiento se conservan los dos. El orden en que se eligen las fotos no importa. Mientras lee, la app avisa «Leyendo N fotos…». Si entre los archivos elegidos hay alguno que no es una foto, la app avisa «Elegí varias fotos o un solo archivo.» y no cambia nada. Cada foto queda guardada como adjunto de la cuenta, como hoy con un archivo importado.

### Escenario: dos capturas solapadas
- **Dado** una captura con los movimientos A, B y C, y otra con B, C y D, de importes distintos entre sí
- **Cuando** la persona elige las dos y las importa
- **Entonces** la app dice «Revisá 4 movimientos»: A, B, C y D

### Escenario: orden inverso
- **Dado** las mismas dos capturas
- **Cuando** la persona las elige en el orden contrario
- **Entonces** la app dice «Revisá 4 movimientos»

### Escenario: capturas sin solapamiento
- **Dado** una captura con 2 movimientos y otra con 3 movimientos distintos
- **Cuando** la persona elige las dos
- **Entonces** la app dice «Revisá 5 movimientos»

### Escenario: dos compras iguales el mismo día
- **Dado** una captura con dos movimientos «Tienda A −2,00€» el mismo día que no se repiten en otra captura
- **Cuando** la persona la importa
- **Entonces** la app dice «Revisá 2 movimientos»

### Escenario: aviso mientras lee
- **Dado** dos capturas elegidas
- **Cuando** la app las lee
- **Entonces** muestra «Leyendo 2 fotos…» hasta terminar

### Escenario: una foto y un PDF a la vez
- **Dado** una foto y un PDF elegidos juntos
- **Cuando** la persona los importa
- **Entonces** la app avisa «Elegí varias fotos o un solo archivo.» y no cambia nada

### Escenario: las capturas quedan adjuntas
- **Dado** dos capturas importadas y guardadas con movimientos de noviembre de 2026
- **Cuando** la persona abre la hoja de la cuenta
- **Entonces** ve las dos capturas como adjuntos de noviembre de 2026

## Requisito: una captura no duplica lo que luego trae el extracto

Un movimiento leído de una captura se marca «Ya está» si la misma cuenta ya tiene un movimiento del mismo importe con fecha a un máximo de 3 días de distancia, y cada movimiento guardado cubre uno solo. Así, importar después el extracto del cierre, cuya fecha puede ser otra, no vuelve a anotar lo ya anotado desde las capturas.

### Escenario: el extracto del cierre después de las capturas
- **Dado** «Banco A» con un gasto de 12,00 € el 2026-11-14 guardado desde una captura
- **Cuando** la persona importa el extracto con ese gasto fechado el 2026-11-16
- **Entonces** ese movimiento sale con la marca «Ya está»

### Escenario: más de tres días de diferencia
- **Dado** «Banco A» con un gasto de 12,00 € el 2026-11-02
- **Cuando** la persona importa una captura con un gasto de 12,00 € el 2026-11-14
- **Entonces** el gasto de la captura sale como nuevo

## Requisito: avisar siempre qué pasó al leer una foto

Al terminar de leer una foto o varias, la app muestra la revisión con los movimientos encontrados o un aviso que dice por qué no encontró ninguno. Nunca queda sin decir nada. El aviso de que no encontró movimientos se mantiene a la vista seis segundos.

### Escenario: la captura no trae movimientos
- **Dado** una foto con un título y botones pero sin movimientos
- **Cuando** la persona la importa
- **Entonces** la app avisa «No encontré movimientos en este archivo.» y no cambia nada

### Escenario: el aviso dura seis segundos
- **Dado** el aviso «No encontré movimientos en este archivo.» recién mostrado
- **Cuando** pasan cinco segundos
- **Entonces** el aviso sigue visible

### Escenario: algo falla al leer
- **Dado** una foto que provoca un fallo inesperado al leerla
- **Cuando** la persona la importa
- **Entonces** la app avisa «No pude leer este archivo.» y no cambia nada
