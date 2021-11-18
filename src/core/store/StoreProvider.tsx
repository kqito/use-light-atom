import { FC, useRef } from 'react';
import { createStore, IStore, StoreContext } from './store';

type StoreProviderProps = Readonly<{
  store?: IStore;
}>;

export const StoreProvider: FC<StoreProviderProps> = ({ store, children }) => {
  const storeRef = useRef(store ? store : createStore());

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};
