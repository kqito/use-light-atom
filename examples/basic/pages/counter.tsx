import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {
  AsyncCounterButton,
  Counter,
  CounterButton,
  ResetCounterButton,
} from '../components/Counter';

const CounterPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Basic Example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <Link href="/">
            <a>Go to /</a>
          </Link>
        </h1>

        <Counter />
        <CounterButton />
        <AsyncCounterButton />
        <ResetCounterButton />
      </main>
    </div>
  );
};

export default CounterPage;
