import Head from 'next/head';
import type { AppProps } from 'next/app';
import { AtomStoreProvider, createAtomStore } from '../dist/index';
import '../styles/globals.css';
import { useRef } from 'react';
import { StoreInfo } from '../components/StoreInfo';

function MyApp({ Component, pageProps }: AppProps) {
  const { initialValue } = pageProps;

  const atomStoreRef = useRef(
    createAtomStore({ initialValue: initialValue || undefined })
  );

  return (
    <>
      <AtomStoreProvider atomStore={atomStoreRef.current}>
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
