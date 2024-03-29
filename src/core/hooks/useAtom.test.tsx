import { getByTestId } from '@testing-library/dom';
import { createAtom } from '../atom/atom';
import { useAtom } from './useAtom';
import { useIsomorphicLayoutEffect } from '../../utils/useIsomorphicLayoutEffect';
import { useAtomSetState } from './useAtomSetState';
import deepEqual from 'fast-deep-equal';
import {
  TestTarget,
  expectRenderResult,
} from '../../testUtils/expectRenderResult';

describe('useAtom', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Initial state', () => {
    const testTarget: TestTarget = () => {
      const User = () => {
        const userAtom = createAtom({
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
        root: <User />,
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
        const userAtom = createAtom({
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

        return {
          root: <User />,
          expects: (container: HTMLElement) => {
            expect(getByTestId(container, 'name').textContent).toBe('example');
            expect(getByTestId(container, 'age').textContent).toBe('22');
          },
        };
      };

      expectRenderResult(testTarget);
    });

    describe('Dispath with function', () => {
      const testTarget: TestTarget = () => {
        const userAtom = createAtom({
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

        return {
          root: <User />,
          expects: (container) => {
            expect(getByTestId(container, 'name').textContent).toBe('example');
            expect(getByTestId(container, 'age').textContent).toBe('22');
          },
        };
      };

      expectRenderResult(testTarget);
    });
  });

  describe('With multi atoms', () => {
    const testTarget: TestTarget = () => {
      const userAtom = createAtom({
        name: '',
        age: -1,
      });
      const countAtom = createAtom(0);
      const User = () => {
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
        }, []);

        useIsomorphicLayoutEffect(() => {
          countDispatch(10);
        }, []);

        return (
          <div>
            <p data-testid="name">{name}</p>
            <p data-testid="age">{age}</p>
            <p data-testid="count">{count}</p>
          </div>
        );
      };

      return {
        root: <User />,
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
      const userAtom = createAtom(
        {
          name: '',
          age: -1,
        },
        {
          equalFn: deepEqual,
        }
      );

      const dateAtom = createAtom({
        month: -1,
        date: -1,
      });

      const User = () => {
        const [{ name, age }] = useAtom(userAtom);
        const [{ month, date }] = useAtom(dateAtom, { equalFn: deepEqual });
        const userDispatch = useAtomSetState(userAtom);
        const dateDispatch = useAtomSetState(dateAtom);

        useIsomorphicLayoutEffect(() => {
          userDispatch({
            name: 'example',
            age: 22,
          });
        }, []);

        useIsomorphicLayoutEffect(() => {
          dateDispatch(() => ({
            month: 12,
            date: 1,
          }));
        }, []);

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
        root: <User />,
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
