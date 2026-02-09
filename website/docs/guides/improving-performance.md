---
id: improving-performance
title: Improving Performance
sidebar_label: Improving Performance
description: How to get rid of performance issues in Kittsune when using mapping customization or React Native Navigation by Wix.
keywords:
  - React Native
  - Kittsune
  - performance
  - custom mapping
  - metro config
---

# Improving Performance

By default, Kittsune is configured with processing Eva mapping packages during the runtime. This may lead to performance issues when using [mapping customization](/docs/design-system/customize-mapping) or React Native Navigation by Wix. By following this guide, you will know how to get rid of these issues and save the time your application takes on loading.

---

## Requirements

The following steps are only possible with installing Kittsune package, which manages these issues:

```bash
npm i -D @kittsune/metro-config

// Using Yarn?
yarn add -D @kittsune/metro-config
```

The props passed to ApplicationProvider should also be modified:

```jsx
import React from 'react';
import * as eva from '@kittsune/eva';
import { ApplicationProvider } from '@kittsune/components';

export default () => (
  <ApplicationProvider {...eva} theme={eva.light}>
    // ...
  </ApplicationProvider>
);
```

By spreading `eva` we say Kittsune to use compiled Eva mapping if there is such. If there is no, it still be compiled during the runtime. Notice we omit `customMapping` property as well, since it's not required anymore.

---

## Metro Bundler

Metro Bundler is used to bundle React Native applications. By using it with extra configuration, we may compile Eva packages during the application build time. This means, the application will start with ready-to-go stylings.

Create **metro.config.js** at the root of your project (if you don't have this file yet) and use the `MetroConfig.create` method to add necessary handlers into default config object.

For bare React Native project:

```js
const MetroConfig = require('@kittsune/metro-config');

const evaConfig = {
  evaPackage: '@kittsune/eva',
  // Optional, but may be useful when using mapping customization feature.
  // customMappingPath: './custom-mapping.json',
};

module.exports = (() => {
  const previousConfig = {};
  const uiKittenMixedConfig = MetroConfig.create(evaConfig, previousConfig);
  return uiKittenMixedConfig;
})();
```

For Expo project:

```js
const { getDefaultConfig } = require("expo/metro-config");

const MetroConfig = require('@kittsune/metro-config');

const evaConfig = {
  evaPackage: '@kittsune/eva',
  // Optional, but may be useful when using mapping customization feature.
  // customMappingPath: './custom-mapping.json',
};

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  const uiKittenMixedConfig = MetroConfig.create(evaConfig, defaultConfig);
  return uiKittenMixedConfig;
})();
```

Shut down the current bundler process and restart the app with clearing cache.

```bash
npm start -- --reset-cache

// Using Expo?
expo start -c
```

---

## Command Line Interface

Despite that configuring Metro Bundler may cover most of the use cases, we also provide a command line interface to do the same job, but manually. Running within the CI environment is one of the cases when it should be done before the application is built.

Assuming `@kittsune/metro-config` package [is installed](#requirements), we may run the following command:

```bash
kittsune bootstrap @kittsune/eva
```

Or, if there is a custom mapping:

```bash
kittsune bootstrap @kittsune/eva ./path-to/mapping.json
```

---

## Definition

Let's take a look on the **evaConfig** we define:

**evaPackage** represents the name of Eva Design System package installed. In this example, we use `@kittsune/eva`. It may be one of the valid Eva Design System packages.

**customMappingPath** represents a path to custom mapping if you use [mapping customization](/docs/design-system/customize-mapping) feature. You may omit it if you do not customize Eva.

The second argument of `create` function is a standard configuration of Metro Bundler. In case you had `metro.config.js` previously, pass the object you had to merge it with Kittsune configuration.
