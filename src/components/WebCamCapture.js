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
  const [audioRecordData, setAudioRecordData] = useState("");
  const [counter, setCounter] = useState({ water: 0, agitation: 0 });

  const checkFaceRecognition = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const image = await resizeImage(imageSrc);
    console.log("Fetching person images...");
    // const resp = await fetch(
    //   "https://izabellaaibackend-xisces6vkq-lm.a.run.app/get-persons",
    const cropPayload = {
      image: image.split(",")[1],
    };

    const cropResponce = await fetch("https://85.65.185.254/facecrop", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(cropPayload),
    });
    const responseData = (await cropResponce.json()).image;

    const payloadObj = {
      image: responseData,
    };

    const compareResponce = await fetch("https://85.65.185.254/recognize", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payloadObj),
    });

    if (!compareResponce.ok) {
      setActionFinState(() => "theme : " + "facerecognition" + " error");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      throw new Error("Network response was not ok");
    }

    const answer = (await compareResponce.json()).answer;

    console.log(answer, counter);
    if (answer !== "no") {
      if (
        (counter && !counter[answer]) ||
        (counter[answer] && counter[answer] === 0)
      ) {
        const newCounter = Object.assign({}, { ...counter, [answer]: 2 });
        console.log("newCounter", newCounter);
        setCounter(newCounter);
        const audioUrl = await getSentence(
          "facerecognition",
          language,
          answer,
          handleSetAudioSrc
        );
        handleSetAudioSrc(audioUrl);
      } else {
        setCounter(
          Object.assign({}, { ...counter, [answer]: counter[answer] - 1 })
        );
      }
    }
    setActionFinState(
      () =>
        "theme : " +
        "facerecognition" +
        " succeded: " +
        answer +
        ": " +
        counter[answer]
    );
  }, [counter, language]);

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
  const checkAnalyzeMoment = useCallback(async () => {
    try {
      let imageSrc = webcamRef.current.getScreenshot();

      let response;
      const resizedImage = await resizeImage(imageSrc);
      const payloadObj = {
        image: resizedImage.split(",")[1],
      };

      const payload = JSON.stringify(payloadObj);

      response = await fetch("https://85.65.185.254/analyzeMoment", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: payload,
      });

      if (!response.ok) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        throw new Error("Network response was not ok");
      }

      const answer = (await response.json()).answer;

      setActionFinState(() => " succeded: " + answer);
      console.log(answer);
      if (answer !== "no") {
        const audioUrl = await getSentence(
          answer,
          language,
          "",
          handleSetAudioSrc
        );
        handleSetAudioSrc(audioUrl);
      }
    } catch (error) {
      console.error("Error in checkActionByTheme:", error);
    }
  }, [language, webcamRef]);
  const capture = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc && running && !blocker) {
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
        // if (facerecognition) {
        //   await checkFaceRecognition(props, {
        //     theme: "facerecognition",
        //     isNoUsed: false,
        //     isCountered: false,

        //     index: 0,
        //   });
        //   await new Promise((resolve) => setTimeout(resolve, 2000));
        //   await checkFaceRecognition(props, {
        //     theme: "facerecognition",
        //     isNoUsed: false,
        //     isCountered: false,

        //     index: 1,
        //   });
        //   await new Promise((resolve) => setTimeout(resolve, 2000));
        //   await checkFaceRecognition(props, {
        //     theme: "facerecognition",
        //     isNoUsed: false,
        //     isCountered: false,

        //     index: 2,
        //   });
        //   await new Promise((resolve) => setTimeout(resolve, 2000));
        // }
        await checkFaceRecognition(props, {});
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await checkAnalyzeMoment(props, {});
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // if (counter.water === 2) {
        //   await onSubmit();
        // }
        // if (water) {
        //   await checkActionByTheme(props, {
        //     theme: "water",
        //     isNoUsed: true,
        //     isCountered: true,
        //     maxCounter: 3,
        //   });
        //   await new Promise((resolve) => setTimeout(resolve, 2000));
        // }

        // if (laughing) {
        //   await checkActionByTheme(props, {
        //     theme: "laughing",
        //     isNoUsed: false,
        //     isCountered: false,
        //   });
        //   await new Promise((resolve) => setTimeout(resolve, 2000));
        // }

        // if (smoking) {
        //   await checkActionByTheme(props, {
        //     theme: "smoking",
        //     isNoUsed: false,
        //     isCountered: false,
        //   });
        //   await new Promise((resolve) => setTimeout(resolve, 2000));
        // }

        // if (agitation) {
        //   await checkActionByTheme(props, {
        //     theme: "agitation",
        //     isNoUsed: false,
        //     isCountered: false,
        //   });
        //   await new Promise((resolve) => setTimeout(resolve, 2000));
        // }

        // setFrameCount((prev) => prev + 1);
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
        width="100%"
        height="auto"
      />

      {AudioGonevo}
      <Recorder></Recorder>
    </div>
  );
};

export default WebcamCapture;
