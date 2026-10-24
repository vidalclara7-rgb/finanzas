"""Reglas de la app que no se confían a la memoria (las de CLAUDE.md).

  1. La clave de los datos sigue siendo la misma   → cambiarla borra los datos de todas las personas
  2. Todo lo que lista el service worker existe     → si falta uno, la instalación offline falla entera
  3. Si cambió un fichero de la app respecto de main, la versión de la caché también cambió
                                                    → si no, quien ya la tiene instalada no recibe el cambio
  4. Lo que escribe la persona se escapa antes de pintarlo como HTML (nombre, nota, categoría)
  5. Nada de inbox/ entra en el repo (salvo su README) → el repo es público
  6. Ni correos ni IBAN en los ficheros del repo      → el repo es público

Una línea concreta se puede eximir con un comentario `guard:allow <motivo>`.
El motivo es obligatorio: una excepción sin porqué no se acepta.
"""
import re
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
APP = RAIZ / "index.html"
SW = RAIZ / "sw.js"
CLAVE = 'const KEY="finanzas-v1"'
ALLOW = re.compile(r"guard:allow\s+\S")
# Un campo que escribe la persona, usado en una línea que arma HTML, sin pasar por esc()
SIN_ESCAPAR = re.compile(r"(?<!esc\()\b[a-z]\.(nombre|nota|cat)\b(?!\s*[?=!<>|&])")
CORREO = re.compile(r"\b[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[A-Za-z]{2,}\b")
IBAN = re.compile(r"\b[A-Z]{2}\d{2}(?: ?\d{4}){4,}\b")


def _git(*args: str) -> tuple[int, str]:
    r = subprocess.run(["git", *args], cwd=RAIZ, capture_output=True, text=True)
    return r.returncode, r.stdout


def _cache(texto: str) -> str | None:
    m = re.search(r"const CACHE\s*=\s*\"([^\"]+)\"", texto)
    return m.group(1) if m else None


def _ficheros_sw(texto: str) -> list[str]:
    m = re.search(r"const FILES\s*=\s*\[(.*?)\]", texto, re.S)
    return re.findall(r"\"([^\"]+)\"", m.group(1)) if m else []


def revisar() -> tuple[list[str], list[str]]:
    fallos, notas = [], []
    app = APP.read_text(encoding="utf-8")
    sw = SW.read_text(encoding="utf-8")

    # 1
    if CLAVE not in app:
        fallos.append(f"index.html: no está «{CLAVE}». Cambiar la clave pierde los datos guardados; "
                      "si es a propósito, hace falta migrar y actualizar esta regla en el mismo cambio")

    # 2
    archivos = _ficheros_sw(sw)
    if not archivos:
        fallos.append("sw.js: no se encuentra la lista FILES")
    for f in archivos:
        ruta = RAIZ / ("index.html" if f in ("./", "/") else f.removeprefix("./"))
        if not ruta.exists():
            fallos.append(f"sw.js: FILES incluye «{f}», que no existe")

    # 3
    codigo, _ = _git("rev-parse", "--verify", "-q", "origin/main")
    if codigo:
        notas.append("sin origin/main: no se puede comparar la versión de la caché (git fetch origin main)")
    else:
        app_files = ["index.html", "sw.js", "manifest.webmanifest"] + [
            f.removeprefix("./") for f in archivos if f not in ("./", "/")]
        cambiados, _ = _git("diff", "--quiet", "origin/main", "--", *sorted(set(app_files)))
        if cambiados:
            _, sw_main = _git("show", "origin/main:sw.js")
            if _cache(sw_main) == _cache(sw):
                fallos.append(f"sw.js: la app cambió respecto de main y CACHE sigue en «{_cache(sw)}»; "
                              "subí la versión para que el cambio llegue a quien ya la tiene instalada")
            else:
                notas.append(f"caché: {_cache(sw_main)} → {_cache(sw)}")
        else:
            notas.append("la app no cambió respecto de main")

    # 4
    for n, linea in enumerate(app.splitlines(), 1):
        if "guard:allow" in linea:
            if not ALLOW.search(linea):
                fallos.append(f"index.html:{n}  guard:allow sin motivo")
            continue
        if ("innerHTML" in linea or "class=" in linea) and (m := SIN_ESCAPAR.search(linea)):
            fallos.append(f"index.html:{n}  «{m.group(0)}» se pinta como HTML sin esc()\n      {linea.strip()[:100]}")

    # 5 y 6
    _, versionados = _git("ls-files")
    for f in versionados.splitlines():
        if f.startswith("inbox/") and f != "inbox/README.md":
            fallos.append(f"{f}: inbox/ no se sube al repo (es público)")
        ruta = RAIZ / f
        if ruta.suffix not in {".html", ".js", ".cjs", ".md", ".json", ".webmanifest", ".py", ".txt", ".csv"}:
            continue
        if not ruta.exists() or f == "scripts/guards.py":
            continue
        for n, linea in enumerate(ruta.read_text(encoding="utf-8", errors="ignore").splitlines(), 1):
            if ALLOW.search(linea):
                continue
            if CORREO.search(linea) or IBAN.search(linea):
                fallos.append(f"{f}:{n}  parece un dato personal (correo o IBAN); el repo es público")
    return fallos, notas


if __name__ == "__main__":
    fallos, notas = revisar()
    for n in notas:
        print("  ·", n)
    for f in fallos:
        print("  ✗", f)
    if not fallos:
        print("  ✓ las 6 reglas de la app se cumplen")
    sys.exit(1 if fallos else 0)
