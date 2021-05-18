import { createContext, FunctionComponent, useContext, useEffect, useState } from "react";

export interface SidePanelContextValue extends Record<string, unknown> {
  /** True when the drawer should be open on mobile. */
  mobileDrawerOpen: boolean,

  /** Pass true/false to generate a callback function that opens/closes the drawer. For keyboard/mouse events. */
  toggleDrawer: (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => void;
}

/** The NextJS SidePanel context. Provided from getInitialProps */
export const SidePanelContext = createContext({
  mobileDrawerOpen: false
} as SidePanelContextValue);

export const SidePanelContextProvider: FunctionComponent = ({ ...props }) => {
  const [state, setState] = useState({ mobileDrawerOpen: false });

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

  return (
    <SidePanelContext.Provider value={{...state, toggleDrawer}}>
      {props.children}
    </SidePanelContext.Provider>
  );
}