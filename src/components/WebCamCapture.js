// src/WebcamCapture.js
import React, { useRef, useCallback, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { checkActionByTheme } from "../actions/checkActionByTheme.js";
import Button from "@mui/material/Button";
const onSubmit = async () => {
  await fetch("https://izabellaaibackend-xisces6vkq-lm.a.run.app/email", {
    method: "POST",
    body: JSON.stringify({
      message: "A person drank water!",
      subject: "Notification about water",
      to: "mediavisionport@gmail.com",
    }),
  });
};

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [running, setRunning] = useState(true);

  const [language, setLanguage] = useState("en-EN");
  const [audioSrc, setAudioSrc] = useState(null);
  const [counter, setCounter] = useState({ water: 0, agitation: 0 });
  const handleReset = () => {
    setRunning((prev) => !prev);
  };
  const capture = useCallback(async () => {
    const tokenResp = await fetch(
      "https://izabellaaibackend-xisces6vkq-lm.a.run.app/auth-token",
      {
        method: "GET",
        origin: "https://fronteu-xisces6vkq-lm.a.run.app",
      }
    );
    const token = await tokenResp.json();
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      try {
        const props = {
          token,
          setAudioSrc,
          setCounter,

          language,
          counter,
          webcamRef,
        };
        if (counter.water === 2) {
          await onSubmit();
        }
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
    } else {
      handleReset();
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
          setRunning((prev) => !prev);
        }}
      >
        {language === "en-EN" ? "Сменить язык на Русский" : "Switch to English"}
      </Button>
      <Button
        onClick={() => {
          setRunning((prev) => !prev);
        }}
      >
        TOGGLE {running ? "OFF" : "ON"}
      </Button>
    </div>
  );
};

export default WebcamCapture;
