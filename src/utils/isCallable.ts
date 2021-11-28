// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isCallable = <T extends (...args: any) => any>(
  target: unknown
): target is T => typeof target === 'function';
