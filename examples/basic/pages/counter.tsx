import type { NextPage } from 'next';
import Link from 'next/link';
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
