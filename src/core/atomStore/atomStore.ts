import { devWarnLog } from '../../utils/devlog';
import { isProduction } from '../../utils/isProduction';
import { Atom } from '../atom/atom';

export type Listener = (atom: Atom<unknown>) => void;

export type AtomStoreOptions = {
  isDebugMode?: boolean;
};

export interface IAtomStore {
  getAtoms: () => Record<string, Atom<unknown>>;
  setAtom: <T>(atom: Atom<T>) => Atom<T>;
  dispatchAtom: <T>(atom: Atom<T>) => void;
  setPreloadValue: (key: string, value: unknown) => void;
  subscribe: (listener: Listener) => void;
  unsubscribe: (listener: Listener) => void;
}

class AtomStore implements IAtomStore {
  private atoms: Map<string, Atom<unknown>>;
  private preloadValues: Map<string, unknown>;
  private listeners: Array<(atom: Atom<unknown>) => void>;
  private isDebugMode: boolean;

  constructor({ isDebugMode }: AtomStoreOptions = {}) {
    this.atoms = new Map();
    this.preloadValues = new Map();
    this.listeners = [];
    this.isDebugMode = isDebugMode || !isProduction;
  }

  getAtoms(): Record<string, Atom<unknown>> {
    return Object.fromEntries(this.atoms);
  }

  setAtom<T>(atom: Atom<T>): Atom<T> {
    const newAtom = atom;
    const storedAtom = this.atoms.get(atom.key) as Atom<T> | undefined;
    const preloadValue = this.preloadValues.get(newAtom.key);
    const setNewAtom = () => {
      this.atoms.set(newAtom.key, newAtom);
      return newAtom;
    };

    if (storedAtom) {
      return storedAtom;
    }

    if (preloadValue) {
      newAtom.value = preloadValue as T;
    }

    return setNewAtom();
  }

  setPreloadValue(key: string, value: unknown): void {
    const hasStoredAtom = this.atoms.has(key);
    if (hasStoredAtom) {
      return;
    }

    this.preloadValues.set(key, value);
  }

  dispatchAtom<T>(atom: Atom<T>): void {
    const storedAtom = this.atoms.get(atom.key);

    if (storedAtom === undefined) {
      if (this.isDebugMode) {
        devWarnLog(
          'Dispatch failed because specified atom has not been stored',
          atom
        );
      }

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

export const createAtomStore = (atomStoreOptions: AtomStoreOptions = {}) =>
  new AtomStore(atomStoreOptions);
