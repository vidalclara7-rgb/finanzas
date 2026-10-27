# Capacidad: datos

## Requisito: financiaciones guardadas antes de la cuenta regresiva

Las financiaciones guardadas con «cuotas que faltan» siguen valiendo: toman como punto de partida el mes en que se
abre la app actualizada, sin descontar nada hacia atrás. Pasa al abrir la app y al restaurar una copia vieja. El
mes de partida viaja en la copia.

### Escenario: datos de la versión anterior
- **Dado** que hoy es 2026-10-15 y «Financiera Z» guardada con 12 cuotas que faltan y sin mes de partida
- **Cuando** la persona abre la app actualizada
- **Entonces** Cuentas dice «faltan 12 (hasta septiembre 2027)»

### Escenario: copia de seguridad vieja
- **Dado** una copia de seguridad anterior a este cambio con una financiación con 12 cuotas que faltan
- **Cuando** la persona la restaura en 2026-11-15
- **Entonces** Cuentas dice «faltan 12 (hasta octubre 2027)»

### Escenario: el mes de partida viaja en la copia
- **Dado** «Financiera Z» con 12 cuotas que faltan cargadas en octubre de 2026
- **Cuando** la persona copia los datos y los restaura en 2026-11-15
- **Entonces** Cuentas dice «faltan 11 (hasta septiembre 2027)»

### Escenario: mes de partida inválido
- **Dado** una copia con una financiación cuyo mes de partida no es un mes válido
- **Cuando** la persona la restaura
- **Entonces** la app funciona con normalidad y toma el mes actual como punto de partida
