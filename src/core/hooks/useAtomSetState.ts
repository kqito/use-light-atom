import { useCallback, useContext } from 'react';
import { Atom } from '../atom/atom';
import { isProduction } from '../../utils/isProduction';
import { isCallable } from '../../utils/isCallable';
import { AtomStoreContext } from '../atomStore/AtomStoreContext';

export type Setter<T> = ((state: T) => T) | T;
export type SetState<T> = (setter: Setter<T>) => void;

export const useAtomSetState = <T>(atom: Atom<T>) => {
  const atomStore = useContext(AtomStoreContext);

  const setState = useCallback<SetState<T>>(
    (setter) => {
      const storedAtom = atomStore.setAtom<T>(atom);

      if (storedAtom === undefined) {
        if (!isProduction) {
          throw new Error(`${atom.key}'s atom has not stored.'`);
        }

        return;
      }

      const nextState: T = isCallable<(state: T) => T>(setter)
        ? setter(storedAtom.value)
        : setter;

      atomStore.dispatchAtom({
        ...atom,
        value: nextState,
      });
    },
    [atom, atomStore]
  );

  return setState;
};
