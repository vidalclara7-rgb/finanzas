# Mis finanzas

App web instalable (PWA) de presupuesto personal. Publicada con GitHub Pages desde la rama `main`, carpeta raíz: https://vidalclara7-rgb.github.io/mis-finanzas/

## Archivos
- `index.html`: toda la app (HTML, CSS y JS en un solo archivo, sin dependencias ni build).
- `sw.js`: service worker, red primero con caché de respaldo para uso sin conexión. Si se agregan archivos, sumarlos a `FILES` y subir la versión de `CACHE`.
- `manifest.webmanifest` e `icon-*.png`: instalación en pantalla de inicio.

## Cómo funciona
- Los datos se guardan solo en el dispositivo (`localStorage`, clave `finanzas-v1`). No hay backend ni sincronización.
- Modelo: `{settings:{topeTarjeta, topeRevolut, aporte, objetivoFondo, inicio:"AAAA-MM", saltos:"AAAA-MM, ..."}, gastos:[{id, fecha, importe, cuenta, cat, nota}], meses:{"AAAA-MM":{fondo, checks}}}`.
- El plan del fondo se calcula en `planMap()` a partir de los ajustes: aporte mensual acumulado desde `inicio`, sin sumar en los meses de `saltos`, hasta llegar al objetivo.
- Los gastos de la categoría "Trabajo (reembolsable)" no cuentan para los topes.
- Pantallas: Inicio (disponible por cuenta, fondo, categorías), Gastos, Mes (checklist, saldo del fondo, plan) y Ajustes (topes, plan, resumen para copiar, copia de seguridad).

## Reglas
- El repo es público: no poner importes, nombres ni datos personales en el código. Todo lo personal se carga desde Ajustes.
- Lo usan otras personas con el mismo link: cualquier cambio les llega a todas. No cambiar la clave de `localStorage` ni el formato de datos sin migrar los datos existentes.
- Interfaz en castellano rioplatense. Probar en ancho de iPhone (390 px) antes de subir cambios.
