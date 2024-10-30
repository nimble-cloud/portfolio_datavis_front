import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import CircularProgress from "@mui/material/CircularProgress";

import axios from "axios";
import type { Report } from "./types";

async function getReport(path: string, name: string) {
  try {
    const { data, headers } = await axios.post<string>(
      `/company/report`,
      {
        path,
      },
      {
        responseType: "arraybuffer",
      }
    );

    //data is a csv string being streamed from the server
    const blob = new Blob([data], { type: headers["content-type"] });
    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.setAttribute("download", name + ".csv");
    downloadLink.click();

    // Clean up the temporary URL object
    window.URL.revokeObjectURL(downloadLink.href);
    return;
  } catch (err) {
    console.error(err);
  }
}

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [reportList, setReportList] = useState<Report[]>([]);
  useEffect(() => {
    axios.get<Report[]>("/company/reports").then((res) => {
      setReportList(res.data);
      setLoading(false);
    });
  }, []);

  const [fetching, setFetching] = useState("");
  const handleGetReport = async (path: string, name: string) => {
    setFetching(name);
    await getReport(path, name);
    setFetching("");
  };
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [desc, setDesc] = useState("");
  const showDesc = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    desc: string
  ) => {
    setDesc(desc);
    setAnchorEl(e.currentTarget);
  };

  const hideDesc = () => {
    setAnchorEl(null);
    setDesc("");
  };

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <List sx={{ width: "300px", height: "100%" }}>
          {reportList.map((i) => (
            <ListItemButton
              key={i.path}
              onClick={() => handleGetReport(i.path, i.name)}
              aria-haspopup="true"
              onMouseEnter={(e) => showDesc(e, i.note)}
              onMouseLeave={hideDesc}
            >
              <ListItemText primary={i.name} />
            </ListItemButton>
          ))}
        </List>
      )}
      <Divider orientation="vertical" flexItem />
      <Box
        sx={{
          width: "100%",
          height: "20%",
          display: "grid",
          placeItems: "center",
        }}
      >
        {fetching && (
          <>
            <Typography variant="h6" sx={{ "& b": { color: "primary.main" } }}>
              Fetching Report <b>{fetching}</b>
            </Typography>
            <CircularProgress />
          </>
        )}
      </Box>
      <Popover
        open={desc !== ""}
        anchorEl={anchorEl}
        onClose={hideDesc}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        sx={{
          pointerEvents: "none",
        }}
      >
        <Typography sx={{ p: 2 }}>{desc}</Typography>
      </Popover>
    </Box>
  );
}
