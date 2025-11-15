This is a comprehensive, production-ready execution plan for setting up and installing Appium's WebDriverAgent (WDA) on an iOS simulator. This plan enables automation capabilities such as screenshots, element inspection, and UI interaction via a standalone REST API for the 16BitFit V3 project.

### **SECTION 1: SYSTEM REQUIREMENTS & VERIFICATION**

This section ensures your development environment is ready for WebDriverAgent installation.

**1.1. Prerequisites Checklist**

* macOS (Monterey 12.0 or later recommended)  
* Xcode (14.0 or later, including Command Line Tools)  
* iOS Simulator (Booted and running)  
* Node.js (v18+) and npm (v9+) (Required for Appium WDA dependencies)  
* Homebrew (Recommended for managing utilities)

**1.2. Verification Commands**

Run these commands in your terminal to verify the setup:

Bash  
\# 1\. Verify Xcode Installation and Command Line Tools  
echo "--- Checking Xcode Version \---"  
xcodebuild \-version  
\# Expected Output: Xcode 15.x (or newer)

echo "\\n--- Checking Xcode Command Line Tools Path \---"  
xcode-select \-p  
\# Expected Output: /Applications/Xcode.app/Contents/Developer  
\# If incorrect or missing, run: sudo xcode-select \--switch /Applications/Xcode.app/Contents/Developer

\# 2\. Verify Node.js and npm  
echo "\\n--- Checking Node.js and npm \---"  
node \-v && npm \-v

\# 3\. List Booted Simulators  
echo "\\n--- Listing Booted Simulators \---"  
xcrun simctl list devices booted  
\# Ensure at least one simulator is running.

\# 4\. Install 'jq' (Crucial for parsing JSON in scripts)  
if \! command \-v jq &\> /dev/null  
then  
    echo "jq not found, attempting to install via Homebrew..."  
    brew install jq  
fi

### **SECTION 2: INSTALLATION PROCEDURE**

We will clone the Appium fork of WebDriverAgent into the project's tools directory.

**Project Root:** /Users/seanwinslow/Desktop/Claude Desktop Access Folders/16BitFit-V3

Bash  
\# Define the installation directory, handling spaces in the path  
PROJECT\_ROOT="/Users/seanwinslow/Desktop/Claude Desktop Access Folders/16BitFit-V3"  
WDA\_INSTALL\_DIR="${PROJECT\_ROOT}/tools"  
mkdir \-p "$WDA\_INSTALL\_DIR"  
cd "$WDA\_INSTALL\_DIR"

\# 1\. Clone the Appium WebDriverAgent repository  
echo "--- Cloning WebDriverAgent (Appium Fork) \---"  
\# Clone only if the directory doesn't already exist  
if \[ \! \-d "WebDriverAgent" \]; then  
  git clone https://github.com/appium/WebDriverAgent.git  
else  
  echo "WebDriverAgent directory already exists. Pulling latest changes."  
  cd WebDriverAgent && git pull && cd ..  
fi

\# 2\. Navigate to the WDA directory  
cd WebDriverAgent  
WDA\_PROJECT\_DIR=$(pwd)

\# 3\. Install dependencies  
\# The Appium fork uses npm to manage the necessary dependencies for building WDA.  
echo "\\n--- Installing WDA Dependencies (npm install) \---"  
npm install  
\# Expected: 'added X packages...'

### **SECTION 3: CONFIGURATION**

For simulator usage, WebDriverAgent configuration is straightforward.

**3.1. Code Signing Configuration (Simulator)**

By default, simulators do not strictly enforce code signing requirements. The xcodebuild command should succeed using Xcode's "Automatic Signing" without manual intervention.

**3.2. Troubleshooting Configuration**

If you encounter build errors related to signing (e.g., "Requires a development team"):

1. Open the project in Xcode: open "$WDA\_PROJECT\_DIR/WebDriverAgent.xcodeproj"  
2. In Xcode, select the WebDriverAgent project in the Project Navigator.  
3. Select the WebDriverAgentRunner target.  
4. Navigate to the "Signing & Capabilities" tab.  
5. Ensure "Automatically manage signing" is checked.  
6. Select a Development Team (any valid Apple ID, even a free personal one, will work for simulators).

### **SECTION 4: BUILD & DEPLOYMENT**

