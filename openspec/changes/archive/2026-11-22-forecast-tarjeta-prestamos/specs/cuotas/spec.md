# Capacidad: cuotas

## Requisito: las cuotas que faltan bajan solas

Las cuotas que faltan de una financiación bajan una por cada mes que pasa, contando desde el mes en que se cargó el
número o desde el mes de la primera cuota, si la persona lo cargó. Antes de la primera cuota la financiación no suma cuota y las que faltan no bajan. Al llegar a cero la financiación deja de sumar cuota. Cambiar el número empieza la cuenta de nuevo.

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

### Escenario: primera cuota más adelante
- **Dado** que hoy es 2026-11-15 y «Préstamo piso» con cuota de 300 €, 20 cuotas y primera cuota febrero de 2027
- **Cuando** la persona abre Cuentas e Inicio
- **Entonces** Préstamo piso dice «300 €/mes · faltan 20 (hasta septiembre 2028)»
- **Y** «Cuotas del mes» de noviembre no suma esos 300 €
