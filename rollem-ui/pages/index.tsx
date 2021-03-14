import { DocsDataTree, getDocData, getSortedDocsData, makePropsAllDocData } from '../lib/get-docs-data';
import RootLayout from '../components/layouts/RootLayout';
import Head from 'next/head';

export default function Home({
  postData,
  allDocsData,
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
      <RootLayout allDocsData={allDocsData}>
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

export async function getStaticProps(): Promise<{ props: { postData: unknown, allDocsData: DocsDataTree[]} }> {
  const postData = await getDocData([]);
  return {
    props: {
      postData: postData,
      ...makePropsAllDocData(),
    }
  }
}