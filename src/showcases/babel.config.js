const path = require('path');
const environment = require('./env');

const evaModules = {
  '@kitsuine/eva': path.resolve(environment.EVA_PATH, 'eva'),
  '@kitsuine/material': path.resolve(environment.EVA_PATH, 'material'),
  '@kitsuine/processor': path.resolve(environment.EVA_PATH, 'processor'),
};

const frameworkModules = {
  '@kitsuine/components': path.resolve(__dirname, '../components'),
  '@kitsuine/date-fns': path.resolve(__dirname, '../date-fns'),
  '@kitsuine/eva-icons': path.resolve(__dirname, '../eva-icons'),
  '@kitsuine/moment': path.resolve(__dirname, '../moment'),
};

const moduleResolverConfig = {
  root: path.resolve('./'),
  alias: {
    ...evaModules,
    ...frameworkModules,
  },
};

const presets = [
  'babel-preset-expo',
];

const plugins = [
  ['module-resolver', moduleResolverConfig],
  ["@babel/plugin-proposal-decorators", { 'legacy': true }],
  ["react-native-web", { commonjs: true }]
];

module.exports = function (api) {
  api.cache(true);
  return { presets, plugins };
};
