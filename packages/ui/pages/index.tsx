import { DocsDataTree, getDocData, getSortedDocsData, makePropsAllDocData } from '../lib/get-docs-data';
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
        <title>{postData.title}</title>
      </Head>
      <RootLayout>
        <article>
          <h1>{postData.title}</h1>
          {/* <div className={utilStyles.lightText}>
            <Date dateString={postData.date} />
          </div> */}
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>
      </RootLayout>
    </>
  )
}
