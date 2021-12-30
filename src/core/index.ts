export { createAtom } from './atom/atom';
export { useAtom } from './hooks/useAtom';
export { useAtomState } from './hooks/useAtomState';
export { useAtomSetState } from './hooks/useAtomSetState';
export { useMergeAtom } from './hooks/useMergeAtom';

// types
export type { AtomValue, AtomOptions, EqualFn, CreateAtom } from './atom/atom';
export type { UseAtom, UseAtomOptions } from './hooks/useAtom';
export type { UseAtomState, UseAtomStateOptions } from './hooks/useAtomState';
export type { SetState, Setter } from './hooks/useAtomSetState';
export type { UseMergeAtom, Merge } from './hooks/useMergeAtom';
