import { useState, useEffect, memo } from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

import UserImg from "../../assets/ic_glass_users.png";
import CartImg from "../../assets/ic_glass_buy.png";
import BagImg from "../../assets/ic_glass_bag.png";

import type { Metrics } from "./types";
import { drawTopTen } from "./draw";

import axios from "axios";

const imergers = {
  usr: UserImg,
  cart: CartImg,
  bag: BagImg,
};

function MetricBox({
  title,
  metric,
  includeDollar,
  img,
}: {
  title: string | undefined;
  metric: number | string | undefined;
  includeDollar?: boolean;
  img: "usr" | "cart" | "bag";
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        px: 2,
        py: 3,
        height: "150px",
        borderRadius: "20px",
        color: "text.secondary",
        display: "flex",
        alignItems: "center",
        boxShadow: "0px 10px 45px rgba(0, 0, 0, 0.15)",
        width: "100%",
      }}
    >
      <img src={imergers[img]} alt="users" height="75px" />
      <Box sx={{ ml: 3, width: "100%" }}>
        {title && metric ? (
          <>
            <Typography variant="h4">
              {includeDollar ? "$" : ""}
              {metric}
            </Typography>
            <Typography variant="body1">{title}</Typography>
          </>
        ) : (
          <>
            <Skeleton animation="wave" height={20} width="80%" />
            <Skeleton
              animation="wave"
              height={50}
              width="80%"
              style={{ marginBottom: 6 }}
            />
          </>
        )}
      </Box>
    </Paper>
  );
}

const Metrics = memo(() => {
  const [metrics, setMetrics] = useState<Metrics>({
    avgOrderSize: 0,
    newCustomers: 0,
    topCustomer: "",
    topTen: [],
  });

  useEffect(() => {
    let mets = {} as Metrics

    // are the metrics in session storage already
    // this cache is cleared if the user uploads a new file
    const localMets = sessionStorage.getItem("metrics")
    if (localMets) {
      mets = JSON.parse(localMets) as Metrics
      setMetrics(mets);
      drawTopTen(mets.topTen)
    } else {
      axios.get<Metrics>("/company/dashboard").then((res) => {
        mets = res.data
        setMetrics(mets);
        drawTopTen(mets.topTen)
        sessionStorage.setItem("metrics", JSON.stringify(mets))
      })
    }

    // clear the session storage on refresh
    window.addEventListener("beforeunload", function () {
      sessionStorage.clear()
    });
  }, [])


  return (
    <Grid container spacing={1} sx={{}}>
      <Grid item xs={12} md={6} lg={4}>
        <MetricBox
          title="New Customers"
          metric={metrics.newCustomers}
          img="usr"
        />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <MetricBox
          title="Average Order Size"
          metric={metrics.avgOrderSize}
          includeDollar
          img="cart"
        />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <MetricBox
          title="Top Customer"
          metric={metrics.topCustomer}
          img="bag"
        />
      </Grid>
    </Grid>
  );
})

export default Metrics;