import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { devlog } from '../../utils/devlog';
import { StoreContext } from '../store/store';
import { Atom } from './atom';

type Dispatch<T> = (updater: (value: T) => Partial<T>) => void;

export function useAtom<T, S = T>(atom: Atom<T>): [S, Dispatch<T>];
export function useAtom<T, S>(
  atom: Atom<T>,
  selector: (value: T) => S
): [S, Dispatch<T>];
export function useAtom<T, S>(atom: Atom<T>, selector?: (value: T) => S) {
  const getState = useCallback(
    (value: T): S => (selector ? selector(value) : value) as S,
    [selector]
  );

  const store = useContext(StoreContext);

  const initialState = useMemo(() => {
    const storedValue = store.atoms.get(atom.key) as T;
    const targetValue = storedValue !== undefined ? storedValue : atom.value;

    return getState(targetValue);
  }, [atom.key, atom.value, getState, store.atoms]);

  const [state, setState] = useState<S>(initialState);
  const stateRef = useRef<S>(initialState);

  useEffect(() => {
    if (store.atoms.has(atom.key)) {
      devlog('Already registerd', atom);
      return;
    }

    store.atoms.set(atom.key, atom.value);
  }, [atom, store.atoms]);

  useEffect(() => {
    const listener = (key: string, value: T) => {
      if (atom.key !== key) {
        return;
      }

      const newState = getState(value);

      if (stateRef.current === newState) {
        return;
      }

      stateRef.current = newState;
      setState(newState);
    };

    store.listeners.push(listener);

    return () => {
      const index = store.listeners.indexOf(listener);

      if (index > -1) {
        store.listeners.splice(index, 1);
      }
    };
  }, [atom.key, getState, store.listeners]);

  const dispatch = useCallback<Dispatch<T>>(
    (updater) => {
      devlog('dispatch', atom.key);

      if (!store.atoms.get(atom.key)) {
        devlog('ERROR', atom.key);
        return;
      }

      const prevState = store.atoms.get(atom.key) as T;

      const newValue: T = {
        ...prevState,
        ...updater(prevState),
      };

      store.atoms.set(atom.key, newValue);
      store.listeners.map((listener) => listener(atom.key, newValue));
    },
    [atom.key, store.atoms, store.listeners]
  );

  return [state, dispatch];
}
