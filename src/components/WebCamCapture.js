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

import Button from "@mui/material/Button";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

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

const WebcamCapture = (setting) => {
  const { language, facerecognition, water, agitation, smoking, laughing } =
    setting.settings;
  const webcamRef = useRef(null);
  const [running, setRunning] = useState(true);

  const [actionFinState, setActionFinState] = useState("");

  const [audioSrc, setAudioSrc] = useState(null);
  const [blocker, setBlocker] = useState(false);
  const [audioData, setAudioData] = useState("");
  const [counter, setCounter] = useState({ water: 0, agitation: 0 });

  // const handleReset = () => {
  //   setRunning((prev) => !prev);
  // };
  useEffect(() => {
    if (audioData) {
      let audio = new Audio(audioData);
      audio.play();
    }
  }, [audioData]);
  const handleSetAudioSrc = async (audioSrc) => {
    if (!blocker) {
      setBlocker(false);
      setAudioSrc(audioSrc);
      // while (blocker) {
      //   await new Promise((resolve) => setTimeout(resolve, 500));
      // }
    }
  };

  const capture = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const token =
      "AAAAAAAAAAAAAAAAAAAAAMLheAAAAAAA0%2BuSeid%2BULvsea4JtiGRiSDSJSI%3DEUifiRBkKG5E2XzMDjRfl76ZC9Ub0wnz4XsNiRVBChTYbJcE3F";
    const imageSrc = webcamRef.current.getScreenshot({
      width: 200,
      hight: 149.9213,
    });
    if (imageSrc && running && !blocker) {
      try {
        const props = {
          token: token,
          handleSetAudioSrc: handleSetAudioSrc,
          setCounter: setCounter,
          setBlocker: setBlocker,
          language: language,
          counter: counter,
          webcamRef: webcamRef,
          setActionFinState: setActionFinState,
        };
        if (facerecognition) {
          await checkFaceRecognition(props, {
            theme: "facerecognition",
            isNoUsed: false,
            isCountered: false,

            index: 0,
          });
          await new Promise((resolve) => setTimeout(resolve, 2000));
          await checkFaceRecognition(props, {
            theme: "facerecognition",
            isNoUsed: false,
            isCountered: false,

            index: 1,
          });
          await new Promise((resolve) => setTimeout(resolve, 2000));
          await checkFaceRecognition(props, {
            theme: "facerecognition",
            isNoUsed: false,
            isCountered: false,

            index: 2,
          });
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        if (counter.water === 2) {
          await onSubmit();
        }
        if (water) {
          await checkActionByTheme(props, {
            theme: "water",
            isNoUsed: true,
            isCountered: true,
            maxCounter: 3,
          });
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        if (laughing) {
          await checkActionByTheme(props, {
            theme: "laughing",
            isNoUsed: false,
            isCountered: false,
          });
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        if (smoking) {
          await checkActionByTheme(props, {
            theme: "smoking",
            isNoUsed: false,
            isCountered: false,
          });
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        if (agitation) {
          await checkActionByTheme(props, {
            theme: "agitation",
            isNoUsed: false,
            isCountered: false,
          });
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        // setFrameCount((prev) => prev + 1);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }
  }, [blocker, counter]);

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
            // setBlocker(false);
          }}
        />
      </Paper>
    );
  }, [audioSrc]);
  return (
    <div>
      <Typography>{actionFinState}</Typography>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="300px"
        height="250px"
      />

      {AudioGonevo}
    </div>
  );
};

export default WebcamCapture;
