import { createContext } from 'react';
import { IAtomStore, createAtomStore } from '..';

export const AtomStoreContext = createContext<IAtomStore>(createAtomStore());
