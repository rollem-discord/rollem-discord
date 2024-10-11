import { createContext, FC, PropsWithChildren, useState } from "react";

export interface SidePanelContextValue extends Record<string, unknown> {
  /** True when the drawer should be open on mobile. */
  mobileDrawerOpen: boolean,

  /** True when the docs drawer should be open on mobile. */
  docsDrawerOpen: boolean;

  /** Pass true/false to generate a callback function that opens/closes the main drawer. For keyboard/mouse events. */
  toggleDrawer: (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => void;

  /** Pass true/false to generate a callback function that opens/closes the docs drawer. For keyboard/mouse events. */
  toggleDocsDrawer: (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => void;
}

/** The NextJS SidePanel context. Provided from getInitialProps */
export const SidePanelContext = createContext({
  mobileDrawerOpen: false
} as SidePanelContextValue);

export const SidePanelContextProvider: FC<PropsWithChildren> = (props) => {
  const [state, setState] = useState({
    mobileDrawerOpen: false,
    docsDrawerOpen: false,
  } as SidePanelContextValue);

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, mobileDrawerOpen: open });
  };

  const toggleDocsDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, docsDrawerOpen: open } as SidePanelContextValue);
  };

  return (
    <SidePanelContext.Provider value={{...state, toggleDrawer, toggleDocsDrawer}}>
      {props.children}
    </SidePanelContext.Provider>
  );
}