# Capacidad: interfaz

## Requisito: los campos de fecha caben en el ancho

Los campos de fecha y de mes de las hojas ocupan el ancho de la hoja, sin salirse por ningún lado, en ancho de
iPhone.

### Escenario: fecha de un movimiento
- **Dado** la hoja «Nuevo movimiento» abierta a 390 px
- **Cuando** la persona mira el campo «Fecha»
- **Entonces** su borde derecho no supera el borde derecho de la hoja
- **Y** no hay desplazamiento horizontal

### Escenario: fecha de una operación de inversión
- **Dado** la hoja «Nueva operación» abierta a 390 px
- **Cuando** la persona mira el campo «Fecha»
- **Entonces** su borde derecho no supera el borde derecho de la hoja

### Escenario: mes en Ajustes
- **Dado** Ajustes abierto a 390 px
- **Cuando** la persona mira «Mes del primer aporte»
- **Entonces** el campo cabe en su tarjeta
