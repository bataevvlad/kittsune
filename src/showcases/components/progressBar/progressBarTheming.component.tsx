import React from 'react';
import { ProgressBar } from '@kittsune/components';
import { useProgress } from '../../helpers/progress.hook';

export const ProgressBarThemingShowcase = (): React.ReactElement => {
  const progress = useProgress();
  return (
    <ProgressBar progress={progress} />
  );
};
