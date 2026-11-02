# Capacidad: importacion

## Requisito: leer el extracto de Revolut en inglés

El extracto de la cuenta de Revolut en euros descargado en inglés se lee igual que el de español: cada línea con su fecha, su
descripción y su importe (lo que sale, negativo; lo que entra, positivo), el saldo final para conciliar y el número de cuenta. Si
el PDF trae también un extracto en otra moneda, esa parte no se lee. El extracto en español se lee como siempre.

### Escenario: extracto en inglés
- **Dado** un extracto de Revolut en inglés de octubre de 2026 con un pago de 10,00 € el 1 de octubre y un ingreso de 40,00 € el 5 de octubre
- **Cuando** la persona lo importa
- **Entonces** la revisión muestra el pago de 10,00 € como gasto el 2026-10-01
- **Y** el ingreso de 40,00 € el 2026-10-05
- **Y** la app reconoce la cuenta por los últimos cuatro dígitos de su número

### Escenario: saldo final del extracto en inglés
- **Dado** un extracto de Revolut en inglés con saldo final de 17,89 €
- **Cuando** la persona lo guarda
- **Entonces** la app ofrece conciliar con ese saldo

### Escenario: el extracto en español sigue igual
- **Dado** un extracto de Revolut en español con los mismos movimientos
- **Cuando** la persona lo importa
- **Entonces** la revisión muestra los mismos movimientos, con las mismas fechas e importes

### Escenario: otra moneda en el mismo archivo
- **Dado** un archivo con un extracto de Revolut en euros y otro en dólares sin movimientos
- **Cuando** la persona lo importa
- **Entonces** sólo se leen los movimientos en euros

### Escenario: el mismo extracto con otro rango de fechas
- **Dado** el extracto del 1 al 31 de octubre ya importado y el mismo extracto hasta el 2 de noviembre
- **Cuando** la persona importa el segundo
- **Entonces** los movimientos de octubre llegan desmarcados como «Ya está»

### Escenario: extracto en inglés sin movimientos
- **Dado** un extracto de Revolut en inglés sin ninguna transacción
- **Cuando** la persona lo importa
- **Entonces** la app avisa «No encontré movimientos en este archivo.» y no abre la revisión

## Requisito: el pago de la tarjeta no se cuenta dos veces

Cuando el extracto de una cuenta trae un pago a una tarjeta propia y esa tarjeta ya tiene anotado un ingreso «Pago» del mismo importe
con fecha a no más de tres días, la línea llega marcada como «Reemplaza el pago anotado». Al guardar, queda una sola transferencia
de la cuenta a la tarjeta y se quita el ingreso anotado antes. Si no hay un ingreso que coincida, el pago se anota como transferencia
nueva. Si la persona desmarca la línea, no se cambia nada. Un mismo ingreso no se reemplaza dos veces.

### Escenario: el pago ya estaba en la tarjeta
- **Dado** «Tarjeta A» con un ingreso «Pago» de 700,00 € del 2026-10-02 y «Banco A» con una deuda de 1.000,00 € en la tarjeta
- **Cuando** la persona importa un extracto de Banco A con «Liquidación de las tarjetas de crédito» por 700,00 € el 2026-10-02
- **Entonces** esa línea llega marcada como «Reemplaza el pago anotado»
- **Y** al guardar, la tarjeta tiene una transferencia de Banco A por 700,00 € y ningún ingreso «Pago»
- **Y** la deuda de la tarjeta es la misma que antes de importar

### Escenario: el pago de este mes todavía no estaba
- **Dado** «Tarjeta A» sin ningún ingreso «Pago» de 767,00 €
- **Cuando** la persona importa un extracto de Banco A con una liquidación de 767,00 €
- **Entonces** esa línea llega sin marca y se anota como transferencia nueva

### Escenario: fecha a tres días
- **Dado** un ingreso «Pago» de 700,00 € en la tarjeta el 2026-10-01 y una liquidación en el banco el 2026-10-04
- **Cuando** la persona importa el extracto del banco
- **Entonces** la línea reemplaza ese ingreso

### Escenario: fecha a más de tres días
- **Dado** un ingreso «Pago» de 700,00 € en la tarjeta el 2026-10-01 y una liquidación en el banco el 2026-10-05
- **Cuando** la persona importa el extracto del banco
- **Entonces** la línea llega sin marca y el ingreso se queda como estaba

### Escenario: dos pagos iguales
- **Dado** dos ingresos «Pago» de 100,00 € en la tarjeta y una sola liquidación de 100,00 € en el banco
- **Cuando** la persona importa el extracto del banco
- **Entonces** la liquidación reemplaza un solo ingreso y el otro se queda

### Escenario: la línea desmarcada no cambia nada
- **Dado** un ingreso «Pago» reemplazable y la línea marcada «Reemplaza el pago anotado»
- **Cuando** la persona la desmarca y guarda
- **Entonces** el ingreso «Pago» sigue en la tarjeta y no se anota ninguna transferencia por esa línea

### Escenario: primero el banco y después la tarjeta
- **Dado** la transferencia de 700,00 € de Banco A a la tarjeta ya guardada
- **Cuando** la persona importa el resumen de la tarjeta con ese pago
- **Entonces** el pago llega desmarcado como «Ya está»

### Escenario: tres resúmenes y el extracto del banco
- **Dado** tres resúmenes de tarjeta seguidos con sus pagos ya importados y el extracto del banco con esos mismos pagos más uno nuevo
- **Cuando** la persona importa el extracto del banco
- **Entonces** los pagos repetidos se reemplazan, el nuevo se anota como transferencia y la deuda de la tarjeta baja sólo por el pago nuevo
