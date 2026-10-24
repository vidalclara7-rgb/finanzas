# Capacidad: cierre-mes

## Requisito: checklist del día de cobro

La pestaña Cierre tiene, debajo de la conciliación, una lista de tareas propia de cada persona para
marcar cada mes. La persona agrega tareas, cambia su texto y las borra; lo marcado se guarda por mes.
Quien empieza de cero no tiene tareas.

### Escenario: agregar una tarea
- **Dado** el checklist sin tareas
- **Cuando** la persona toca «Agregar tarea», escribe «Pagar el alquiler» y guarda
- **Entonces** la tarea aparece en el checklist sin marcar

### Escenario: tarea sin texto
- **Dado** la hoja de nueva tarea abierta
- **Cuando** la persona guarda sin escribir nada
- **Entonces** la app avisa «Escribí la tarea» y no agrega nada

### Escenario: cambiar el texto de una tarea
- **Dado** la tarea «Pagar el alquiler»
- **Cuando** la persona la edita a «Pagar alquiler y expensas» y guarda
- **Entonces** el checklist muestra «Pagar alquiler y expensas»

### Escenario: borrar una tarea
- **Dado** la tarea «Pagar el alquiler»
- **Cuando** la persona la edita, toca «Borrar tarea» y «Tocá de nuevo para borrar»
- **Entonces** la tarea desaparece del checklist

### Escenario: lo marcado se conserva
- **Dado** que hoy es 2026-10-15 y la tarea «Pagar el alquiler» sin marcar en octubre
- **Cuando** la persona la marca y vuelve a abrir la app
- **Entonces** sigue marcada

### Escenario: cada mes empieza sin marcar
- **Dado** tareas marcadas en septiembre 2026
- **Cuando** la persona abre Cierre el 2026-10-15
- **Entonces** ninguna tarea de octubre está marcada

### Escenario: persona nueva sin tareas
- **Dado** una app recién abierta, sin datos
- **Cuando** la persona abre Cierre
- **Entonces** el checklist dice «Agregá las tareas de tu cierre de mes.»
