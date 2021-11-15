import '../styles/globals.css';
import type { AppProps } from 'next/app';
import * as dist from '../dist/index.esm';
import { StoreProvider } from '../dist/index.esm';

console.log(dist);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  );
}

export default MyApp;
