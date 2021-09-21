import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { GitHubWrapper } from '../context/github';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GitHubWrapper>
      <Component {...pageProps} />
    </GitHubWrapper>
  );
}
export default MyApp;
