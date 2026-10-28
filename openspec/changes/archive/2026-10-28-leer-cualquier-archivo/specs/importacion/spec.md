# Capacidad: importacion

## Retirado: importar un extracto en PDF
Lo sustituye «importar un extracto desde un archivo».

## Requisito: importar un extracto desde un archivo

Desde Movimientos o desde la hoja de una cuenta, la persona elige un archivo con movimientos: un PDF, un Excel (.xlsx), un
CSV, un archivo de texto o una foto. Los formatos conocidos (extracto de cuenta de Revolut en euros, movimientos de cuenta de
Santander y extracto de tarjeta de crédito de Santander) se leen como siempre. Cualquier otro se lee buscando filas con una
fecha y un importe, sea cual sea su formato: con importe negativo es un gasto y con importe positivo es un ingreso. La cuenta
se reconoce por los últimos cuatro dígitos del número de cuenta o de tarjeta que recuerda. La primera vez, la persona elige a
cuál de sus cuentas corresponde. Siempre se revisa antes de guardar.

### Escenario: extracto reconocido
- **Dado** «Banco A» con el extracto de Santander terminado en 4321 ya importado una vez
- **Cuando** la persona importa otro extracto de esa cuenta con 12 movimientos
- **Entonces** la app propone Banco A y dice «Revisá 12 movimientos»

### Escenario: primera vez con una cuenta
- **Dado** «Revolut» sin extractos importados
- **Cuando** la persona importa un extracto de Revolut y elige Revolut como su cuenta
- **Entonces** la próxima vez que importe un extracto de esa cuenta, la app propone Revolut

### Escenario: tabla en Excel con cabeceras en inglés
- **Dado** un Excel con las columnas «Transaction date», «Description», «Amount» y «Currency», y 3 filas con importes negativos
- **Cuando** la persona lo importa desde Movimientos y elige «Banco A» como cuenta
- **Entonces** la app dice «Revisá 3 movimientos» y los muestra como gastos con su fecha, descripción e importe

### Escenario: la misma tabla en un PDF
- **Dado** un PDF con esa misma tabla de 3 movimientos
- **Cuando** la persona lo importa
- **Entonces** la app dice «Revisá 3 movimientos» con los mismos importes

### Escenario: CSV con punto y coma y coma decimal
- **Dado** un CSV separado por punto y coma, con fechas «05/10/2026» e importes «-12,50» y «1.200,00»
- **Cuando** la persona lo importa
- **Entonces** ve un gasto de 12,50 € y un ingreso de 1200 €

### Escenario: columnas de cargo y abono
- **Dado** una tabla con las columnas «Cargo» y «Abono» y una fila con 30,00 en «Cargo» y otra con 100,00 en «Abono»
- **Cuando** la persona la importa
- **Entonces** la primera fila es un gasto de 30 € y la segunda un ingreso de 100 €

### Escenario: todos los importes positivos
- **Dado** una tabla de 4 movimientos con importes sin signo
- **Cuando** la persona la importa
- **Entonces** la app pregunta «Todos los importes son positivos. ¿Son gastos o ingresos?» antes de revisar
- **Y** al elegir «Gastos», los 4 movimientos se proponen como gastos

### Escenario: filas que no son movimientos
- **Dado** una tabla con un título, una fila de cabeceras, 2 movimientos y una fila de total sin fecha
- **Cuando** la persona la importa
- **Entonces** la app dice «Revisá 2 movimientos»

### Escenario: cuenta reconocida por el número de tarjeta
- **Dado** «Tarjeta Y» con el extracto terminado en 0123 ya importado, y un Excel con el número de tarjeta «4000 0000 0000 0123» arriba de la tabla
- **Cuando** la persona lo importa
- **Entonces** la app propone Tarjeta Y sin preguntar

### Escenario: archivo sin movimientos
- **Dado** la app abierta
- **Cuando** la persona elige un archivo de texto sin fechas ni importes
- **Entonces** la app avisa «No encontré movimientos en este archivo.» y no cambia nada

### Escenario: archivo que no se puede leer
- **Dado** un archivo «datos.xlsx» dañado
- **Cuando** la persona lo importa
- **Entonces** la app avisa «No pude leer este archivo.» y no cambia nada

## Requisito: leer fotos

Una foto de un extracto, de un recibo o de una pantalla se lee con reconocimiento de texto dentro de la app, sin enviar
nada a otro sitio, y sus filas pasan por la misma revisión. Mientras lee, la app avisa «Leyendo la foto…». Un PDF sin texto
(escaneado) se lee igual que una foto. La primera vez, el lector de fotos se descarga y necesita conexión.

### Escenario: foto de una tabla de movimientos
- **Dado** una foto con 3 filas de fecha, descripción e importe
- **Cuando** la persona la importa y elige «Banco A» como cuenta
- **Entonces** la app muestra «Leyendo la foto…» y después «Revisá 3 movimientos»

### Escenario: PDF escaneado
- **Dado** un PDF que es una imagen de una tabla con 3 movimientos
- **Cuando** la persona lo importa
- **Entonces** la app lo lee como una foto y dice «Revisá 3 movimientos»

### Escenario: foto sin texto
- **Dado** una foto sin texto legible
- **Cuando** la persona la importa
- **Entonces** la app avisa «No pude leer texto en la foto.» y no cambia nada

### Escenario: el lector de fotos no se puede cargar
- **Dado** que el lector de fotos no se puede descargar
- **Cuando** la persona importa una foto
- **Entonces** la app avisa «No pude cargar el lector de fotos. Probá de nuevo con conexión.» y no cambia nada

### Escenario: la lectura no pide nada a otros sitios
- **Dado** una foto de una tabla
- **Cuando** la persona la importa
- **Entonces** la app no hace ninguna petición fuera de su propio sitio
