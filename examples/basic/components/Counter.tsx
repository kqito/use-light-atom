import { createAtom, useAtom, useAtomValue } from '../dist';

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
  const count2 = useAtomValue(
    countAtom,
    count < 10 ? () => 'count is smaller than 10' : () => 'count is 10 or over'
  );

  return (
    <div style={{ marginTop: '8px' }}>
      <div>SelectorTest: {count2}</div>
    </div>
  );
};

export const CounterButton = () => {
  const [count, dispatch] = useAtom(countAtom, (count) => count);

  return (
    <div style={{ marginTop: '8px' }}>
      <div>
        <button onClick={() => dispatch(count + 1)}>
          CounterButton: {count}
        </button>
      </div>
    </div>
  );
};

export const AsyncCounterButton = () => {
  const [count, dispatch] = useAtom(countAtom, (count) => count);

  return (
    <div style={{ marginTop: '8px' }}>
      <button
        onClick={async () =>
          setTimeout(() => {
            dispatch((count) => count + 1);
          }, 1000)
        }
      >
        AsyncCounterButton: {count}
      </button>
    </div>
  );
};

export const ResetCounterButton = () => {
  const [count, dispatch] = useAtom(countAtom, (count) => count);

  return (
    <div style={{ marginTop: '8px' }}>
      <button onClick={() => dispatch(0)}>ResetCounterButton: {count}</button>
    </div>
  );
};