We use xcodebuild to build the WebDriverAgentRunner scheme and launch it on the simulator. This action installs the WDA app and starts the XCTest runner, which initializes the automation server.

**4.1. Getting the Simulator UDID**

We need the Unique Device Identifier (UDID) of the booted simulator.

Bash  
\# Get the UDID of the first booted simulator using a robust regex match  
SIMULATOR\_UDID=$(xcrun simctl list devices booted | grep \-E \-o \-m 1 '(\[0-9A-F\]{8}-(\[0-9A-F\]{4}-){3}\[0-9A-F\]{12})')

if \[ \-z "$SIMULATOR\_UDID" \]; then  
    echo "Error: No booted simulator found. Please start an iOS simulator."  
else  
    echo "Target Simulator UDID: $SIMULATOR\_UDID"  
fi

**4.2. The Complete xcodebuild Command**

Ensure you are in the WDA project directory ($WDA\_PROJECT\_DIR).

Bash  
cd "$WDA\_PROJECT\_DIR"

echo "\\n--- Building and Launching WebDriverAgentRunner \---"  
echo "This may take a few minutes on the first run..."

xcodebuild \-project WebDriverAgent.xcodeproj \\  
           \-scheme WebDriverAgentRunner \\  
           \-destination "platform=iOS Simulator,id=$SIMULATOR\_UDID" \\  
           test

**4.3. Execution and Output**

**Success Indicator:** Look for the following line in the verbose output, confirming the server has started:  
ServerURLHere-\>http://127.0.0.1:8100\<-ServerURLHere

*   
* **Important:** This command runs continuously. You must leave this terminal window open to keep the server active.

**4.4. Optimization: test-without-building**

Once WDA is successfully built and installed, you can launch it much faster in subsequent sessions:

Bash  
xcodebuild \-project WebDriverAgent.xcodeproj \\  
           \-scheme WebDriverAgentRunner \\  
           \-destination "platform=iOS Simulator,id=$SIMULATOR\_UDID" \\  
           test-without-building

### **SECTION 5: SERVER STARTUP & VERIFICATION**

**5.1. Default URL and Port**

* **URL:** http://localhost:8100

**5.2. Health Check (Verification)**

Open a **new** terminal window and use curl to check the server status.

Bash  
echo "--- Checking WDA Server Status \---"  
curl http://localhost:8100/status | jq .

**Expected JSON Response:**

JSON  
{  
  "value" : {  
    "message" : "WebDriverAgent is ready",  
    "state" : "success",  
    "os" : { ... },  
    "ready" : true,  
    "build" : { ... }  
  },  
  "sessionId" : null  
}

### **SECTION 6: API REFERENCE**

WebDriverAgent implements the W3C WebDriver protocol.1

| HTTP Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /status | Checks server health and readiness. |
| POST | /session | Creates a new automation session and launches the target app. |
| DELETE | /session/{sessionId} | Ends the session and cleans up resources. |
| GET | /session/{sessionId}/screenshot | Captures a screenshot (base64 PNG). |
| GET | /session/{sessionId}/source | Retrieves the UI hierarchy. Use ?format=json. |
| POST | /session/{sessionId}/elements | Finds elements matching a strategy (e.g., accessibility id, xpath). |
| POST | /session/{sessionId}/element/{elementId}/click | Taps/clicks the specified element. |
| POST | /session/{sessionId}/element/{elementId}/value | Types text. Requires JSON body: {"value": \["T", "e", "s", "t"\]}. |
| GET | /session/{sessionId}/element/{elementId}/attribute/{name} | Gets the value of an attribute (e.g., label, value). |

### **SECTION 7: TESTING EXAMPLES (16BitFit Integration)**

These examples demonstrate how to interact with the 16BitFit app (Bundle ID: com.sixteenbitfit.app) using curl and jq. Ensure the app is installed on the simulator.

**7.1. Creating a Session**

This launches the 16BitFit app using the standard W3C capabilities format.

Bash  
echo "--- Creating Session for 16BitFit \---"  
SESSION\_RESPONSE=$(curl \-s \-X POST http://localhost:8100/session \\  
     \-H "Content-Type: application/json" \\  
     \-d '{  
           "capabilities": {  
             "alwaysMatch": {  
               "platformName": "iOS",  
               "appium:bundleId": "com.sixteenbitfit.app"  
             },  
             "firstMatch": \[{}\]  
           }  
         }')

