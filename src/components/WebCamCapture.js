// src/WebcamCapture.js
import React, { useRef, useCallback, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { checkFaceRecognition } from "../actions/checkFaceRecognition.js";
import combineImages from '../actions/combinePhotos';

import Button from "@mui/material/Button";
import Text from "@mui/material/Typography";

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
  const [language, setLanguage] = useState("en-EN");
  const [audioSrc, setAudioSrc] = useState(null);
  const [counter, setCounter] = useState({ water: 0, agitation: 0 });
  const [toggleFreeToCheck, setToggleFreeToCheck] = useState(false)
  // const handleReset = () => {
  //   setRunning((prev) => !prev);
  // };
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
    if (imageSrc && !toggleFreeToCheck) {
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
        await checkFaceRecognition(props, {
          theme: "facerecognition",
          isNoUsed: false,
          isCountered: false,
          maxCounter: 3,
          imageSrc,
          toggleFreeToCheck: setToggleFreeToCheck
        });
        await checkActionByTheme(props, {
          theme: "water",
          isNoUsed: true,
          isCountered: true,
          maxCounter: 3,
        });

       

        await checkFaceRecognition(props, {
          theme: "facerecognition",
          isNoUsed: false,
          isCountered: false,
        });

        await checkActionByTheme(props, {
          theme: "laughing",
          isNoUsed: false,
          isCountered: false,
        });



        setFrameCount((prev) => prev + 1);
        
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }
  });

  useEffect(() => {
    if (toggleFreeToCheck) {
      setTimeout(() => {
        setToggleFreeToCheck(false);
      }
      , 40000);
    }
  }, [frameCount])
  

  useEffect(() => {
    

    
    const runRepeatedFunction = async () => {
     try {
       await capture();
       if (!toggleFreeToCheck) {
         runRepeatedFunction();
       }
      

     } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
     }
        
        
    }

    return () => runRepeatedFunction();
    
  }, [toggleFreeToCheck]);
  

  return (
    <div>
      <Text
        style={{
          fontSize: "20px",
          color: "black",
          textAlign: "center",
          marginBottom: "10px",
        }}
      >
        {frameCount}
      </Text>
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
