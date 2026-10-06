#!/bin/bash
set -eu
WORKSPACE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$WORKSPACE_ROOT"
for WORKSPACE_NODE in "$WORKSPACE_ROOT"/.tools/node-v*/bin/node "$(command -v node || true)"; do
  [ -x "$WORKSPACE_NODE" ] || continue
  if "$WORKSPACE_NODE" -e 'const [major,minor]=process.versions.node.split(".").map(Number); process.exit(major>20 || (major===20 && minor>=9) ? 0 : 1)' 2>/dev/null; then
    exec "$WORKSPACE_NODE" scripts/test-workspace.mjs
  fi
done
echo "ต้องใช้ Node.js 20.9 ขึ้นไป (เลือก Node ใน .tools ได้โดยอัตโนมัติ)"
exit 1
