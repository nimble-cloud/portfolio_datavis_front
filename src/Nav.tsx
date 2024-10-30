import { useContext } from "react";

import { Link } from "@tanstack/react-router";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import DashboardIcon from "@mui/icons-material/ShowChart";
import ReportIcon from "@mui/icons-material/GridOn";
import UploadIcon from "@mui/icons-material/FileUploadTwoTone";

import NimbleLogo from "./assets/nimble_cloud_logo_original.webp";
import Logoipsum from "./assets/logoipsum.svg";

import { ThemeCtx } from "./theme/context";

export default function Bar() {
  const { mode, toggleTheme } = useContext(ThemeCtx);
  return (
    <>
      <Box
        sx={{
          height: "100vh",
          width: "300px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 3,
          px: 1,
          "& a": {
            textDecoration: "none",
            color: "inherit",
          },
        }}
      >
        <img src={NimbleLogo} alt="50" height="" width="125px" />
        <Divider orientation="horizontal" flexItem sx={{ my: 2 }} />
        <Box
          sx={{
            backgroundColor:
              mode === "dark" ? "#cddde9f9" : "rgba(0, 0, 0, 0.02)",
            width: "100%",
            textAlign: "center",
            // mb: 3,
            borderRadius: "5px",
            height: "50px",
            p: 2
          }}
        >
          <img src={Logoipsum} height="20px" />
        </Box>

        <List
          component="nav"
          aria-label="main dashboard"
          sx={{ width: "100%", mt: 5 }}
        >
          <Link to="/">
            {({ isActive }) => (
              <ListItemButton selected={isActive}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            )}
          </Link>
          <Link to="/reports">
            {({ isActive }) => (
              <ListItemButton selected={isActive}>
                <ListItemIcon>
                  <ReportIcon />
                </ListItemIcon>
                <ListItemText primary="Reports" />
              </ListItemButton>
            )}
          </Link>

          <Link to="/uploads">
            {({ isActive }) => (
              <ListItemButton selected={isActive}>
                <ListItemIcon>
                  <UploadIcon />
                </ListItemIcon>
                <ListItemText primary="Uploads" />
              </ListItemButton>
            )}
          </Link>
        </List>

        <IconButton
          sx={{
            mt: 10,
            SVG: {
              fill: "#349486",
            },
          }}
          onClick={toggleTheme}
          color="inherit"
        >
          {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      <Divider orientation="vertical" flexItem />
    </>
  );
}
