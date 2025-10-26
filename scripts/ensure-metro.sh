#!/bin/bash
# scripts/ensure-metro.sh
# Ensures Metro bundler is running and ready before proceeding with the Xcode build.

# Fail on any error
set -e

echo "[16BitFit] Synchronizing Metro Bundler..."

# --- Environment Setup ---
# Load Node environment. Xcode builds often run in a restricted shell environment.
# We must manually source common Node Version Manager configurations.

# NVM
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  source "$NVM_DIR/nvm.sh"
elif [ -x "$(command -v brew)" ] && [ -s "$(brew --prefix)/opt/nvm/nvm.sh" ]; then
  source "$(brew --prefix)/opt/nvm/nvm.sh"
fi

# ASDF
if [ -s "$HOME/.asdf/asdf.sh" ]; then
    source "$HOME/.asdf/asdf.sh"
fi

# Volta
if [ -s "$HOME/.volta/bin" ]; then
  export PATH="$HOME/.volta/bin:$PATH"
fi

NODE_BINARY=$(command -v node)
if [ -z "$NODE_BINARY" ]; then
  echo "error: Node.js binary not found. Ensure Node is installed and accessible."
  exit 1
fi

# --- Configuration & Paths (Monorepo Aware) ---
export RCT_METRO_PORT="${RCT_METRO_PORT:=8081}"

# SRCROOT is provided by Xcode and points to the directory containing the .xcodeproj file (apps/mobile-shell/ios)
if [ -z "$SRCROOT" ]; then
  echo "error: SRCROOT environment variable not set. This script is intended to be run from Xcode."
  exit 1
fi

IOS_DIR="$SRCROOT"
# Resolve to absolute paths to ensure file tests work correctly
APP_DIR="$(cd "$IOS_DIR/.." && pwd)"           # apps/mobile-shell
PROJECT_ROOT="$(cd "$APP_DIR/../.." && pwd)"   # Monorepo root

# Log file within the app directory for easy access
LOG_FILE="${APP_DIR}/metro-sync.log"

# Find react-native CLI script (handle monorepo hoisting)
RN_CLI_PATH="${PROJECT_ROOT}/node_modules/react-native/cli.js"
if [ ! -f "$RN_CLI_PATH" ]; then
  RN_CLI_PATH="${APP_DIR}/node_modules/react-native/cli.js"
fi

if [ ! -f "$RN_CLI_PATH" ]; then
  echo "error: Can't find react-native/cli.js at:"
  echo "  Tried: ${PROJECT_ROOT}/node_modules/react-native/cli.js"
  echo "  Tried: ${APP_DIR}/node_modules/react-native/cli.js"
  echo "Ensure dependencies are installed (npm install)."
  exit 1
fi

# --- Helper Functions ---
check_metro() {
  # Check the status endpoint for the success string
  curl -s "http://localhost:${RCT_METRO_PORT}/status" 2>/dev/null | grep -q "packager-status:running"
}

wait_for_metro() {
  # Increased timeout for complex monorepos
  TIMEOUT=120; INTERVAL=2; ELAPSED=0
  echo "Waiting for Metro to initialize (max ${TIMEOUT}s)..."
  while ! check_metro; do
    if [ $ELAPSED -ge $TIMEOUT ]; then
      echo "error: Metro did not initialize within $TIMEOUT seconds. Check Metro logs:"
      echo "--- Last 30 lines of ${LOG_FILE} ---"
      tail -n 30 "$LOG_FILE"
      exit 1
    fi
    sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
    echo "Waiting... ($ELAPSED/$TIMEOUTs)"
  done
  sleep 2 # Small extra buffer
  echo "✅ Metro initialization complete."
}

# --- Main Logic ---
# 1. Check if Metro is ready
if check_metro; then
  echo "✅ Metro is already running and ready."
  exit 0
fi

# 2. Handle port conflicts: If the port is busy but Metro is unresponsive, kill the process.
if lsof -i tcp:${RCT_METRO_PORT} -s tcp:LISTEN -t >/dev/null ; then
  echo "warn: Port ${RCT_METRO_PORT} is in use but Metro is unresponsive. Killing process and restarting."
  # Use lsof to find the PID and kill it (macOS compatible)
  kill $(lsof -t -i:${RCT_METRO_PORT}) || true
  sleep 2
fi

# 3. Start Metro
echo "Starting Metro bundler (background process)... Logs: ${LOG_FILE}"
# Navigate to app dir for correct config loading (metro.config.js)
cd "$APP_DIR"
# Start Metro detached (nohup), redirecting output to the log file
nohup "$NODE_BINARY" "$RN_CLI_PATH" start --port ${RCT_METRO_PORT} > "$LOG_FILE" 2>&1 &

# 4. Wait synchronously
wait_for_metro
