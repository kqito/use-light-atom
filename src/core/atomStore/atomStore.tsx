import { createContext } from 'react';
import { Atom } from '../atom/atom';

export type Listener = (atom: Atom<unknown>) => void;

export interface IAtomStore {
  getAtoms: () => Record<string, Atom<unknown>>;
  setPreloadValue: <T, S>(
    key: string,
    value: (prevValue: T | undefined) => S
  ) => void;
  setAtom: <T>(atom: Atom<T>) => Atom<T>;
  getAtom: <T = unknown>(key: string) => Atom<T> | undefined;
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
    const targetAtom = this.getAtom(key);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.preloadValues.set(key, value as any);

    if (targetAtom === undefined) {
      return;
    }

    this.setAtom(targetAtom);
  }

  getAtom<T>(key: string) {
    return this.atoms.get(key) as Atom<T> | undefined;
  }

  setAtom<T>(atom: Atom<T>): Atom<T> {
    const preloadValue = this.preloadValues.get(atom.key);
    this.preloadValues.delete(atom.key);

    const mergedAtom: Atom<T> = {
      ...atom,
      value: preloadValue ? preloadValue(atom.value) : atom.value,
    };

    this.atoms.set(atom.key, mergedAtom);
    this.dispatch(mergedAtom);

    return mergedAtom;
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
