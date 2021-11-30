import { createElement, FC, useMemo, useRef } from 'react';
import { createPreloadAtom } from '../atom/atom';
import { createAtomStore, IAtomStore, AtomStoreContext } from './atomStore';

export type AtomStoreProviderProps = Readonly<{
  atomStore?: IAtomStore;
  preloadValues?: Record<string, unknown>;
}>;

export const AtomStoreProvider: FC<AtomStoreProviderProps> = ({
  atomStore,
  preloadValues,
  children,
}) => {
  const storeRef = useRef(atomStore ? atomStore : createAtomStore());

  useMemo(() => {
    if (preloadValues === undefined) {
      return;
    }

    for (const [key, preloadValue] of Object.entries(preloadValues)) {
      storeRef.current.setAtom(createPreloadAtom(key, preloadValue));
    }
  }, [preloadValues]);

  return createElement(
    AtomStoreContext.Provider,
    {
      value: storeRef.current,
    },
    children
  );
};
