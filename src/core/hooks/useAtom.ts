import { Atom } from '../atom/atom';
import { SetState, useAtomSetState } from './useAtomSetState';
import { useAtomState, UseAtomStateOptions } from './useAtomState';

export type UseAtomOptions<T, S> = UseAtomStateOptions<T, S>;

export type UseAtom = {
  <T, S = T>(atom: Atom<T>): [S, SetState<T>];
  <T, S = T>(atom: Atom<T>, useAtomOptions?: UseAtomOptions<T, S>): [
    S,
    SetState<T>
  ];
};

export const useAtom: UseAtom = <T, S>(
  atom: Atom<T>,
  useAtomOptions: UseAtomOptions<T, S> = {}
) => {
  const state = useAtomState(atom, useAtomOptions);
  const setState = useAtomSetState(atom);

  return [state, setState];
};
