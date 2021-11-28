import { createAtom, useAtom, useAtomState } from '../dist';

export const countAtom = createAtom('counter', 0);

export const Counter = () => {
  const [count] = useAtom(countAtom);
  const countInfo = useAtomState(countAtom, {
    selector:
      count < 10
        ? () => 'count is smaller than 10'
        : () => 'count is 10 or over',
  });

  return (
    <div>
      <p>Counter: {count}</p>
      <p>SelectorTest: {countInfo}</p>
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
