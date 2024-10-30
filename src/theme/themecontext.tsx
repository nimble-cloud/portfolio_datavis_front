import { useState, useMemo } from "react";
import { type PaletteOptions, createTheme } from "@mui/material/styles";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { ThemeCtx } from "./context";

const dark: PaletteOptions = {
  mode: "dark",
  background: {
    default: "#2a303c",
    paper: "#1c212b",
  },
  primary: {
    main: "#349486",
  },
  secondary: {
    main: "#e9c694",
  },
  info: {
    main: "#1b181c",
  },
};

const light: PaletteOptions = {
  mode: "light",
  background: {
    paper: "#F6F7F8",
  },
  primary: {
    main: "#349486",
  },
  secondary: {
    main: "#e9c694",
  },
  info: {
    main: "#1b181c",
  },
};
export default function ThemeContext({
  children,
}: {
  children: React.ReactElement;
}) {
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => {
    if (mode === "dark") {
      return createTheme({
        palette: dark,
      });
    } else {
      return createTheme({
        palette: light,
      });
    }
  }, [mode]);

  return (
    <ThemeCtx.Provider
      value={{
        mode,
        theme,
        toggleTheme,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeCtx.Provider>
  );
}
