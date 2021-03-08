import Link from 'next/link';

export default function DocsIndex() {
  return (
    <ul>
      <li><Link href="/">Home</Link></li>
      <li><Link href="/docs/rolling">Rolling Docs</Link></li>
    </ul>
  )
}
