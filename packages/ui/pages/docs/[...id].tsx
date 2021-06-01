import Head from 'next/head'
import utilStyles from '../../styles/utils.module.scss'
import { GetStaticProps, GetStaticPaths } from 'next'
import { DocsDataTree, getAllDocIds, getDocData, makePropsAllDocData } from '../../lib/markdown/docs/get-docs-data'
import DocsLayout from '@rollem/ui/components/layouts/docs/DocsLayout'
import { chain, trim } from 'lodash'
import util from 'util';
import { renderDocsMarkdown } from '@rollem/ui/lib/markdown/docs/render-markdown'
import { isWhiteSpaceLike } from 'typescript'

export default function Post({
  postData,
  allDocsData,
  session,
}: {
  postData: {
    title: string
    date: string
    content: string,
    id: string[],
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
        {renderDocsMarkdown(postData.content, postData.id)}
      </article>
    </DocsLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = chain(getAllDocIds()).filter(path => path.params.id.length !== 0).value();
  return {
    paths: paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: { params: { id: string[] }}) => {
  const postData = await getDocData(params.id);
  if (trim(postData.frontMatter.redirect_to) !== '') {
    return {
      redirect: {
        statusCode: 302,
        destination: postData.frontMatter.redirect_to,
      }
    };
  }
  return {
    props: {
      postData,
      ...makePropsAllDocData(),
    }
  }
}
