import * as eva from '@kittsune/eva';
import * as material from '@kittsune/material';

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
