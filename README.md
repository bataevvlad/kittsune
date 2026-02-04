
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
| Headless Components | ❌ | ✅ `@kitsune/core` |
| Unistyles Support | ❌ | ✅ `@kitsune/unistyles` |
| Actively Maintained | ⚠️ | ✅ |

---

## Packages

| Package | Description |
|---------|-------------|
| `@kitsune/components` | Full UI components with Eva Design System |
| `@kitsune/core` | Headless components (behavior only) |
| `@kitsune/unistyles` | C++ powered styling with zero re-renders |
| `@kitsune/eva-icons` | 480+ SVG icons |
| `@kitsune/metro-config` | Build-time optimizations |

---

## Quick Start

```bash
# Install
npm install @kitsune/components @eva-design/eva

# or with yarn
yarn add @kitsune/components @eva-design/eva
```

```tsx
import React from 'react';
import { ApplicationProvider, Button } from '@kitsune/components';
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

Use `@kitsune/unistyles` for C++ powered styling (requires New Architecture):

```bash
yarn add @kitsune/unistyles react-native-unistyles
```

```tsx
import { Button, UnistylesProvider } from '@kitsune/unistyles';

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

Use `@kitsune/core` for headless, unstyled components:

```bash
yarn add @kitsune/core
```

```tsx
import { ButtonCore } from '@kitsune/core';

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
+ import { Button } from '@kitsune/components';
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

[badge:license]: https://img.shields.io/npm/l/@kitsune/components.svg
[badge:github-actions]: https://github.com/user/kitsune/workflows/Build/badge.svg
[link:github-actions]: https://github.com/user/kitsune/actions
