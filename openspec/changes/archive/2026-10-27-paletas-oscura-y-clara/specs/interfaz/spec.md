# Capacidad: interfaz

## Requisito: una sola letra en toda la app

Los títulos de las pantallas y de las hojas usan la misma letra que el resto del texto, en negrita: una sans del
sistema. Los números (importes, totales y el resultado del mes) usan una letra monoespaciada.

### Escenario: títulos con la letra del texto
- **Dado** la app abierta en Inicio
- **Cuando** la persona mira el título «Este mes» y abre la hoja de nuevo gasto
- **Entonces** el título y el de la hoja usan la misma letra que el resto del texto

### Escenario: los números en monoespaciada
- **Dado** la app con un gasto este mes
- **Cuando** la persona mira el resultado del mes en Inicio y el importe en Movimientos
- **Entonces** los importes usan una letra monoespaciada y los textos, la sans

### Escenario: sin letras de otros sitios
- **Dado** la app abierta
- **Cuando** la persona recorre todas las pantallas
- **Entonces** la app no hace ninguna petición a otro sitio

## Requisito: el logo «mf.» dentro de la app

El encabezado de Inicio muestra el monograma «mf.» con la letra de la app: las letras en el color del texto y el punto
en el color de acento de la apariencia (amarillo en la oscura, tomate en la clara).

### Escenario: logo en Inicio
- **Dado** la apariencia Oscura
- **Cuando** la persona abre Inicio
- **Entonces** el encabezado muestra «mf.» con el punto en el amarillo de la paleta

### Escenario: el logo sigue a la apariencia
- **Dado** el logo en Inicio
- **Cuando** la persona cambia a la apariencia Clara
- **Entonces** las letras pasan al chocolate del texto y el punto, al tomate de la paleta Brûlée

## Requisito: tarjetas de color sólido

Casi todas las tarjetas son bloques de un color sólido de la paleta, planos y redondeados, sin degradados: el
disponible de cada cuenta y los grupos de Cuentas llevan el color de su tipo (bancos, inversiones, tarjetas,
financiaciones y deudas compartidas), y «Cuotas del mes», el patrimonio, «Por semana», «Ingresos y gastos», «Por
cobrar», la conciliación y el checklist llevan cada uno el suyo. «Gasto del mes» y las hojas de formularios son
neutras, para que se lean la torta y los campos. Cada tarjeta de color lleva su título en una etiqueta en píldora
(texto con borde redondeado), como en la referencia. El texto de cada tarjeta es claro u oscuro según su color y se lee con
contraste de al menos 4,5 a 1.

### Escenario: el disponible lleva el color de su tipo
- **Dado** una cuenta de bancos con tope y una tarjeta de crédito con tope
- **Cuando** la persona abre Inicio
- **Entonces** el disponible de cada una es un bloque de color sólido, y los dos colores son distintos

### Escenario: títulos en píldora
- **Dado** una cuenta de bancos con tope
- **Cuando** la persona abre Inicio
- **Entonces** el título de la tarjeta de color está en una etiqueta con borde redondeado (píldora)

### Escenario: tarjetas sin degradado
- **Dado** una tarjeta de crédito con tope y una financiación con cuota
- **Cuando** la persona abre Inicio
- **Entonces** el disponible y «Cuotas del mes» tienen un fondo sólido, sin degradado
- **Y** «Gasto del mes» tiene el fondo neutro

### Escenario: el texto se lee sobre cada color
- **Dado** esas tarjetas, el patrimonio y los grupos de Cuentas
- **Cuando** la persona los mira en las apariencias Clara y Oscura
- **Entonces** el texto de cada tarjeta de color tiene contraste de al menos 4,5 a 1 con su fondo

## Requisito: color por categoría

Cada gasto es una tarjeta del color de su categoría, el mismo en la torta, en la lista y en el icono. Los colores de las
categorías son los mismos en las dos apariencias.

### Escenario: mismo color por categoría
- **Dado** un gasto en Supermercado este mes
- **Cuando** la persona mira la torta de Inicio y la tarjeta del gasto en Movimientos
- **Entonces** la porción de Supermercado y la tarjeta del gasto tienen el mismo color

### Escenario: texto legible en las tarjetas
- **Dado** un gasto en Compras este mes
- **Cuando** la persona abre Movimientos en las apariencias Oscura y Clara
- **Entonces** el texto de su tarjeta se lee con contraste de al menos 4,5 a 1

### Escenario: reembolsos distinguibles
- **Dado** un gasto en Trabajo (reembolsable) este mes
- **Cuando** la persona abre Movimientos
- **Entonces** su tarjeta tiene el color propio de esa categoría y distinto del de Compras

## Requisito: todo se lee sobre el fondo

En las dos apariencias, los importes principales y el texto de las tarjetas se leen con un contraste de al menos
4,5 a 1, y las dos partes de la barra de fijos y variables se distinguen de su tarjeta (al menos 1,5 a 1: el dato está
en el texto que la acompaña).

### Escenario: contraste en las dos apariencias
- **Dado** gastos fijos y variables, una tarjeta de crédito con tope y cuentas de varios tipos
- **Cuando** la persona recorre Inicio, Movimientos, Cuentas y Cierre en las apariencias Clara y Oscura
- **Entonces** el resultado, el disponible, el patrimonio y el texto de las tarjetas tienen contraste de al menos 4,5 a 1, y las dos partes de la barra de fijos y variables, de al menos 1,5 a 1 contra su tarjeta

## Retirado: tarjetas neutras sobre el fondo de manchas
Lo sustituyen «tarjetas de color sólido» y «color por categoría».