\# Extract Session ID using jq  
SESSION\_ID=$(echo $SESSION\_RESPONSE | jq \-r '.sessionId')  
echo "Session ID: $SESSION\_ID"

**7.2. Taking a Screenshot and Saving to File**

Bash  
echo "--- Taking Screenshot \---"  
\# Capture the base64 data, decode it, and save to a PNG file  
\# Note: Use 'base64 \-d' on macOS or 'base64 \--decode' on some Linux distributions  
curl \-s http://localhost:8100/session/$SESSION\_ID/screenshot | jq \-r '.value' | base64 \-d \> screenshot.png  
echo "Screenshot saved to screenshot.png"

**7.3. Getting the UI Hierarchy (Source)**

Bash  
echo "--- Getting Element Tree (JSON) \---"  
\# WDA defaults to XML, request JSON for easier parsing  
curl \-s "http://localhost:8100/session/$SESSION\_ID/source?format=json" | jq . \> source.json  
echo "Element tree saved to source.json"

**7.4. Finding an Element**

Find a button by accessibility ID (React Native testID), e.g., "LoginButton".

Bash  
echo "--- Finding Element 'LoginButton' \---"  
FIND\_RESPONSE=$(curl \-s \-X POST http://localhost:8100/session/$SESSION\_ID/elements \\  
     \-H "Content-Type: application/json" \\  
     \-d '{"using": "accessibility id", "value": "LoginButton"}')

\# Extract Element ID. WDA returns both legacy (ELEMENT) and W3C keys. We check for either using the jq // operator.  
ELEMENT\_ID=$(echo $FIND\_RESPONSE | jq \-r '.value\[0\].ELEMENT // .value\[0\]."element-6066-11e4-a52e-4f735466cecf"')  
echo "Element ID: $ELEMENT\_ID"

**7.5. Tapping the Element**

Bash  
if \[ \! \-z "$ELEMENT\_ID" \] && \[ "$ELEMENT\_ID" \!= "null" \]; then  
    echo "--- Tapping Element \---"  
    curl \-s \-X POST http://localhost:8100/session/$SESSION\_ID/element/$ELEMENT\_ID/click \\  
         \-H "Content-Type: application/json" \-d '{}'  
else  
    echo "Element not found, skipping tap."  
fi

**7.6. Typing Text**

Assuming $INPUT\_ELEMENT\_ID refers to a text field found previously. Text must be sent as an array of characters.

Bash  
\# Assuming INPUT\_ELEMENT\_ID is set  
\# echo "--- Typing Text \---"  
\# curl \-s \-X POST http://localhost:8100/session/$SESSION\_ID/element/$INPUT\_ELEMENT\_ID/value \\  
\#      \-H "Content-Type: application/json" \-d '{"value": \["t","e","s","t","@","e","m","a","i","l",".","c","o","m"\]}'

**7.7. Ending the Session**

Bash  
echo "--- Deleting Session \---"  
curl \-s \-X DELETE http://localhost:8100/session/$SESSION\_ID

### **SECTION 8: AUTOMATION INTEGRATION**

This section details how to integrate WDA management into the 16BitFit React Native workflow.

**8.1. Robust WDA Startup Script (scripts/start-wda.sh)**

Create a script in your project root (/Users/seanwinslow/Desktop/Claude Desktop Access Folders/16BitFit-V3/scripts/start-wda.sh) to manage WDA startup, incorporating optimizations.

Bash  
\#\!/bin/bash  
\# scripts/start-wda.sh

\# Determine project root and WDA directory relative to the script location  
SCRIPT\_DIR="$(cd "$(dirname "${BASH\_SOURCE\[0\]}")" && pwd)"  
PROJECT\_ROOT="$SCRIPT\_DIR/.."  
WDA\_PROJECT\_DIR="$PROJECT\_ROOT/tools/WebDriverAgent"  
XCODE\_PROJECT="$WDA\_PROJECT\_DIR/WebDriverAgent.xcodeproj"

\# Get the UDID of the first booted simulator  
SIMULATOR\_UDID=$(xcrun simctl list devices booted | grep \-E \-o \-m 1 '(\[0-9A-F\]{8}-(\[0-9A-F\]{4}-){3}\[0-9A-F\]{12})')

