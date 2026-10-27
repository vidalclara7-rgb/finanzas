# Capacidad: cuotas

## Requisito: tarjeta de cuotas del mes

Inicio muestra la tarjeta «Cuotas del mes» cuando hay algo que se paga en cuotas: las cuentas de Financiaciones con
cuota mensual y las compras en cuotas de las tarjetas. Dice cuánto se paga este mes, cuántas cuotas son y cuánto
queda por pagar en total. Sin cuotas, no aparece.

### Escenario: financiación y compra en cuotas
- **Dado** que hoy es 2026-10-15, «Financiera Z» con cuota de 50 € y 12 cuotas que faltan cargadas en octubre de 2026, y una compra de 700 € en 3 cuotas de 240 € del 2026-10-05 en «Tarjeta Y»
- **Cuando** la persona abre Inicio
- **Entonces** ve la tarjeta «Cuotas del mes» con 290 €
- **Y** dice «2 cuotas · te quedan por pagar 1320 €»

### Escenario: sin cuotas no hay tarjeta
- **Dado** que la persona no tiene financiaciones con cuota ni compras en cuotas
- **Cuando** abre Inicio
- **Entonces** no ve la tarjeta «Cuotas del mes»

### Escenario: una compra en cuotas ya terminada
- **Dado** que hoy es 2027-01-15 y una compra en 3 cuotas del 2026-10-05
- **Cuando** la persona abre Inicio
- **Entonces** esa compra no suma en «Cuotas del mes»

### Escenario: financiación sin fecha de fin
- **Dado** «Financiera Z» con cuota de 50 € y sin cuotas que faltan
- **Cuando** la persona abre Inicio
- **Entonces** la tarjeta suma 50 € este mes
- **Y** esa financiación no suma en «te quedan por pagar»

## Requisito: detalle de las cuotas

Al tocar la tarjeta se abre la hoja «Cuotas», con una fila por cada financiación y por cada compra en cuotas: de
cuánto es la cuota, cuántas faltan (con la de este mes) y hasta qué mes, y lo que queda por pagar de esa.

### Escenario: filas de la hoja
- **Dado** esas mismas cuotas
- **Cuando** la persona toca la tarjeta «Cuotas del mes»
- **Entonces** ve «Financiera Z · 50 € · faltan 12 (hasta septiembre 2027)»
- **Y** ve «Tarjeta Y · cuota 1 de 3 · 240 € · faltan 3 (hasta diciembre 2026)»

### Escenario: la última cuota
- **Dado** que hoy es 2026-12-15 y esa compra en 3 cuotas del 2026-10-05
- **Cuando** la persona abre la hoja «Cuotas»
- **Entonces** la compra dice «cuota 3 de 3 · 240 € · faltan 1 (hasta diciembre 2026)»

## Requisito: las cuotas que faltan bajan solas

Las cuotas que faltan de una financiación bajan una por cada mes que pasa, contando desde el mes en que se cargó el
número. Al llegar a cero la financiación deja de sumar cuota. Cambiar el número empieza la cuenta de nuevo.

### Escenario: un mes después
- **Dado** «Financiera Z» con 12 cuotas que faltan cargadas en octubre de 2026 y que hoy es 2026-11-15
- **Cuando** la persona abre Cuentas
- **Entonces** Financiera Z dice «50 €/mes · faltan 11 (hasta septiembre 2027)»

### Escenario: corregir el número
- **Dado** esa financiación en noviembre de 2026
- **Cuando** la persona edita «Cuotas que faltan» a 8 y guarda
- **Entonces** Cuentas dice «faltan 8 (hasta junio 2027)»

### Escenario: editar otro dato no reinicia la cuenta
- **Dado** esa financiación en noviembre de 2026 con 11 cuotas que faltan
- **Cuando** la persona cambia sólo su nombre y guarda
- **Entonces** sigue diciendo «faltan 11 (hasta septiembre 2027)»

### Escenario: financiación terminada
- **Dado** «Financiera Z» con 12 cuotas que faltan cargadas en octubre de 2026 y que hoy es 2027-10-15
- **Cuando** la persona abre Cuentas e Inicio
- **Entonces** Financiera Z dice «Sin cuotas pendientes»
- **Y** no suma en «Cuotas de financiaciones» ni en la tarjeta «Cuotas del mes»
