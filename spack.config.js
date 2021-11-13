const { config } = require('@swc/core/spack');

module.exports = config({
  entry: {
    web: `${__dirname}/src/index.ts`,
  },
  output: {
    path: `${__dirname}/dist`,
    name: 'index.js',
  },
  options: {
    sourceMaps: false,
  },
});
