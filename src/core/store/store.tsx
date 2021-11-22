import { createContext } from 'react';
import { Atom } from '../atom/atom';

export type Listener = (key: string, state: unknown) => void;

export type StoreOptions = {
  initialValue?: Record<string, unknown>;
};

export type IStore = {
  getAtomState: <T = unknown>(key: string) => T;
  getState: () => Record<string, unknown>;
  addAtom: <T>(atom: Atom<T>) => void;
  subscribe: (listener: Listener) => void;
  unsubscribe: (listener: Listener) => void;
  dispatch: (key: string, state: unknown) => void;
};

class Store implements IStore {
  private atoms: Map<string, unknown>;
  private listeners: Array<(key: string, state: unknown) => void>;

  constructor({ initialValue }: StoreOptions = {}) {
    // Set initial value
    const atoms = new Map();
    for (const [key, value] of Object.entries(initialValue || {})) {
      atoms.set(key, value);
    }

    this.atoms = atoms;
    this.listeners = [];
  }

  getAtomState<T = unknown>(key: string) {
    if (!this.atoms.has(key)) {
      throw new Error(`Undefined atom: ${key}`);
    }

    return this.atoms.get(key) as T;
  }

  getState(): Record<string, unknown> {
    return Object.fromEntries(this.atoms);
  }

  addAtom<T>(atom: Atom<T>) {
    if (this.atoms.has(atom.key)) {
      return;
    }

    this.atoms.set(atom.key, atom.value);
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
  }

  unsubscribe(listener: Listener) {
    const index = this.listeners.indexOf(listener);

    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  dispatch(key: string, state: unknown) {
    if (!this.atoms.has(key)) {
      throw new Error(`Undefined atom: ${key}`);
    }

    this.atoms.set(key, state);
    for (const listener of this.listeners) {
      listener(key, state);
    }
  }
}

export const createStore = (storeOptions: StoreOptions = {}) =>
  new Store(storeOptions);

export const StoreContext = createContext<IStore>(createStore());
