import { memo } from "react";

import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import CircularProgress from "@mui/material/CircularProgress";
import type { Revenue } from "./types";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type Props = {
  loadingState: boolean;
  states: string[];
  activeStates: string[];
  rev: Revenue;
  selectStates: (s: string[]) => Promise<void>
}

const StateSelector = memo(({ loadingState, states, activeStates, selectStates }: Props) => {
  return (
    <>
      {loadingState && <CircularProgress />}
      <Autocomplete
        disabled={loadingState}
        multiple
        id="state-selector"
        options={states}
        disableCloseOnSelect
        getOptionLabel={(option) => option}
        value={activeStates}
        onChange={(_e, v) => {
          selectStates(v);
        }}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              key={option}
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option}
          </li>
        )}
        style={{ width: "70%" }}
        renderInput={(params) => (
          <TextField {...params} label="States" placeholder="States" />
        )}
      />
    </>
  );
});

export default StateSelector;
