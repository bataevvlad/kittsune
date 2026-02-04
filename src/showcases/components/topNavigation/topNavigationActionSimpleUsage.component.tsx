import React from 'react';
import { Icon, IconElement, TopNavigationAction } from '@kitsuine/components';
import { TouchableWebElement } from '@kitsuine/components/devsupport';

const BackIcon = (props): IconElement => (
  <Icon
    {...props}
    name='arrow-back'
  />
);

export const TopNavigationActionSimpleUsageShowcase = (): TouchableWebElement => (
  <TopNavigationAction icon={BackIcon} />
);
