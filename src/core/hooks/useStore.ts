import { useContext } from 'react';
import { StoreContext, IStore } from '../store/store';

export const useStore = (): IStore => {
  return useContext(StoreContext);
};
