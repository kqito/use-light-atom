import { useCallback, useContext } from 'react';
import { AtomStoreContext } from '../atomStore/atomStore';
import { Atom } from '../atom/atom';

export type SetState<T> = (newState: ((state: T) => T) | T) => void;

export const useAtomSetState = <T>(atom: Atom<T>) => {
  const atomStore = useContext(AtomStoreContext);

  const setState = useCallback<SetState<T>>(
    (newState) => {
      const unknownSetState = newState as unknown;
      const prevState = atomStore.getAtomState<T>(atom.key);
      const nextState: T =
        typeof unknownSetState === 'function'
          ? unknownSetState(prevState)
          : unknownSetState;

      atomStore.dispatch(atom.key, nextState);
    },
    [atom.key, atomStore]
  );

  return setState;
};
