import { createRootRoute, Outlet } from "@tanstack/react-router";
import Box from "@mui/material/Box";

import Nav from "../Nav";

export const Route = createRootRoute({
  component: () => (
    <Box sx={{ display: "flex", height: "100%" }}>
      <Nav />
      <Box sx={{ p: 2, flexGrow: 1, width: "100%" }}>
        <Outlet />
      </Box>
    </Box>
  ),
});
