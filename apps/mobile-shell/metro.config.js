/**
 * Metro configuration for React Native in Nx Monorepo
 * https://github.com/facebook/react-native
 *
 * @format
 */

// Note: For RN 0.71.8, we import from 'metro-config'.
const { getDefaultConfig } = require('metro-config');
const path = require('path');

// 1. Define roots
const projectRoot = __dirname;
// Workspace root is two levels up from the app directory (apps/mobile-shell)
const workspaceRoot = path.resolve(projectRoot, '../../');

module.exports = (async () => {
  // 2. Get default config (must be awaited in this RN version)
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    projectRoot: projectRoot,
    // 3. Watch the entire monorepo for changes
    watchFolders: [workspaceRoot],

    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      // 4. Ensure resolution from both app and root node_modules
      nodeModulesPaths: [
        path.resolve(projectRoot, 'node_modules'),
        path.resolve(workspaceRoot, 'node_modules'),
      ],

      // 5. Recommended for monorepos: prevents Metro from automatically looking up parent directories,
      // forcing it to use the explicit paths defined above.
      disableHierarchicalLookup: true,

      // 6. Add support for TS/TSX and ensure standard extensions are present
      sourceExts: [...sourceExts, 'ts', 'tsx', 'js', 'jsx', 'json'].filter((ext, index, self) => self.indexOf(ext) === index), // Ensure unique extensions
      assetExts: assetExts.filter((ext) => ext !== 'svg'), // Example: filter out svg if handled differently, adjust as needed

      blockList: [
        // Exclude BMAD-METHOD directory to prevent Haste module naming collision
        /BMAD-METHOD\/.*/,
      ],
    },
    // Server option might be needed in some monorepo setups, optional
    // server: {
    //   enhanceMiddleware: (middleware) => {
    //     return (req, res, next) => {
    //       // Add custom middleware if needed
    //       return middleware(req, res, next);
    //     };
    //   },
    // },
  };
})();
