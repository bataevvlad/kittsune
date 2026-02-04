import React from 'react';
import { Icon, IconElement, Tab } from '@kitsuine/components';

const PersonIcon = (props): IconElement => (
  <Icon
    {...props}
    name='person-outline'
  />
);

export const TabSimpleUsageShowcase = (): React.ReactElement => (
  <Tab
    title='USERS'
    icon={PersonIcon}
  />
);
