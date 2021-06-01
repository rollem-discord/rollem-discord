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
  const docIds = getAllDocIds().filter(path => path.params.id.length !== 0);

  // remove any elements that would produce redirects
  for (let i = docIds.length-1; i >=0; i--) {
    const docData = await getDocData(docIds[i].params.id);
    if (trim(docData.frontMatter.redirect_to)) {
      docIds.splice(i, 1);
    }
  }

  return {
    paths: docIds,
    fallback: 'blocking', // required to support redirects
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: { params: { id: string[] }}) => {
  const postData = await getDocData(params.id);

  if (!postData) {
    return {
      notFound: true,
    };
  }

  if (trim(postData.frontMatter.redirect_to) !== '') {
    return {
      redirect: {
        destination: postData.frontMatter.redirect_to,
        permanent: false,
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
