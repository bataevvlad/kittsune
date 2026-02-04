
# Kitsune 🦊

> **Modern React Native UI Library** — New Architecture Ready

A modernized fork of [UI Kitten](https://github.com/akveo/react-native-ui-kitten), rebuilt for React Native's **New Architecture** (Fabric & TurboModules).

---

## Why Kitsune?

UI Kitten is a great library, but development has slowed. **Kitsune** picks up where it left off:

| Feature | UI Kitten | Kitsune |
|---------|-----------|---------|
| React Native | 0.70 | **0.76+** |
| New Architecture | ❌ | ✅ |
| Functional Components | ❌ Class-based | ✅ Hooks |
| Headless Components | ❌ | ✅ `@kitsuine/core` |
| Unistyles Support | ❌ | ✅ `@kitsuine/unistyles` |
| Actively Maintained | ⚠️ | ✅ |

---

## Packages

| Package | Description |
|---------|-------------|
| `@kitsuine/components` | Full UI components with Eva Design System |
| `@kitsuine/core` | Headless components (behavior only) |
| `@kitsuine/unistyles` | C++ powered styling with zero re-renders |
| `@kitsuine/eva-icons` | 480+ SVG icons |
| `@kitsuine/metro-config` | Build-time optimizations |

---

## Quick Start

```bash
# Install
npm install @kitsuine/components @eva-design/eva

# or with yarn
yarn add @kitsuine/components @eva-design/eva
```

```tsx
import React from 'react';
import { ApplicationProvider, Button } from '@kitsuine/components';
import * as eva from '@eva-design/eva';

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Button onPress={() => console.log('Pressed!')}>
        Hello Kitsune!
      </Button>
    </ApplicationProvider>
  );
}
```

---

## Want Maximum Performance?

Use `@kitsuine/unistyles` for C++ powered styling (requires New Architecture):

```bash
yarn add @kitsuine/unistyles react-native-unistyles
```

```tsx
import { Button, UnistylesProvider } from '@kitsuine/unistyles';

export default function App() {
  return (
    <UnistylesProvider theme="light">
      <Button>Zero re-renders!</Button>
    </UnistylesProvider>
  );
}
```

---

## Build Your Own Components

Use `@kitsuine/core` for headless, unstyled components:

```bash
yarn add @kitsuine/core
```

```tsx
import { ButtonCore } from '@kitsuine/core';

function MyCustomButton({ children, onPress }) {
  return (
    <ButtonCore onPress={onPress}>
      {({ state, handlers, accessibilityProps }) => (
        <Pressable
          {...handlers}
          {...accessibilityProps}
          style={{ opacity: state.pressed ? 0.5 : 1 }}
        >
          <Text>{children}</Text>
        </Pressable>
      )}
    </ButtonCore>
  );
}
```

---

## Features

- **30+ Components** — Button, Input, Select, Calendar, and more
- **Dark Mode** — Built-in light/dark themes
- **Eva Design System** — Consistent, beautiful design language
- **Fully Typed** — TypeScript from the ground up
- **Accessible** — ARIA roles and screen reader support
- **New Architecture** — Fabric & TurboModules ready

---

## Migration from UI Kitten

```diff
- import { Button } from '@ui-kitten/components';
+ import { Button } from '@kitsuine/components';
```

API is fully compatible. See [Migration Guide](./docs/migration/ui-kitten-to-kitsune.md).

---

## Documentation

- [Getting Started](./docs/getting-started.md)
- [Components](./docs/components/)
- [Theming](./docs/theming.md)
- [FAQ](./FAQ.md) — Comprehensive guide for contributors

---

## Contributing

We welcome contributions! See [FAQ.md](./FAQ.md) for the complete development roadmap.

---

## Credits

Kitsune is a fork of [UI Kitten](https://github.com/akveo/react-native-ui-kitten) by [Akveo](https://akveo.com).
Thank you for creating such an amazing foundation!

---

## License

[MIT](LICENSE.txt)

---

**Kitsune** 🦊 — *The fox that evolved from the kitten*

[badge:license]: https://img.shields.io/npm/l/@kitsuine/components.svg
[badge:github-actions]: https://github.com/bataevvlad/kitsune/workflows/Build/badge.svg
[link:github-actions]: https://github.com/bataevvlad/kitsune/actions
