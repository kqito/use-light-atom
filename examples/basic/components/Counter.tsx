import { createAtom, useAtom } from '../dist';
import { store } from '../pages/_app';

export const countAtom = createAtom('counter', 0);

export const Counter = () => {
  const [count] = useAtom(countAtom);

  console.log('Store', store);
  // console.log('Render: Counter', count);

  return (
    <div>
      <p>Counter: {count}</p>
    </div>
  );
};

export const CounterButton = () => {
  const [count, dispatch] = useAtom(countAtom, (count) => count);

  // console.log('Render: CounterButton', count);

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

  // console.log('Render: AsyncCounterButton', count);

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

  // console.log('Render: ResetCounterButton', count);

  return (
    <div style={{ marginTop: '8px' }}>
      <button onClick={() => dispatch(0)}>ResetCounterButton: {count}</button>
    </div>
  );
};
