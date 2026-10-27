# Capacidad: apariencia

## Requisito: elegir la apariencia

En Ajustes, «Apariencia» ofrece Oscura, Clara y Automática (sigue al teléfono). Sin elección, la apariencia es
Oscura, aunque el teléfono esté en modo claro. Al elegir otra, toda la app cambia al instante y la elección se
recuerda al volver a abrir.

### Escenario: oscura por defecto
- **Dado** una app recién abierta, sin datos, en un teléfono en modo claro
- **Cuando** la persona abre la app y luego Ajustes
- **Entonces** la app se ve oscura
- **Y** «Apariencia» tiene marcada «Oscura»

### Escenario: elegir clara
- **Dado** la app oscura
- **Cuando** la persona elige «Clara» en Ajustes
- **Entonces** el fondo de la pantalla pasa a claro y la opción queda marcada

### Escenario: automática sigue al teléfono
- **Dado** «Automática» elegida y el teléfono en modo claro
- **Cuando** la persona abre la app
- **Entonces** la app se ve clara
- **Y** al pasar el teléfono a modo oscuro, la app pasa a oscura

### Escenario: la apariencia se recuerda
- **Dado** «Clara» elegida
- **Cuando** la persona vuelve a abrir la app
- **Entonces** la app se ve clara


## Requisito: fondo de manchas

Detrás de todas las pantallas hay un fondo de manchas de color que se funden con un degradado suave, con estrellas
pequeñas que titilan. Los colores salen de dos moodboards que eligió la persona: en la apariencia clara, oliva, vino,
azul polvo, naranja quemado y rosa pálido sobre un fondo crema rosado, con tarjetas de vidrio esmerilado (blancas y
translúcidas) y estrellas vino; en la oscura, chartreuse, cereza, rosa, óxido y azul claro sobre un fondo vino muy
oscuro, con estrellas blancas. Las tarjetas quedan encima y su texto se lee con contraste de al menos 4,5 a 1.

### Escenario: el fondo está en todas las pantallas
- **Dado** la app con datos de ejemplo
- **Cuando** la persona recorre Inicio, Movimientos, Cuentas, Cierre y Ajustes
- **Entonces** en todas se ve el fondo de manchas detrás de las tarjetas

### Escenario: los colores del fondo
- **Dado** el fondo de manchas visible
- **Cuando** la persona mira las manchas en la apariencia Clara y en la Oscura
- **Entonces** en la clara predominan el oliva, el vino, el azul polvo y el naranja quemado, y en la oscura el chartreuse, la cereza, el rosa, el óxido y el azul claro
- **Y** en ninguna hay violetas ni azules eléctricos

### Escenario: estrellas en las dos apariencias
- **Dado** la apariencia Oscura
- **Cuando** la persona abre la app
- **Entonces** se ven estrellas pequeñas sobre el fondo, que titilan
- **Y** al pasar a Clara se siguen viendo, en vino

### Escenario: el texto se lee sobre el fondo
- **Dado** una tarjeta de gasto y el resultado del mes en las dos apariencias
- **Cuando** la persona abre Inicio y Movimientos
- **Entonces** los importes y el texto de las tarjetas tienen contraste de al menos 4,5 a 1 con lo que tienen detrás

## Requisito: movimiento del fondo

Las manchas se mueven despacio y las estrellas titilan. No se mueven si el teléfono tiene activado «Reducir movimiento», y se detienen
cuando la app no está visible.

### Escenario: se mueve despacio
- **Dado** el teléfono sin «Reducir movimiento»
- **Cuando** la persona abre la app
- **Entonces** las manchas están en movimiento lento

### Escenario: reducir movimiento
- **Dado** el teléfono con «Reducir movimiento» activado
- **Cuando** la persona abre la app
- **Entonces** las manchas y las estrellas se ven quietas

### Escenario: la app no está visible
- **Dado** la app abierta con las manchas en movimiento
- **Cuando** la app pasa a segundo plano
- **Entonces** el movimiento se detiene
- **Y** al volver se reanuda

### Escenario: sin cargar nada de otros sitios
- **Dado** la app abierta
- **Cuando** la persona recorre todas las pantallas
- **Entonces** la app no hace ninguna petición a otro sitio

## Requisito: la barra del sistema acompaña

En la app instalada, el color de la barra superior del sistema acompaña a la apariencia que se está viendo.

### Escenario: barra oscura y clara
- **Dado** la apariencia Oscura
- **Cuando** la persona cambia a Clara
- **Entonces** el color de la barra del sistema pasa de oscuro a claro
