# Capacidad: datos

## Requisito: ingreso del Forecast y fechas de pago guardados antes

Los datos guardados antes de este cambio no tienen ingreso del Forecast ni fechas de pago: siguen valiendo, el Forecast usa el promedio y las tarjetas no dicen cuándo se pagan, sin reescribir nada. Al cargar y al restaurar una copia, el ingreso guardado se conserva sólo si es un número de 0 o más, y de las fechas de pago sólo las válidas: de una tarjeta de crédito, con un mes AAAA-MM y una fecha real posterior al cierre de ese mes y como mucho del último día del mes siguiente. Los dos viajan en la copia de seguridad.

### Escenario: datos de la versión anterior (Forecast)
- **Dado** datos guardados sin ingreso del Forecast ni fechas de pago, con ingresos de 2000 € en septiembre de 2026
- **Cuando** la persona abre Forecast
- **Entonces** el ingreso por mes es 2000 € y lo guardado no cambia

### Escenario: copia de seguridad vieja (Forecast)
- **Dado** una copia de seguridad sin ingreso del Forecast ni fechas de pago
- **Cuando** la persona la restaura
- **Entonces** se restaura sin errores y el Forecast usa el promedio

### Escenario: ingreso y fechas de pago inválidos en la copia
- **Dado** una copia con ingreso del Forecast «hola», y «Tarjeta Y» con cierre de noviembre el 2026-11-20 y pagos «2026-11»: «2026-11-10» y «2026-10»: «2026-11-05»
- **Cuando** la persona la restaura
- **Entonces** no queda ingreso guardado y Tarjeta Y conserva sólo el pago de octubre

### Escenario: el ingreso y la fecha de pago viajan en la copia
- **Dado** un ingreso guardado de 1500 € y «Tarjeta Y» con pago de noviembre el 2026-12-05
- **Cuando** la persona copia la copia de seguridad y la restaura en otro teléfono
- **Entonces** el ingreso guardado es 1500 € y Tarjeta Y tiene el pago de noviembre el 2026-12-05
