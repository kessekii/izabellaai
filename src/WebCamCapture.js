// src/WebcamCapture.js
import React, { useRef, useCallback, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { checkActionByTheme } from "./checkActionByTheme.ts";
export const phraseDataBase = {
  "en-EN": {
    voice: "en-GB-Wavenet-D",
    water: {
      question:
        "does a person on the photo drink water? Answer with only yes or no",

      ask: [
        "Don't forget to drink some water!",
        "Stay hydrated, have a glass of water.",
        "Remember to sip some water throughout the day.",
        "How about a refreshing glass of water?",
        "Your body needs water, take a drink!",
        "Quench your thirst with some water.",
        "A glass of water will do you good.",
        "Time to hydrate, drink some water.",
        "Keep yourself hydrated, have some water.",
        "A quick water break could be just what you need.",
      ],
      thanks: [
        "Thank you for taking care of yourself and drinking water!",
        "I appreciate you staying hydrated!",
        "Thanks for making hydration a priority!",
        "Thank you for drinking water and staying healthy.",
        "I'm glad you had some water, thank you!",
        "Thanks for keeping yourself hydrated!",
        "Your health is important, thank you for drinking water!",
        "Thanks for sipping on some water!",
        "I appreciate you for drinking water and staying refreshed!",
        "Thank you for making the healthy choice to drink water!",
      ],
    },
  },
  "ru-RU": {
    voice: "ru-RU-Wavenet-D",
    water: {
      question:
        "does a person on the photo drink water? Answer with only yes or no",
      ask: [
        "Не хочешь выпить стакан воды?",
        "Тебе не нужна вода? Могу налить.",
        "Может, выпьешь немного воды?",
        "Хочешь стакан воды?",
        "Не хочешь освежиться водой?",
        "Как насчёт воды? Я могу принести.",
        "Тебе нужно что-нибудь попить? Воды, например?",
        "Ты не хочешь воды? Здесь есть свежая.",
        "Выпей немного воды, если хочешь.",
        "Тебе не нужна вода? Могу налить холодной.",
      ],
      thanks: [
        "Спасибо, что выпили воды!",
        "Благодарю, что согласились выпить воду.",
        "Спасибо, что утолили жажду.",
        "Мы рады, что вы выпили воды.",
        "Спасибо, что позаботились о себе и выпили воду.",
        "Благодарим за то, что выпили воды.",
        "Спасибо, что приняли наше предложение и выпили воду.",
        "Мы очень благодарны, что вы выпили воды.",
        "Спасибо, что поддержали наш совет и выпили воду.",
        "Благодарим, что утолили жажду с помощью воды.",
      ],
    },
  },
};
const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [answer, setAnswer] = useState("no");
  const [language, setLanguage] = useState("en-EN");
  const [audioSrc, setAudioSrc] = useState(null);
  let counterNo = 0;

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
        await checkActionByTheme(
          imageSrc,
          token,
          setAudioSrc,
          setAnswer,
          language,
          counterNo,
          "water",
          true
        );
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }
  }, [webcamRef, setAnswer, language]);

  useEffect(() => {
    const interval = setInterval(capture, 5000);
    return () => clearInterval(interval);
  }, [capture, language]);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
        height="auto"
      />
      <text>{answer}</text>
      {audioSrc && <audio autoPlay src={audioSrc}></audio>}
      <text
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
        {language}
      </text>
    </div>
  );
};

export default WebcamCapture;
