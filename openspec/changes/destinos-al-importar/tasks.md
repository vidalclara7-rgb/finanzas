# Tareas: destinos-al-importar

## Preview
- [x] Crear el esqueleto del preview
- [x] Pantalla «hoja-importar»: revisión con «Nueva cuenta…» y con el movimiento ya como transferencia
- [x] Pantalla «hoja-cuenta»: «Nueva cuenta» abierta desde la revisión
- [x] Comprobar el preview y sacar capturas a 390 px, claro y oscuro
- [x] Gate 2: la persona aprueba el diseño

## Datos y migración
- [x] `S.reglas["t|<comercio>"]` con el id de la cuenta; se ignora si no es un número de una cuenta existente o es la propia cuenta del extracto; las `g|` e `i|` no cambian
- [x] El destino aprendido viaja en la copia; un valor inválido no rompe nada

## Pantallas
- [x] «Nueva cuenta…» en la lista de cada movimiento; abre la hoja de cuenta y vuelve a la revisión al guardar o al cerrar (sin guardar, el movimiento queda como estaba)
- [x] Al guardar la importación: aprender `t|` y olvidar `g|`/`i|` de la misma descripción (y a la inversa)
- [x] La propuesta del borrador consulta primero el destino aprendido
- [x] Subir la versión de `CACHE` en `sw.js`

## Tests
- [x] Un test por escenario de `importacion` (9) y `datos` (3)
- [x] Pruebas extra: nombre escapado en la lista, 390 px en claro y oscuro

## Prueba en el navegador
- [x] `python3 kit.py check` en verde
- [x] `python3 kit.py capturas` y comparar con el preview aprobado, claro y oscuro

## Documentación
- [x] `CLAUDE.md`: `reglas` con `t|`, «Nueva cuenta…» al importar y la garantía como cuenta propia
