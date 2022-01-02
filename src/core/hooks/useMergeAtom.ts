import { useEffect } from 'react';
import { IAtom } from '../atom/atom';
import { useAtomSetState } from './useAtomSetState';

export type Merge<T> = (prev: T) => T | undefined;
export type UseMergeAtom = <T>(atom: IAtom<T>, merge: Merge<T>) => void;

export const useMergeAtom: UseMergeAtom = (atom, merge) => {
  const setState = useAtomSetState(atom);

  useEffect(() => {
    const nextState = merge(atom.getValue());
    if (nextState === undefined) {
      return;
    }

    setState(nextState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merge]);
};
