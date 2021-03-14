import NavTop from '../navtop/Navtop'

const name = '[Your Name]'
export const siteTitle = 'Next.js Sample Website'

export default function Layout({
  children,
  home
}: {
  children: React.ReactNode
  home?: boolean
}) {
  return (
    <>
      <NavTop></NavTop>
      <main>{children}</main>
    </>
  )
}