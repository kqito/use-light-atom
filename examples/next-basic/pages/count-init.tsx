import Link from 'next/link';
import type { GetStaticProps, NextPage } from 'next';
import { countAtom, Counter } from '.';
import styles from '../styles/Home.module.css';

const CounterPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>use-light-atom example</h1>
        <h3>Preload value 100 to count atom</h3>

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
        [countAtom.key]: 100,
      },
    },
  };
};
