import DocsLayout from "../../components/layouts/docs/DocsLayout"
import { DocsDataTree, makePropsAllDocData } from "../../lib/markdown/docs/get-docs-data"

export default function Custom404({ allDocsData }: { allDocsData: DocsDataTree[] }) {
  return (
    <DocsLayout allDocsData={allDocsData}>
      <h1>404 - Page Not Found</h1>
      <img src="/images/rollem-transparent.png"></img>
      <p>You may have been looking for one of the docs to the left.</p>
    </DocsLayout>
  )
}

export async function getStaticProps(): Promise<{ props: { allDocsData: DocsDataTree[]} }> {
  return {
    props: {
      ...makePropsAllDocData(),
    }
  }
}