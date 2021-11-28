import Head from 'next/head';
import type { AppProps } from 'next/app';
import { AtomStoreProvider, createAtomStore } from '../dist/index';
import '../styles/globals.css';
import { useRef } from 'react';
import { StoreInfo } from '../components/StoreInfo';

function MyApp({ Component, pageProps }: AppProps) {
  const { preloadValues } = pageProps;

  const atomStoreRef = useRef(createAtomStore());

  return (
    <>
      <AtomStoreProvider
        atomStore={atomStoreRef.current}
        preloadValues={preloadValues}
      >
        <StoreInfo />
        <Component {...pageProps} />
      </AtomStoreProvider>
      <Head>
        <title>Basic Example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
}

export default MyApp;
