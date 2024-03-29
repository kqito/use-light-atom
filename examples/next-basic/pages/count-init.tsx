import Link from 'next/link';
import type { GetStaticProps, NextPage } from 'next';
import styles from '../styles/Home.module.css';
import { useMergeAtom } from '../dist';
import { useCallback } from 'react';
import { Counter } from '../components/counter';
import { countAtom } from '../atoms/countAtom';

type PreloadValues = {
  preloadValues: {
    [key: string]: number;
  };
};

const CounterPage: NextPage<PreloadValues> = ({ preloadValues }) => {
  const count = preloadValues[countAtom.key];
  const setter = useCallback(() => count, [count]);

  useMergeAtom(countAtom, setter);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>use-light-atom example</h1>
        <h3>Reset count atom</h3>

        <Link href="/">
          <a>To count app</a>
        </Link>

        <Counter />
      </main>
    </div>
  );
};

export default CounterPage;

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      preloadValues: {
        [countAtom.key]: 0,
      },
    },
  };
};
