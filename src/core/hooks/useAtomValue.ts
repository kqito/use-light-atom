import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Listener, StoreContext } from '../store/store';
import { Atom } from '../atom/atom';
import { Selector, useSelectValue } from '../../utils/useSelectValue';

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

  const initialValue = useMemo(() => {
    try {
      const storedValue = store.getAtomValue<T>(atom.key);
      return selectValue(storedValue);
    } catch {
      store.addAtom(atom);
      return selectValue(atom.value);
    }
  }, [atom, selectValue, store]);

  const [state, setValue] = useState<S>(initialValue);
  const stateRef = useRef<S>(initialValue);

  useEffect(() => {
    const listener: Listener = (key, value) => {
      if (atom.key !== key) {
        return;
      }

      const newValue = selectValue(value as T);

      if (stateRef.current === newValue) {
        return;
      }

      stateRef.current = newValue;
      setValue(newValue);
    };

    store.subscribe(listener);

    return () => {
      store.unsubscribe(listener);
    };
  }, [atom.key, selectValue, store]);

  return state;
};
