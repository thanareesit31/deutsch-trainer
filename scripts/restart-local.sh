#!/bin/bash
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-3000}"
cd "$ROOT"

# Find the Next dev server on this port and verify its command before stopping it.
LISTENERS="$(lsof -tiTCP:"${PORT}" -sTCP:LISTEN 2>/dev/null || true)"
if [ -n "$LISTENERS" ]; then
  TARGETS=()
  while IFS= read -r PID; do
    [ -n "$PID" ] || continue
    COMMAND="$(ps -p "$PID" -o command= 2>/dev/null || true)"
    case "$COMMAND" in
      *next-server*)
        PARENT="$(ps -p "$PID" -o ppid= 2>/dev/null | tr -d ' ' || true)"
        PARENT_COMMAND="$(ps -p "$PARENT" -o command= 2>/dev/null || true)"
        case "$PARENT_COMMAND" in
          *"next dev"*) TARGETS+=("$PARENT" "$PID") ;;
          *) echo "หยุดไม่ได้: พบ process ที่พอร์ต ${PORT} แต่ไม่พบคำสั่ง Next.js dev ที่ตรงกัน"; exit 1 ;;
        esac
        ;;
      *"next dev"*) TARGETS+=("$PID") ;;
      *) echo "หยุดไม่ได้: พอร์ต ${PORT} ถูกใช้งานโดยโปรแกรมอื่น"; echo "$COMMAND"; exit 1 ;;
    esac
  done <<< "$LISTENERS"

  echo "กำลังหยุด Next.js dev server ที่พอร์ต ${PORT}…"
  for PID in "${TARGETS[@]}"; do kill -TERM "$PID" 2>/dev/null || true; done
  for SECOND in {1..20}; do
    if ! lsof -tiTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then break; fi
    sleep 0.5
  done
  if lsof -tiTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "เซิร์ฟเวอร์เดิมยังปิดไม่เสร็จ กรุณาปิดด้วย Ctrl+C แล้วลองใหม่"
    exit 1
  fi
else
  echo "ไม่พบเซิร์ฟเวอร์เดิมที่พอร์ต ${PORT} เริ่มเซิร์ฟเวอร์ใหม่…"
fi

NODE_BIN=""
for CANDIDATE in "$ROOT"/.tools/node-v*/bin/node "$(command -v node 2>/dev/null || true)"; do
  [ -x "$CANDIDATE" ] || continue
  if "$CANDIDATE" -e 'const [major,minor]=process.versions.node.split(".").map(Number); process.exit(major > 20 || (major === 20 && minor >= 9) ? 0 : 1)' 2>/dev/null; then
    NODE_BIN="$CANDIDATE"
    break
  fi
done
if [ -z "$NODE_BIN" ]; then
  echo "ต้องใช้ Node.js 20.9 ขึ้นไป แต่ไม่พบในเครื่องหรือโฟลเดอร์ .tools"
  exit 1
fi
if [ ! -f "$ROOT/node_modules/next/dist/bin/next" ]; then
  echo "ยังไม่พบ dependencies กรุณาติดตั้งด้วย bun install ก่อน"
  exit 1
fi

echo "เริ่ม Deutsch mit Sun ที่ http://localhost:${PORT}"
exec "$NODE_BIN" node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port "${PORT}"
