import React from 'react';
import { CalendarRange, RangeCalendar } from '@kittsune/components';

export const RangeCalendarSimpleUsageShowcase = (): React.ReactElement => {

  const [range, setRange] = React.useState<CalendarRange<Date>>({});

  return (
    <RangeCalendar
      range={range}
      onSelect={nextRange => setRange(nextRange)}
    />
  );
};
