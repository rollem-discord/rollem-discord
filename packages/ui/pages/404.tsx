import RootLayout from "../components/layouts/RootLayout"
import { DocsDataTree, makePropsAllDocData } from "../lib/get-docs-data"

export default function Custom404({ allDocsData }: { allDocsData: DocsDataTree[] }) {
  return (
    <RootLayout allDocsData={allDocsData}>
      <h1>404 - Page Not Found</h1>
      <img src="/images/rollem-transparent.png"></img>
    </RootLayout>
  )
}

export async function getStaticProps(): Promise<{ props: { allDocsData: DocsDataTree[]} }> {
  return {
    props: {
      ...makePropsAllDocData(),
    }
  }
}