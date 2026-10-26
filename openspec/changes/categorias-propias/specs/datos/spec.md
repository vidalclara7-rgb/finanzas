# Capacidad: datos

## Requisito: categorías guardadas antes de poder editarlas

Quien usaba una versión anterior no pierde nada: las categorías de siempre se crean solas, con sus colores,
y cualquier categoría que ya use un movimiento se conserva aunque no esté en esa lista. Pasa al abrir la app
y al restaurar una copia de seguridad vieja. Las categorías viajan en la copia.

### Escenario: datos de la versión anterior
- **Dado** datos guardados antes de poder editar categorías, con gastos en Ocio y Supermercado
- **Cuando** la persona abre la app actualizada
- **Entonces** Movimientos, la torta y los totales son los de antes
- **Y** la hoja «Categorías» tiene las de siempre

### Escenario: categoría que no está en la lista
- **Dado** una copia de seguridad con un gasto en una categoría «Mascotas» que ninguna lista de categorías incluye
- **Cuando** la persona la restaura
- **Entonces** el gasto sigue en «Mascotas» y esa categoría aparece en la lista, antes de «Otros»

### Escenario: copia de seguridad vieja
- **Dado** una copia de seguridad anterior a este cambio
- **Cuando** la persona la restaura
- **Entonces** la app avisa «Copia restaurada» y las categorías de siempre están disponibles

### Escenario: las categorías viajan en la copia
- **Dado** una categoría «Mascotas» creada y «Siempre fija» activada en Alquiler
- **Cuando** la persona copia los datos y los restaura
- **Entonces** «Mascotas» y la marca de Alquiler siguen ahí

### Escenario: categorías con datos inválidos
- **Dado** una copia con categorías mal formadas (sin nombre, repetidas o con un color fuera de rango)
- **Cuando** la persona la restaura
- **Entonces** la app funciona con normalidad, ignora lo inválido y conserva las categorías que usan los movimientos
