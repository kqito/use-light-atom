import { useCallback, useEffect, useRef } from 'react';

export type Selector<T, S> = (state: T) => S;

export const useSelectState = <T, S>(selector: Selector<T, S> | undefined) => {
  const selectorRef = useRef(selector);
  useEffect(() => {
    selectorRef.current = selector;
  }, [selector]);

  const selectState = useCallback(
    (state: T): S =>
      (selectorRef.current ? selectorRef.current(state) : state) as S,
    []
  );

  return selectState;
};
