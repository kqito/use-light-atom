import Head from 'next/head';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

import { useAtom } from '../dist';
import { countAtom } from '../atoms/countAtom';

export const StoreInfo = () => {
  useAtom(countAtom);

  console.log(countAtom);

  return null;
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <StoreInfo />
      <Component {...pageProps} />
      <Head>
        <title>Basic Example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
}

export default MyApp;
