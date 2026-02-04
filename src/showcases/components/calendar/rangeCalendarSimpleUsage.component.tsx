import React from 'react';
import { RangeCalendar } from '@kitsuine/components';

export const RangeCalendarSimpleUsageShowcase = (): React.ReactElement => {

  const [range, setRange] = React.useState({});

  return (
    <RangeCalendar
      range={range}
      onSelect={nextRange => setRange(nextRange)}
    />
  );
};
