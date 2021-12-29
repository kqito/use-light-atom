import { countAtom } from '../atoms/countAtom';
import { useAtom, useAtomSetState } from '../dist';

export const Counter = () => {
  const [count] = useAtom(countAtom);

  return <p>Counter: {count}</p>;
};

export const CounterButton = () => {
  const [count, setState] = useAtom(countAtom, { selector: (count) => count });

  return (
    <button onClick={() => setState(count + 1)} style={{ padding: '4px 8px' }}>
      count + 1
    </button>
  );
};

export const AsyncCounterButton = () => {
  const setState = useAtomSetState(countAtom);

  return (
    <button
      style={{ padding: '4px 8px' }}
      onClick={async () =>
        setTimeout(() => {
          setState((count) => count + 1);
        }, 3000)
      }
    >
      count + 1 after 3000ms
    </button>
  );
};

export const ResetCounterButton = () => {
  const setState = useAtomSetState(countAtom);

  return (
    <button style={{ padding: '4px 8px' }} onClick={() => setState(0)}>
      Reset counter
    </button>
  );
};
