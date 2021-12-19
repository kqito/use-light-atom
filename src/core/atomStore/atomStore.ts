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
  subscribe: (listener: Listener) => void;
  unsubscribe: (listener: Listener) => void;
}

class AtomStore implements IAtomStore {
  private atoms: Map<string, Atom<unknown>>;
  private listeners: Array<(atom: Atom<unknown>) => void>;
  private isDebugMode: boolean;

  constructor({ isDebugMode }: AtomStoreOptions = {}) {
    this.atoms = new Map();
    this.listeners = [];
    this.isDebugMode = isDebugMode || false;
  }

  getAtoms(): Record<string, Atom<unknown>> {
    return Object.fromEntries(this.atoms);
  }

  setAtom<T>(atom: Atom<T>): Atom<T> {
    const newAtom = atom;
    const storedAtom = this.atoms.get(atom.key) as Atom<T> | undefined;

    // If already stored atom that is not isPreload, return current stored atom.
    if (storedAtom?.meta.isPreload === false && newAtom.meta.isPreload) {
      if (
        isProduction &&
        this.isDebugMode &&
        storedAtom.meta.initialValue !== storedAtom.meta.initialValue
      ) {
        console.warn(
          `You trying to resgiter same key atom. Please consider ${atom.key}'s atom`
        );
      }
      return storedAtom;
    }

    // If already stored atom that is ot isPreload, then merge atom, return it.
    if (!newAtom.meta.isPreload && storedAtom?.meta.isPreload) {
      newAtom.value = storedAtom.value;
      newAtom.meta.isPreload = false;
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

export const createAtomStore = (atomStoreOptions: AtomStoreOptions = {}) =>
  new AtomStore(atomStoreOptions);
