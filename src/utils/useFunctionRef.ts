import { useEffect, useRef } from 'react';

export type Selector<T, S> = (state: T) => S;

export const useFunctionRef = <T>(fn: T | undefined) => {
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  return fnRef;
};
