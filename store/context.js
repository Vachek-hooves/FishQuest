import {createContext, useEffect, useState, useContext} from 'react';

export const Context = createContext();

export const ContextProvider = ({children}) => {
  const value = {};

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useContextProvider = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useContextProvider must be used within a ContextProvider');
  }
  return context;
};
