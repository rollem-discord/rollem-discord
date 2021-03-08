import Link from 'next/link';
import Head from 'next/head';

export default function DocsRollingIndex() {
  return (
    <>
      <Head>
        <title>Rollem Presskit</title>
      </Head>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><img src="/images/kagura1-384.png" alt="Small Size Rollem Avatar, White Background"></img></li>
        <li><img src="/images/kagura1-512.png" alt="Medium Size Rollem Avatar, White Background"></img></li>
        <li><img src="/images/kagura1.jpg" alt="Large Size Rollem Avatar, White Background"></img></li>
        <li><img src="/images/kagura2.jpg" alt="Rollem Beta Avatar, White Background"></img></li>
        <li><img src="/images/rollem-transparent.png" alt="Large Size Rollem Avatar, Transparent Background"></img></li>
      </ul>
    </>
  )
}
