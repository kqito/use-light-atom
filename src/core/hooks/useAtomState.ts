import { useContext, useMemo, useRef, useState } from 'react';
import { Listener, StoreContext } from '../store/store';
import { Atom } from '../atom/atom';
import { Selector, useSelectState } from '../../utils/useSelectState';
import { useIsomorphicLayoutEffect } from '../../utils/useIsomorphicLayoutEffect';
import { isProduction } from '../../utils/isProduction';

export type UseAtomStateOptions<T, S> = {
  selector?: Selector<T, S>;
};

export type UseAtomState = {
  <T, S = T>(atom: Atom<T>): S;
  <T, S>(atom: Atom<T>, useAtomStateOptions?: UseAtomStateOptions<T, S>): S;
};

export const useAtomState: UseAtomState = <T, S>(
  atom: Atom<T>,
  { selector }: UseAtomStateOptions<T, S> = {}
) => {
  const store = useContext(StoreContext);
  const selectState = useSelectState(selector);

  const initialState = useMemo((): S => {
    try {
      const state = store.getAtomState<T>(atom.key);
      return selectState(state);
    } catch {
      store.addAtom(atom);
      return selectState(atom.value);
    }
  }, [atom, selectState, store]);

  const [state, setState] = useState<S>(initialState);
  const prevStateRef = useRef<S>(initialState);

  useIsomorphicLayoutEffect(() => {
    const listener: Listener = (key, state) => {
      try {
        if (atom.key !== key) {
          return;
        }

        const newState = selectState(state as T);
        if (prevStateRef.current === newState) {
          return;
        }

        prevStateRef.current = newState;
        setState(newState);
      } catch (err) {
        if (isProduction) {
          return;
        }

        console.error(err);
      }
    };

    store.subscribe(listener);

    return () => {
      store.unsubscribe(listener);
    };
  }, [atom.key, selectState, store]);

  return state;
};
