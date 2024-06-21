// src/WebcamCapture.js
import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import Webcam from "react-webcam";
import { checkFaceRecognition } from "../actions/checkFaceRecognition.js";
import { checkActionByTheme } from "../actions/checkActionByTheme.js";
import combineImages from "../actions/combinePhotos";

import Button from "@mui/material/Button";
import Text from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
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
  const [frameCount, setFrameCount] = useState(0);
  const [language, setLanguage] = useState("ru-RU");
  const [audioSrc, setAudioSrc] = useState(null);
  const [blocker, setBlocker] = useState(false);
  const [playstart, setPlaystart] = useState(false);
  const [counter, setCounter] = useState({ water: 0, agitation: 0 });
  const [toggleFreeToCheck, setToggleFreeToCheck] = useState(false);
  // const handleReset = () => {
  //   setRunning((prev) => !prev);
  // };
  const handleReset = () => {
    setRunning((prev) => !prev);
  };
  const handleSetAudioSrc = async (audioSrc) => {
    if (!blocker) {
      setBlocker(true);
      setAudioSrc(audioSrc);
      while (blocker) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
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
    if (imageSrc && running && !blocker) {
      try {
        const props = {
          token,
          handleSetAudioSrc,
          setCounter,
          setBlocker,
          language,
          counter,
          webcamRef,
        };

        // await checkFaceRecognition(props, {
        //   theme: "facerecognition",
        //   isNoUsed: false,
        //   isCountered: false,
        //   maxCounter: 3,
        //   index: 0,
        // });
        // await checkFaceRecognition(props, {
        //   theme: "facerecognition",
        //   isNoUsed: false,
        //   isCountered: false,
        //   maxCounter: 3,
        //   index: 1,
        // });
        // await checkFaceRecognition(props, {
        //   theme: "facerecognition",
        //   isNoUsed: false,
        //   isCountered: false,
        //   maxCounter: 3,
        //   index: 2,
        // });
        setBlocker(false);
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
          theme: "laughing",
          isNoUsed: false,
          isCountered: false,
        });

        await checkActionByTheme(props, {
          theme: "smoking",
          isNoUsed: false,
          isCountered: false,
        });

        await checkActionByTheme(props, {
          theme: "agitation",
          isNoUsed: false,
          isCountered: false,
        });

        // setFrameCount((prev) => prev + 1);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }
  }, [language, blocker, counter]);

  useEffect(() => {
    const runRepeatedFunction = async () => {
      try {
        while (running) {
          await capture();
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    return () => runRepeatedFunction();
  }, [running]);
  const AudioGonevo = useMemo(() => {
    return (
      <Paper>
        <audio
          src={audioSrc}
          autoPlay
          onEnded={() => {
            setBlocker(false);
          }}
        />
      </Paper>
    );
  }, [audioSrc]);
  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
        height="auto"
      />

      {AudioGonevo}
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
