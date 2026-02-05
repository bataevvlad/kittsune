const path = require('path');

const srcRoot = path.resolve(__dirname, '..');

const evaModules = {
  '@kitsuine/eva': path.resolve(srcRoot, 'eva'),
  '@kitsuine/material': path.resolve(srcRoot, 'material'),
  '@kitsuine/processor': path.resolve(srcRoot, 'processor'),
};

const frameworkModules = {
  '@kitsuine/components': path.resolve(srcRoot, 'components'),
  '@kitsuine/date-fns': path.resolve(srcRoot, 'date-fns'),
  '@kitsuine/eva-icons': path.resolve(srcRoot, 'eva-icons'),
  '@kitsuine/moment': path.resolve(srcRoot, 'moment'),
};

const moduleResolverConfig = {
  root: path.resolve('./'),
  alias: {
    ...evaModules,
    ...frameworkModules,
  },
};

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', moduleResolverConfig],
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};
