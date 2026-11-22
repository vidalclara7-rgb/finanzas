# Capacidad: datos

## Requisito: tarjetas guardadas antes de la fecha de cierre

Las tarjetas guardadas antes de este cambio no tienen fechas de cierre: siguen valiendo tal cual y cada mes cuenta su último día, sin reescribir nada. Al cargar y al restaurar una copia, de las fechas de cierre sólo se conservan las válidas: de una tarjeta de crédito, con un mes AAAA-MM y una fecha real de ese mes. Las fechas de cierre viajan en la copia de seguridad.

### Escenario: datos de la versión anterior (cierre)
- **Dado** datos guardados con «Tarjeta Y» sin fechas de cierre y un gasto de 100 € este mes
- **Cuando** la persona abre la app
- **Entonces** «A pagar de la tarjeta» dice 100 € y «Sin fecha de cierre»
- **Y** lo guardado de Tarjeta Y no cambia

### Escenario: copia de seguridad vieja (cierre)
- **Dado** una copia de seguridad sin fechas de cierre
- **Cuando** la persona la restaura
- **Entonces** se restaura sin errores y cada tarjeta dice «Sin fecha de cierre»

### Escenario: fecha de cierre inválida en la copia
- **Dado** una copia con «Tarjeta Y» con cierres «2026-11»: «2026-12-03», «2026-10»: «hola» y «2026-09»: «2026-09-18», y «Banco A» con cierres
- **Cuando** la persona la restaura
- **Entonces** Tarjeta Y conserva sólo el cierre de septiembre y Banco A queda sin cierres

### Escenario: la fecha de cierre viaja en la copia
- **Dado** «Tarjeta Y» con cierre de noviembre el 2026-11-20
- **Cuando** la persona copia la copia de seguridad y la restaura en otro teléfono
- **Entonces** Tarjeta Y tiene el cierre de noviembre el 2026-11-20
