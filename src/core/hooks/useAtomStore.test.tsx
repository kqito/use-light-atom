import { renderHook } from '@testing-library/react-hooks';
import { AtomStoreProvider } from '../atomStore/AtomStoreProvider';
import { useAtomStore } from './useAtomStore';
import { createAtomStore } from '../atomStore/atomStore';

describe('useAtomStore', () => {
  const atomStore = createAtomStore();
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Should be able to get AtomStore when AtomStoreProvider is setted on the container', () => {
    const { result } = renderHook(() => useAtomStore(), {
      wrapper: ({ children }) => (
        <AtomStoreProvider atomStore={atomStore}>{children}</AtomStoreProvider>
      ),
    });

    expect(result.current).toEqual(atomStore);
  });

  test('Should be able to get AtomStore when no AtomStoreProvider is setted on the container', () => {
    const { result } = renderHook(() => useAtomStore());

    expect(result.current).toEqual(atomStore);
  });
});
