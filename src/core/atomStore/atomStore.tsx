import { createContext } from 'react';
import { Atom } from '../atom/atom';

export type Listener = (atom: Atom<unknown>) => void;

export interface IAtomStore {
  getAtoms: () => Record<string, Atom<unknown>>;
  setPreloadValue: <T, S>(
    key: string,
    value: (prevValue: T | undefined) => S
  ) => void;
  mergeAtom: <T>(atom: Atom<T>) => Atom<T>;
  setAtom: <T>(atom: Atom<T>) => void;
  subscribe: (listener: Listener) => void;
  unsubscribe: (listener: Listener) => void;
}

class AtomStore implements IAtomStore {
  private atoms: Map<string, Atom<unknown>>;
  private preloadValues: Map<string, <T, S>(prevValue: T | undefined) => S>;
  private listeners: Array<(atom: Atom<unknown>) => void>;

  constructor() {
    this.atoms = new Map();
    this.preloadValues = new Map();
    this.listeners = [];
  }

  getAtoms(): Record<string, Atom<unknown>> {
    return Object.fromEntries(this.atoms);
  }

  setPreloadValue<T, S>(key: string, value: (prevValue: T | undefined) => S) {
    const targetAtom = this.atoms.get(key);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.preloadValues.set(key, value as any);

    if (targetAtom === undefined) {
      return;
    }

    this.mergeAtom(targetAtom);
  }

  mergeAtom<T>(atom: Atom<T>): Atom<T> {
    let newAtom = (this.atoms.get(atom.key) || atom) as Atom<T>;
    const preloadValue = this.preloadValues.get(newAtom.key);

    if (preloadValue) {
      this.preloadValues.delete(newAtom.key);
      newAtom = {
        ...newAtom,
        value: preloadValue(newAtom.value),
      };
    }

    this.setAtom(newAtom);

    return newAtom;
  }

  setAtom<T>(atom: Atom<T>): void {
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
