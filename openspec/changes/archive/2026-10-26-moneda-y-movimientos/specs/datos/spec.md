# Capacidad: datos

## Requisito: movimientos guardados antes de la moneda

Los movimientos guardados antes de poder elegir la moneda siguen valiendo sin cambios y se tratan
como euros, tanto al abrir la app como al restaurar una copia de seguridad vieja.

### Escenario: datos de la versión anterior
- **Dado** datos con tres gastos sin moneda
- **Cuando** la persona abre la app actualizada
- **Entonces** Movimientos y los totales del mes son los de antes
- **Y** ningún gasto muestra una moneda distinta de euros

### Escenario: copia de seguridad vieja
- **Dado** una copia de seguridad anterior a este cambio
- **Cuando** la persona la restaura
- **Entonces** sus movimientos aparecen en euros y la app funciona con normalidad

### Escenario: la moneda viaja en la copia
- **Dado** un gasto de 20 USD
- **Cuando** la persona copia los datos y los restaura
- **Entonces** el gasto vuelve con USD
