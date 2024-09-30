import React from 'react'
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import { ServerStyleSheets } from '@mui/styles'
import {
  Theme,
} from '@mui/material/styles';
import { theme } from '../lib/theme'

declare module '@mui/styles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons"
          />
          <link 
            rel="stylesheet" 
            href="https://fonts.googleapis.com/icon?family=Material+Icons" 
          />
          <style jsx global>
            {`
              html,
              body {
                height: 100%;
                width: 100%;
                background-color: ${theme.palette.background.default};
                color: ${theme.palette.text.primary};
              }
              *,
              *:after,
              *:before {
                box-sizing: border-box;
              }
              body {
                font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
                font-size: 1rem;
                margin: 0;
              }
            `}
          </style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

// TODO(upgrade): What on earth is this thing doing?
MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets(); // LATER(MUI): to switch to emotion, refer to materialui-makestyles-undoes-custom-css-upon-refresh-in-nextjs https://stackoverflow.com/questions/75401710/material-ui-next-js-13-styles-issues-in-prod https://stackoverflow.com/questions/66089290/ https://blog.logrocket.com/getting-started-mui-next-js/
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props => sheets.collect(<App {...props} />)
    })

  const initialProps = await Document.getInitialProps(ctx)

  return {
    ...initialProps,
    ctx,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      <React.Fragment key="styles">
        {initialProps.styles}
        {sheets.getStyleElement()}
      </React.Fragment>
    ]
  }
}

export default MyDocument