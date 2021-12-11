import { createContext } from 'react';
import { Atom } from '../atom/atom';

export type Listener = (atom: Atom<unknown>) => void;

export interface IAtomStore {
  getAtoms: () => Record<string, Atom<unknown>>;
  setAtom: <T>(atom: Atom<T>) => Atom<T>;
  dispatchAtom: <T>(atom: Atom<T>) => void;
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

  setAtom<T>(atom: Atom<T>): Atom<T> {
    const newAtom = atom;
    const storedAtom = this.atoms.get(atom.key) as Atom<T> | undefined;

    // If already stored atom that is not isPreload, return current stored atom.
    if (storedAtom?.isPreload === false && newAtom.isPreload) {
      return storedAtom;
    }

    // If already stored atom that is ot isPreload, then merge atom, return it.
    if (!newAtom.isPreload && storedAtom?.isPreload) {
      newAtom.value = storedAtom.value;
      newAtom.isPreload = false;
    }

    this.atoms.set(newAtom.key, newAtom);

    return newAtom;
  }

  dispatchAtom<T>(atom: Atom<T>): void {
    const storedAtom = this.atoms.get(atom.key);

    if (storedAtom === undefined) {
      return;
    }

    // Copy value for original atom
    storedAtom.value = atom.value;

    this.dispatch(storedAtom);
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
