import Head from 'next/head'
import App, { AppContext } from 'next/app'
import { useEffect } from 'react';
import '../styles/globals.scss'
import '../styles/markdown.scss';
import { AppContextProvider} from '../lib/contexts/request-context';
import { theme } from '../lib/theme';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material/styles';
import { SidePanelContextProvider } from '../lib/contexts/sidepanel-context';
import { CssBaseline } from '@mui/material';


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


function MyApp({
  Component,
  pageProps,
}): JSX.Element {

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])
  
  return (<>
    {/* <CacheProvider value={emotionCache}> // LATER(MUI): to switch this, refer to https://stackoverflow.com/questions/66089290/materialui-makestyles-undoes-custom-css-upon-refresh-in-nextjs https://stackoverflow.com/questions/75401710/material-ui-next-js-13-styles-issues-in-prod https://blog.logrocket.com/getting-started-mui-next-js/*/}
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
        <meta name="msapplication-TileColor" content="#da532c"/>
        <meta name="theme-color" content="#ffffff"/>

        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SidePanelContextProvider>
            <AppContextProvider>
              <Component {...pageProps} />
            </AppContextProvider>
          </SidePanelContextProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    {/* </CacheProvider> */}
  </>);
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);
  const { ctx, router } = appContext as AppContext;
  const { req, query, res, asPath, pathname } = ctx;

  return { ...appProps }
}

export default MyApp
