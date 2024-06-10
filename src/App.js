import React, { useState } from "react";
import WebcamCapture from "./WebCamCapture";

function App() {
  const [answer, setAnswer] = useState("no");
  return (
    <div className="App">
      <header className="App-header">
        <h1>Webcam Capture App</h1>
      </header>
      <WebcamCapture setAnswer={setAnswer} />
    </div>
  );
}

export default App;
