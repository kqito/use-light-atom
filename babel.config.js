const isTest = process.env.NODE_ENV === 'TEST';

const presets = [
  [
    '@babel/preset-env',
    {
      modules: isTest ? 'commonjs' : false,
    },
  ],
  [
    '@babel/preset-react',
    {
      runtime: 'automatic',
    },
  ],
  '@babel/preset-typescript',
];

const plugins = [];

module.exports = { presets, plugins };
