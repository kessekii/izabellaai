// src/WebcamCapture.js
import React, { useRef, useCallback, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { checkActionByTheme } from "../actions/checkActionByTheme.js";
import Button from "@mui/material/Button";
const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [running, setRunning] = useState(true);

  const [startTime, setStartTime] = useState(performance.now());
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
          setStartTime,
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

        await checkActionByTheme(props, {
          theme: "smoking",
          isNoUsed: false,
          isCountered: false,
        });

        const endTime = performance.now();
        setStartTime(() => endTime);
        console.log("Total time: ", endTime - startTime);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }
  }, [webcamRef, language, counter]);

  useEffect(() => {
    let isMounted = true;

    const runRepeatedFunction = async () => {
      while (isMounted) {
        await capture();
      }
    };

    if (running) {
      runRepeatedFunction();
    }

    return () => {
      isMounted = false; // Cleanup to prevent memory leaks
    };
  }, [running]);

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
        {language === "en-EN" ? "Сменить язык на Русский" : "Switch to English"}
      </Button>
    </div>
  );
};

export default WebcamCapture;
