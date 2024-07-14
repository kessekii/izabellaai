import React, { useState, useEffect, useMemo } from "react";
import WebcamCapture from "./components/WebCamCapture";
import Button from "@mui/material/Button";
import {
  Switch,
  FormControlLabel,
  FormGroup,
  FormControl,
  InputLabel,
  Typography,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Box,
  Grid,
  ButtonBase,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { MuiChipsInput } from "mui-chips-input";
import { AlarmSettingsSelector } from "../src/components/AlarmSettingsSelector";
import SelectInput from "@mui/material/Select/SelectInput";
import { phraseDataBase } from "./data/phraseDataBase";

import { createTheme, ThemeProvider } from "@mui/material/styles";
const actx = new AudioContext();

// Define light and dark themes
const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
const App = ({ themeref }) => {
  const [initializeSoundBoolean, setInitializeSoundBoolean] = useState(false);
  const [settings, setSettings] = useState({
    language: "ru",
    mode: "scheduler",
  });
  const [alarmsChips, setAlarmsChips] = useState(["drinking"]);
  const [alarmSchedule, setAlarmSchedule] = useState({
    drinking: { value: "1", mode: "hours" },
  });

  const [isDarkMode, setIsDarkMode] = useState(true);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    themeref = !isDarkMode;
    const toggle = document.querySelector("#toggle");
    toggle.toggleTheme();
  };
  const theme = isDarkMode ? darkTheme : lightTheme;
  // Use effect to apply or remove dark mode

  const initializeSound = async () => {
    await actx.resume();
    setInitializeSoundBoolean(true);
  };
  const ChipInput = () => {
    const handleChange = (newChip) => {
      console.log("newChip", newChip);
      setAlarmsChips(newChip);
      const newObj = Object.assign(
        {},
        {
          ...alarmSchedule,
          [newChip[newChip.length - 1]]: { value: "1", mode: "hours" },
        }
      );
      Object.keys(newObj).forEach((key) => {
        if (!newChip.includes(key)) delete newObj[key];
      });

      setAlarmSchedule(newObj);
    };

    return (
      <MuiChipsInput
        value={alarmsChips}
        onChange={(value) => handleChange(value)}
      />
    );
  };
  const SettingsComponent = () => {
    const handleModeChange = (event) => {
      setSettings(() => {
        return Object.assign(
          {},
          {
            ...settings,
            mode: event.target.value,
          }
        );
      });
    };

    const handleLanguageChange = (event) => {
      setSettings(() => {
        return Object.assign(
          {},
          {
            ...settings,
            language: event.target.value,
          }
        );
      });
    };

    const alarmsGridComponents = Object.keys(alarmSchedule).map(
      (alarmObj, i) => {
        console.log("alarmName", alarmObj);
        return (
          <Paper theme={theme} key={"alarmgrid" + i}>
            {alarmSchedule[alarmObj].value + " " + alarmSchedule[alarmObj].mode}
            <AlarmSettingsSelector
              alarmName={alarmObj}
              setAlarmSchedule={setAlarmSchedule}
              alarmSchedule={alarmSchedule}
            ></AlarmSettingsSelector>
          </Paper>
        );
      }
    );

    return (
      <Grid container>
        <ButtonBase onClick={toggleDarkMode}>
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </ButtonBase>
        <Grid item xs={3}>
          <Typography fontSize={20} paddingInline={"5vw"}>
            {phraseDataBase[settings.language].misc[settings.mode]}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{ maxWidth: 600, margin: "20px auto", padding: "20px" }}>
            <CardHeader title="Settings" />
            <CardContent>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Mode selection
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={settings.mode}
                  label="Mode"
                  onChange={handleModeChange}
                >
                  <MenuItem value={"generation"}>
                    Generation (
                    {settings.language === "ru"
                      ? "Генерация"
                      : settings.language === "he"
                        ? "דוֹר"
                        : ""}{" "}
                    )
                  </MenuItem>
                  <MenuItem value={"scheduler"}>
                    Scheduler (
                    {settings.language === "ru"
                      ? "Расписание"
                      : settings.language === "he"
                        ? "מְתַזֵּמֵן"
                        : ""}{" "}
                    )
                  </MenuItem>
                  <MenuItem value={"monotone"}>
                    Monotone (
                    {settings.language === "ru"
                      ? "Монотонный"
                      : settings.language === "he"
                        ? "מוֹנוֹטוֹן"
                        : ""}{" "}
                    )
                  </MenuItem>
                </Select>
              </FormControl>

              <Box mt={2}>
                {settings.mode === "scheduler" && <ChipInput></ChipInput>}
                <Typography variant="body1">Language</Typography>
                <Select
                  value={settings.language}
                  onChange={handleLanguageChange}
                  fullWidth
                  variant="outlined"
                >
                  <MenuItem value="ru">Russian (ru-RU)</MenuItem>
                  <MenuItem value="en">English (en-EN)</MenuItem>
                  <MenuItem value="he">Hebrew (he-IL)</MenuItem>
                </Select>
              </Box>

              {settings.mode === "scheduler" && alarmsGridComponents}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Typography gutterBottom theme={theme}>
        Webcam Capture App
      </Typography>

      {initializeSoundBoolean && (
        <WebcamCapture
          settings={settings}
          alarmSchedule={alarmSchedule}
          theme={theme}
        />
      )}
      {!initializeSoundBoolean && (
        <Paper>
          <Button
            variant="contained"
            color="primary"
            onClick={initializeSound}
            sx={{ margin: "20px" }}
          >
            BEGIN
          </Button>
          <SettingsComponent />
        </Paper>
      )}
    </ThemeProvider>
  );
};

export default App;
