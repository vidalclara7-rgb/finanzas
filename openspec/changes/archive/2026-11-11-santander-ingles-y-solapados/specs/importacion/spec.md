# Capacidad: importacion

## Requisito: leer el extracto de Santander en inglés

El extracto de movimientos de la cuenta de Santander descargado en inglés se lee como el de español: cada movimiento con su fecha valor, su concepto y su importe con signo, el saldo disponible para conciliar y el número de cuenta. Si un movimiento no trae fecha valor, se usa la fecha de operación.

### Escenario: extracto en inglés
- **Dado** un extracto de Santander en inglés con un pago de 35,00 € del 2 de noviembre de 2026 y una nómina de 2000,00 € del 30 de octubre
- **Cuando** la persona lo importa
- **Entonces** la revisión muestra el pago como gasto de 35,00 € y la nómina como ingreso de 2000,00 €
- **Y** la app reconoce la cuenta por los últimos cuatro dígitos de su número

### Escenario: se usa la fecha valor
- **Dado** un movimiento con fecha de operación 5 de noviembre y fecha valor 3 de noviembre
- **Cuando** la persona importa el extracto
- **Entonces** el movimiento llega con fecha 2026-11-03

### Escenario: saldo para conciliar
- **Dado** un extracto en inglés con saldo disponible de 52,00 € al 11 de noviembre de 2026
- **Cuando** la persona lo guarda
- **Entonces** la app ofrece conciliar con 52,00 €

### Escenario: concepto en dos líneas
- **Dado** un movimiento cuyo concepto sigue en la línea de la fecha valor
- **Cuando** la persona importa el extracto
- **Entonces** el movimiento se reconoce con el concepto completo, por ejemplo como pago a su tarjeta propia

### Escenario: el extracto en español sigue igual
- **Dado** un extracto de Santander en español con los mismos movimientos
- **Cuando** la persona lo importa
- **Entonces** la revisión muestra los mismos movimientos, con las mismas fechas e importes

### Escenario: extracto en inglés sin movimientos
- **Dado** un extracto de Santander en inglés sin ningún movimiento
- **Cuando** la persona lo importa
- **Entonces** la app avisa «No encontré movimientos en este archivo.» y no abre la revisión

## Requisito: no contar dos veces

Un movimiento que ya está cargado en esa cuenta (misma fecha e importe) llega desmarcado como «Ya está». Cada movimiento guardado cubre uno solo del extracto: si el extracto trae más movimientos iguales que los guardados, los que sobran entran como nuevos. Vale igual entre extractos de formatos distintos de la misma cuenta: cuando el extracto trae fecha de operación y fecha valor, coincide con lo guardado en cualquiera de las dos y, si no, con un movimiento igual guardado a tres días o menos (cada formato fecha distinto el mismo movimiento). Una compra y su anulación por el mismo importe y comercio el mismo día llegan desmarcadas las dos, como «Anulada».

### Escenario: movimiento ya cargado
- **Dado** un gasto de 25,30 € del 2026-10-18 ya cargado en Banco A
- **Cuando** la persona importa un extracto de Banco A con ese mismo movimiento
- **Entonces** ese movimiento llega desmarcado como «Ya está»

### Escenario: compra anulada
- **Dado** un extracto con una compra de 3,50 € y su anulación el mismo día en el mismo comercio
- **Cuando** la persona lo importa
- **Entonces** las dos llegan desmarcadas como «Anulada»

### Escenario: dos iguales y uno guardado
- **Dado** un gasto de 400,00 € del 2026-11-03 ya cargado en Banco A
- **Cuando** la persona importa un extracto de Banco A con dos gastos de 400,00 € del 2026-11-03
- **Entonces** uno llega como «Ya está» y el otro entra como nuevo

### Escenario: dos iguales y dos guardados
- **Dado** dos gastos de 400,00 € del 2026-11-03 ya cargados en Banco A
- **Cuando** la persona importa un extracto con esos dos gastos
- **Entonces** los dos llegan como «Ya está»

