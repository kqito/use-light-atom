import { isProduction } from './isProduction';

type LogType = 'log' | 'warn' | 'error';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const devlog = (message: any, type: LogType) => {
  if (isProduction) {
    return;
  }

  console[type](message);
};
