"""Archiva un cambio construido: funde su delta en la especificación viva y
mueve la carpeta a openspec/changes/archive/AAAA-MM-DD-<cambio>/.

Por cada openspec/changes/<cambio>/specs/<capacidad>/spec.md:
  ## Requisito: X   → si X ya existe en la viva, se sustituye; si no, se añade
  ## Retirado: X    → se quita X de la viva
Si la capacidad no existía, la viva se crea con la cabecera del delta.

Sin --aplicar sólo enseña qué se movería. No borra nada: la carpeta del cambio
entera (propuesta, diseño, tareas, preview) queda en el archivo.

Uso:  python scripts/archive.py [cambio] [--aplicar]
"""
import shutil
import subprocess
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import openspec_lib as os_  # noqa: E402


def plan(c: Path) -> list[tuple[Path, os_.Spec, list[str]]]:
    resultado = []
    for delta_ruta in sorted((c / "specs").glob("*/spec.md")):
        delta = os_.leer_spec(delta_ruta)
        viva_ruta = os_.VIVAS / delta.capacidad / "spec.md"
        viva = os_.leer_spec(viva_ruta) if viva_ruta.exists() else os_.Spec(viva_ruta, delta.cabecera, [])
        movimientos = [] if viva_ruta.exists() else [f"+ capacidad nueva «{delta.capacidad}»"]
        nombres = [r.nombre for r in viva.requisitos]
        for r in delta.requisitos:
            if r.retirado:
                viva.requisitos = [x for x in viva.requisitos if x.nombre != r.nombre]
                movimientos.append(f"− retirado: {r.nombre}")
            elif r.nombre in nombres:
                viva.requisitos = [r if x.nombre == r.nombre else x for x in viva.requisitos]
                movimientos.append(f"~ sustituido: {r.nombre}")
            else:
                viva.requisitos.append(r)
                movimientos.append(f"+ añadido: {r.nombre}")
        resultado.append((viva_ruta, viva, movimientos))
    return resultado


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    aplicar = "--aplicar" in sys.argv
    c = os_.resolver_cambio(args[0] if args else None)
    if os_.estado(c) != "construida":
        print(f"✗ «{c.name}» está en «{os_.estado(c)}». Sólo se archiva un cambio construido "
              "(aprobado en el Gate 3 de /sdd:apply).")
        return 1
    for script in ("spec_check.py", "preview_check.py"):
        if subprocess.call([sys.executable, str(Path(__file__).parent / script)], stdout=subprocess.DEVNULL):
            print("✗ Las especificaciones o el preview no pasan (python kit.py specs). Se arregla antes de archivar.")
            return 1

    movimientos = plan(c)
    if not movimientos:
        print(f"✗ «{c.name}» no tiene especificación que fundir.")
        return 1
    destino = os_.ARCHIVO / f"{date.today().isoformat()}-{c.name}"
    print(f"Archivar «{c.name}» → {destino.relative_to(os_.RAIZ).as_posix()}/\n")
    for viva_ruta, _, movs in movimientos:
        print(f"  {viva_ruta.relative_to(os_.RAIZ).as_posix()}")
        for m in movs:
            print(f"    {m}")
    if not aplicar:
        print("\n(Sin cambios en disco. Para hacerlo:  python kit.py archive " + c.name + " --aplicar)")
        return 0
    if destino.exists():
        print(f"\n✗ Ya existe {destino.name} en el archivo; no se sobrescribe.")
        return 1
    for viva_ruta, viva, _ in movimientos:
        viva_ruta.parent.mkdir(parents=True, exist_ok=True)
        viva_ruta.write_text(os_.escribir_spec(viva), encoding="utf-8")
    os_.fijar_estado(c, "archivado", archivado=date.today().isoformat())
    shutil.move(str(c), str(destino))
    print("\n✓ Especificación viva actualizada y cambio archivado.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
