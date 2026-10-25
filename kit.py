"""Punto de entrada del desarrollo dirigido por especificación (SDD) de Mis finanzas.
Sólo usa la biblioteca estándar de Python; las pruebas, Node y Playwright.

    python3 kit.py instalar                  comprueba Node y Playwright (y los instala si faltan)
    python3 kit.py servir                    la app en http://localhost:8000
    python3 kit.py check                     reglas de la app + especificaciones + preview + tests
    python3 kit.py specs                     sólo especificaciones y preview
    python3 kit.py tests                     sólo los tests en el navegador
    python3 kit.py preview [cambio]          copia los estilos de la app, lo comprueba y saca capturas
    python3 kit.py preview [cambio] --esqueleto   crea preview.html desde la plantilla
    python3 kit.py preview [cambio] --servir      además lo sirve en http://localhost:8001
    python3 kit.py capturas                  capturas de la app real con datos de ejemplo
    python3 kit.py archive [cambio]          enseña qué se fundiría en openspec/specs/
    python3 kit.py archive [cambio] --aplicar     lo funde y archiva el cambio

[cambio] se puede omitir cuando sólo hay uno en curso. Las capturas quedan en
.capturas/ (fuera del repo).
"""
import functools
import http.server
import re
import shutil
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
SCRIPTS = RAIZ / "scripts"
CAPTURAS = RAIZ / ".capturas"
PLAYWRIGHT = "playwright@1.50.1"

sys.stdout.reconfigure(line_buffering=True)  # que los mensajes salgan en orden con los subprocesos
sys.path.insert(0, str(SCRIPTS))


def _run(cmd, cwd=RAIZ) -> int:
    return subprocess.call([str(c) for c in cmd], cwd=cwd)


def _playwright_ok() -> bool:
    if not shutil.which("node"):
        return False
    return subprocess.call(["node", "-e", "require('playwright')"], cwd=RAIZ,
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL) == 0


def _node_o_salir():
    if not _playwright_ok():
        print("Faltan Node o Playwright. Ejecutá primero:  python3 kit.py instalar")
        sys.exit(2)


def instalar(_args) -> int:
    if not shutil.which("node"):
        print("Hace falta Node 20 o superior (https://nodejs.org).")
        return 2
    if _playwright_ok():
        print("✓ Node y Playwright disponibles. Siguiente:  python3 kit.py check")
        return 0
    print(f"· Instalando {PLAYWRIGHT} en node_modules/ (fuera del repo) …")
    if _run(["npm", "install", "--no-save", "--no-package-lock", PLAYWRIGHT]):
        return 1
    if _run(["npx", "playwright", "install", "chromium"]):
        return 1
    print("✓ Listo. Siguiente:  python3 kit.py check")
    return 0


def servir(_args) -> int:
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(RAIZ))
    with http.server.ThreadingHTTPServer(("127.0.0.1", 8000), handler) as srv:
        print("App en http://localhost:8000   ·   Ctrl+C para parar")
        try:
            srv.serve_forever()
        except KeyboardInterrupt:
            pass
    return 0


def tests(_args) -> int:
    _node_o_salir()
    archivos = sorted(str(p.relative_to(RAIZ)) for p in (RAIZ / "tests").glob("*.test.cjs"))
    if not archivos:
        print("  ✗ no hay ningún tests/*.test.cjs")
        return 1
    return _run(["node", "--test", "--test-reporter=spec", *archivos])


def specs(_args) -> int:
    a = _run([sys.executable, SCRIPTS / "spec_check.py"])
    b = _run([sys.executable, SCRIPTS / "preview_check.py"])
    return a or b


