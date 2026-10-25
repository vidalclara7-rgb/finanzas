# Capacidad: presupuesto

## Requisito: disponible del mes por cuenta

Inicio muestra, para cada cuenta con tope, cuánto queda del tope mensual: tope menos lo gastado en el
mes con esa cuenta. Los gastos de «Trabajo (reembolsable)», los ingresos, las transferencias y los
ajustes no descuentan. El anillo del tope se marca en aviso desde el 75 % y como excedido al
superarlo.

### Escenario: disponible con un reembolsable
- **Dado** «Tarjeta» con tope de 500 €, 64,30 € en Súper y 42 € en Trabajo (reembolsable) con esa tarjeta
- **Cuando** la persona abre Inicio
- **Entonces** Tarjeta muestra 435,7 € disponibles y «Gastado 64,3 € de 500 €»

### Escenario: tope superado
- **Dado** «Revolut» con tope de 300 € y 320 € gastados con esa cuenta este mes
- **Cuando** la persona abre Inicio
- **Entonces** Revolut muestra -20 € disponibles y el anillo se marca como excedido

### Escenario: tope en aviso
- **Dado** «Tarjeta» con tope de 500 € y 400 € gastados con esa tarjeta este mes
- **Cuando** la persona abre Inicio
- **Entonces** el anillo de Tarjeta dice «80 %» y se marca en aviso

### Escenario: cuenta sin tope
- **Dado** «Banco A» sin tope y «Tarjeta» con tope
- **Cuando** la persona abre Inicio
- **Entonces** sólo aparece el disponible de Tarjeta

## Requisito: aviso de primer paso

Mientras la persona no tiene ninguna cuenta, Inicio muestra la tarjeta «Primer paso» con un botón que
lleva a crear la primera cuenta.

### Escenario: app sin configurar
- **Dado** una app recién abierta, sin datos
- **Cuando** la persona toca «Crear cuenta» en la tarjeta «Primer paso»
- **Entonces** se abre Cuentas con la hoja «Nueva cuenta»

### Escenario: app configurada
- **Dado** al menos una cuenta
- **Cuando** la persona abre Inicio
- **Entonces** no aparece la tarjeta «Primer paso»
