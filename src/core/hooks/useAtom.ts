import { Selector } from '../../utils/useSelectValue';
import { Atom } from '../atom/atom';
import { Dispatch, useAtomDispatch } from './useAtomDispatch';
import { useAtomValue } from './useAtomValue';

export type UseAtom = {
  <T, S = T>(atom: Atom<T>): [S, Dispatch<T>];
  <T, S>(atom: Atom<T>, selector?: Selector<T, S>): [S, Dispatch<T>];
};

export const useAtom: UseAtom = <T, S>(
  atom: Atom<T>,
  selector?: Selector<T, S>
) => {
  const atomValue = useAtomValue(atom, selector);
  const atomDispatch = useAtomDispatch(atom);

  return [atomValue, atomDispatch];
};
