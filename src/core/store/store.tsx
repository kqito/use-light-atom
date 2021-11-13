import { createContext, FC, useRef } from 'react';

type Store = {
  atoms: Map<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listeners: Array<(key: string, value: any) => void>;
};

const createStore = (): Store => ({
  atoms: new Map(),
  listeners: [],
});

export const StoreContext = createContext<Store>(createStore());

export const StoreProvider: FC = ({ children }) => {
  const storeRef = useRef(createStore());

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};
