import { useEffect } from 'react';
import { createAtom, useAtom, useAtomSetState, useAtomState } from '../dist';

export const countAtom = createAtom('counter', 0);

export const Counter = () => {
  const [count] = useAtom(countAtom);

  return (
    <div>
      <p>Counter: {count}</p>
    </div>
  );
};

export const SelectorTest = () => {
  const [count] = useAtom(countAtom);
  const count2 = useAtomState(countAtom, {
    selector:
      count < 10
        ? () => 'count is smaller than 10'
        : () => 'count is 10 or over',
  });

  return (
    <div style={{ marginTop: '8px' }}>
      <div>SelectorTest: {count2}</div>
    </div>
  );
};

export const CounterButton = () => {
  const [count, setState] = useAtom(countAtom, { selector: (count) => count });

  return (
    <div style={{ marginTop: '8px' }}>
      <div>
        <button onClick={() => setState(count + 1)}>
          CounterButton: {count}
        </button>
      </div>
    </div>
  );
};

export const AsyncCounterButton = () => {
  const [count, setState] = useAtom(countAtom, {
    selector: (count) => count,
  });

  return (
    <div style={{ marginTop: '8px' }}>
      <button
        onClick={async () =>
          setTimeout(() => {
            setState((count) => count + 1);
          }, 1000)
        }
      >
        AsyncCounterButton: {count}
      </button>
    </div>
  );
};

export const ResetCounterButton = () => {
  const [count, setState] = useAtom(countAtom, {
    selector: (count) => count,
  });

  return (
    <div style={{ marginTop: '8px' }}>
      <button onClick={() => setState(0)}>ResetCounterButton: {count}</button>
    </div>
  );
};

export const FirstIncrement = () => {
  const count = useAtomState(countAtom);
  const setState = useAtomSetState(countAtom);

  useEffect(() => {
    setState(count <= 0 ? 99 : count * 2);
  }, []);

  return null;
};
