import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import AuthContext from "./auth/authcontext";

import "@fontsource/ibm-plex-sans/300.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/700.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContext />
  </React.StrictMode>
);
