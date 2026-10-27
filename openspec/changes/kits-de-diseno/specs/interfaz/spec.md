# Capacidad: interfaz

## Requisito: una sola letra en toda la app

Los títulos de las pantallas y de las hojas usan la misma letra que el resto del texto, en negrita. La letra es la del
kit elegido.

### Escenario: títulos con la letra del texto
- **Dado** la app abierta en Inicio
- **Cuando** la persona mira el título «Este mes» y abre la hoja de nuevo gasto
- **Entonces** el título y el de la hoja usan la misma letra que el resto del texto

## Requisito: todo se lee sobre el fondo

En los cuatro kits y en las dos apariencias, con el fondo de manchas detrás, los importes principales y el texto de las
tarjetas se leen con un contraste de al menos 4,5 a 1, y las dos partes de la barra de fijos y variables se distinguen
de su tarjeta (al menos 1,5 a 1: el dato está en el texto que la acompaña).

### Escenario: contraste en los kits y las apariencias
- **Dado** gastos fijos y variables, una tarjeta de crédito con tope y cuentas de varios tipos
- **Cuando** la persona recorre Inicio, Movimientos, Cuentas y Cierre en cada kit y en las apariencias Clara y Oscura
- **Entonces** el resultado, el disponible, el patrimonio y el texto de las tarjetas tienen contraste de al menos 4,5 a 1, y las dos partes de la barra de fijos y variables, de al menos 1,5 a 1 contra su tarjeta

## Retirado: tarjetas neutras sobre el fondo de manchas
Lo sustituyen «tarjetas con degradado del kit» y «color por categoría y por tipo de cuenta», de la capacidad kits.