if \[ \-z "$SIMULATOR\_UDID" \]; then  
    echo "Error: No booted simulator found. Please start an iOS simulator."  
    exit 1  
fi

echo "Target Simulator UDID: $SIMULATOR\_UDID"

\# Ensure we are in the WDA directory for the build commands  
cd "$WDA\_PROJECT\_DIR"

\# Optimized Startup: Try test-without-building first for speed  
echo "Attempting optimized launch (test-without-building)..."  
xcodebuild \-project WebDriverAgent.xcodeproj \\  
           \-scheme WebDriverAgentRunner \\  
           \-destination "platform=iOS Simulator,id=$SIMULATOR\_UDID" \\  
           test-without-building || {  
    \# If it fails (e.g., first run, WDA not installed, or after updates), fallback to a full build and test  
    echo "Optimized launch failed. Falling back to full build (test)..."  
    xcodebuild \-project WebDriverAgent.xcodeproj \\  
               \-scheme WebDriverAgentRunner \\  
               \-destination "platform=iOS Simulator,id=$SIMULATOR\_UDID" \\  
               test  
}

Make the script executable:

chmod \+x "/Users/seanwinslow/Desktop/Claude Desktop Access Folders/16BitFit-V3/scripts/start-wda.sh"

**8.2. Package.json Scripts**

Add scripts to the root package.json for easy management:

JSON  
"scripts": {  
  "wda:install": "cd ./tools/WebDriverAgent && npm install",  
  "wda:start": "./scripts/start-wda.sh",  
  "wda:status": "curl \-s http://localhost:8100/status | jq .",  
  "test:automation:ios": "node ./scripts/wda-automation-test.js"  
}

**8.3. Automation Script Template (Node.js)**

Create scripts/wda-automation-test.js. This provides a foundation for writing tests.

*Prerequisite: Install axios in the monorepo: npm install axios*

JavaScript  
// scripts/wda-automation-test.js  
const axios \= require('axios');  
const fs \= require('fs');  
const path \= require('path');

const WDA\_URL \= process.env.WDA\_URL || 'http://localhost:8100';  
const BUNDLE\_ID \= 'com.sixteenbitfit.app';  
const OUTPUT\_DIR \= path.join(\_\_dirname, '../wda\_test\_output');

// Ensure output directory exists  
if (\!fs.existsSync(OUTPUT\_DIR)) {  
    fs.mkdirSync(OUTPUT\_DIR, { recursive: true });  
}

