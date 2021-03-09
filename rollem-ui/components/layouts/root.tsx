export default function RootLayout({ children }) {
  return (
    <div>
      <div className="left">
      </div>
      <div className="right">
        <h1>Docs Page</h1>
        {children}
      </div>
    </div>
  )
}
