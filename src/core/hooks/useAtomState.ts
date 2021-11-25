import { useContext, useMemo, useRef, useState } from 'react';
import { Listener, AtomStoreContext } from '../atomStore/atomStore';
import { Atom, EqualFn } from '../atom/atom';
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
  const atomStore = useContext(AtomStoreContext);
  const selectState = useSelectState(selector);

  const initialAtom = useMemo((): Atom<T> => {
    const storedAtom = atomStore.getAtom<T>(atom.key);
    if (storedAtom === undefined) {
      return atomStore.setAtom(atom);
    }

    return storedAtom;
  }, [atom, atomStore]);

  const [state, setState] = useState<S>(selectState(initialAtom.value));
  const prevStateRef = useRef<S>(selectState(initialAtom.value));
  const equalFnRef = useRef<EqualFn>(initialAtom.equalFn);

  useIsomorphicLayoutEffect(() => {
    const listener: Listener = (nextAtom) => {
      try {
        if (atom.key !== nextAtom.key) {
          return;
        }

        const newState = selectState(nextAtom.value as T);
        equalFnRef.current = nextAtom.equalFn;
        if (equalFnRef.current(prevStateRef.current, newState)) {
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

    atomStore.subscribe(listener);

    return () => {
      atomStore.unsubscribe(listener);
    };
  }, [atom.key, selectState, atomStore]);

  return state;
};
