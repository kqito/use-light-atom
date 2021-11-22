import { FC, useRef } from 'react';
import { createAtomStore, IAtomStore, AtomStoreContext } from './atomStore';

export type AtomStoreProviderProps = Readonly<{
  atomStore?: IAtomStore;
}>;

export const AtomStoreProvider: FC<AtomStoreProviderProps> = ({
  atomStore,
  children,
}) => {
  const storeRef = useRef(atomStore ? atomStore : createAtomStore());

  return (
    <AtomStoreContext.Provider value={storeRef.current}>
      {children}
    </AtomStoreContext.Provider>
  );
};
