#!/bin/bash
# scripts/start-wda.sh

# Determine project root and WDA directory relative to the script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/.."
WDA_PROJECT_DIR="$PROJECT_ROOT/tools/WebDriverAgent"
XCODE_PROJECT="$WDA_PROJECT_DIR/WebDriverAgent.xcodeproj"

# Get the UDID of the first booted simulator
SIMULATOR_UDID=$(xcrun simctl list devices booted | grep -E -o -m 1 '([0-9A-F]{8}-([0-9A-F]{4}-){3}[0-9A-F]{12})')

if [ -z "$SIMULATOR_UDID" ]; then
    echo "Error: No booted simulator found. Please start an iOS simulator."
    exit 1
fi

echo "Target Simulator UDID: $SIMULATOR_UDID"

# Ensure we are in the WDA directory for the build commands
cd "$WDA_PROJECT_DIR"

# Optimized Startup: Try test-without-building first for speed
echo "Attempting optimized launch (test-without-building)..."
xcodebuild -project WebDriverAgent.xcodeproj \
           -scheme WebDriverAgentRunner \
           -destination "platform=iOS Simulator,id=$SIMULATOR_UDID" \
           test-without-building || {
    # If it fails (e.g., first run, WDA not installed, or after updates), fallback to a full build and test
    echo "Optimized launch failed. Falling back to full build (test)..."
    xcodebuild -project WebDriverAgent.xcodeproj \
               -scheme WebDriverAgentRunner \
               -destination "platform=iOS Simulator,id=$SIMULATOR_UDID" \
               test
}
