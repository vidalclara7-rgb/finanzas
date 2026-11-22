# Capacidad: interfaz

## Requisito: tarjetas de Inicio en parejas de color

En Inicio, las tarjetas del resumen llevan un fondo de color suave, del color de una categoría: todo su texto, sus barras y sus anillos van en blanco en la apariencia Oscura y casi negros en la Clara. Son el resultado del mes, «Fijos y variables», «Gastado», «Ingresado», el disponible de cada cuenta con tope (con el color de su tipo de cuenta), «Cuotas del mes», «A pagar de la tarjeta», «Por cobrar», «Toca transferir» y «Patrimonio neto». Las demás (los avisos, la sugerencia de gasto fijo, «Gasto del mes» e «Ingresos y gastos») siguen grises. El texto de cada tarjeta de color tiene contraste de al menos 4,5 a 1 en el punto de su degradado donde peor se lee, en las dos apariencias. Dentro de una tarjeta de color, un tope excedido o un mes en negativo se dicen con texto y una marca, no con rosa.

### Escenario: el resumen de Inicio en color
- **Dado** gastos fijos y variables, ingresos, una tarjeta de crédito con tope y cuentas cargadas este mes
- **Cuando** la persona abre Inicio
- **Entonces** el resultado del mes, «Fijos y variables», «Gastado», «Ingresado», el disponible de la tarjeta y «Patrimonio neto» tienen fondo de color
- **Y** «Gasto del mes» e «Ingresos y gastos» son grises

### Escenario: tarjetas de color distintas
- **Dado** el resultado del mes, «Fijos y variables», «Gastado» e «Ingresado» a la vista
- **Cuando** la persona mira Inicio
- **Entonces** cada una de esas cuatro tarjetas tiene un color de fondo distinto de las otras tres

### Escenario: el texto de las tarjetas de color se lee
- **Dado** todas las tarjetas de color de Inicio a la vista
- **Cuando** la persona las mira en las apariencias Clara y Oscura
- **Entonces** todo su texto tiene contraste de al menos 4,5 a 1 con cada punto de su degradado

### Escenario: tope excedido en una tarjeta de color
- **Dado** «Tarjeta» con tope de 300 € y 320 € gastados este mes
- **Cuando** la persona abre Inicio
- **Entonces** el disponible de Tarjeta dice «-20 €», su anillo dice «107 %» y lleva la marca «Excedido»
