import React from 'react';
import { ThemeStyleType } from '@kitsuine/processor';

const defaultValue: ThemeStyleType = {};

export const MappingContext: React.Context<ThemeStyleType> = React.createContext(defaultValue);
