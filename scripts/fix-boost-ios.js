const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const os = require('os');

// Configuration for Boost 1.76.0 (required by RN 0.71.8)
const BOOST_VERSION = '1.76.0';
// SHA256 verified from IOS_BUILD_MIGRATION_REPORT.md
const EXPECTED_SHA256 = 'f0397ba6e982c4450f27bf32a2a83292aba035b827a5623a14636ea583318c41';
const DOWNLOAD_URL = `https://sourceforge.net/projects/boost/files/boost/${BOOST_VERSION}/boost_${BOOST_VERSION.replace(/\./g, '_')}.tar.bz2/download`;
// Path to the podspec file relative to this script's location
const PODSPEC_PATH = path.join(
  __dirname,
  '../node_modules/react-native/third-party-podspecs/boost.podspec'
);

// Define permanent cache directory in the user's home directory (suitable for CI/CD caching)
const CACHE_DIR = path.join(os.homedir(), '.cache', 'react-native-boost');
const TARBALL_PATH = path.join(CACHE_DIR, `boost_${BOOST_VERSION}.tar.bz2`);

// --- Helper Functions ---

/**
 * Calculates the SHA256 checksum of a file.
 */
const calculateSha256 = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('error', reject);
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
};

/**
 * Downloads a file via HTTPS, handling redirects (required for SourceForge).
 */
const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    // Use a User-Agent to prevent blocking by some servers
    const options = { headers: { 'User-Agent': 'Node.js/18 (16BitFit Build Script)' } };

    const request = https.get(url, options, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Handle redirect
        console.log(`[Boost Fix] Following redirect...`);
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      } else if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        reject(new Error(`Failed to download file. Status Code: ${response.statusCode}`));
      }
    });

    request.on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete the file asynchronously if download failed
      reject(err);
    });
  });
};

// --- Main Logic ---

/**
 * Ensures the Boost tarball is downloaded, cached, and verified.
 */
const ensureBoostTarball = async () => {
  // 1. Check if file exists and checksum is valid
  if (fs.existsSync(TARBALL_PATH)) {
    console.log(`[Boost Fix] Tarball found locally. Verifying checksum...`);
    const actualSha256 = await calculateSha256(TARBALL_PATH);
    if (actualSha256 === EXPECTED_SHA256) {
      console.log(`[Boost Fix] Checksum verified.`);
      return;
    } else {
      console.warn(`[Boost Fix] Checksum mismatch. Re-downloading.`);
      fs.unlinkSync(TARBALL_PATH);
    }
  }

  // 2. Download the tarball
  console.log(`[Boost Fix] Downloading Boost ${BOOST_VERSION}...`);
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  await downloadFile(DOWNLOAD_URL, TARBALL_PATH);
  console.log(`[Boost Fix] Download complete.`);

  // 3. Final verification
  const finalSha256 = await calculateSha256(TARBALL_PATH);
  if (finalSha256 !== EXPECTED_SHA256) {
    throw new Error(
      `Final checksum verification failed. Expected ${EXPECTED_SHA256}, got ${finalSha256}`
    );
  }
  console.log(`[Boost Fix] Final checksum verified.`);
};

/**
 * Patches the boost.podspec file to use the local tarball URI.
 */
const patchPodspec = () => {
  if (!fs.existsSync(PODSPEC_PATH)) {
    // This might happen if postinstall runs before all packages are fully extracted
    console.warn(
      `[Boost Fix] boost.podspec not found at ${PODSPEC_PATH}. Skipping patch. (Dependencies might not be fully installed yet).`
    );
    return;
  }

  console.log(`[Boost Fix] Patching boost.podspec...`);
  let content = fs.readFileSync(PODSPEC_PATH, 'utf8');

  // Use file:// protocol for local path
  const localFileUrl = `file://${TARBALL_PATH}`;
  const replacementString = `spec.source = { :http => '${localFileUrl}', :sha256 => '${EXPECTED_SHA256}' }`;

  // Regex to find the original spec.source block
  const regex = /spec\.source\s*=\s*\{[^}]+\}/;

  if (content.includes(localFileUrl)) {
    console.log('[Boost Fix] boost.podspec is already patched.');
    return;
  }

  if (content.match(regex)) {
    content = content.replace(regex, replacementString);
    fs.writeFileSync(PODSPEC_PATH, content);
    console.log('✅ [Boost Fix] Successfully patched boost.podspec.');
  } else {
    throw new Error('Could not find spec.source block in boost.podspec to patch.');
  }
};

const run = async () => {
  try {
    await ensureBoostTarball();
    patchPodspec();
  } catch (error) {
    console.error(`❌ [Boost Fix] Execution failed: ${error.message}`);
    // Exit with error code to stop the installation process if the fix fails
    process.exit(1);
  }
};

run();
