# Capacidad: datos

## Requisito: los datos quedan sólo en el teléfono

Todo lo que la persona carga queda guardado en su dispositivo y sigue ahí al cerrar y volver a abrir
la app. No se envía a ningún servidor.

### Escenario: se conserva al volver a abrir
- **Dado** un gasto y una cuenta guardados
- **Cuando** la persona cierra la app y la vuelve a abrir
- **Entonces** el gasto y la cuenta siguen ahí

### Escenario: nada sale del teléfono
- **Dado** la app abierta
- **Cuando** la persona anota un gasto y crea una cuenta
- **Entonces** la app no hace ninguna petición a otro sitio fuera de las tipografías

## Requisito: copia de seguridad

En Ajustes la persona copia todos sus datos como texto y los restaura pegando ese texto. Restaurar
reemplaza todo lo que hay. Un texto que no es una copia válida se rechaza sin tocar nada.

### Escenario: restaurar una copia
- **Dado** una copia de seguridad hecha con dos gastos y una cuenta
- **Cuando** la persona la pega en una app vacía y toca «Restaurar copia»
- **Entonces** la app avisa «Copia restaurada» y aparecen los dos gastos y la cuenta

### Escenario: copia inválida
- **Dado** la app con datos
- **Cuando** la persona pega «hola» y toca «Restaurar copia»
- **Entonces** la app avisa «Esa copia no es válida» y los datos siguen iguales

## Requisito: datos de versiones anteriores siguen valiendo

Quien usaba una versión anterior de la app, sin la pestaña Cuentas, no pierde nada al actualizar, y
una copia de seguridad de esa versión se puede restaurar.

### Escenario: datos guardados antes de Cuentas
- **Dado** datos guardados por la versión anterior, con gastos, ajustes y fondo pero sin cuentas
- **Cuando** la persona abre la app actualizada
- **Entonces** ve sus gastos, topes y fondo como antes
- **Y** Cuentas aparece vacía

### Escenario: copia de seguridad anterior a Cuentas
- **Dado** una copia de seguridad hecha antes de que existiera Cuentas
- **Cuando** la persona la restaura
- **Entonces** la app avisa «Copia restaurada» y puede crear cuentas a continuación

## Requisito: resumen del mes para copiar

En Ajustes, «Copiar resumen del mes» copia un texto con lo gastado en Tarjeta, Revolut y
Débito/efectivo, el saldo del fondo frente al plan, cuántas tareas del checklist están hechas, lo
gastado por categoría y, si hay cuentas, el patrimonio neto y el detalle de cada cuenta.

### Escenario: resumen con cuentas
- **Dado** los datos de ejemplo de octubre 2026 con cuentas
- **Cuando** la persona toca «Copiar resumen del mes»
- **Entonces** el texto empieza con «Resumen octubre 2026»
- **Y** incluye «Patrimonio neto: 2305 €» y una línea por cuenta
