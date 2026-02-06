const path = require('path');

const srcRoot = path.resolve(__dirname, '..');

const evaModules = {
  '@kittsune/eva': path.resolve(srcRoot, 'eva'),
  '@kittsune/material': path.resolve(srcRoot, 'material'),
  '@kittsune/processor': path.resolve(srcRoot, 'processor'),
};

const frameworkModules = {
  '@kittsune/components': path.resolve(srcRoot, 'components'),
  '@kittsune/date-fns': path.resolve(srcRoot, 'date-fns'),
  '@kittsune/eva-icons': path.resolve(srcRoot, 'eva-icons'),
  '@kittsune/moment': path.resolve(srcRoot, 'moment'),
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
      'react-native-reanimated/plugin', // Must be last (includes worklets plugin)
    ],
  };
};
