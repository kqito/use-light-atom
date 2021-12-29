import { useContext } from 'react';
import { devlog } from '../../utils/devlog';
import { IAtomStore } from '../atomStore/atomStore';
import { AtomStoreContext } from '../atomStore/AtomStoreContext';

export const useAtomStore = (): IAtomStore => {
  const atomStore = useContext(AtomStoreContext);

  if (atomStore === null) {
    devlog(
      `'AtomStoreProvider' has not found. Please check to set 'AtomStoreProvider' on the parent element or higher`,
      'warn'
    );
  }

  return atomStore;
};
