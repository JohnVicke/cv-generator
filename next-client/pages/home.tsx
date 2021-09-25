import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/OauthCallback.module.scss';
import { useRouter } from 'next/dist/client/router';
import { useEffect } from 'react';
import { useGitHubContext } from '../context/github';
import { GitHubUser } from '../types/github';
import { getUser } from '../api/api';

const Home: NextPage = () => {
  const router = useRouter();
  const { query } = useRouter();
  const { authenticate, user } = useGitHubContext();

  useEffect(() => {
    (async () => {
      const { data } = await getUser();
      if (data) authenticate(data as GitHubUser);
    })();
  }, []);

  const goTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!user ? (
        <div className={styles.ldsFacebook}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : (
        <>
          <button onClick={() => goTo('profile/update-page')}>
            Update GitHub page
          </button>
          <button onClick={() => goTo('editor/resume/1')}>
            View my resume
          </button>
        </>
      )}

      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Home;