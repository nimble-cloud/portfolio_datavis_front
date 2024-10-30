import { useState, useContext } from "react";

import { red } from "@mui/material/colors";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import NimbleLogo from "../assets/nimble_cloud_logo_original.webp";
import { AuthCtx } from "./context";

export default function SignIn() {
  const auth = useContext(AuthCtx);
  const [error, setError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState<boolean>(false);

  const startErr = (err: string) => {
    setError(err);
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoggingIn(true);
    const err = await auth.logIn();
    setLoggingIn(false);

    if (err) {
      startErr("Invalid email or password");
    } else {
      startErr("An Error Occured");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img src={NimbleLogo} alt="50" width="150px" />
        <Avatar sx={{ m: 1, mt: 3, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {loggingIn ? (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <CircularProgress variant="indeterminate" color="primary" />
            </Box>
          ) : (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, width: "200px" }}
            >
              Sign In
            </Button>
          )}
        </Box>
        {error && (
          <Alert
            severity="error"
            sx={{
              width: "100%",
              mt: 2,
              backgroundColor: red[100],
              color: red[800],
            }}
          >
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
}
