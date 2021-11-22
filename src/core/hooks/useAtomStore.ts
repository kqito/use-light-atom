import { useContext } from 'react';
import { AtomStoreContext, IAtomStore } from '../atomStore/atomStore';

export const useAtomStore = (): IAtomStore => {
  return useContext(AtomStoreContext);
};
