import React, { useState } from "react";
import WebcamCapture from "./components/WebCamCapture";
import Button from "@mui/material/Button";
const actx = new AudioContext();
function App() {
  const [initializeSoundBoolean, setInitializeSoundBoolean] = useState(false);
  const initializeSound = async () => {
    await actx.resume();
    setInitializeSoundBoolean(true);
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>Webcam Capture App</h1>
      </header>

      {initializeSoundBoolean && <WebcamCapture />}
      <Button
        onClick={() => {
          initializeSound();
        }}
      >
        Initialize Sound
      </Button>
    </div>
  );
}

export default App;
