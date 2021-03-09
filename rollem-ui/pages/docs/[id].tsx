import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.scss'
import { GetStaticProps, GetStaticPaths } from 'next'
import { getAllDocIds, getDocData } from '../../lib/get-docs-data'
import DocsLayout from '../../components/layouts/docs'

export default function Post({
  postData
}: {
  postData: {
    title: string
    date: string
    contentHtml: string
  }
}) {
  return (
    <DocsLayout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </DocsLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllDocIds()
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getDocData(params.id as string)
  return {
    props: {
      postData
    }
  }
}