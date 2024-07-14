// src/WebcamCapture.js
import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import Webcam from "react-webcam";

import Button from "@mui/material/Button";
import { getSentence, resizeImage } from "../actions/helpers.js";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Recorder from "./Recorder.js";
import { checkFaceRecognition } from "../actions/checkFaceRecognition.js";
import { checkAnalyzeMoment } from "../actions/checkAnalyzeMoment.js";
import { checkActionByTheme } from "../actions/checkActionByTheme.js";
import { scheduler_data } from "./Scheduler.js";
import { phraseDataBase } from "../data/phraseDataBase.js";
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

const WebcamCapture = (setting, alarmSchedule, theme) => {
  const { language, mode } = setting.settings;
  const webcamRef = useRef(null);
  const [running, setRunning] = useState(true);

  const [actionFinState, setActionFinState] = useState("");

  const [audioSrc, setAudioSrc] = useState(null);
  const [blocker, setBlocker] = useState(false);

  const [counter, setCounter] = useState({ water: 0, agitation: 0 });
  const [transcribedText, setTranscribedText] = useState("");

  // const handleReset = () => {
  //   setRunning((prev) => !prev);
  // };

  const handleSetAudioSrc = async (audioSrc) => {
    if (!blocker) {
      setBlocker(true);
      setAudioSrc(audioSrc);
      // while (blocker) {
      //   await new Promise((resolve) => setTimeout(resolve, 500));
      // }
    }
  };
  let arrayOfTasks = [];
  const capture = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc && running && !blocker && mode === "generation") {
      try {
        const props = Object.assign(
          {},
          {
            handleSetAudioSrc: handleSetAudioSrc,
            setCounter: setCounter,
            setBlocker: setBlocker,
            language: language,
            counter: counter,
            webcamRef: webcamRef,
            setActionFinState: setActionFinState,
          }
        );

        await checkFaceRecognition(props);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await checkAnalyzeMoment(props);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await checkAnalyzeMoment(props);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await checkAnalyzeMoment(props);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await checkAnalyzeMoment(props);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await checkAnalyzeMoment(props);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    } else if (imageSrc && running && !blocker && mode === "scheduler") {
      try {
        console.log("scheduler");
        const props = Object.assign(
          {},
          {
            webcamRef: webcamRef,
            language: language,
            setActionFinState: setActionFinState,

            isNoUsed: true,
            handleSetAudioSrc: handleSetAudioSrc,
            setBlocker: setBlocker,
          }
        );
        for (let schedule of Object.keys(alarmSchedule)) {
          scheduler_data(
            alarmSchedule[schedule].value,
            alarmSchedule[schedule].mode,
            checkActionByTheme,
            { ...props, theme: schedule },
            0
          );
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    } else if (imageSrc && running && !blocker && mode === "monotone") {
      try {
        await checkActionByTheme({
          webcamRef: webcamRef,
          setActionFinState: setActionFinState,
          theme: "drinking",
          isNoUsed: true,
          language: language,
          setBlocker: setBlocker,
          handleSetAudioSrc: handleSetAudioSrc,
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await checkActionByTheme({
          webcamRef: webcamRef,
          setActionFinState: setActionFinState,
          theme: "smoking",
          isNoUsed: false,
          language: language,
          setBlocker: setBlocker,
          handleSetAudioSrc: handleSetAudioSrc,
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await checkActionByTheme({
          webcamRef: webcamRef,
          setActionFinState: setActionFinState,
          theme: "agitated",
          isNoUsed: false,
          language: language,
          setBlocker: setBlocker,
          handleSetAudioSrc: handleSetAudioSrc,
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await checkActionByTheme({
          webcamRef: webcamRef,
          setActionFinState: setActionFinState,
          theme: "laughing",
          isNoUsed: false,
          language: language,
          setBlocker: setBlocker,
          handleSetAudioSrc: handleSetAudioSrc,
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }
  }, [blocker, counter, language, running, webcamRef]);

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
      <Typography>{actionFinState}</Typography>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
        height="auto"
      />

      {AudioGonevo}
      <Recorder
        setTranscribedText={setTranscribedText}
        language={language}
        handleSetAudioSrc={handleSetAudioSrc}
        setBlocker={setBlocker}
      ></Recorder>
    </div>
  );
};

export default WebcamCapture;
