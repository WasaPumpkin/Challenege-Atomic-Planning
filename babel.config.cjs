// eslint-disable-next-line no-undef
// babel.config.js
// babel.config.cjs

module.exports = {
  presets: [
    // 1. For compiling modern JavaScript down to a version that runs in Node (for Jest)
    ['@babel/preset-env', { targets: { node: 'current' } }],

    // 2. For compiling React's JSX syntax
    ['@babel/preset-react', { runtime: 'automatic' }],

    // 3. For compiling TypeScript syntax
    '@babel/preset-typescript',
  ],
};