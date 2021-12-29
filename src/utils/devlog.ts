import { isProduction } from './isProduction';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const devWarnLog = (...message: any) => {
  if (isProduction) {
    return;
  }

  console.warn(...message);
};
