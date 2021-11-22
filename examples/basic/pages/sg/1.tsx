import type { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';
import { Counter, CounterButton } from '../../components/Counter';

const SG1: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          <p>
            <Link href="/">
              <a>Go to /</a>
            </Link>
          </p>
          <p>
            <Link href="/sg/2">
              <a>Go to /sg/2</a>
            </Link>
          </p>
        </h1>

        <Counter />
        <CounterButton />
      </main>
    </div>
  );
};

export default SG1;

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      initialValue: {
        counter: 100,
      },
    },
  };
};
