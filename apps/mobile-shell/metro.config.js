const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

// Get the default Expo config
const config = getDefaultConfig(projectRoot);

// 1. Watch the entire monorepo (including shared packages)
config.watchFolders = [workspaceRoot];

// 2. Configure module resolution for hoisted workspace with proper priority
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"), // local node_modules first
  path.resolve(workspaceRoot, "node_modules"), // then root node_modules
];

// 3. CRITICAL: Must be true when using hoistingLimits to prevent React version conflicts
config.resolver.disableHierarchicalLookup = true;

// 4. Add asset extensions if missing
config.resolver.assetExts = [...(config.resolver.assetExts || []), "db"];

// 5. Ensure source extensions include TypeScript
config.resolver.sourceExts = [...(config.resolver.sourceExts || []), "cjs"];

// 6. Reset cache on start (helps with monorepo changes)
config.resetCache = true;

// 7. Enable minification for production builds
config.transformer = {
  ...config.transformer,
  minifierPath: require.resolve("metro-minify-terser"),
  minifierConfig: {
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  },
};

module.exports = config;