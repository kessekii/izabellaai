// src/WebcamCapture.js
import React, { useRef, useCallback, useEffect, useState } from "react";
import Webcam from "react-webcam";
const wateraskarray = [
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
];
const waterthanksarray2 = [
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
];

const ruAskPhrases = [
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
];
const thank_Ruyou_phrases = [
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
];
const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [answer, setAnswer] = useState("no");
  const [language, setLanguage] = useState("en-EN");
  const [audioSrc, setAudioSrc] = useState(null);
  let counterNo = 0;
  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      try {
        const response = await fetch(
          "https://us-central1-aiplatform.googleapis.com/v1/projects/streamingai-33a74/locations/us-central1/publishers/google/models/imagetext:predict",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ya29.c.c0AY_VpZjwtKUa-tE6UuZCbpJKHl7FyFlu5V8qbTkHLJ6i-VNbkp3GP9ABPuSXbBIl0kIWsYQb1KcFejhdsmkHPsJtlCYMMyB-SHNr1vhH8j8lkpMfX1loOt0vrHq6IBENBF57jUI0TR1FWBXVVJaVt7S7fkkrvnFK_rc8iLHh3oAHM3VJgu7NPGpGI_BCyhMvLQEfchX1CRU_TtVNlgzi18Gnjg1D9Bty-hN-WllKaaFT5FDSZ3o1TbqD25jY1xKd76d9jFA4NJBYkQMA5-WcSRyllvUhZTojw4DP2caT-O8LlpIAtWdaHJXwBH5xX0BCiChYi5gKNBn4kwguzC6d2orgkBcVz_4Me6lUxpQ5zSqS4dprSGreNG1YdMOzhmtUCZdzE397KmlJ9Yctqe-iyi9I0Ord2etFe1bx_aMFrBS3fMO9Ol5X9tfmR1m1MO1j94z2YSy3gqcOlvcqU2ikt29pvBZ1JvSQjQ-apkWw8gf5ipViZhwJoJo-sbd_zzpIbOFYkYM1ngs8uVzc668wit2sVfhik6ZRwQ6jXJ0_gmsI_zF816rgX7mRXnVtw0kdybUU36UXhgUxZyye9lWJxvIF4ZnaabkbUxi0bVeOQuwbnYOlxasy65Qjz8sBnIlahItwgzZyo4Ycf4FbaZ6rJ40rU4ZyVUjz2yeFM571UpfsiIrF8UnRVcx09x8fJp1BWv5xBX31j57tksly_ohQ_ZMv_do1xwWb-4eaanhUVYUBUv1ZyYMuVkhoweuxFO7avnFnpcn3e29RmkuRh0vcFbbkqffcor4n_FhwcXvx306SVl33nMSj1VIF3v9VggpvR0btcYot9Vl4SBXqiyI_tI898wUihzV3Ma9B96hO_s8qmSX7sSz0OFw_zpo4aiWavq5BVF9dJxMz1XUoyc95gXOWpZIbVahdJSjySYpXoeUVh_ZZ_r8f0gi0Z1OFpYol8cB_iJ7a5p17Rt7bosO8slR-q0pcrV4-4nx35rqjoVV0MR7f5q7qwMZ`,
            },

            body: JSON.stringify({
              instances: [
                {
                  prompt:
                    "Does a person on the photo drink water? Answer with only yes or no",
                  image: {
                    bytesBase64Encoded: imageSrc.split(",")[1],
                  },
                },
              ],
              parameters: {
                sampleCount: 1,
                language: language,
              },
            }),
          }
        );

        if (!response.ok) {
          console.log(response);
          throw new Error("Network response was not ok");
        }
        const answer = await response.json();
        if (answer.predictions[0] === "no") {
          console.log("no encountered ", counterNo + 1);
          counterNo = counterNo + 1;
        }
        if (counterNo >= 1) {
          const randomIndex = Math.floor(Math.random() * wateraskarray.length);

          const payload = {
            input: {
              text:
                language === "en-EN"
                  ? wateraskarray[randomIndex]
                  : ruAskPhrases[randomIndex],
            },
            voice: {
              languageCode: language,
              name:
                language === "en-EN" ? "en-GB-Wavenet-D" : "ru-RU-Wavenet-D",
              ssmlGender: "FEMALE",
            },
            audioConfig: {
              audioEncoding: "MP3",
            },
          };

          const result2 = await fetch(
            "https://texttospeech.googleapis.com/v1/text:synthesize",
            {
              method: "POST",
              headers: {
                Authorization:
                  "Bearer ya29.c.c0AY_VpZjwtKUa-tE6UuZCbpJKHl7FyFlu5V8qbTkHLJ6i-VNbkp3GP9ABPuSXbBIl0kIWsYQb1KcFejhdsmkHPsJtlCYMMyB-SHNr1vhH8j8lkpMfX1loOt0vrHq6IBENBF57jUI0TR1FWBXVVJaVt7S7fkkrvnFK_rc8iLHh3oAHM3VJgu7NPGpGI_BCyhMvLQEfchX1CRU_TtVNlgzi18Gnjg1D9Bty-hN-WllKaaFT5FDSZ3o1TbqD25jY1xKd76d9jFA4NJBYkQMA5-WcSRyllvUhZTojw4DP2caT-O8LlpIAtWdaHJXwBH5xX0BCiChYi5gKNBn4kwguzC6d2orgkBcVz_4Me6lUxpQ5zSqS4dprSGreNG1YdMOzhmtUCZdzE397KmlJ9Yctqe-iyi9I0Ord2etFe1bx_aMFrBS3fMO9Ol5X9tfmR1m1MO1j94z2YSy3gqcOlvcqU2ikt29pvBZ1JvSQjQ-apkWw8gf5ipViZhwJoJo-sbd_zzpIbOFYkYM1ngs8uVzc668wit2sVfhik6ZRwQ6jXJ0_gmsI_zF816rgX7mRXnVtw0kdybUU36UXhgUxZyye9lWJxvIF4ZnaabkbUxi0bVeOQuwbnYOlxasy65Qjz8sBnIlahItwgzZyo4Ycf4FbaZ6rJ40rU4ZyVUjz2yeFM571UpfsiIrF8UnRVcx09x8fJp1BWv5xBX31j57tksly_ohQ_ZMv_do1xwWb-4eaanhUVYUBUv1ZyYMuVkhoweuxFO7avnFnpcn3e29RmkuRh0vcFbbkqffcor4n_FhwcXvx306SVl33nMSj1VIF3v9VggpvR0btcYot9Vl4SBXqiyI_tI898wUihzV3Ma9B96hO_s8qmSX7sSz0OFw_zpo4aiWavq5BVF9dJxMz1XUoyc95gXOWpZIbVahdJSjySYpXoeUVh_ZZ_r8f0gi0Z1OFpYol8cB_iJ7a5p17Rt7bosO8slR-q0pcrV4-4nx35rqjoVV0MR7f5q7qwMZ",
                "x-goog-user-project": "streamingai-33a74",
                "Content-Type": "application/json; charset=utf-8",
              },
              body: JSON.stringify(payload),
            }
          );

          if (!result2.ok) {
            console.log(result2);
            throw new Error("Network response was not ok");
          }
          const answer2 = await result2.json();
          const audioContent = answer2.audioContent;

          // Convert base64 audio content to a blob URL
          const audioBlob = new Blob(
            [Uint8Array.from(atob(audioContent), (c) => c.charCodeAt(0))],
            { type: "audio/mp3" }
          );
          const audioUrl = URL.createObjectURL(audioBlob);
          counterNo = 0;
          setAudioSrc(audioUrl);
          console.log(answer2);
        } else {
          setAnswer(answer.predictions);
        }
        if (answer.predictions[0] === "yes") {
          const randomIndex = Math.floor(Math.random() * wateraskarray.length);
          const payload1 = {
            input: {
              text:
                language === "en-EN"
                  ? waterthanksarray2[randomIndex]
                  : thank_Ruyou_phrases[randomIndex],
            },
            voice: {
              languageCode: language,

              ssmlGender: "FEMALE",
              name:
                language === "en-EN" ? "en-GB-Wavenet-D" : "ru-RU-Wavenet-D",
            },
            audioConfig: {
              audioEncoding: "MP3",
            },
          };
          const result2 = await fetch(
            "https://texttospeech.googleapis.com/v1/text:synthesize",
            {
              method: "POST",
              headers: {
                Authorization:
                  "Bearer ya29.c.c0AY_VpZjwtKUa-tE6UuZCbpJKHl7FyFlu5V8qbTkHLJ6i-VNbkp3GP9ABPuSXbBIl0kIWsYQb1KcFejhdsmkHPsJtlCYMMyB-SHNr1vhH8j8lkpMfX1loOt0vrHq6IBENBF57jUI0TR1FWBXVVJaVt7S7fkkrvnFK_rc8iLHh3oAHM3VJgu7NPGpGI_BCyhMvLQEfchX1CRU_TtVNlgzi18Gnjg1D9Bty-hN-WllKaaFT5FDSZ3o1TbqD25jY1xKd76d9jFA4NJBYkQMA5-WcSRyllvUhZTojw4DP2caT-O8LlpIAtWdaHJXwBH5xX0BCiChYi5gKNBn4kwguzC6d2orgkBcVz_4Me6lUxpQ5zSqS4dprSGreNG1YdMOzhmtUCZdzE397KmlJ9Yctqe-iyi9I0Ord2etFe1bx_aMFrBS3fMO9Ol5X9tfmR1m1MO1j94z2YSy3gqcOlvcqU2ikt29pvBZ1JvSQjQ-apkWw8gf5ipViZhwJoJo-sbd_zzpIbOFYkYM1ngs8uVzc668wit2sVfhik6ZRwQ6jXJ0_gmsI_zF816rgX7mRXnVtw0kdybUU36UXhgUxZyye9lWJxvIF4ZnaabkbUxi0bVeOQuwbnYOlxasy65Qjz8sBnIlahItwgzZyo4Ycf4FbaZ6rJ40rU4ZyVUjz2yeFM571UpfsiIrF8UnRVcx09x8fJp1BWv5xBX31j57tksly_ohQ_ZMv_do1xwWb-4eaanhUVYUBUv1ZyYMuVkhoweuxFO7avnFnpcn3e29RmkuRh0vcFbbkqffcor4n_FhwcXvx306SVl33nMSj1VIF3v9VggpvR0btcYot9Vl4SBXqiyI_tI898wUihzV3Ma9B96hO_s8qmSX7sSz0OFw_zpo4aiWavq5BVF9dJxMz1XUoyc95gXOWpZIbVahdJSjySYpXoeUVh_ZZ_r8f0gi0Z1OFpYol8cB_iJ7a5p17Rt7bosO8slR-q0pcrV4-4nx35rqjoVV0MR7f5q7qwMZ",
                "x-goog-user-project": "streamingai-33a74",
                "Content-Type": "application/json; charset=utf-8",
              },
              body: JSON.stringify(payload1),
            }
          );

          if (!result2.ok) {
            console.log(result2);
            throw new Error("Network response was not ok");
          }
          const answer2 = await result2.json();

          const audioContent = answer2.audioContent;

          // Convert base64 audio content to a blob URL
          const audioBlob = new Blob(
            [Uint8Array.from(atob(audioContent), (c) => c.charCodeAt(0))],
            { type: "audio/mp3" }
          );
          const audioUrl = URL.createObjectURL(audioBlob);
          counterNo = 0;
          setAudioSrc(audioUrl);
        }
        setAnswer(answer.predictions);
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
