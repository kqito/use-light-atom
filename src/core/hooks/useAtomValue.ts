import { useContext, useMemo, useRef, useState } from 'react';
import { Listener, StoreContext } from '../store/store';
import { Atom } from '../atom/atom';
import { Selector, useSelectValue } from '../../utils/useSelectValue';
import { useIsomorphicLayoutEffect } from '../../utils/useIsomorphicLayoutEffect';
import { isProduction } from '../../utils/isProduction';

export type UseAtomValue = {
  <T, S = T>(atom: Atom<T>): S;
  <T, S>(atom: Atom<T>, selector?: Selector<T, S>): S;
};

export const useAtomValue: UseAtomValue = <T, S>(
  atom: Atom<T>,
  selector?: Selector<T, S>
) => {
  const store = useContext(StoreContext);
  const selectValue = useSelectValue(selector);

  const initialState = useMemo((): S => {
    try {
      const storedValue = store.getAtomValue<T>(atom.key);
      return selectValue(storedValue);
    } catch {
      store.addAtom(atom);
      return selectValue(atom.value);
    }
  }, [atom, selectValue, store]);

  const [state, setValue] = useState<S>(initialState);
  const prevStateRef = useRef<S>(initialState);

  useIsomorphicLayoutEffect(() => {
    const listener: Listener = (key, value) => {
      try {
        if (atom.key !== key) {
          return;
        }

        const newValue = selectValue(value as T);
        if (prevStateRef.current === newValue) {
          return;
        }

        prevStateRef.current = newValue;
        setValue(newValue);
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
  }, [atom.key, selectValue, store]);

  return state;
};
