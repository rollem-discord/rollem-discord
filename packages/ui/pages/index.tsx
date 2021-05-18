import RootLayout from '../components/layouts/RootLayout';
import Head from 'next/head';
import { Button, Card, CardContent } from '@material-ui/core';

import styles from '../styles/standard.module.scss';
import { GetStaticProps } from 'next';
import { getMarkdownData, makePropsAllMarkdownData, MarkdownDataTree } from '../lib/markdown/get-markdown-data';
import { renderMarkdown } from '../lib/markdown/render-markdown';

export default function Home({
  postData,
}: {
  postData: {
    title: string
    date: string
    content: string
  },
  allMarkdownData: MarkdownDataTree[],
}) {
  return (
    <>
      <Head>
        <title>Rollem Rocks</title>
      </Head>
      <RootLayout>
        <Card className={styles.card}>
          <CardContent>
            <div className={styles.evenlySpace}>
              <Button variant="contained" href={"https://old.rollem.rocks"}>
                Old Docs
              </Button>
              <Button
                variant="contained"
                color="primary"
                href={"https://rollem.rocks/invite"}
              >
                <>
                  <img
                    className={styles.textImage}
                    src="/images/rollem-transparent.png"
                  ></img>
                  Invite Rollem
                </>
              </Button>
              <Button
                variant="contained"
                href={"https://rollem.rocks/docs/rollem-next"}
              >
                <>
                  <img
                    className={styles.textImage}
                    src="/images/rollem-next-transparent.png"
                  ></img>
                  Rollem-Next
                </>
              </Button>
              <Button
                variant="contained"
                color="secondary"
                href={"https://patreon.com/david_does"}
              >
                Patreon
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.card}>
          <CardContent>
            <div>{renderMarkdown(postData.content)}</div>
          </CardContent>
        </Card>
      </RootLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }: { params: { id: string[] }}) => {
  const postData = await getMarkdownData([]);
  return {
    props: {
      postData,
      ...makePropsAllMarkdownData(),
    }
  }
}
