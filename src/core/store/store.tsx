import { createContext } from 'react';
import { Atom } from '../atom/atom';

export type Listener = (key: string, value: unknown) => void;

export interface IStore {
  getAtomValue: <T = unknown>(key: string) => T;
  addAtom: <T>(atom: Atom<T>) => void;
  subscribe: (listener: Listener) => void;
  unsubscribe: (listener: Listener) => void;
  dispatch: (key: string, value: unknown) => void;
}

class Store implements IStore {
  private atoms: Map<string, unknown>;
  private listeners: Array<(key: string, value: unknown) => void>;

  constructor() {
    this.atoms = new Map();
    this.listeners = [];
  }

  getAtomValue<T = unknown>(key: string) {
    if (!this.atoms.has(key)) {
      throw new Error(`Undefined atom: ${key}`);
    }

    return this.atoms.get(key) as T;
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

export const createStore = (): IStore => new Store();

export const StoreContext = createContext<IStore>(createStore());
