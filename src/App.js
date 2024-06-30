import React from "react";
import WebcamCapture from "./components/WebCamCapture";
import Button from "@mui/material/Button";

function App() {
  // const initializeSound = () => {
  //   actx.resume().then(() => {
  //     console.log("Playback resumed successfully");
  //   });
  // };
  return (
    <div className="App">
      <header className="App-header">
        <h1>Webcam Capture App</h1>
      </header>

      <WebcamCapture />
      {/* <Button
        onClick={() => {
          initializeSound();
        }}
      >
        Initialize Sound
      </Button> */}
    </div>
  );
}

export default App;
