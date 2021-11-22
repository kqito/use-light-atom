import { useCallback, useContext } from 'react';
import { StoreContext } from '../store/store';
import { Atom } from '../atom/atom';

export type SetState<T> = (newState: ((state: T) => T) | T) => void;

export const useAtomSetState = <T>(atom: Atom<T>) => {
  const store = useContext(StoreContext);

  const setState = useCallback<SetState<T>>(
    (newState) => {
      const unknownSetState = newState as unknown;
      const prevState = store.getAtomState<T>(atom.key);
      const nextState: T =
        typeof unknownSetState === 'function'
          ? unknownSetState(prevState)
          : unknownSetState;

      store.dispatch(atom.key, nextState);
    },
    [atom.key, store]
  );

  return setState;
};
