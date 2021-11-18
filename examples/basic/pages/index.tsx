import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Form, UserInfo } from '../components/User';
import {
  AsyncCounterButton,
  Counter,
  CounterButton,
  ResetCounterButton,
} from '../components/Counter';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Basic Example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <Link href="/counter">
            <a>Go to /counter</a>
          </Link>
        </h1>

        <UserInfo />
        <Form />
        <Counter />
        <CounterButton />
        <AsyncCounterButton />
        <ResetCounterButton />
      </main>
    </div>
  );
};

export default Home;
