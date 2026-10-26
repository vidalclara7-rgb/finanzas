# Capacidad: datos

## Requisito: inversiones guardadas antes de las posiciones

Las cuentas de inversión guardadas antes de poder cargar activos siguen valiendo igual, con su valor y
su total aportado, tanto al abrir la app como al restaurar una copia vieja. Activos y operaciones
viajan en la copia de seguridad.

### Escenario: datos de la versión anterior
- **Dado** datos con «Broker X», una inversión de 2100 € con 2000 € aportados y ningún activo
- **Cuando** la persona abre la app actualizada
- **Entonces** Broker X dice «+100 € (+5,0 %) sobre 2000 €» como antes
- **Y** el patrimonio neto no cambia

### Escenario: copia de seguridad vieja
- **Dado** una copia de seguridad anterior a este cambio
- **Cuando** la persona la restaura
- **Entonces** la app funciona con normalidad y no hay activos

### Escenario: la copia conserva las posiciones
- **Dado** «Fondo A» con una compra de 10 unidades a 50 €
- **Cuando** la persona copia los datos y los restaura
- **Entonces** «Fondo A» vuelve con 10 unidades y la misma compra

### Escenario: copia rota o con una operación huérfana
- **Dado** una copia con una operación que apunta a un activo que no existe
- **Cuando** la persona la restaura
- **Entonces** la app ignora esa operación, funciona con normalidad y no pierde lo demás
