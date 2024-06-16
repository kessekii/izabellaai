// src/WebcamCapture.js
import React, { useRef, useCallback, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { checkActionByTheme } from "../actions/checkActionByTheme.js";
import Button from "@mui/material/Button";
const WebcamCapture = () => {
  const webcamRef = useRef(null);

  const [language, setLanguage] = useState("en-EN");
  const [audioSrc, setAudioSrc] = useState(null);
  const [counter, setCounter] = useState({ water: 0, agitation: 0 });
  const capture = useCallback(async () => {
    const tokenResp = await fetch(
      "https://backend-xisces6vkq-uc.a.run.app/auth-token",
      {
        method: "GET",
      }
    );
    const token = await tokenResp.json();
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      try {
        const props = {
          imageSrc,
          token,
          setAudioSrc,
          setCounter,
          language,
          counter,
        };

        await checkActionByTheme(props, {
          theme: "water",
          isNoUsed: true,
          isCountered: true,
          maxCounter: 3,
        });

        await checkActionByTheme(props, {
          theme: "agitation",
          isNoUsed: false,
          isCountered: false,
        });
        await checkActionByTheme(props, {
          theme: "laughing",
          isNoUsed: false,
          isCountered: false,
        });
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }
  }, [webcamRef, language, counter]);

  useEffect(() => {
    const interval = setInterval(capture, 5000);
    return () => clearInterval(interval);
  }, [capture, language, counter]);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
        height="auto"
      />

      {audioSrc && <audio autoPlay src={audioSrc}></audio>}
      <Button
        onClick={() => {
          setLanguage((prev) => {
            if (prev === "en-EN") {
              return "ru-RU";
            } else {
              return "en-EN";
            }
          });
        }}
      >
        {language + "   " + counter}
      </Button>
    </div>
  );
};

export default WebcamCapture;
