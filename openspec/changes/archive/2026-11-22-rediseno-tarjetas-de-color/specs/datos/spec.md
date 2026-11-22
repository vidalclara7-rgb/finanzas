# Capacidad: datos

## Requisito: categorías guardadas antes de poder editarlas

Quien usaba una versión anterior no pierde nada: las categorías de siempre se crean solas, con sus colores,
y cualquier categoría que ya use un movimiento se conserva aunque no esté en esa lista. Pasa al abrir la app
y al restaurar una copia de seguridad vieja. Las categorías viajan en la copia.

### Escenario: datos de la versión anterior
- **Dado** datos guardados antes de poder editar categorías, con gastos en Ocio y Supermercado
- **Cuando** la persona abre la app actualizada
- **Entonces** Movimientos, «Gasto del mes» y los totales son los de antes
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

## Requisito: categorías guardadas antes de los íconos

Las categorías guardadas antes de poder elegir un ícono siguen valiendo tal cual: las de siempre se ven con su ícono de siempre y
las demás con su inicial, sin que la app reescriba nada de lo guardado. Pasa al abrir la app y al restaurar una copia vieja. El
ícono elegido viaja en la copia de seguridad; un ícono que no es de la lista se ignora y la categoría se ve como si no lo tuviera.

### Escenario: datos de la versión anterior
- **Dado** datos guardados antes de este cambio, con gastos en Supermercado y en una categoría «Mascotas»
- **Cuando** la persona abre la app actualizada
- **Entonces** Supermercado se ve con el carrito y Mascotas con la «M»
- **Y** los totales y los colores de cada categoría son los de antes

### Escenario: copia de seguridad vieja
- **Dado** una copia de seguridad anterior a este cambio
- **Cuando** la persona la restaura
- **Entonces** la app avisa «Copia restaurada» y las categorías de siempre se ven con sus íconos

### Escenario: el ícono viaja en la copia
- **Dado** la categoría «Mascotas» con el ícono de la huella
- **Cuando** la persona copia los datos y los restaura
- **Entonces** «Mascotas» sigue con la huella

### Escenario: ícono inválido en la copia
- **Dado** una copia con una categoría «Ocio» cuyo ícono no es de la lista
- **Cuando** la persona la restaura
- **Entonces** la app avisa «Copia restaurada» y «Ocio» se ve con su ícono de siempre, sin error
