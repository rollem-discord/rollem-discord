import Link from 'next/link';
import Head from 'next/head';

export default function DocsIndex() {
  return (
    <>
      <Head>
        <title>Rollem Docs Home</title>
      </Head>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/docs/rolling">Rolling Docs</Link></li>
      </ul>
    </>
  )
}
