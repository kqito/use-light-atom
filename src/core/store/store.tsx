import { createContext } from 'react';
import { Atom } from '../atom/atom';

export type Listener = (key: string, value: unknown) => void;

export type StoreOptions<
  V extends Record<string, unknown> = Record<string, unknown>
> = {
  initialValue?: V;
};

export type IStore<
  V extends Record<string, unknown> = Record<string, unknown>
> = {
  getAtomValue: <T = unknown>(key: string) => T;
  getValue: () => V;
  addAtom: <T>(atom: Atom<T>) => void;
  subscribe: (listener: Listener) => void;
  unsubscribe: (listener: Listener) => void;
  dispatch: (key: string, value: unknown) => void;
};

class Store<V extends Record<string, unknown> = Record<string, unknown>>
  implements IStore<V>
{
  private atoms: Map<string, unknown>;
  private listeners: Array<(key: string, value: unknown) => void>;

  constructor({ initialValue }: StoreOptions<V> = {}) {
    // Set initial value
    const atoms = new Map();
    for (const [key, value] of Object.entries(initialValue || {})) {
      atoms.set(key, value);
    }

    this.atoms = atoms;
    this.listeners = [];
  }

  getAtomValue<T = unknown>(key: string) {
    if (!this.atoms.has(key)) {
      throw new Error(`Undefined atom: ${key}`);
    }

    return this.atoms.get(key) as T;
  }

  getValue(): V {
    return Object.fromEntries(this.atoms) as V;
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

  dispatch(key: string, value: unknown) {
    if (!this.atoms.has(key)) {
      throw new Error(`Undefined atom: ${key}`);
    }

    this.atoms.set(key, value);
    for (const listener of this.listeners) {
      listener(key, value);
    }
  }
}

export const createStore = <
  V extends Record<string, unknown> = Record<string, unknown>
>(
  storeOptions: StoreOptions<V> = {}
) => new Store<V>(storeOptions);

export const StoreContext = createContext<IStore>(createStore());
