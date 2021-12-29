import Link from 'next/link';
import type { GetStaticProps, NextPage } from 'next';
import styles from '../styles/Home.module.css';

import { createAtom, useAtom, useAtomSetState } from '../dist';

export const countAtom = createAtom(0);

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
const CounterPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>use-light-atom example</h1>
        <h3>Count App</h3>

        <Link href="/count-init">
          <a>To Reset count page</a>
        </Link>

        <Counter />
        <div
          style={{
            marginTop: '8px',
            display: 'grid',
            gridGap: '4px',
            gridAutoFlow: 'column',
          }}
        >
          <CounterButton />
          <AsyncCounterButton />
          <ResetCounterButton />
        </div>
      </main>
    </div>
  );
};

export default CounterPage;

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      preloadValues: {
        [countAtom.key]: 5,
      },
    },
  };
};
