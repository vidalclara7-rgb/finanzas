# Diseño: titulos-misma-letra

## Decisiones (2026-10-24)

- **Todos los títulos**, no sólo «Este mes»: es el mismo elemento en las cinco pantallas, y dejar
  uno distinto rompería la coherencia que se busca.
- **Letra del sistema en negrita** (la variable de letra que ya usa el cuerpo), con un tamaño un poco
  menor que el actual (32 px en el encabezado, 24 px en las hojas) porque la letra sin serifa en
  negrita pesa más a la vista.
- **Se quita la carga de la letra desde Google Fonts** y la variable de la letra con serifa. Efecto
  secundario bueno: la app no hace ninguna petición fuera del teléfono, y el escenario «nada sale del
  teléfono» deja de tener la excepción de las tipografías.
- Sube la versión de la caché del service worker.

## Descartado

- Cambiar sólo «Este mes»: inconsistente con las otras pantallas.
- Otra letra descargada: vuelve a depender de internet sin ganar nada.
