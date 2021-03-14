import Head from 'next/head';
import Link from 'next/link';
import { DocsData, DocsDataTree, getSortedDocsData } from '../lib/get-docs-data';
import styles from '../styles/Home.module.css';
import Button from '@material-ui/core/Button';
import { TransitEnterexitOutlined } from '@material-ui/icons';

export default function Home({ allDocsData }: { allDocsData: DocsDataTree[] }) {
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
          {allDocsData.map(node => makeTree(node))}
        </ul>
        <h2>end</h2>
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

function makeTree(treeNode: DocsDataTree, parentPath: string = '/') {
  return (
    <li>
      {makeEntry(treeNode?.item, parentPath)}
      <ul>
        {treeNode?.children?.map(child => makeTree(child, parentPath))}
      </ul>
    </li>
  )
}

function makeEntry(data: DocsData, parentPath: string) {
  console.log(data);
  if (!data) { return <></>; }
  const path = data.route.join('/');
  console.log(path);
  return (
    <li>
      <a href={path}><span>{data.title} ({data.id}) ({data.nav_order})</span></a>
    </li>
  )
}

export async function getStaticProps(): Promise<{ props: { allDocsData: DocsDataTree[]} }> {
  const allDocsData = getSortedDocsData();
  return {
    props: {
      allDocsData: allDocsData,
    }
  }
}