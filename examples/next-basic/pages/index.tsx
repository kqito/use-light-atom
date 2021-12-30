import Link from 'next/link';
import type { GetStaticProps, NextPage } from 'next';
import styles from '../styles/Home.module.css';
import {
  Counter,
  AsyncCounterButton,
  CounterButton,
  ResetCounterButton,
} from '../components/counter';
import { countAtom } from '../atoms/countAtom';
import { useMergeAtom } from '../dist';
import { useCallback } from 'react';

type Props = {
  preloadValues: {
    count: number;
  };
};

const CounterPage: NextPage<Props> = ({ preloadValues }) => {
  const setter = useCallback(
    (prev: number) => (prev === 0 ? preloadValues.count : undefined),
    [preloadValues.count]
  );
  useMergeAtom(countAtom, setter);

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

export const getStaticProps: GetStaticProps<Props> = () => {
  return {
    props: {
      preloadValues: {
        count: 5,
      },
    },
  };
};
