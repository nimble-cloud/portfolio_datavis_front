import { createContext } from "react";

export const AuthCtx = createContext({
  loggedIn: false,
  logIn: async (): Promise<boolean> => {
    return true;
  },
});
