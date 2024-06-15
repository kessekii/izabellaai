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
              Authorization: `Bearer ya29.c.c0AY_VpZhxqsrg4RvgmF1XM2DsuAgaK1Vcsewk9Asj0Okxghg6fhJOFc7gEAlarZ5xA55p5hhMyCO_41Am5gstXMFL2BfffFcPew9PG7VCWEUq5N-2UPLxksUSiOhTVd_hEYZZyVUpOH-XO5ZrlPkFTZu8JscQBYVnxIdo2c6kb-Do4H2Jtz3Ypd9PPIJcNvTnhGHh1NiuSy7Eozc0u7VitrntXYxtN8HkmlpO3jeSgVWScjI1mHaEXE9lngUil8bP5ZOOQ7mvoVQH-Wg1iUmNWSoJ2ShLkhIasKufnl3dcqDQq_dOIGCLx-wKgTKNuwvJFOiP1sxOU9EeobuKt4xFb8tMgc7kki_ZesKzaD-ISNIss6UlfGJA2-SuWO42m0WvJ67UXA8H400PqmSyZz8y2345OgeZM5YnZQiiFYIg_8rR10k4hVRUs8ZjqOj0dws5b34e_Mux_8rUXMe--QkcMiY07d6wI0bRYuya0o1QrQyw_4sdXtuOyRShp5gpzQYb23andjdvtsZXl-mnXrh-aedIWQV9MSJiS_zhmf8ipYhseyFuQqIFO9qFhz6Fm_FFawyVaJRl84WWIov6mQsUouMkbX6a6ymewM0MbIjnUecyRevfj7JJeclMaUqhxbvk7VOarOQzXOWvlaWfjqbsr1rcZq3Jf-Mbei6Q9YR5n6g7z00R245c5vSlIVQOXQwkYRu9g9nIn_0Rq9mI9ZFqzJgyVlhjIqjvUWxwQaho8d2qhQ2qWte23S_MRdboopupIXi5aWW45MmgWmYXd1xzXU94yre4QRqBlkO4tkaFX-lpq6lRRjuJSggubIOhsi_BUa4pSli0BOWos31q5jtXMYqctruMw5XJUB-u9Ztwv2vXl1vZ_grIo3-24-9tgcMxmxrYlUSflWgb90u4U5gUa04FSdx-Rsczv8b8eSj25vfYBdv0_Yt1UfamdVW-rwefzkcooyJ_fFOyoI7_rklWjwgjs_1xrblY--izQorBbcrlvkRlru83p49`,
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
                  "Bearer ya29.c.c0AY_VpZhxqsrg4RvgmF1XM2DsuAgaK1Vcsewk9Asj0Okxghg6fhJOFc7gEAlarZ5xA55p5hhMyCO_41Am5gstXMFL2BfffFcPew9PG7VCWEUq5N-2UPLxksUSiOhTVd_hEYZZyVUpOH-XO5ZrlPkFTZu8JscQBYVnxIdo2c6kb-Do4H2Jtz3Ypd9PPIJcNvTnhGHh1NiuSy7Eozc0u7VitrntXYxtN8HkmlpO3jeSgVWScjI1mHaEXE9lngUil8bP5ZOOQ7mvoVQH-Wg1iUmNWSoJ2ShLkhIasKufnl3dcqDQq_dOIGCLx-wKgTKNuwvJFOiP1sxOU9EeobuKt4xFb8tMgc7kki_ZesKzaD-ISNIss6UlfGJA2-SuWO42m0WvJ67UXA8H400PqmSyZz8y2345OgeZM5YnZQiiFYIg_8rR10k4hVRUs8ZjqOj0dws5b34e_Mux_8rUXMe--QkcMiY07d6wI0bRYuya0o1QrQyw_4sdXtuOyRShp5gpzQYb23andjdvtsZXl-mnXrh-aedIWQV9MSJiS_zhmf8ipYhseyFuQqIFO9qFhz6Fm_FFawyVaJRl84WWIov6mQsUouMkbX6a6ymewM0MbIjnUecyRevfj7JJeclMaUqhxbvk7VOarOQzXOWvlaWfjqbsr1rcZq3Jf-Mbei6Q9YR5n6g7z00R245c5vSlIVQOXQwkYRu9g9nIn_0Rq9mI9ZFqzJgyVlhjIqjvUWxwQaho8d2qhQ2qWte23S_MRdboopupIXi5aWW45MmgWmYXd1xzXU94yre4QRqBlkO4tkaFX-lpq6lRRjuJSggubIOhsi_BUa4pSli0BOWos31q5jtXMYqctruMw5XJUB-u9Ztwv2vXl1vZ_grIo3-24-9tgcMxmxrYlUSflWgb90u4U5gUa04FSdx-Rsczv8b8eSj25vfYBdv0_Yt1UfamdVW-rwefzkcooyJ_fFOyoI7_rklWjwgjs_1xrblY--izQorBbcrlvkRlru83p49",
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
                  "Bearer ya29.c.c0AY_VpZhxqsrg4RvgmF1XM2DsuAgaK1Vcsewk9Asj0Okxghg6fhJOFc7gEAlarZ5xA55p5hhMyCO_41Am5gstXMFL2BfffFcPew9PG7VCWEUq5N-2UPLxksUSiOhTVd_hEYZZyVUpOH-XO5ZrlPkFTZu8JscQBYVnxIdo2c6kb-Do4H2Jtz3Ypd9PPIJcNvTnhGHh1NiuSy7Eozc0u7VitrntXYxtN8HkmlpO3jeSgVWScjI1mHaEXE9lngUil8bP5ZOOQ7mvoVQH-Wg1iUmNWSoJ2ShLkhIasKufnl3dcqDQq_dOIGCLx-wKgTKNuwvJFOiP1sxOU9EeobuKt4xFb8tMgc7kki_ZesKzaD-ISNIss6UlfGJA2-SuWO42m0WvJ67UXA8H400PqmSyZz8y2345OgeZM5YnZQiiFYIg_8rR10k4hVRUs8ZjqOj0dws5b34e_Mux_8rUXMe--QkcMiY07d6wI0bRYuya0o1QrQyw_4sdXtuOyRShp5gpzQYb23andjdvtsZXl-mnXrh-aedIWQV9MSJiS_zhmf8ipYhseyFuQqIFO9qFhz6Fm_FFawyVaJRl84WWIov6mQsUouMkbX6a6ymewM0MbIjnUecyRevfj7JJeclMaUqhxbvk7VOarOQzXOWvlaWfjqbsr1rcZq3Jf-Mbei6Q9YR5n6g7z00R245c5vSlIVQOXQwkYRu9g9nIn_0Rq9mI9ZFqzJgyVlhjIqjvUWxwQaho8d2qhQ2qWte23S_MRdboopupIXi5aWW45MmgWmYXd1xzXU94yre4QRqBlkO4tkaFX-lpq6lRRjuJSggubIOhsi_BUa4pSli0BOWos31q5jtXMYqctruMw5XJUB-u9Ztwv2vXl1vZ_grIo3-24-9tgcMxmxrYlUSflWgb90u4U5gUa04FSdx-Rsczv8b8eSj25vfYBdv0_Yt1UfamdVW-rwefzkcooyJ_fFOyoI7_rklWjwgjs_1xrblY--izQorBbcrlvkRlru83p49",
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
