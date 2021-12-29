import { useCallback } from 'react';
import { IAtom } from '../atom/atom';
import { isCallable } from '../../utils/isCallable';

export type Setter<T> = ((state: T) => T) | T;
export type SetState<T> = (setter: Setter<T>) => void;

export const useAtomSetState = <T>(atom: IAtom<T>) => {
  const setState = useCallback<SetState<T>>(
    (setter) => {
      const nextState: T = isCallable<(state: T) => T>(setter)
        ? setter(atom.value)
        : setter;

      atom.value = nextState;
    },
    [atom]
  );

  return setState;
};
