import Head from 'next/head'
import Date from '../components/date'
import utilStyles from '../styles/utils.module.scss'
import { GetStaticProps, GetStaticPaths } from 'next'
import { DocsDataTree, getAllDocIds, getDocData, makePropsAllDocData } from '../lib/get-docs-data'
import DocsLayout from '../components/layouts/docs'
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
  const paths = getAllDocIds()
  return {
    paths: paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: { params: { id: string[] }}) => {
  console.log(params)
  console.log('Viewing: ', params.id);
  const postData = await getDocData(params.id);
  return {
    props: {
      postData,
      ...makePropsAllDocData(),
    }
  }
}
