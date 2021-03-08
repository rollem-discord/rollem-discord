import Link from 'next/link';
import Head from 'next/head';
import DocsLayout from '../layout';

export default function DocsRollingIndex() {
  return (
    <DocsLayout>
      <Head>
        <title>Rollem Rolling Docs</title>
      </Head>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/docs"> Docs</Link></li>
      </ul>
    </DocsLayout>
  )
}
