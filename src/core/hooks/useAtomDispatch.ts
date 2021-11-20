import { useCallback, useContext } from 'react';
import { StoreContext } from '../store/store';
import { Atom } from '../atom/atom';

export type Dispatch<T> = (getValue: ((value: T) => T) | T) => void;

export const useAtomDispatch = <T>(atom: Atom<T>) => {
  const store = useContext(StoreContext);

  const dispatch = useCallback<Dispatch<T>>(
    (getValue) => {
      const unknownGetValue = getValue as unknown;
      const prevValue = store.getAtomValue<T>(atom.key);
      const newValue: T =
        typeof unknownGetValue === 'function'
          ? unknownGetValue(prevValue)
          : unknownGetValue;

      store.dispatch(atom.key, newValue);
    },
    [atom.key, store]
  );

  return dispatch;
};