def check(_args) -> int:
    _node_o_salir()
    pasos = [
        ("reglas de la app", lambda: _run([sys.executable, SCRIPTS / "guards.py"])),
        ("especificaciones", lambda: _run([sys.executable, SCRIPTS / "spec_check.py"])),
        ("preview y paridad", lambda: _run([sys.executable, SCRIPTS / "preview_check.py"])),
        ("tests en el navegador (390 px)", lambda: tests([])),
    ]
    resultados = []
    for nombre, paso in pasos:
        print(f"\n── {nombre} ──")
        resultados.append((nombre, paso() == 0))
    print("\n── resumen ──")
    for nombre, ok in resultados:
        print(f"  {'✓' if ok else '✗'} {nombre}")
    ok = all(ok for _, ok in resultados)
    print("\ncheck en verde" if ok else "\ncheck en ROJO")
    return 0 if ok else 1


def _estilos_app() -> str:
    """Las hojas y el <style> del <head> de index.html, tal cual."""
    head = (RAIZ / "index.html").read_text(encoding="utf-8").split("</head>", 1)[0]
    enlaces = re.findall(r"<link rel=\"(?:preconnect|stylesheet)\"[^>]*>", head)
    estilo = re.search(r"<style>.*?</style>", head, re.S)
    return "\n".join(enlaces + [estilo.group(0) if estilo else ""])


def _copiar_estilos(destino: Path) -> None:
    texto = destino.read_text(encoding="utf-8")
    nuevo = re.sub(r"(<!-- estilos-app:inicio[^>]*-->).*?(<!-- estilos-app:fin -->)",
                   lambda m: f"{m.group(1)}\n{_estilos_app()}\n{m.group(2)}", texto, count=1, flags=re.S)
    destino.write_text(nuevo, encoding="utf-8")


def preview(args) -> int:
    import openspec_lib as os_
    import preview_check

    nombre = next((a for a in args if not a.startswith("--")), None)
    cambio = os_.resolver_cambio(nombre)
    destino = cambio / "preview.html"
    if "--esqueleto" in args:
        if destino.exists():
            print(f"Ya existe {destino.relative_to(RAIZ).as_posix()}; no se sobrescribe.")
            return 1
        texto = (RAIZ / "templates" / "preview.html").read_text(encoding="utf-8")
        destino.write_text(texto.replace("__CAMBIO__", cambio.name), encoding="utf-8")
        _copiar_estilos(destino)
        print(f"✓ Esqueleto en {destino.relative_to(RAIZ).as_posix()}. Rellená las regiones nav y pantallas.")
        return 0
    if not destino.exists():
        print(f"No hay preview en {cambio.relative_to(RAIZ).as_posix()}/. Crealo con: "
              f"python3 kit.py preview {cambio.name} --esqueleto")
        return 1
    _copiar_estilos(destino)
    fallos, notas = preview_check.revisar(cambio.name)
    for n in notas:
        print("  ·", n)
    for f in fallos:
        print("  ✗", f)
    if fallos:
        print("\nEl preview no pasa la comprobación; se arregla antes de enseñarlo.")
        return 1
    _node_o_salir()
    salida = CAPTURAS / cambio.name
    shutil.rmtree(salida, ignore_errors=True)
    print("Capturas del preview:")
    if _run(["node", SCRIPTS / "capturas.cjs", "preview", destino, salida]):
        return 1
    if "--servir" in args:
        handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(cambio))
        with http.server.ThreadingHTTPServer(("127.0.0.1", 8001), handler) as srv:
            print(f"Preview de «{cambio.name}» en http://localhost:8001/preview.html   ·   Ctrl+C para parar")
            try:
                srv.serve_forever()
            except KeyboardInterrupt:
                pass
    return 0


def capturas(_args) -> int:
    _node_o_salir()
    salida = CAPTURAS / "app"
    shutil.rmtree(salida, ignore_errors=True)
    print("Capturas de la app:")
    return _run(["node", SCRIPTS / "capturas.cjs", "app", salida])


def archive(args) -> int:
    return _run([sys.executable, SCRIPTS / "archive.py", *args])


COMANDOS = {
    "instalar": instalar, "servir": servir, "check": check, "specs": specs, "tests": tests,
    "preview": preview, "capturas": capturas, "archive": archive,
}

if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] not in COMANDOS:
        print(__doc__)
        sys.exit(2)
    sys.exit(COMANDOS[sys.argv[1]](sys.argv[2:]))
