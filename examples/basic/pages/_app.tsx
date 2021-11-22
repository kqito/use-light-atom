import Head from 'next/head';
import type { AppProps } from 'next/app';
import { StoreProvider, createStore } from '../dist/index';
import '../styles/globals.css';
import { useRef } from 'react';
import { StoreInfo } from '../components/StoreInfo';

function MyApp({ Component, pageProps }: AppProps) {
  const { initialValue } = pageProps;

  const storeRef = useRef(
    createStore({ initialValue: initialValue || undefined })
  );

  return (
    <>
      <StoreProvider store={storeRef.current}>
        <StoreInfo />
        <Component {...pageProps} />
      </StoreProvider>
      <Head>
        <title>Basic Example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
}

export default MyApp;
