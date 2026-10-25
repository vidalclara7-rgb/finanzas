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

## Requisito: configurar topes y plan de ahorro

En Ajustes se cargan el tope de Tarjeta, el de Revolut, el aporte mensual al fondo, el objetivo del
fondo, el mes del primer aporte y, opcionalmente, los meses sin aporte separados por coma. Los
cuatro importes tienen que ser mayores que cero y el mes de inicio es obligatorio. Los meses sin
aporte con formato distinto de AAAA-MM se descartan.

### Escenario: ajustes completos
- **Dado** Ajustes vacío
- **Cuando** la persona carga 500, 300, 100, 1000, el mes 2026-09 y «2026-12, diciembre» y guarda
- **Entonces** la app avisa «Ajustes guardados»
- **Y** los meses sin aporte quedan como «2026-12»

### Escenario: ajustes incompletos
- **Dado** Ajustes vacío
- **Cuando** la persona guarda sin el objetivo del fondo
- **Entonces** la app avisa «Completá todos los importes y el mes de inicio» y no guarda nada

## Requisito: aviso de primer paso

Mientras los ajustes no están completos, Inicio muestra la tarjeta «Primer paso» con un botón que
lleva a Ajustes.

### Escenario: app sin configurar
- **Dado** una app recién abierta, sin datos
- **Cuando** la persona toca «Ir a Ajustes» en la tarjeta «Primer paso»
- **Entonces** se abre Ajustes

### Escenario: app configurada
- **Dado** los ajustes completos
- **Cuando** la persona abre Inicio
- **Entonces** no aparece la tarjeta «Primer paso»
