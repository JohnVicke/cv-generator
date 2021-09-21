import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.scss';
import { useRouter } from 'next/dist/client/router';
import { useEffect } from 'react';
import { useGitHubContext } from '../context/github';
import { GitHubUser } from '../types/github';
import { getUser } from '../api/api';

const Hello: NextPage = () => {
  const router = useRouter();
  const { query } = useRouter();
  const { authenticate, user } = useGitHubContext();

  useEffect(() => {
    const fetchUser = async () => {
      const body = {
        code: query.code as string
      };
      if (query) {
        const { data, ...rest } = await getUser(body);
        if (data) authenticate(data as GitHubUser);
        router.push('editor/resume/1');
      }
    };

    if (query?.code) fetchUser();
  }, [query]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>Logged in as {user?.name}</main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Hello;
