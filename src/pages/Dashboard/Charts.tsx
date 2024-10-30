import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";

import StateSelector from "./StateSelector";
import { drawRevByState } from "./draw";
import type { Revenue, RevenueByState, RevMap, SortTypes } from "./types";

import axios from "axios";

const RevByMonth = () => {

  const [loadingRevByState, setLoadingRevByState] = useState(true);
  const [loadingState, setLoadingState] = useState(false);

  const [rev, setRev] = useState<Revenue>({
    monthKeys: [],
    rev: {},
  });

  const [customerSortType, setCustomerSortType] = useState<SortTypes | "">("");
  const updateType = (t: "bulk" | "sort") => {
    if (customerSortType === t) {
      setCustomerSortType("");
      drawRevByState(activeStates, rev, ["bulk", "sort"]);
    } else {
      setCustomerSortType(t);
      drawRevByState(activeStates, rev, [t]);
    }
  };

  const [states, setStates] = useState<string[]>([]);
  const [activeStates, setActiveStates] = useState<string[]>([]);
  const selectStates = async (s: string[]) => {
    const curLen = activeStates.length;

    setActiveStates(s);

    const constSorts: SortTypes[] = ["bulk", "sort"];
    const sorts: SortTypes[] = [];
    if (customerSortType === "") {
      sorts.push("bulk");
      sorts.push("sort");
    } else {
      sorts.push(customerSortType);
    }
    // Need to get the revenue for this state. Then need to compare it's revenue against all other active
    // states. All revenue must match 1 : 1 for number of months. ie each data set must have a 202301 if just
    // one of the datasets have it.
    if (curLen < s.length) {
      let newRev: Revenue = {
        monthKeys: [],
        rev: {},
      };

      if (!rev.rev[s[s.length - 1]]) {
        setLoadingState(true);
        // only get the new state if we dont yet have it and are selecting a new state
        const { data } = await axios.get<RevenueByState[]>(
          "/company/rev/" + s[s.length - 1]
        );

        const min = data[0].month;
        const max = data[data.length - 1].month;
        const bulk: RevMap = {};
        const sort: RevMap = {};
        data.forEach((i) => {
          const sortType = i.sortType.toLowerCase();
          if (sortType === "sort") {
            sort[i.month] = {
              r: i.revenue,
              t: "sort",
            };
          } else {
            bulk[i.month] = {
              r: i.revenue,
              t: "bulk",
            };
          }
        });

        newRev = {
          ...rev,
          rev: {
            ...rev.rev,
            [s[s.length - 1]]: {
              minMonth: min,
              maxMonth: max,
              rev: {
                bulk,
                sort,
              },
              // r,
            },
          },
        };
      } else {
        newRev = { ...rev };
      }
      // all possible states revenue should be loaded by now. Need to go through each and verify they are all the same length and have the same values
      // now need to veryify they are all both the same length and have an equal number of months.

      const states = Object.keys(newRev.rev);
      let minMonth = 400000;
      let maxMonth = 0;
      let expectedDataSetLen = 0;
      states.forEach((i) => {
        const state = newRev.rev[i];
        if (state.minMonth < minMonth) {
          // this is the state with the earliest Date
          minMonth = state.minMonth;
        }

        if (state.maxMonth > maxMonth) {
          // this state has the lastest Date
          maxMonth = state.maxMonth;
        }

        if (Object.keys(state.rev).length > expectedDataSetLen) {
          expectedDataSetLen = Object.keys(state.rev).length;
        }
      });

      if (states.length > 0) {
        // fill in any possible gaps if there are multiple states
        // and also 0 out the items that are not the correct sort type
        states.forEach((i) => {
          const state = newRev.rev[i];
          state.minMonth = minMonth;
          state.maxMonth = maxMonth;

          const minString = minMonth.toString();
          let monthCount = parseInt(minString.slice(4));
          // 202301 - 202405 = 14 months
          // where month count = 12 increase the year by one by adding 100 to the count

          constSorts.forEach((sort) => {
            for (let j = minMonth; j <= maxMonth;) {
              const s = state.rev[sort][j];
              if (s === undefined) {
                // this is a month of revenue that another state has but this one does not.
                // set it to 0
                state.rev[sort][j] = {
                  r: 0,
                  t: sort,
                };
              }

              newRev.monthKeys.push(minMonth);

              if (monthCount === 12) {
                j = j + 89; // 202312 + 100 = 202412 - 11 = 202401 = 100 - 11 = 89
                monthCount = 1;
              } else {
                j++;
                monthCount++;
              }
              minMonth = j;
            }
            // reset the min month
            minMonth = state.minMonth;

            monthCount = parseInt(minMonth.toString().slice(4));
          });
        });
      }
      newRev.monthKeys = [...new Set(newRev.monthKeys)];

      setLoadingState(false);
      setRev(newRev);
      drawRevByState(s, newRev, sorts);
      return;
    }

    drawRevByState(s, rev, sorts);
  };

  useEffect(() => {
    let s: string[] = [];

    // states should be cleared if the user uploads a new report
    const localStates = sessionStorage.getItem("states")
    if (localStates) {

      s = JSON.parse(localStates) as string[];
      setStates(s);
      setLoadingRevByState(false);
    } else {

      axios.get<string[]>("/company/rev/states").then((res) => {
        s = res.data
        setStates(s);
        setLoadingRevByState(false);
        sessionStorage.setItem("states", JSON.stringify(s))
      })
    }
  }, []);

  return (
    <>
      <Grid container spacing={0} sx={{ mt: 5, width: "90%", mx: "auto" }}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
            }}
          >
            <Typography
              variant="body1"
              color="#666"
              sx={{ textAlign: "center", fontWeight: 600, fontSize: 25 }}
            >
              Revenue by State
            </Typography>
            <ButtonGroup
              disableElevation
              variant="outlined"
              aria-label="Disabled button group"
            >
              <Button
                variant={customerSortType === "bulk" ? "contained" : "outlined"}
                onClick={() => updateType("bulk")}
              >
                Bulk
              </Button>
              <Button
                variant={customerSortType === "sort" ? "contained" : "outlined"}
                onClick={() => updateType("sort")}
              >
                Sort
              </Button>
            </ButtonGroup>
            {loadingRevByState ? (
              <LinearProgress color="secondary" sx={{ width: "50%", mt: 1 }} />
            ) : (
              <StateSelector

                loadingState={loadingState}
                states={states}
                activeStates={activeStates}
                rev={rev}
                selectStates={selectStates}
              />
            )}
          </Box>
          {loadingRevByState && <CircularProgress />}
          <canvas id="revByMonth"></canvas>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ maxHeight: "1000px", width: "800px", mx: "auto" }}>
            <canvas id="topTen"></canvas>
          </Box>
        </Grid>
      </Grid>
      <Divider orientation="horizontal" flexItem sx={{ my: 2 }} />
    </>
  );
};

export default RevByMonth;
