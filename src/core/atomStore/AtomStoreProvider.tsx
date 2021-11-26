import { FC, useMemo, useRef } from 'react';
import {
  createAtomStore,
  IAtomStore,
  AtomStoreContext,
  PreloadValue,
} from './atomStore';

export type AtomStoreProviderProps = Readonly<{
  atomStore?: IAtomStore;
  preloadValues?: Record<string, PreloadValue>;
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
      storeRef.current.setPreloadValue(key, preloadValue);
    }
  }, [preloadValues]);

  return (
    <AtomStoreContext.Provider value={storeRef.current}>
      {children}
    </AtomStoreContext.Provider>
  );
};
