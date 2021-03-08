import Link from 'next/link';

export default function DocsRollingIndex() {
  return (
    <ul>
      <li><Link href="/">Home</Link></li>
      <li><Link href="/docs"> Docs</Link></li>
    </ul>
  )
}
