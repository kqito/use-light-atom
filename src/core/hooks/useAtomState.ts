import { useCallback, useRef, useState } from 'react';
import { IAtom, EqualFn, Listener } from '../atom/atom';
import { Selector, useFunctionRef } from '../../utils/useFunctionRef';
import { useIsomorphicLayoutEffect } from '../../utils/useIsomorphicLayoutEffect';
import { devWarnLog } from '../../utils/devlog';

export type UseAtomStateOptions<T, S> = {
  selector?: Selector<T, S>;
  equalFn?: EqualFn;
};

export type UseAtomState = {
  <T, S = T>(atom: IAtom<T>): S;
  <T, S = T>(
    atom: IAtom<T>,
    useAtomStateOptions?: UseAtomStateOptions<T, S>
  ): S;
};

export const useAtomState: UseAtomState = <T, S>(
  atom: IAtom<T>,
  { selector, equalFn }: UseAtomStateOptions<T, S> = {}
) => {
  const selectStateRef = useFunctionRef(selector);
  const equalFnRef = useFunctionRef(equalFn);

  const selectState = useCallback(
    (state: T): S =>
      (selectStateRef.current ? selectStateRef.current(state) : state) as S,
    [selectStateRef]
  );

  const [state, setState] = useState<S>(selectState(atom.getValue()));
  const prevStateRef = useRef<S>(selectState(atom.getValue()));

  useIsomorphicLayoutEffect(() => {
    const equalFn = equalFnRef.current || atom.options.equalFn;
    const listener: Listener<T> = (value) => {
      try {
        const newState = selectState(value as T);
        if (equalFn(prevStateRef.current, newState)) {
          return;
        }

        prevStateRef.current = newState;
        setState(newState);
      } catch (err) {
        devWarnLog(err);
      }
    };

    // Change state by changed atom value
    const initialState = selectState(atom.getValue());

    if (!equalFn(prevStateRef.current, initialState)) {
      setState(initialState);
      prevStateRef.current = initialState;
    }

    atom.subscribe(listener);

    return () => {
      atom.unsubscribe(listener);
    };
  }, [atom, equalFnRef, selectState]);

  return state;
};
