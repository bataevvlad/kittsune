import React from 'react';
import { Icon, IconElement, TopNavigationAction } from '@kittsune/components';
import { TouchableWebElement } from '@kittsune/components/devsupport';

const BackIcon = (props): IconElement => (
  <Icon
    {...props}
    name='arrow-back'
  />
);

export const TopNavigationActionSimpleUsageShowcase = (): TouchableWebElement => (
  <TopNavigationAction icon={BackIcon} />
);
