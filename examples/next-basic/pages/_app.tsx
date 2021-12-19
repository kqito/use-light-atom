import Head from 'next/head';
import type { AppProps } from 'next/app';
import { AtomStoreProvider, createAtomStore } from '../dist/index';
import '../styles/globals.css';
import { useRef } from 'react';

import { useAtom, useAtomStore } from '../dist';
import { countAtom } from '.';

export const StoreInfo = () => {
  useAtom(countAtom);

  console.log('Store', useAtomStore());

  return null;
};

function MyApp({ Component, pageProps }: AppProps) {
  const { preloadValues } = pageProps;

  const atomStoreRef = useRef(createAtomStore({ isDebugMode: true }));

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
