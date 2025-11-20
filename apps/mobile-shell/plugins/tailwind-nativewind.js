module.exports = function(api) {
  return {
    visitor: {
      Program(path, state) {
        path.traverse({
          ImportDeclaration(importPath) {
            if (importPath.node.source.value === 'nativewind') {
              // ensure Tailwind CSS plugin compatibility
              state.opts.tailwind = true;
            }
          },
        });
      },
    },
  };
};
