import React, { createContext, useReducer } from "react";
import { ApplicationReducer } from "./ApplicationReducer";
import { rememberTheme } from "./Store";


export interface IApplicationContext {
  darkMode: boolean;
  rememberTheme: (darkMode: boolean) => any;
  toggleDarkMode: () => void;
}

const storage: boolean = localStorage.getItem("darkMode")
  ? JSON.parse(localStorage.getItem("darkMode")!)
  : false;

type ApplicationContextProps = {
    children: React.ReactNode
}

const initialState = {
    darkMode: storage,
    ...rememberTheme(storage),
  };

export const ApplicationContext =
  createContext<Partial<IApplicationContext>>(initialState);

export const ApplicationContextProvider = ({children}: ApplicationContextProps) => {
  const [state, dispatch] = useReducer(ApplicationReducer, initialState);

  const toggleDarkMode = () => {
    dispatch({ type: "toggleDarkMode" });
  };

  const ContextValues = {
    rememberTheme,
    toggleDarkMode,
    ...state,
  };

  return (
    <ApplicationContext.Provider value={ContextValues}>
      {children}
    </ApplicationContext.Provider>
  );
};

