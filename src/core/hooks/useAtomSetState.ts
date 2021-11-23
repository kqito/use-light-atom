import { useCallback, useContext } from 'react';
import { AtomStoreContext } from '../atomStore/atomStore';
import { Atom } from '../atom/atom';
import { isProduction } from '../../utils/isProduction';

export type SetState<T> = (newState: ((state: T) => T) | T) => void;

export const useAtomSetState = <T>(atom: Atom<T>) => {
  const atomStore = useContext(AtomStoreContext);

  const setState = useCallback<SetState<T>>(
    (newState) => {
      const unknownSetState = newState as unknown;
      const storedAtom = atomStore.getAtom(atom.key);

      if (storedAtom === undefined) {
        if (!isProduction) {
          throw new Error(`${atom.key}'s atom has not stored.'`);
        }

        return;
      }

      const nextState: T =
        typeof unknownSetState === 'function'
          ? unknownSetState(storedAtom.value)
          : unknownSetState;

      atomStore.setAtom({
        ...atom,
        value: nextState,
      });
    },
    [atom, atomStore]
  );

  return setState;
};
