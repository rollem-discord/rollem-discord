import Head from 'next/head';
import Link from 'next/link';
import { getSortedDocsData } from '../lib/get-docs-data';
import styles from '../styles/Home.module.css';
import Button from '@material-ui/core/Button';

export default function Home({ allDocsData }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Rollem</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Link href="/docs">Docs</Link>
      <Link href="/presskit">Presskit</Link>

    <Button variant="contained" color="primary">
      Hello World
    </Button>

      {/* Add this <section> tag below the existing <section> tag */}
      <section>
        <h2>Blog</h2>
        <ul>
          {allDocsData.map(({ id, date, title }) => (
            <li key={id}>
              {title}
              <br />
              {id}
              <br />
              {date}
            </li>
          ))}
        </ul>
      </section>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  const allDocsData = getSortedDocsData();
  return {
    props: {
      allDocsData,
    }
  }
}