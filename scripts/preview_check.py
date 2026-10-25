"""Comprueba el preview del Gate 2 y, cuando la app ya está construida, que la
app conserva lo que se aprobó en él.

Estructura (openspec/changes/<cambio>/preview.html):
  - lleva los estilos de la app (región estilos-app, la copia kit.py)
  - al menos una <section data-pantalla="…">, y en cada una los estados
    data-estado="normal" y "vacio" (primer uso, sin datos)
  - al menos un data-ui="…": son las piezas que la app tiene que conservar
  - cada data-ir de la navegación apunta a una pantalla que existe
  - en las pantallas, ni <script> (el preview enseña formas, no calcula) ni
    estilos propios: sólo las clases de la app

Un cambio que no toca pantallas lo declara con `preview: no` en proposal.md y
no pasa por el Gate 2.

Paridad (cambio `construida`): cada data-pantalla y cada data-ui del preview
aparece en index.html. Un preview sin data-ui no deja comparar nada, y por eso
falla en vez de aprobar.

Uso:  python3 scripts/preview_check.py [cambio]     sin cambio: todos los activos
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import openspec_lib as os_  # noqa: E402

ESTADOS_PANTALLA = ("normal", "vacio")
REVISION = re.compile(r"<!-- revision:inicio.*?<!-- revision:fin -->", re.S)
SECCION = re.compile(r"<section\b[^>]*\bdata-pantalla=\"([^\"]+)\"[^>]*>")
COLOR = re.compile(r"#[0-9a-fA-F]{3,8}\b(?![\w-])|\b(rgb|rgba|hsl|hsla)\s*\(")


def region(texto: str, nombre: str) -> str:
    m = re.search(rf"<!-- {nombre}:inicio.*?-->(.*?)<!-- {nombre}:fin -->", texto, re.S)
    return m.group(1) if m else ""


def _en_app(atributo: str, valor: str, fuente: str) -> bool:
    return re.search(rf"""{atributo}=["']{re.escape(valor)}["']""", fuente) is not None


def revisar_cambio(c: Path) -> tuple[list[str], str | None]:
    rel = c.relative_to(os_.RAIZ).as_posix()
    preview = c / "preview.html"
    sin_pantallas = os_.frontmatter(c / "proposal.md").get("preview") == "no"
    if not preview.exists():
        if sin_pantallas:
            return [], f"{rel}: sin pantallas (preview: no), no hay Gate 2"
        if os_.al_menos(c, "diseno-aprobado"):
            return [f"{rel}: en «{os_.estado(c)}» y sin preview.html"], None
        return [], None

    fallos = []
    texto = preview.read_text(encoding="utf-8")
    if "<style" not in region(texto, "estilos-app"):
        fallos.append(f"{rel}/preview.html: no lleva los estilos de la app (python3 kit.py preview {c.name} los copia)")

    sin_revision = REVISION.sub("", texto)
    pantallas_txt = region(sin_revision, "pantallas")
    nav_txt = region(sin_revision, "nav")
    if not pantallas_txt.strip():
        fallos.append(f"{rel}/preview.html: la región <!-- pantallas:inicio --> … <!-- pantallas:fin --> está vacía")
        return fallos, None

    marcas = list(SECCION.finditer(pantallas_txt))
    claves = [m.group(1) for m in marcas]
    if not marcas:
        fallos.append(f"{rel}/preview.html: no hay ninguna <section data-pantalla=\"…\">")
    for i, m in enumerate(marcas):
        trozo = pantallas_txt[m.end() : marcas[i + 1].start() if i + 1 < len(marcas) else len(pantallas_txt)]
        presentes = set(re.findall(r"data-estado=\"([^\"]+)\"", trozo))
        for e in ESTADOS_PANTALLA:
            if e not in presentes:
                fallos.append(f"{rel}/preview.html: la pantalla «{m.group(1)}» no tiene el estado «{e}»")

    for destino in re.findall(r"data-ir=\"([^\"]+)\"", nav_txt):
        if destino not in claves:
            fallos.append(f"{rel}/preview.html: la navegación apunta a «{destino}», que no es ninguna pantalla")

    piezas = sorted(set(re.findall(r"data-ui=\"([^\"]+)\"", pantallas_txt)))
    if not piezas:
        fallos.append(f"{rel}/preview.html: ningún data-ui; sin ellos no se puede comprobar que la app "
                      "conserva el diseño aprobado")

    for n, linea in enumerate((nav_txt + pantallas_txt).splitlines(), 1):
        if "<script" in linea:
            fallos.append(f"{rel}/preview.html (pantallas, línea {n}): <script> en el preview; "
                          "enseña formas, no calcula")
        if "<style" in linea or COLOR.search(linea):
            fallos.append(f"{rel}/preview.html (pantallas, línea {n}): estilo propio; usa sólo clases de la app\n"
                          f"      {linea.strip()[:100]}")

    nota = f"{rel}/preview.html: {len(claves)} pantallas, {len(piezas)} piezas marcadas"
    if os_.estado(c) == "construida" and not fallos:
        fuente = os_.APP.read_text(encoding="utf-8")
        for k in claves:
            if not _en_app("data-pantalla", k, fuente):
                fallos.append(f"paridad: la pantalla «{k}» del preview no está en index.html (data-pantalla)")
        for u in piezas:
            if not _en_app("data-ui", u, fuente):
                fallos.append(f"paridad: la pieza «{u}» del preview no está en index.html (data-ui)")
        nota += ", paridad comprobada"
    return fallos, nota


def revisar(nombre: str | None = None) -> tuple[list[str], list[str]]:
    cambios = [os_.resolver_cambio(nombre)] if nombre else os_.cambios_activos()
    fallos, notas = [], []
    for c in cambios:
        f, n = revisar_cambio(c)
        fallos += f
        if n:
            notas.append(n)
    if not notas and not fallos:
        notas.append("ningún cambio con preview todavía")
    return fallos, notas


if __name__ == "__main__":
    fallos, notas = revisar(sys.argv[1] if len(sys.argv) > 1 else None)
    for n in notas:
        print("  ·", n)
    for f in fallos:
        print("  ✗", f)
    if not fallos:
        print("  ✓ preview correcto")
    sys.exit(1 if fallos else 0)
