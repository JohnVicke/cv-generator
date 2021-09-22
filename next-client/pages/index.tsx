import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.scss';
import axios from 'axios';
import { useRouter } from 'next/dist/client/router';

const Home: NextPage = () => {
  const router = useRouter();

  const loginWithGithub = async () => {
    const { data } = await axios.get(
      'http://localhost:8080/api/v1/github/get-redirect'
    );
    router.push(data);
  };

  const goToEditor = () => {
    loginWithGithub();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}></main>
      <h1>CV-GENERATOR</h1>
      <button onClick={goToEditor}>Go To editor</button>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Home;