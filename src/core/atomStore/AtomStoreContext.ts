import { createContext } from 'react';
import { IAtomStore, createAtomStore } from './atomStore';

export const AtomStoreContext = createContext<IAtomStore>(createAtomStore());
