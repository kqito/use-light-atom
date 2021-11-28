import { ReactElement, useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { getByTestId } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { createAtom, createPreloadAtom } from '../atom/atom';
import { useAtom } from './useAtom';
import { AtomStoreProvider } from '../atomStore/AtomStoreProvider';
import * as useIsomorphicLayoutEffectObject from '../../utils/useIsomorphicLayoutEffect';
import { useIsomorphicLayoutEffect } from '../../utils/useIsomorphicLayoutEffect';
import { useAtomSetState } from './useAtomSetState';
import { createAtomStore } from '../atomStore/atomStore';
import deepEqual from 'fast-deep-equal';

const useIsomorphicLayoutEffectMock = jest.spyOn(
  useIsomorphicLayoutEffectObject,
  'useIsomorphicLayoutEffect'
);

type TestTarget = () => {
  root: ReactElement;
  expects: (container: HTMLElement) => void;
};

const expectRenderResult = (target: TestTarget) => {
  it('CSR', () => {
    useIsomorphicLayoutEffectMock.mockImplementation(useEffect);
    const { root, expects } = target();
    const { container } = render(root);

    expects(container);
  });

  it('SSR', () => {
    useIsomorphicLayoutEffectMock.mockImplementation((effect) => effect());

    const { root, expects } = target();
    const innerElement = renderToString(root);

    const container = document.createElement('div');
    container.innerHTML = innerElement;

    expects(container);
  });
};

describe('useAtom', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    useIsomorphicLayoutEffectMock.mockClear();
  });

  describe('Initial state', () => {
    const testTarget: TestTarget = () => {
      const User = () => {
        const userAtom = createAtom('user', {
          name: 'example',
          age: -1,
        });

        const [user] = useAtom(userAtom);

        return (
          <div>
            <p data-testid="name">{user.name}</p>
            <p data-testid="age">{user.age}</p>
          </div>
        );
      };

      return {
        root: (
          <AtomStoreProvider>
            <User />
          </AtomStoreProvider>
        ),
        expects: (container) => {
          expect(getByTestId(container, 'name').textContent).toBe('example');
          expect(getByTestId(container, 'age').textContent).toBe('-1');
        },
      };
    };

    expectRenderResult(testTarget);
  });

  describe('SetState', () => {
    describe('Dispath with literal', () => {
      const testTarget: TestTarget = () => {
        const userAtom = createAtom('user', {
          name: '',
          age: -1,
        });

        const User = () => {
          const [name] = useAtom(userAtom, {
            selector: ({ name }) => name,
          });
          const [age] = useAtom(userAtom, {
            selector: ({ age }) => age,
          });
          const setState = useAtomSetState(userAtom);

          useIsomorphicLayoutEffect(() => {
            setState({
              name: 'example',
              age: 22,
            });
          }, []);

          return (
            <div>
              <p data-testid="name">{name}</p>
              <p data-testid="age">{age}</p>
            </div>
          );
        };

        const store = createAtomStore();

        return {
          root: (
            <AtomStoreProvider atomStore={store}>
              <User />
            </AtomStoreProvider>
          ),
          expects: (container: HTMLElement) => {
            expect(getByTestId(container, 'name').textContent).toBe('example');
            expect(getByTestId(container, 'age').textContent).toBe('22');
            expect(store.getAtoms().user).toEqual({
              ...userAtom,
              value: {
                name: 'example',
                age: 22,
              },
            });
          },
        };
      };

      expectRenderResult(testTarget);
    });

    describe('Dispath with function', () => {
      const testTarget: TestTarget = () => {
        const userAtom = createAtom('user', {
          name: '',
          age: -1,
        });

        const User = () => {
          const [name] = useAtom(userAtom, {
            selector: ({ name }) => name,
          });
          const [age] = useAtom(userAtom, {
            selector: ({ age }) => age,
          });
          const setState = useAtomSetState(userAtom);

          useIsomorphicLayoutEffect(() => {
            setState((prev) => ({
              ...prev,
              name: 'example',
              age: 22,
            }));
          }, []);

          return (
            <div>
              <p data-testid="name">{name}</p>
              <p data-testid="age">{age}</p>
            </div>
          );
        };

        const store = createAtomStore();

        return {
          root: (
            <AtomStoreProvider atomStore={store}>
              <User />
            </AtomStoreProvider>
          ),
          expects: (container) => {
            expect(getByTestId(container, 'name').textContent).toBe('example');
            expect(getByTestId(container, 'age').textContent).toBe('22');
            expect(store.getAtoms().user).toEqual({
              ...userAtom,
              value: {
                name: 'example',
                age: 22,
              },
            });
          },
        };
      };

      expectRenderResult(testTarget);
    });
  });

  describe('Initial state from store', () => {
    const testTarget: TestTarget = () => {
      const userAtom = createAtom('user', {
        name: '',
        age: -1,
      });

      const User = () => {
        const [user] = useAtom(userAtom);

        return (
          <div>
            <p data-testid="name">{user.name}</p>
            <p data-testid="age">{user.age}</p>
          </div>
        );
      };

      const atomStore = createAtomStore();
      atomStore.setAtom(
        createPreloadAtom('user', {
          name: 'example',
          age: 22,
        })
      );

      return {
        root: (
          <AtomStoreProvider atomStore={atomStore}>
            <User />
          </AtomStoreProvider>
        ),
        expects: (container) => {
          expect(getByTestId(container, 'name').textContent).toBe('example');
          expect(getByTestId(container, 'age').textContent).toBe('22');
        },
      };
    };

    expectRenderResult(testTarget);
  });

  describe('With multi atoms', () => {
    const testTarget: TestTarget = () => {
      const User = () => {
        const userAtom = createAtom('user', {
          name: '',
          age: -1,
        });

        const countAtom = createAtom('count', 0);

        const [name] = useAtom(userAtom, { selector: ({ name }) => name });
        const [age] = useAtom(userAtom, { selector: ({ age }) => age });
        const [count] = useAtom(countAtom);
        const [nullable] = useAtom(countAtom, { selector: () => null });
        const userDispatch = useAtomSetState(userAtom);
        const countDispatch = useAtomSetState(countAtom);

        expect(nullable).toBe(null);

        useIsomorphicLayoutEffect(() => {
          userDispatch({
            name: 'example',
            age: 22,
          });
        }, [userDispatch]);

        useIsomorphicLayoutEffect(() => {
          countDispatch(10);
        }, [countDispatch]);

        return (
          <div>
            <p data-testid="name">{name}</p>
            <p data-testid="age">{age}</p>
            <p data-testid="count">{count}</p>
          </div>
        );
      };

      return {
        root: (
          <AtomStoreProvider>
            <User />
          </AtomStoreProvider>
        ),
        expects: (container) => {
          expect(getByTestId(container, 'name').textContent).toBe('example');
          expect(getByTestId(container, 'age').textContent).toBe('22');
          expect(getByTestId(container, 'count').textContent).toBe('10');
        },
      };
    };

    expectRenderResult(testTarget);
  });

  describe('With deep equal', () => {
    const testTarget: TestTarget = () => {
      const User = () => {
        const userAtom = createAtom(
          'user',
          {
            name: '',
            age: -1,
          },
          {
            equalFn: deepEqual,
          }
        );

        const dateAtom = createAtom('date', {
          month: -1,
          date: -1,
        });

        const [{ name, age }] = useAtom(userAtom);
        const [{ month, date }] = useAtom(dateAtom, { equalFn: deepEqual });
        const userDispatch = useAtomSetState(userAtom);
        const dateDispatch = useAtomSetState(dateAtom);

        useIsomorphicLayoutEffect(() => {
          userDispatch({
            name: 'example',
            age: 22,
          });
        }, [userDispatch]);

        useIsomorphicLayoutEffect(() => {
          dateDispatch(() => ({
            month: 12,
            date: 1,
          }));
        }, [userDispatch]);

        return (
          <div>
            <p data-testid="name">{name}</p>
            <p data-testid="age">{age}</p>
            <p data-testid="month">{month}</p>
            <p data-testid="date">{date}</p>
          </div>
        );
      };

      return {
        root: (
          <AtomStoreProvider>
            <User />
          </AtomStoreProvider>
        ),
        expects: (container) => {
          expect(getByTestId(container, 'name').textContent).toBe('example');
          expect(getByTestId(container, 'age').textContent).toBe('22');
          expect(getByTestId(container, 'month').textContent).toBe('12');
          expect(getByTestId(container, 'date').textContent).toBe('1');
        },
      };
    };

    expectRenderResult(testTarget);
  });
});
