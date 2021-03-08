import Link from 'next/link';
import Head from 'next/head';

export default function DocsRollingIndex() {
  return (
    <>
    <Head>
      <title>Rollem Rolling Docs</title>
    </Head>
    <ul>
      <li><Link href="/">Home</Link></li>
      <li><Link href="/docs"> Docs</Link></li>
    </ul>
    </>
  )
}
