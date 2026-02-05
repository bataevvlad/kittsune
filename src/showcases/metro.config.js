const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const workspaceRoot = path.resolve(__dirname, '../..');
const srcRoot = path.resolve(__dirname, '..');

const frameworkModules = [
  path.resolve(srcRoot, 'components'),
  path.resolve(srcRoot, 'date-fns'),
  path.resolve(srcRoot, 'eva-icons'),
  path.resolve(srcRoot, 'moment'),
  path.resolve(srcRoot, 'eva'),
  path.resolve(srcRoot, 'material'),
  path.resolve(srcRoot, 'processor'),
];

const moduleDependencies = [
  // root node_modules
  path.resolve(workspaceRoot, 'node_modules'),

  // @kitsuine/components dependencies
  path.resolve(workspaceRoot, 'node_modules/hoist-non-react-statics'),
  path.resolve(workspaceRoot, 'node_modules/lodash.merge'),
  path.resolve(workspaceRoot, 'node_modules/fecha'),

  // @kitsuine/eva-icons
  path.resolve(workspaceRoot, 'node_modules/react-native-eva-icons'),

  // external
  path.resolve(workspaceRoot, 'node_modules/react-is'),
  path.resolve(workspaceRoot, 'node_modules/source-map'),
];

// Force single copies of these modules - use root node_modules
const extraNodeModules = {
  // Core React modules - force root copy
  'react': path.resolve(workspaceRoot, 'node_modules/react'),
  'react-native': path.resolve(workspaceRoot, 'node_modules/react-native'),
  'react-native-svg': path.resolve(workspaceRoot, 'node_modules/react-native-svg'),
  '@babel/runtime': path.resolve(workspaceRoot, 'node_modules/@babel/runtime'),

  // Map @kitsuine packages to local source
  '@kitsuine/components': path.resolve(srcRoot, 'components'),
  '@kitsuine/eva-icons': path.resolve(srcRoot, 'eva-icons'),
  '@kitsuine/date-fns': path.resolve(srcRoot, 'date-fns'),
  '@kitsuine/moment': path.resolve(srcRoot, 'moment'),
  '@kitsuine/eva': path.resolve(srcRoot, 'eva'),
  '@kitsuine/material': path.resolve(srcRoot, 'material'),
  '@kitsuine/processor': path.resolve(srcRoot, 'processor'),
};

config.projectRoot = path.resolve(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  ...extraNodeModules,
};

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.watchFolders = [
  ...frameworkModules,
  ...moduleDependencies,
];

module.exports = config;
