# Capacidad: cierre-mes

## Requisito: checklist del día de cobro

La pestaña Mes tiene cinco tareas para marcar cada mes: transferir el aporte al fondo, transferir el
presupuesto a Revolut (con los importes de Ajustes), tarjeta cobrada en pago total, gastos de empresa
cargados y, el día 15, tarjeta por debajo de la mitad del tope. Lo marcado se guarda por mes.

### Escenario: lo marcado se conserva
- **Dado** que hoy es 2026-10-15 y el checklist de octubre sin marcar
- **Cuando** la persona marca «Tarjeta cobrada en pago total, sin fraccionar» y vuelve a abrir la app
- **Entonces** esa tarea sigue marcada

### Escenario: cada mes empieza sin marcar
- **Dado** tareas marcadas en septiembre 2026
- **Cuando** la persona abre Mes el 2026-10-15
- **Entonces** ninguna tarea de octubre está marcada

### Escenario: tareas con los importes de Ajustes
- **Dado** un aporte de 100 € y un tope de Revolut de 300 €
- **Cuando** la persona abre Mes
- **Entonces** el checklist dice «Transferir 100 € al fondo» y «Transferir 300 € a Revolut»
