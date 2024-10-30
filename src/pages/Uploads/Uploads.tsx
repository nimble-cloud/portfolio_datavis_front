import { useState, useEffect } from "react";

import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
// import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Snackbar from "@mui/material/Snackbar";

import CloudIcon from "@mui/icons-material/CloudUpload";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/ErrorOutline";
import axios from "axios";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const reports: string[] = ["Orders By ID"];
const xlType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

type RecentReport = {
  report: string;
  date: string;
  fileName: string;
  notes: string;
};

export default function Uploads() {

  const [activeReport, setActiveReport] = useState(reports[0]);
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [recentUploads, setRecentUploads] = useState<RecentReport[]>([]);

  useEffect(() => {
    axios
      .get<RecentReport[]>("/company/uploads")
      .then((res) => setRecentUploads(res.data));
  }, []);

  const [showAlert, setShowAlert] = useState("");
  const toggleAlert = () => setShowAlert("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4} md={3}>
        <List aria-label="report options">
          {reports.map((report) => (
            <ListItemButton
              key={report}
              selected={activeReport === report}
              onClick={() => setActiveReport(report)}
            >
              <ListItemText primary={report} />
            </ListItemButton>
          ))}
        </List>
      </Grid>

      <Grid item xs={12} sm={5} md={6}>
        <Paper
          elevation={3}
          sx={{ mt: 1, p: 2 }}
          component={"form"}
        // onSubmit={startUpload}
        >
          {/* {uploading ? (
            <>
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Uploading...
              </Typography>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <CircularProgress color="success" sx={{ mx: "auto" }} />
              </Box>
            </>
          ) : (
            <> */}
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            fullWidth
            startIcon={<CloudIcon />}
          >
            Upload file
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "90%",
              mt: 3,
              mx: "auto",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={5}>
                <TextField
                  id="file-name"
                  label="File Name"
                  variant="standard"
                  disabled
                  value={file?.name || "No file selected"}
                  sx={{ width: "100%" }}
                />
              </Grid>

              <Grid item xs={12} sm={5}>
                {file && (
                  <>
                    <Typography variant="h6">
                      {file && file.type === xlType ? (
                        <>
                          <CheckIcon
                            sx={{ fill: "green", mb: -0.5, mr: 1 }}
                          />
                          Good to go
                        </>
                      ) : (
                        <>
                          <ErrorIcon
                            sx={{ fill: "red", mb: -0.5, mr: 1 }}
                          />
                          Please upload an Excel Document
                        </>
                      )}
                    </Typography>
                    <Typography variant="h6">
                      <CheckIcon sx={{ fill: "green", mb: -0.5, mr: 1 }} />
                      File Size: {(file.size / 1000).toFixed(3)} kb
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>

            <TextField
              id="upload-date"
              label="Upload Date"
              variant="standard"
              disabled
              value={new Date().toLocaleDateString()}
              sx={{ my: 2 }}
            />

            <TextField
              id="upload-notes"
              label="Notes"
              variant="standard"
              multiline
              rows={4}
              inputProps={{
                maxLength: 1000,
              }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Box>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2, width: "80%", mx: "auto", display: "block" }}
            disabled
            type="submit"
          >
            Submit
          </Button>
          {/* </> */}
          {/* )} */}
        </Paper>
      </Grid>

      <Grid item xs={12} sm={3}>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Recent Uploads (past 50)
        </Typography>
        <Divider />
        {recentUploads.map((u, i) => (
          <Card key={u.fileName + i} sx={{ mt: 1 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {u.report}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {u.date}
              </Typography>
              <Typography variant="body1">{u.fileName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {u.notes}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Grid>

      <Snackbar
        open={showAlert !== ""}
        autoHideDuration={6000}
        onClose={toggleAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          Upload successful! {showAlert} rows added.
        </Alert>
      </Snackbar>
    </Grid>
  );
}
