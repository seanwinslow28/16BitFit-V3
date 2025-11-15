const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Watch the entire monorepo so shared packages reload correctly while preserving Expo defaults.
config.watchFolders = [...config.watchFolders, workspaceRoot];

// 2. In a hoisted workspace, resolve modules from both the app and workspace roots.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 3. Force Metro to use the explicit resolution paths to avoid duplicate React Native installs.
config.resolver.disableHierarchicalLookup = false;

module.exports = config;
