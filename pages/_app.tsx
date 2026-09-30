import '../src/index.css';
import type { AppProps } from 'next/app';
import { GlobalProviders } from '../src/contexts/GlobalProviders';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalProviders>
      <Component {...pageProps} />
    </GlobalProviders>
  );
}
