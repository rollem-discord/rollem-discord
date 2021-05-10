import { createContext } from "react";

export interface AppContextValue extends Record<string, unknown> {
  baseUrl?: string;
}

/** The NextJS app context. Provided from getInitialProps */
export const AppContext = createContext({ baseUrl: null });