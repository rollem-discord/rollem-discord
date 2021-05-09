import { DocsDataTree, getDocData, getSortedDocsData, makePropsAllDocData } from '../lib/docs/get-docs-data';
import RootLayout from '../components/layouts/RootLayout';
import Head from 'next/head';

export default function Home({
  postData,
}: {
  postData: {
    title: string
    date: string
    contentHtml: string
  },
  allDocsData: DocsDataTree[],
}) {
  return (
    <>
      <Head>
        <title>Rollem Rocks</title>
      </Head>
      <RootLayout>
        <article>
          <h1>Rollem Rocks</h1>
        </article>
      </RootLayout>
    </>
  )
}