### Escenario: extractos solapados de distinto formato
- **Dado** un extracto de Santander en español ya importado, con movimientos del 23 al 31 de octubre
- **Cuando** la persona importa un extracto en inglés del 23 de octubre al 5 de noviembre con esos mismos movimientos y tres más
- **Entonces** los de octubre llegan como «Ya está» y sólo entran los tres nuevos

### Escenario: importar dos veces el mismo extracto
- **Dado** un extracto ya importado entero
- **Cuando** la persona lo importa otra vez
- **Entonces** todos sus movimientos llegan como «Ya está» y la app avisa «Marcá al menos un movimiento» si intenta guardar

### Escenario: guardado con la fecha de operación
- **Dado** un gasto de 8,00 € guardado en Banco A con fecha 2026-10-05
- **Cuando** la persona importa un extracto de Santander con ese gasto, con fecha de operación 5 de octubre y fecha valor 4 de octubre
- **Entonces** ese movimiento llega como «Ya está»

### Escenario: guardado con otra fecha cercana
- **Dado** un gasto de 20,70 € guardado en Banco A con fecha 2026-10-05
- **Cuando** la persona importa un extracto de Santander con ese gasto con fecha de operación y fecha valor 4 de octubre
- **Entonces** ese movimiento llega como «Ya está»

### Escenario: la holgura no tapa un movimiento nuevo
- **Dado** un gasto de 2,10 € guardado en Banco A con fecha 2026-10-10
- **Cuando** la persona importa un extracto de Santander con ese gasto del 10 de octubre y otro de 2,10 € del 11 de octubre
- **Entonces** el del 10 llega como «Ya está» y el del 11 entra como nuevo

## Requisito: resumen de la revisión

Arriba de la lista, la revisión del extracto dice el periodo que cubre el archivo y cuántos movimientos son nuevos y cuántos ya estaban. El periodo es el de las fechas del primer y del último movimiento del archivo; si no hay fechas, muestra sólo los conteos. La lista muestra sólo los movimientos nuevos; los que ya estaban quedan plegados bajo «Ver los N que ya estaban» y, al abrirlo, se pueden marcar para guardarlos igual.

### Escenario: nuevos y repetidos
- **Dado** un extracto del 23/10 al 05/11 con 3 movimientos nuevos y 5 que ya estaban
- **Cuando** la persona abre la revisión
- **Entonces** ve «Del 23/10 al 05/11 · 3 nuevos · 5 ya estaban»

### Escenario: todo nuevo
- **Dado** un extracto con 4 movimientos y ninguno guardado
- **Cuando** la persona abre la revisión
- **Entonces** el resumen dice «4 nuevos · 0 ya estaban»

### Escenario: periodo de un archivo de tabla
- **Dado** un archivo CSV con dos movimientos del 5 y del 6 de octubre
- **Cuando** la persona abre la revisión
- **Entonces** el resumen dice «Del 05/10 al 06/10 · 2 nuevos · 0 ya estaban»

### Escenario: los que ya estaban quedan plegados
- **Dado** un extracto con 3 movimientos nuevos y 5 que ya estaban
- **Cuando** la persona abre la revisión
- **Entonces** la lista muestra los 3 nuevos y el texto «Ver los 5 que ya estaban»
- **Y** los 5 no se ven hasta tocarlo

### Escenario: abrir los que ya estaban
- **Dado** la revisión con «Ver los 5 que ya estaban»
- **Cuando** la persona lo toca y marca uno de ellos
- **Entonces** ve los 5 con la marca «Ya está» y el botón pasa a «Guardar 4 movimientos»

### Escenario: sin repetidos no hay plegado
- **Dado** un extracto con 4 movimientos y ninguno guardado
- **Cuando** la persona abre la revisión
- **Entonces** no aparece «Ver los que ya estaban»
