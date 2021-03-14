import Head from 'next/head'
import utilStyles from '../styles/utils.module.scss'
import { GetStaticProps, GetStaticPaths } from 'next'
import { DocsDataTree, getAllDocIds, getDocData, makePropsAllDocData } from '../lib/get-docs-data'
import RootLayout from '../components/layouts/RootLayout'

export default function Post({
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
    <RootLayout allDocsData={allDocsData}>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        {/* <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div> */}
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </RootLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllDocIds().filter(path => path.params.id.length !== 0);
  return {
    paths: paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: { params: { id: string[] }}) => {
  const postData = await getDocData(params.id);
  return {
    props: {
      postData,
      ...makePropsAllDocData(),
    }
  }
}