async function runAutomation() {  
    let sessionId \= null;  
    try {  
        // 1\. Check Status  
        console.log(\`Checking WDA status at ${WDA\_URL}...\`);  
        await axios.get(\`${WDA\_URL}/status\`).catch(() \=\> {  
            throw new Error(\`WDA server is not accessible. Is it running?\`);  
        });

        // 2\. Create Session  
        console.log(\`Launching app: ${BUNDLE\_ID}...\`);  
        const sessionRes \= await axios.post(\`${WDA\_URL}/session\`, {  
            capabilities: {  
                alwaysMatch: { "appium:bundleId": BUNDLE\_ID },  
                firstMatch: \[{}\]  
            }  
        });  
        sessionId \= sessionRes.data.sessionId;  
        console.log(\`Session ID: ${sessionId}\`);

        // 3\. Get Element Tree (Source)  
        console.log('Getting element tree...');  
        const sourceRes \= await axios.get(\`${WDA\_URL}/session/${sessionId}/source?format=json\`);  
        const sourcePath \= path.join(OUTPUT\_DIR, 'source.json');  
        // The actual tree is inside the 'value' property  
        fs.writeFileSync(sourcePath, JSON.stringify(sourceRes.data.value, null, 2));  
        console.log(\`Saved source to ${sourcePath}\`);

        // 4\. Take Screenshot  
        console.log('Taking screenshot...');  
        const screenshotRes \= await axios.get(\`${WDA\_URL}/session/${sessionId}/screenshot\`);  
        const base64Image \= screenshotRes.data.value;  
        const buffer \= Buffer.from(base64Image, 'base64');  
        const screenshotPath \= path.join(OUTPUT\_DIR, 'screenshot.png');  
        fs.writeFileSync(screenshotPath, buffer);  
        console.log(\`Saved screenshot to ${screenshotPath}\`);

        // (Add interaction steps here: find element, click, etc.)

    } catch (error) {  
        console.error('Automation Error:', error.message);  
        if (error.response) {  
            console.error('Response Status:', error.response.status);  
            console.error('Response Data:', error.response.data);  
        }  
        process.exit(1); // Exit with error code for CI/CD  
    } finally {  
        // 5\. Clean up Session  
        if (sessionId) {  
            console.log('Deleting session...');  
            await axios.delete(\`${WDA\_URL}/session/${sessionId}\`).catch(e \=\> console.error('Failed to delete session', e.message));  
        }  
    }  
}

runAutomation();

### **SECTION 9: TROUBLESHOOTING**

Common issues encountered during WDA setup and execution.

**9.1. Port Conflicts (8100 already in use)**

* **Symptom:** xcodebuild logs show errors binding to port 8100\.

**Solution 1 (Stop conflicting process):**  
Bash  
lsof \-i :8100  
\# Find the PID and kill it  
kill \-9 \<PID\>

* 

**Solution 2 (Use a different port):** Pass environment variables to the XCTest runner using the \-WDA\_environmentVariables flag. Modify the xcodebuild command (in scripts/start-wda.sh):  
Bash  
xcodebuild ... test-without-building \-WDA\_environmentVariables USE\_PORT=8101

* (Remember to update your scripts to connect to the new port, e.g., by setting the WDA\_URL environment variable).

**9.2. XCTest Runner Failing to Launch or Stalling**

* **Symptom:** xcodebuild hangs, the ServerURLHere line never appears, or it reports "Testing Failed".  
* **Solution:** This often indicates instability in Xcode or the simulator's state.  
  1. Stop the xcodebuild command (Ctrl+C).

**Clean WDA Build:** In the WDA directory:  
Bash  
xcodebuild \-project WebDriverAgent.xcodeproj \-scheme WebDriverAgentRunner clean

2. 

**Clean Derived Data (Targeted):**  
Bash  
rm \-rf \~/Library/Developer/Xcode/DerivedData/WebDriverAgent-\*

3.   
   4. **Erase Simulator:** In the Simulator app, choose Device \-\> Erase All Content and Settings....  
   5. Rerun the startup script.

**9.3. Code Signing Errors on Simulator**

* **Symptom:** xcodebuild fails with signing errors.

**Solution:** Follow the steps in Section 3.2 to manually select a team. If issues persist, you can force the build without signing (only for simulators):  
Bash  
xcodebuild ... test CODE\_SIGN\_IDENTITY="" CODE\_SIGNING\_REQUIRED=NO

* 

**9.4. Session Creation Errors**

* **Symptom:** POST /session returns an error or times out.  
* **Solution:** Verify the bundleId (com.sixteenbitfit.app) is correct and that the application is **installed** on the targeted simulator. Check the xcodebuild logs to see if the app crashed on launch.

**9.5. Checking WDA Logs**

* **Terminal Logs:** The primary logs are the standard output of the running xcodebuild command.  
* **System Logs:** Use the macOS Console.app, select the simulator device, and filter by the WebDriverAgentRunner process.

### **SECTION 10: MAINTENANCE & UPDATES**

**10.1. How to Update WebDriverAgent**

WebDriverAgent is frequently updated. To get the latest version:

Bash  
cd "/Users/seanwinslow/Desktop/Claude Desktop Access Folders/16BitFit-V3/tools/WebDriverAgent"  
git pull origin master  
\# Re-run the setup  
npm install  
\# Clean previous build artifacts  
xcodebuild \-project WebDriverAgent.xcodeproj \-scheme WebDriverAgentRunner clean

**10.2. After Xcode Updates**

Xcode updates often break XCTest compatibility. After updating Xcode:

Ensure the correct Xcode Command Line Tools are selected:  
Bash  
sudo xcode-select \-s /Applications/Xcode.app/Contents/Developer

1.   
2. Update WDA (Section 10.1).  
3. Perform a clean build and restart the server.

**10.3. Performance Considerations**

* **Locator Strategies:** Prefer accessibility id (React Native testID) or predicate string. They are significantly faster and more reliable than xpath on iOS.  
* **Source Retrieval:** Getting the full element tree (/source) can be slow in complex React Native hierarchies. Use it sparingly.  
* **Session Reuse:** Reuse the same WDA session for multiple commands rather than creating a new session for every action.

