import { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { getByTestId } from '@testing-library/dom';
import { render, cleanup } from '@testing-library/react';
import { createAtom } from '../atom/atom';
import { useAtom } from './useAtom';
import { AtomStoreProvider } from '../atomStore/AtomStoreProvider';
import * as useIsomorphicLayoutEffectObject from '../../utils/useIsomorphicLayoutEffect';
import { useIsomorphicLayoutEffect } from '../../utils/useIsomorphicLayoutEffect';
import { useAtomSetState } from './useAtomSetState';
import { createAtomStore } from '../atomStore/atomStore';
import deepEqual from 'fast-deep-equal';

const expectRenderResult = (
  children: ReactElement,
  expectWithContainer: (container: HTMLElement) => void
) => {
  jest
    .spyOn(useIsomorphicLayoutEffectObject, 'useIsomorphicLayoutEffect')
    .mockImplementation((effect) => effect());

  it('CSR', () => {
    const { container } = render(children);

    expectWithContainer(container);
  });

  it('SSR', () => {
    const innerElement = renderToString(children);

    const container = document.createElement('div');
    container.innerHTML = innerElement;

    expectWithContainer(container);
  });
};

describe('useAtom', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('Initial state', () => {
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

    expectRenderResult(
      <AtomStoreProvider>
        <User />
      </AtomStoreProvider>,
      (container) => {
        expect(getByTestId(container, 'name').textContent).toBe('example');
        expect(getByTestId(container, 'age').textContent).toBe('-1');
      }
    );
  });

  describe('Initial state from store', () => {
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
    atomStore.setAtomValue(userAtom.key, () => ({
      name: 'example',
      age: 22,
    }));

    expectRenderResult(
      <AtomStoreProvider atomStore={atomStore}>
        <User />
      </AtomStoreProvider>,
      (container) => {
        expect(getByTestId(container, 'name').textContent).toBe('example');
        expect(getByTestId(container, 'age').textContent).toBe('22');
      }
    );
  });

  describe('SetState', () => {
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
    expectRenderResult(
      <AtomStoreProvider atomStore={store}>
        <User />
      </AtomStoreProvider>,
      (container) => {
        expect(getByTestId(container, 'name').textContent).toBe('example');
        expect(getByTestId(container, 'age').textContent).toBe('22');
        expect(store.getAtoms().user).toEqual({
          ...userAtom,
          value: {
            name: 'example',
            age: 22,
          },
        });
      }
    );
  });

  describe('With multi atoms', () => {
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

    expectRenderResult(
      <AtomStoreProvider>
        <User />
      </AtomStoreProvider>,
      (container) => {
        expect(getByTestId(container, 'name').textContent).toBe('example');
        expect(getByTestId(container, 'age').textContent).toBe('22');
        expect(getByTestId(container, 'count').textContent).toBe('10');
      }
    );
  });

  describe('With deep equal', () => {
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

      const [{ name, age }] = useAtom(userAtom);
      const userDispatch = useAtomSetState(userAtom);

      useIsomorphicLayoutEffect(() => {
        userDispatch({
          name: 'example',
          age: 22,
        });
      }, [userDispatch]);

      return (
        <div>
          <p data-testid="name">{name}</p>
          <p data-testid="age">{age}</p>
        </div>
      );
    };

    expectRenderResult(
      <AtomStoreProvider>
        <User />
      </AtomStoreProvider>,
      (container) => {
        expect(getByTestId(container, 'name').textContent).toBe('example');
        expect(getByTestId(container, 'age').textContent).toBe('22');
      }
    );
  });
});
