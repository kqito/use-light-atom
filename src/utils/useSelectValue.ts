import { useCallback, useEffect, useRef } from 'react';

export type Selector<T, S> = (value: T) => S;

export const useSelectValue = <T, S>(selector: Selector<T, S> | undefined) => {
  const selectorRef = useRef(selector);
  useEffect(() => {
    selectorRef.current = selector;
  }, [selector]);

  const selectValue = useCallback(
    (value: T): S =>
      (selectorRef.current ? selectorRef.current(value) : value) as S,
    []
  );

  return selectValue;
};
