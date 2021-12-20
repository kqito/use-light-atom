import { useContext } from 'react';
import { IAtomStore } from '../atomStore/atomStore';
import { AtomStoreContext } from '../atomStore/AtomStoreContext';

export const useAtomStore = (): IAtomStore => {
  return useContext(AtomStoreContext);
};
