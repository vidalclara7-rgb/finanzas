# Capacidad: interfaz

## Requisito: navegación

Una barra inferior lleva a Inicio, Movimientos, Cuentas y Cierre, con el botón «+» en el centro.
Ajustes se abre con el engranaje del encabezado. El «+» abre «Nuevo movimiento», salvo en Cuentas,
donde abre «Nueva cuenta». El título del encabezado cambia con la pantalla.

### Escenario: el más según la pantalla
- **Dado** la app abierta en Inicio con al menos una cuenta
- **Cuando** la persona toca «+», cierra, va a Cuentas y vuelve a tocar «+»
- **Entonces** primero se abre «Nuevo movimiento» y después «Nueva cuenta»

### Escenario: ajustes desde el engranaje
- **Dado** la app abierta en Inicio
- **Cuando** la persona toca el engranaje
- **Entonces** el título dice «Ajustes» y se ve el plan del fondo

### Escenario: nombres de las pestañas
- **Dado** la app abierta
- **Cuando** la persona mira la barra inferior
- **Entonces** ve «Inicio», «Movimientos», «Cuentas» y «Cierre»
