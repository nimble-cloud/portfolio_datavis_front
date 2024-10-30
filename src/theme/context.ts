import { createContext } from "react";
import type { Theme } from "@mui/material/styles";

export const ThemeCtx = createContext({
  mode: "dark",
  theme: {} as Theme,
  toggleTheme: () => {},
});
