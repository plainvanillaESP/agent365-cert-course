#!/usr/bin/env bash
#
# pack-offline.sh — Empaqueta el build de la plataforma en un zip que puede
# servirse desde cualquier static server local o copiarse a un USB para
# trabajar sin conexión. Resuelve dos detalles:
#
#   1. El build de producción asume `basename = /agent365-cert-course`.
#      Para uso offline servimos desde la raíz, así que generamos un build
#      con `BASE=./` en su lugar.
#
#   2. Añadimos un README dentro del zip con instrucciones rápidas:
#      cómo servir el contenido en localhost con Python, Node o vía
#      file:// (con limitaciones).
#
# Uso:
#   bash scripts/pack-offline.sh
#
# Genera:
#   dist/agent365-cert-course-offline-YYYY-MM-DD.zip
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TODAY="$(date +%Y-%m-%d)"
TMP_DIR="$(mktemp -d -t agent365-offline-XXXX)"
OUT_FILE="$ROOT/dist-offline/agent365-cert-course-offline-${TODAY}.zip"

trap 'rm -rf "$TMP_DIR"' EXIT

echo "  Empaquetado offline de Agent 365 Certificate Course"
echo "  Tmp: $TMP_DIR"
echo

# 1. Build con base relativa
cd "$ROOT"
echo "  → Build con base relativa y basename vacío (VITE_OFFLINE=1)"
VITE_OFFLINE=1 npm run build > "$TMP_DIR/build.log" 2>&1 || {
  echo "  FAIL: build falló. Mira $TMP_DIR/build.log"
  cat "$TMP_DIR/build.log"
  exit 1
}

# 2. Copiar dist a tmp
echo "  → Copiando artifact"
cp -r "$ROOT/dist" "$TMP_DIR/agent365-cert-course"

# 3. README offline
cat > "$TMP_DIR/agent365-cert-course/README-OFFLINE.txt" <<'EOF'
Agent 365 Certificate Course - Distribución offline
====================================================

Este paquete contiene el curso completo navegable sin conexión:
los 16 módulos de contenido, los quizzes de práctica, los
laboratorios, el examen final con cronómetro y el certificado.

Tres formas de abrirlo:

1) Servidor local simple (recomendado)

   Si tienes Python 3:
     python3 -m http.server 8000
   Si tienes Node:
     npx serve .

   Después abre http://localhost:8000 en tu navegador.

2) Doble click sobre index.html

   La mayoría de navegadores funcionan, pero algunos bloquean el
   acceso a archivos relativos. Si ves errores en la consola,
   usa la opción (1).

3) Subir a cualquier hosting estático

   Carpeta agent365-cert-course/ a tu hosting (S3, Netlify,
   nginx, IIS, Apache). Cualquier cosa que sirva HTML estático.

Tu progreso se guarda en localStorage del navegador donde lo
abras. Puedes exportar e importar el progreso desde la página
de ajustes para mover los datos entre dispositivos.

Plain Vanilla Solutions SL · plainvanilla.ai
EOF

# 4. Crear el zip
mkdir -p "$(dirname "$OUT_FILE")"
echo "  → Empaquetando en $OUT_FILE"
cd "$TMP_DIR"
zip -r -q "$OUT_FILE" agent365-cert-course

SIZE_HUMAN="$(du -h "$OUT_FILE" | cut -f1)"
echo
echo "  OK Empaquetado completado"
echo "     Archivo: $OUT_FILE"
echo "     Tamaño:  $SIZE_HUMAN"
echo
