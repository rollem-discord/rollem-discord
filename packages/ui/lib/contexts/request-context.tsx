import { createContext, FunctionComponent, useContext, useEffect } from "react";
import util from 'util';

const defaultUrl = "https://rollem.rocks"

export interface AppContextValue extends Record<string, unknown> {
  baseUrl?: string;
}

/** The NextJS app context. Provided from getInitialProps */
export const AppContext = createContext({ baseUrl: defaultUrl } as AppContextValue);

export const AppContextProvider: FunctionComponent = ({ ...props }) => {

  const context = useContext(AppContext);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.host;
      const protocol = host?.toLowerCase().startsWith('localhost') ? 'http' : 'https';
      context.baseUrl = `${protocol}://${window.location.host}`;
    }

    console.log({inEffect: context});
  })

  console.log(util.inspect({inMethod: context, props}, true, 5, true));

  return (
    <AppContext.Provider value={context}>
      {props.children}
    </AppContext.Provider>
  );
}