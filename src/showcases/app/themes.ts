import * as eva from '@kitsuine/eva';
import * as material from '@kitsuine/material';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const themes: Record<string, any> = {
  Eva: {
    Light: eva.light,
    Dark: eva.dark,
  },
  Material: {
    Light: material.light,
    Dark: material.dark,
  },
};
