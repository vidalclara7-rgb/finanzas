# Capacidad: presupuesto

## Requisito: disponible del mes por cuenta

Inicio muestra, para Tarjeta y para Revolut, cuánto queda del tope mensual: tope menos lo gastado en
el mes con esa cuenta. Los gastos de «Trabajo (reembolsable)» no descuentan. El anillo del tope se
marca en aviso desde el 75 % y como excedido al superarlo.

### Escenario: disponible con un reembolsable
- **Dado** un tope de Tarjeta de 500 €, 64,30 € en Súper y 42 € en Trabajo (reembolsable) con Tarjeta
- **Cuando** la persona abre Inicio
- **Entonces** Tarjeta muestra 435,7 € disponibles y «Gastado 64,3 € de 500 €»

### Escenario: tope superado
- **Dado** un tope de Revolut de 300 € y 320 € gastados con Revolut este mes
- **Cuando** la persona abre Inicio
- **Entonces** Revolut muestra -20 € disponibles y el anillo se marca como excedido

### Escenario: tope en aviso
- **Dado** un tope de Tarjeta de 500 € y 400 € gastados con Tarjeta este mes
- **Cuando** la persona abre Inicio
- **Entonces** el anillo de Tarjeta dice «80 %» y se marca en aviso
