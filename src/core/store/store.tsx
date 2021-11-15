import { createContext } from 'react';

type Store = {
  atoms: Map<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listeners: Array<(key: string, value: any) => void>;
};

export const createStore = (): Store => ({
  atoms: new Map(),
  listeners: [],
});

export const StoreContext = createContext<Store>(createStore());
