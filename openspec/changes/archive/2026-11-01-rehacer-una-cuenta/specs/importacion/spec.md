# Capacidad: importacion

## Requisito: empezar la cuenta con el saldo anterior del resumen

Cuando el resumen de una tarjeta de Santander trae el saldo anterior y la cuenta de destino es una tarjeta sin ningún
movimiento, la revisión muestra la casilla «Empezar esta cuenta con el saldo anterior del resumen» con ese importe y su fecha,
marcada. Si queda marcada al guardar, la deuda inicial de la cuenta pasa a ser ese saldo anterior, desde esa fecha, y lo que se
importa cuadra con el resumen. Si ya hay movimientos, o el resumen no trae el saldo anterior, no se ofrece.

### Escenario: ofrecer empezar con el saldo anterior
- **Dado** «Tarjeta Y» sin movimientos y un resumen de tarjeta con saldo anterior de 742,94 € al 29/09
- **Cuando** la persona lo importa
- **Entonces** la revisión muestra la casilla marcada «Empezar esta cuenta con el saldo anterior del resumen: 742,94 € el 29/09»

### Escenario: guardar empezando con el saldo anterior
- **Dado** esa revisión con la casilla marcada y un resumen que paga 742,94 € y trae compras por 100 €
- **Cuando** la persona guarda
- **Entonces** la deuda inicial de Tarjeta Y es 742,94 € desde 2026-09-29
- **Y** al conciliar con el resumen la diferencia es 0 €

### Escenario: no empezar con el saldo anterior
- **Dado** esa revisión
- **Cuando** la persona desmarca la casilla y guarda
- **Entonces** la deuda inicial y la fecha de inicio de la cuenta no cambian

### Escenario: una cuenta con movimientos no lo ofrece
- **Dado** «Tarjeta Y» con un gasto
- **Cuando** la persona importa el resumen
- **Entonces** la revisión no muestra «Empezar esta cuenta con el saldo anterior del resumen»

### Escenario: un resumen sin saldo anterior no lo ofrece
- **Dado** «Banco A» sin movimientos y un extracto de la cuenta de Santander
- **Cuando** la persona lo importa
- **Entonces** la revisión no muestra «Empezar esta cuenta con el saldo anterior del resumen»
