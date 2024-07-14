import React, { Component, useEffect, useState } from "react";

import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
const hoursArray = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
];
const minutesArray = ["00", "15", "30", "45"];

export const AlarmSettingsSelector = ({
  alarmName,
  setAlarmSchedule,
  alarmSchedule,
}) => {
  const [mode, setMode] = useState(alarmSchedule[alarmName].mode);
  let optionGroups = {};
  if (alarmSchedule[alarmName].mode === "hours") {
    optionGroups = {
      [mode]: hoursArray.map((i) => ({
        value: i,
        label: i,
      })),
    };
  } else if (alarmSchedule[alarmName].mode === "minutes") {
    optionGroups = {
      [mode]: minutesArray.map((i) => ({
        value: i,
        label: i,
      })),
    };
  } else if (alarmSchedule[alarmName].mode === "seconds") {
    optionGroups = {
      [mode]: minutesArray.map((i) => ({
        value: i,
        label: i,
      })),
    };
  }

  const handleChangeMode = (value) => {
    console.log("name", value.target.value);
    setMode(value.target.value);
    setAlarmSchedule((prev) =>
      Object.assign(
        {},
        {
          ...prev,
          [alarmName]: {
            value: prev[alarmName].value,
            mode: value.target.value,
          },
        }
      )
    );
  };

  // useEffect(() => {
  //   setMode(alarmSchedule[alarmName].mode);
  // }, [alarmSchedule[alarmName].mode]);
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <TextField value={alarmName} disabled></TextField>
      </Grid>
      <Grid item xs={4}>
        <TextField
          required
          onChange={(value) => {
            const newObject = Object.assign(
              {},
              {
                ...alarmSchedule,
                [alarmName]: {
                  value: value.target.value,
                  mode: alarmSchedule[alarmName].mode,
                },
              }
            );

            // delete newObject[alarmName];
            setAlarmSchedule(newObject);
          }}
          value={alarmSchedule[alarmName].value}
        ></TextField>
      </Grid>
      <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Repeat</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={alarmSchedule[alarmName].mode}
            label="Every"
            onChange={handleChangeMode}
          >
            <MenuItem value={"hours"}>Hours</MenuItem>
            <MenuItem value={"minutes"}>Minutes</MenuItem>
            <MenuItem value={"seconds"}>Seconds</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};
