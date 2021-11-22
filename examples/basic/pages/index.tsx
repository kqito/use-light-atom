import type { NextPage } from 'next';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { Form, UserInfo } from '../components/User';
import { Counter, CounterButton } from '../components/Counter';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          <p>
            <Link href="/counter">
              <a>Go to /counter</a>
            </Link>
          </p>
          <p>
            <Link href="/sg/1">
              <a>Go to /sg/1</a>
            </Link>
          </p>
          <p>
            <Link href="/sg/2">
              <a>Go to /sg/2</a>
            </Link>
          </p>
        </h1>

        <UserInfo />
        <Form />
        <Counter />
        <CounterButton />
      </main>
    </div>
  );
};

export default Home;
