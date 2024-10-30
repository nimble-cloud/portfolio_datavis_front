import { useState, Suspense } from "react";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import { AuthCtx } from "./context";
import ThemeContext from "../theme/themecontext";
import axios from "axios";
import SignIn from "./Login";

// Import the generated route tree
import { routeTree } from "../routeTree.gen";

type User = {
  access_token: string;
  companies: string[] | null;
  id: string;
  role: string;
};

function SuspenseLoader() {
  return (
    <Box sx={{ width: "100%", textAlign: "center", mt: 30 }}>
      <Typography variant="h4">Loading...</Typography>
      <CircularProgress />
    </Box>
  );
}

// Create a new router instance
const router = createRouter({ basepath: "/datavis", routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function AuthContext() {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = async (): Promise<boolean> => {
    try {
      const { status, data } = await axios.post<User>(
        import.meta.env.VITE_API_LOGIN_URL,
        {
          email: "portfolio",
          password: "thanksfortakingalook",
        }
      );

      if (status === 200) {
        // console.log(data);

        axios.defaults.baseURL = import.meta.env.VITE_API_URL;
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${data.access_token}`;
        setLoggedIn(true);
        return false; //no err
      } else {
        return true; //err
      }
    } catch (error) {
      console.error(error);
      return true; //err
    }
  };

  return (
    <AuthCtx.Provider value={{ loggedIn, logIn }}>
      <ThemeContext>
        {!loggedIn ? (
          <SignIn />
        ) : (
          <Suspense fallback={<SuspenseLoader />}>
            <RouterProvider router={router} />
          </Suspense>
        )}
      </ThemeContext>
    </AuthCtx.Provider>
  );
}
