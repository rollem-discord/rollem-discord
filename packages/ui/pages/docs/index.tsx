import Head from 'next/head'
import utilStyles from '../../styles/utils.module.scss'
import { GetStaticProps, GetStaticPaths } from 'next'
import { DocsDataTree, getAllDocIds, getDocData, makePropsAllDocData } from '../../lib/docs/get-docs-data'
import DocsLayout from '@rollem/ui/components/layouts/docs/DocsLayout'
import { chain } from 'lodash'
import util from 'util';
import { renderMarkdown } from '@rollem/ui/lib/docs/render-markdown'

export default function Post({
  postData,
  allDocsData,
  session,
}: {
  postData: {
    title: string,
    date: string,
    content: string,
  },
  allDocsData: DocsDataTree[],
  session: any,
}) {
  return (
    <DocsLayout allDocsData={allDocsData}>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div>
          {renderMarkdown(postData.content)}
        </div>
      </article>
    </DocsLayout>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }: { params: { id: string[] }}) => {
  const postData = await getDocData([]);
  return {
    props: {
      postData,
      ...makePropsAllDocData(),
    }
  }
}
