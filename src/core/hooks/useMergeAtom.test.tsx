import { createAtom } from '../atom/atom';
import { renderHook, act } from '@testing-library/react-hooks';
import { useMergeAtom } from './useMergeAtom';
import { AtomStoreProvider } from '../atomStore/AtomStoreProvider';
import { useCallback } from 'react';
import { useAtom } from './useAtom';

describe('useMergeAtom', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Should override new value to an atom', async () => {
    type User = {
      name: string;
      age: number;
    };
    const userAtom = createAtom<User>({
      name: '',
      age: -1,
    });

    const originalAtom = { ...userAtom };

    const { result } = renderHook(
      () => {
        const callback = useCallback((prev: User) => {
          if (prev.name !== '') {
            return;
          }

          return { name: 'name', age: 22 };
        }, []);

        useMergeAtom(userAtom, callback);

        const [state, setState] = useAtom(userAtom);

        return { state, setState };
      },
      {
        wrapper: AtomStoreProvider,
      }
    );

    expect(userAtom).toEqual({
      ...originalAtom,
      value: {
        name: 'name',
        age: 22,
      },
    });

    expect(result.current.state).toEqual({
      name: 'name',
      age: 22,
    });

    act(() => {
      // Test after with rerender
      result.current.setState((prev) => ({
        ...prev,
        name: 'newName',
      }));
    });

    expect(userAtom).toEqual({
      ...originalAtom,
      value: {
        name: 'newName',
        age: 22,
      },
    });
  });

  test('Should not override when setter is undefined', () => {
    const userAtom = createAtom({
      name: '',
      age: -1,
    });

    renderHook(() => useMergeAtom(userAtom, () => undefined));

    expect(userAtom).toEqual(userAtom);
  });
});
