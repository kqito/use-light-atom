import type { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';
import { UserInfo } from '../../components/User';

const SG2: NextPage = () => {
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
            <Link href="/sg/1">
              <a>Go to /sg/1</a>
            </Link>
          </p>
        </h1>

        <UserInfo />
      </main>
    </div>
  );
};

export default SG2;

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      preloadValues: {
        user: () => ({
          name: 'getStaticProps',
        }),
      },
    },
  };
};
