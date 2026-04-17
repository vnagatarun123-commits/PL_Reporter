const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const nodeModules = path.join(projectRoot, 'node_modules');

const config = getDefaultConfig(projectRoot);

config.resolver.nodeModulesPaths = [nodeModules];
config.resolver.extraNodeModules = new Proxy({}, {
  get: (target, name) => path.join(nodeModules, name),
});

module.exports = config;
