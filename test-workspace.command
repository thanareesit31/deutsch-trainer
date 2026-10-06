#!/bin/bash
set -eu
cd "$(dirname "$0")"
exec bash scripts/start-test-workspace.sh
