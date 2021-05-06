import Head from 'next/head'
import utilStyles from '../styles/utils.module.scss'
import { GetStaticProps, GetStaticPaths, NextApiResponse, GetServerSideProps } from 'next'
import { DocsDataTree, getAllDocIds, getDocData, makePropsAllDocData } from '../lib/get-docs-data'
import RootLayout from '../components/layouts/RootLayout'
import { applySession } from 'next-session'
import { RollemApiRequest, RollemSessionData, RollemIncomingMessage } from '../lib/withSession'
import { ServerResponse } from 'http'
import * as util from 'util';

export default function Post({
  postData,
  allDocsData,
  session,
}: {
  postData: {
    title: string
    date: string
    contentHtml: string
  },
  allDocsData: DocsDataTree[],
  session: any,
}) {
  return (
    <>
      Sorry this page was supposed to be a redirect from the old docs url to the new.
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const paths = getAllDocIds().filter(path => path.params.id.length !== 0).map(p => ['', ...p.params.id].join('/'));

  // if our path is a (presumably old) docs path, redirect to the new docs location
  if (paths.includes(context.resolvedUrl)) {
    context.res.setHeader('location', '/docs' + context.resolvedUrl);
    context.res.statusCode = 302;
    context.res.end();
    return {props:{}};
  }

  // otherwise this is a standard 404 scenario
  return {
    notFound: true,
  };
}