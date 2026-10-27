# Capacidad: datos

## Requisito: destinos aprendidos guardados antes del cambio

Lo que la app aprendió antes (categorías por comercio) sigue valiendo, y lo aprendido de las transferencias
viaja en la copia de seguridad. Un destino aprendido que no se puede usar (cuenta inexistente o dato inválido)
se ignora sin romper nada.

### Escenario: datos de la versión anterior
- **Dado** datos guardados con «Bar Ejemplo» aprendido como Ocio y ninguna transferencia aprendida
- **Cuando** la persona abre la app actualizada e importa un extracto con «Bar Ejemplo»
- **Entonces** esa compra llega como Ocio

### Escenario: el destino viaja en la copia
- **Dado** «Traspaso Fondo» aprendido como transferencia a «Broker X»
- **Cuando** la persona copia los datos y los restaura
- **Entonces** importar un extracto con «Traspaso Fondo» la propone como transferencia a Broker X

### Escenario: destino inválido en una copia
- **Dado** una copia de seguridad con un destino aprendido que no es un número ni una cuenta existente
- **Cuando** la persona la restaura e importa un extracto con esa descripción
- **Entonces** la importación funciona con normalidad y propone la descripción como siempre
