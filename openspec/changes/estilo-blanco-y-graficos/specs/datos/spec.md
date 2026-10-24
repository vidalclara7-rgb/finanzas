# Capacidad: datos

## Requisito: los datos quedan sólo en el teléfono

Todo lo que la persona carga queda guardado en su dispositivo y sigue ahí al cerrar y volver a abrir
la app. La app no se comunica con ningún otro sitio.

### Escenario: se conserva al volver a abrir
- **Dado** un gasto y una cuenta guardados
- **Cuando** la persona cierra la app y la vuelve a abrir
- **Entonces** el gasto y la cuenta siguen ahí

### Escenario: nada sale del teléfono
- **Dado** la app abierta
- **Cuando** la persona anota un gasto y crea una cuenta
- **Entonces** la app no hace ninguna petición a otro sitio
