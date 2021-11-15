import { FC, useRef } from 'react';
import { createStore, StoreContext } from './store';

export const StoreProvider: FC = ({ children }) => {
  const storeRef = useRef(createStore());

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};
