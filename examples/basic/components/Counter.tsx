import { createAtom, useAtom } from '../dist';

export const countAtom = createAtom('counter', {
  count: 0,
});

export const Counter = () => {
  const [{ count }] = useAtom(countAtom);

  console.log('Counter');

  return (
    <div>
      <p>Counter: {count}</p>
    </div>
  );
};

export const CounterButton = () => {
  const [{ count }, dispatch] = useAtom(countAtom);

  console.log('CounterButton');

  return (
    <div>
      <button
        onClick={() =>
          dispatch(() => ({
            count: count + 1,
          }))
        }
      >
        CounterButton: {count}
      </button>
    </div>
  );
};
