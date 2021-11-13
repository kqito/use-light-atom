import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StoreContext } from '../store/store';
import { Atom } from './atom';

export function useAtom<T, S = T>(atom: Atom<T>): S;
export function useAtom<T, S>(atom: Atom<T>, selector: (value: T) => S): S;
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

  return state;
}
