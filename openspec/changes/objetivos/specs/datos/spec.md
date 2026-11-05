# Capacidad: datos

## Requisito: los objetivos al cargar datos anteriores

Al cargar o restaurar datos guardados sin objetivos, la app los crea a partir del plan del fondo si estaba completo (aporte, objetivo y mes
de inicio): un objetivo «Fondo de emergencia» con los mismos datos y por cuenta destino la marcada como fondo. Sin plan completo no crea
ninguno. Los datos viejos del plan no se borran. Cargar de nuevo no duplica nada. Un objetivo guardado con datos inválidos se descarta, y
uno con una cuenta destino que no existe queda sin cuenta.

### Escenario: el plan del fondo pasa a ser un objetivo
- **Dado** datos guardados con aporte de 100 €, objetivo de 1000 €, inicio 2026-09, meses sin aporte «2026-12» y una cuenta «Fondo A» marcada como fondo
- **Cuando** la persona abre la app
- **Entonces** hay un objetivo «Fondo de emergencia» de 1000 €, aporte de 100 €, inicio 2026-09, día 1 y meses sin aporte «2026-12», con «Fondo A» como cuenta destino

### Escenario: sin plan no hay objetivos
- **Dado** datos guardados sin aporte ni objetivo del fondo
- **Cuando** la persona abre la app
- **Entonces** no hay ningún objetivo

### Escenario: plan sin cuenta de fondo
- **Dado** datos guardados con un plan completo y ninguna cuenta marcada como fondo
- **Cuando** la persona abre la app
- **Entonces** el objetivo «Fondo de emergencia» existe sin cuenta destino

### Escenario: una copia de seguridad vieja
- **Dado** una copia de seguridad hecha antes de los objetivos, con un plan del fondo completo
- **Cuando** la persona la restaura
- **Entonces** el objetivo «Fondo de emergencia» aparece con los datos del plan

### Escenario: cargar dos veces no duplica
- **Dado** datos guardados con un plan completo ya convertidos en objetivo
- **Cuando** la persona cierra y abre la app
- **Entonces** sigue habiendo un solo objetivo «Fondo de emergencia»

### Escenario: objetivo con datos inválidos
- **Dado** datos guardados con un objetivo sin nombre y otro con monto 0
- **Cuando** la persona abre la app
- **Entonces** ninguno de los dos aparece en la lista de objetivos

### Escenario: cuenta destino que no existe
- **Dado** datos guardados con un objetivo «Vacaciones» cuya cuenta destino ya no existe
- **Cuando** la persona abre la app
- **Entonces** «Vacaciones» aparece en la lista sin cuenta destino

## Requisito: resumen del mes para copiar

En Ajustes, «Copiar resumen del mes» copia un texto con los ingresos, los gastos y el resultado del
mes, el saldo de cada cuenta con su estado de conciliación, el disponible de las cuentas con tope, cada
objetivo con lo ahorrado frente a su plan, cuántas tareas del checklist están hechas, lo gastado por categoría y el
patrimonio neto.

### Escenario: resumen con conciliación
- **Dado** los datos de ejemplo de octubre 2026, con Banco A conciliada
- **Cuando** la persona toca «Copiar resumen del mes»
- **Entonces** el texto empieza con «Resumen octubre 2026» e incluye ingresos, gastos y resultado
- **Y** incluye una línea por cuenta con su saldo y «conciliada» o «sin conciliar»

### Escenario: resumen con objetivos
- **Dado** que hoy es 2026-10-15, el objetivo «Vacaciones» con plan de 200 € para octubre y «Ahorro A» con 150 €
- **Cuando** la persona toca «Copiar resumen del mes»
- **Entonces** el texto incluye una línea «Objetivo Vacaciones: 150 € de 1000 € (plan 200 €)»

### Escenario: resumen sin objetivos
- **Dado** que la persona no tiene objetivos
- **Cuando** toca «Copiar resumen del mes»
- **Entonces** el texto no incluye ninguna línea de objetivos
