import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { StoreProvider, createStore } from '../dist/index';

export const store = createStore();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider store={store}>
      <Component {...pageProps} />
    </StoreProvider>
  );
}

export default MyApp;
