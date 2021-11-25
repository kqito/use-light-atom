import { useCallback, useContext } from 'react';
import { AtomStoreContext } from '../atomStore/atomStore';
import { Atom } from '../atom/atom';
import { isProduction } from '../../utils/isProduction';
import { isCallable } from '../../utils/isCallable';

export type SetState<T> = (newState: ((state: T) => T) | T) => void;

export const useAtomSetState = <T>(atom: Atom<T>) => {
  const atomStore = useContext(AtomStoreContext);

  const setState = useCallback<SetState<T>>(
    (newState) => {
      const storedAtom = atomStore.getAtom<T>(atom.key);

      if (storedAtom === undefined) {
        if (!isProduction) {
          throw new Error(`${atom.key}'s atom has not stored.'`);
        }

        return;
      }

      const nextState: T = isCallable<(state: T) => T>(newState)
        ? newState(storedAtom.value)
        : newState;

      atomStore.setAtom({
        ...atom,
        value: nextState,
      });
    },
    [atom, atomStore]
  );

  return setState;
};
