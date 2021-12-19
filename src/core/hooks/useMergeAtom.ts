import { useEffect } from 'react';
import { useAtom } from '../hooks/useAtom';
import { Atom } from '../atom/atom';

export type Merge<T> = (prev: T) => T | undefined;
export type UseMergeAtom = <T>(atom: Atom<T>, merge: Merge<T>) => void;

export const useMergeAtom: UseMergeAtom = (atom, merge) => {
  const [state, setState] = useAtom(atom);

  useEffect(() => {
    const nextState = merge(state);
    if (nextState === undefined) {
      return;
    }

    setState(nextState);
  }, [merge, setState, state]);
};
