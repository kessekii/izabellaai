import React, { useState } from "react";
import WebcamCapture from "./components/WebCamCapture";
import Button from "@mui/material/Button";
import {
  Switch,
  FormControlLabel,
  FormGroup,
  Typography,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  Box,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const actx = new AudioContext();

const App = () => {
  const [initializeSoundBoolean, setInitializeSoundBoolean] = useState(false);
  const [settings, setSettings] = useState({
    facerecognition: false,
    water: true,
    agitation: true,
    smoking: true,
    laughing: true,
    language: "en",
  });

  const initializeSound = async () => {
    await actx.resume();
    setInitializeSoundBoolean(true);
  };

  const SettingsComponent = () => {
    const handleToggle = (event) => {
      const { name, checked } = event.target;
      setSettings({
        ...settings,
        [name]: checked,
      });
    };

    const handleLanguageChange = (event) => {
      setSettings({
        ...settings,
        language: event.target.value,
      });
    };

    return (
      <Card sx={{ maxWidth: 600, margin: "20px auto", padding: "20px" }}>
        <CardHeader title="Settings" />
        <CardContent>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.facerecognition}
                      onChange={handleToggle}
                      name="facerecognition"
                    />
                  }
                  label="Face Recognition"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.water}
                      onChange={handleToggle}
                      name="water"
                    />
                  }
                  label="Water"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.agitation}
                      onChange={handleToggle}
                      name="agitation"
                    />
                  }
                  label="Agitation"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.smoking}
                      onChange={handleToggle}
                      name="smoking"
                    />
                  }
                  label="Smoking"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.laughing}
                      onChange={handleToggle}
                      name="laughing"
                    />
                  }
                  label="Laughing"
                />
              </Grid>
            </Grid>
          </FormGroup>
          <Box mt={2}>
            <Typography variant="body1">Language</Typography>
            <Select
              value={settings.language}
              onChange={handleLanguageChange}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="ru">Russian (ru-RU)</MenuItem>
              <MenuItem value="en">English (en-EN)</MenuItem>
              {/* Add more language options as needed */}
            </Select>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <Typography variant="h4" gutterBottom>
          Webcam Capture App
        </Typography>
      </header>

      {initializeSoundBoolean && <WebcamCapture settings={settings} />}
      <Button
        variant="contained"
        color="primary"
        onClick={initializeSound}
        sx={{ margin: "20px" }}
      >
        Start
      </Button>
      <SettingsComponent />
    </div>
  );
};

export default App;
