import { GetServerSideProps } from 'next'
import { DocsDataTree, getAllDocIds } from '../lib/docs/get-docs-data'

export function ServerSideTemporaryRedirectPage(targetUrl: string, blurb: string = "Click here to continue") {
  return function({
    postData,
    session,
  }: {
    postData: {
      title: string
      date: string
      contentHtml: string
    },
    session: any,
  }) {
    return (
      <main className="markdown">
        <p>Sorry. This page was supposed to be a redirect.</p>
  
        <p>
          <a href={targetUrl}>{blurb}</a>
        </p>
      </main>
    )
  }
}

/** Produces the necessary serverSideProps for a temporary redirect. */
export function serverSideTemporaryRedirectServerSideProps(targetUrl: string): GetServerSideProps {
  return async (context) => {
    context.res.setHeader('location', targetUrl);
    context.res.statusCode = 302;
    context.res.end();
    return {props:{}};
  }
}