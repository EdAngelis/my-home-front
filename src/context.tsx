import { createContext } from "react";

export const AppContext = createContext<any>(null);

export function AppProvider({ children }: any) {
  return (
    <AppContext.Provider value={{ qtItemCart: 11 }}>
      {children}
    </AppContext.Provider>
  );
}
