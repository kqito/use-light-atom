import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Listener, StoreContext } from '../store/store';
import { Atom } from './atom';

type Dispatch<T> = (getState: ((value: T) => T) | T) => void;

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
    try {
      const storedValue = store.getAtomValue<T>(atom.key);
      return getState(storedValue);
    } catch {
      store.addAtom(atom);
      return getState(atom.value);
    }
  }, [atom, getState, store]);

  const [state, setState] = useState<S>(initialState);
  const stateRef = useRef<S>(initialState);

  useEffect(() => {
    const listener: Listener = (key, value) => {
      if (atom.key !== key) {
        return;
      }

      const newState = getState(value as T);

      if (stateRef.current === newState) {
        return;
      }

      stateRef.current = newState;
      setState(newState);
    };

    store.subscribe(listener);

    return () => {
      store.unsubscribe(listener);
    };
  }, [atom.key, getState, store]);

  const dispatch = useCallback<Dispatch<T>>(
    (getState) => {
      const unknownGetState = getState as unknown;
      const prevState = store.getAtomValue<T>(atom.key);
      const newValue: T =
        typeof unknownGetState === 'function'
          ? unknownGetState(prevState)
          : unknownGetState;

      store.dispatch(atom.key, newValue);
    },
    [atom.key, store]
  );

  return [state, dispatch];
}
