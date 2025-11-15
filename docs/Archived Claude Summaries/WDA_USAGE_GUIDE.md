# WebDriverAgent Usage Guide

## Overview

WebDriverAgent (WDA) has been successfully installed and configured for the 16BitFit V3 project. This guide explains how to use WDA for iOS simulator automation, UI testing, and taking screenshots.

## Installation Location

- **WDA Repository**: `/tools/WebDriverAgent/`
- **Startup Script**: `/scripts/start-wda.sh`
- **Automation Template**: `/scripts/wda-automation-test.js`

## Prerequisites

All prerequisites have been verified and are ready:

- macOS with Xcode 15.2
- Node.js v22.15.0 and npm v11.6.0
- iOS Simulator (currently using: 16BitFit-Testing-iPhone13 on iOS 17.2)
- jq (for JSON parsing in terminal commands)
- Homebrew (for package management)

## Quick Start

### 1. Start the WDA Server

Before using WDA, you need to start an iOS simulator and then launch the WDA server.

**Option A: Using npm script (Recommended)**
```bash
npm run wda:start
```

**Option B: Using the script directly**
```bash
./scripts/start-wda.sh
```

The script will:
1. Detect the booted simulator automatically
2. Try optimized startup (test-without-building) for faster launch
3. Fall back to full build if needed (first run or after updates)
4. Display the server URL when ready: `http://127.0.0.1:8100`

**Important**: Keep this terminal window open while using WDA. The server runs continuously.

### 2. Verify Server Status

In a new terminal window:

```bash
npm run wda:status
```

You should see a JSON response confirming the server is ready:
```json
{
  "value": {
    "message": "WebDriverAgent is ready to accept commands",
    "state": "success",
    "ready": true
  }
}
```

## Available npm Scripts

The following scripts have been added to `package.json`:

| Script | Command | Description |
|--------|---------|-------------|
| `npm run wda:install` | `cd ./tools/WebDriverAgent && npm install` | Install/update WDA dependencies |
| `npm run wda:start` | `./scripts/start-wda.sh` | Start the WDA server on the simulator |
| `npm run wda:status` | `curl -s http://localhost:8100/status \| jq .` | Check if WDA server is running |
| `npm run test:automation:ios` | `node ./scripts/wda-automation-test.js` | Run the automation test template |

## Using the Automation Test Script

The automation test template demonstrates basic WDA operations:

1. **Ensure WDA server is running** (see Quick Start above)
2. **Run the automation script**:
   ```bash
   npm run test:automation:ios
   ```

This will:
- Check WDA server health
- Launch the 16BitFit app (Bundle ID: `com.sixteenbitfit.app`)
- Capture the UI element tree (saved to `wda_test_output/source.json`)
- Take a screenshot (saved to `wda_test_output/screenshot.png`)
- Clean up the session

## Customizing the Automation Script

The template at `/scripts/wda-automation-test.js` can be extended to:

1. **Find elements** by accessibility ID, XPath, or other selectors
2. **Interact with elements** (tap, type text, swipe)
3. **Validate UI state** and app behavior
4. **Navigate between screens**
5. **Run automated test flows**

Example: Finding and tapping a button:
```javascript
// Find element by accessibility ID (React Native testID)
const findRes = await axios.post(`${WDA_URL}/session/${sessionId}/elements`, {
    using: "accessibility id",
    value: "LoginButton"
});

const elementId = findRes.data.value[0].ELEMENT;

// Tap the element
await axios.post(`${WDA_URL}/session/${sessionId}/element/${elementId}/click`, {});
```

## WebDriver API Endpoints

Common endpoints for automation:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/status` | Server health check |
| POST | `/session` | Create new session and launch app |
| DELETE | `/session/{sessionId}` | End session |
| GET | `/session/{sessionId}/screenshot` | Capture screenshot (base64 PNG) |
| GET | `/session/{sessionId}/source?format=json` | Get UI hierarchy as JSON |
| POST | `/session/{sessionId}/elements` | Find elements matching criteria |
| POST | `/session/{sessionId}/element/{elementId}/click` | Tap an element |
| POST | `/session/{sessionId}/element/{elementId}/value` | Type text into an element |

## Troubleshooting

### Server Won't Start
**Symptom**: `xcodebuild` fails or hangs
**Solution**:
1. Clean the build: `cd tools/WebDriverAgent && xcodebuild -project WebDriverAgent.xcodeproj -scheme WebDriverAgentRunner clean`
2. Erase simulator: Device > Erase All Content and Settings
3. Try again

### Port 8100 Already in Use
**Symptom**: Error binding to port 8100
**Solution**:
```bash
# Find the process using port 8100
lsof -i :8100
# Kill it (replace PID with the actual process ID)
kill -9 <PID>
```

### Session Creation Fails
**Symptom**: POST /session returns error
**Solution**:
- Verify the Bundle ID is correct: `com.sixteenbitfit.app`
- Ensure the 16BitFit app is installed on the simulator
- Check the WDA logs in the terminal running the server

### After Xcode Updates
After updating Xcode, you may need to:
1. Verify command line tools: `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`
2. Update WDA: `cd tools/WebDriverAgent && git pull && npm install`
3. Clean and rebuild

## Performance Tips

1. **Use accessibility IDs**: Prefer `accessibility id` (React Native `testID`) over XPath for faster, more reliable element location
2. **Reuse sessions**: Keep the same session for multiple operations instead of creating new sessions
3. **Minimize source requests**: Getting the full UI tree can be slow; use targeted element queries instead
4. **Use test-without-building**: After the first build, the optimized startup is much faster

## Integration with Development Workflow

### Typical Workflow

1. **Start the simulator**
   ```bash
   npm run ios
   ```

2. **In a separate terminal, start WDA**
   ```bash
   npm run wda:start
   ```

3. **Run automation tests or take screenshots**
   ```bash
   npm run test:automation:ios
   ```

4. **View outputs**
   - Screenshots: `wda_test_output/screenshot.png`
   - Element tree: `wda_test_output/source.json`

### CI/CD Integration

The automation script exits with code 1 on errors, making it suitable for CI/CD pipelines. You can expand it to run comprehensive test suites automatically.

## Documentation References

- **Full Implementation Guide**: `/docs/WebDriverAgent Creation - Google Deep Think.md`
- **W3C WebDriver Protocol**: https://www.w3.org/TR/webdriver/
- **Appium WebDriverAgent**: https://github.com/appium/WebDriverAgent

## Success Indicators

The installation is successful if:
- WDA server starts and shows `ServerURLHere->http://127.0.0.1:8100<-ServerURLHere`
- Status endpoint returns `"ready": true`
- npm scripts execute without errors
- Automation test script can create sessions and capture screenshots

## Next Steps

1. **Add testIDs to React Native components** for easier element location
2. **Create automated test scenarios** for critical user flows
3. **Integrate with CI/CD** for automated regression testing
4. **Capture screenshots** for documentation and design reviews
5. **Monitor UI performance** using WDA's element tree analysis

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the detailed implementation guide
3. Check WebDriverAgent logs in the terminal
4. Review Appium WDA GitHub issues: https://github.com/appium/WebDriverAgent/issues
