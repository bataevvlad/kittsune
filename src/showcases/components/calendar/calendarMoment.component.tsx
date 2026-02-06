/**
 * IMPORTANT: To use Moment make sure to install Moment Date Service
 * npm i @kittsune/moment
 */

import React from 'react';
import { Calendar } from '@kittsune/components';
import { MomentDateService } from '@kittsune/moment';
import moment from 'moment';

const dateService = new MomentDateService();

export const CalendarMomentShowcase = (): React.ReactElement => {

  const [date, setDate] = React.useState(moment());

  return (
    <Calendar
      dateService={dateService}
      date={date}
      onSelect={nextDate => setDate(nextDate)}
    />
  );
};
