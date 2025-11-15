// scripts/wda-automation-test.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const WDA_URL = process.env.WDA_URL || 'http://localhost:8100';
const BUNDLE_ID = 'com.sixteenbitfit.app';
const OUTPUT_DIR = path.join(__dirname, '../wda_test_output');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function runAutomation() {
    let sessionId = null;
    try {
        // 1. Check Status
        console.log(`Checking WDA status at ${WDA_URL}...`);
        await axios.get(`${WDA_URL}/status`).catch(() => {
            throw new Error(`WDA server is not accessible. Is it running?`);
        });

        // 2. Create Session
        console.log(`Launching app: ${BUNDLE_ID}...`);
        const sessionRes = await axios.post(`${WDA_URL}/session`, {
            capabilities: {
                alwaysMatch: { "appium:bundleId": BUNDLE_ID },
                firstMatch: [{}]
            }
        });
        sessionId = sessionRes.data.sessionId;
        console.log(`Session ID: ${sessionId}`);

        // 3. Get Element Tree (Source)
        console.log('Getting element tree...');
        const sourceRes = await axios.get(`${WDA_URL}/session/${sessionId}/source?format=json`);
        const sourcePath = path.join(OUTPUT_DIR, 'source.json');
        // The actual tree is inside the 'value' property
        fs.writeFileSync(sourcePath, JSON.stringify(sourceRes.data.value, null, 2));
        console.log(`Saved source to ${sourcePath}`);

        // 4. Take Screenshot
        console.log('Taking screenshot...');
        const screenshotRes = await axios.get(`${WDA_URL}/session/${sessionId}/screenshot`);
        const base64Image = screenshotRes.data.value;
        const buffer = Buffer.from(base64Image, 'base64');
        const screenshotPath = path.join(OUTPUT_DIR, 'screenshot.png');
        fs.writeFileSync(screenshotPath, buffer);
        console.log(`Saved screenshot to ${screenshotPath}`);

        // (Add interaction steps here: find element, click, etc.)

    } catch (error) {
        console.error('Automation Error:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
        process.exit(1); // Exit with error code for CI/CD
    } finally {
        // 5. Clean up Session
        if (sessionId) {
            console.log('Deleting session...');
            await axios.delete(`${WDA_URL}/session/${sessionId}`).catch(e => console.error('Failed to delete session', e.message));
        }
    }
}

runAutomation();
