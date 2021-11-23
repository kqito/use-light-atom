import { createContext } from 'react';
import { Atom, createValueAtom } from '../atom/atom';

export type Listener = (atom: Atom<unknown>) => void;

export interface IAtomStore {
  getAtoms: () => Record<string, Atom<unknown>>;
  setAtomValues: (values: Record<string, unknown>) => void;
  setAtom: <T>(atom: Atom<T>) => void;
  getAtom: (key: string) => Atom<unknown> | undefined;
  subscribe: (listener: Listener) => void;
  unsubscribe: (listener: Listener) => void;
}

class AtomStore implements IAtomStore {
  private atoms: Map<string, Atom<unknown>>;
  private listeners: Array<(atom: Atom<unknown>) => void>;

  constructor() {
    this.atoms = new Map();
    this.listeners = [];
  }

  getAtoms(): Record<string, Atom<unknown>> {
    return Object.fromEntries(this.atoms);
  }

  setAtomValues(values: Record<string, unknown>) {
    for (const [key, value] of Object.entries(values)) {
      const targetAtom = this.getAtom(key);

      if (targetAtom === undefined) {
        this.setAtom(createValueAtom(key, value));
        continue;
      }

      this.setAtom({
        ...targetAtom,
        value,
        hasInitialized: true,
      });
    }
  }

  getAtom(key: string) {
    return this.atoms.get(key);
  }

  setAtom<T>(atom: Atom<T>) {
    this.atoms.set(atom.key, atom);
    this.dispatch(atom);
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

  private dispatch(atom: Atom<unknown>) {
    for (const listener of this.listeners) {
      listener(atom);
    }
  }
}

export const createAtomStore = () => new AtomStore();

export const AtomStoreContext = createContext<IAtomStore>(createAtomStore());
