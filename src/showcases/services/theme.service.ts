import React from 'react';

export enum AppMapping {
  eva = 'Eva',
  material = 'Material',
}

export enum AppTheme {
  light = 'Light',
  dark = 'Dark',
}

export interface ThemeContextType {
  mapping: AppMapping;
  theme: AppTheme;
  setMapping: React.Dispatch<React.SetStateAction<AppMapping>>;
  setTheme: React.Dispatch<React.SetStateAction<AppTheme>>;
  isDarkMode: () => boolean;
}

export const ThemeContext = React.createContext<ThemeContextType>({
  mapping: AppMapping.eva,
  theme: AppTheme.light,
  setMapping: () => {},
  setTheme: () => {},
  isDarkMode: () => false,
});
