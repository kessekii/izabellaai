import { phraseDataBase } from "../data/phraseDataBase.js";
import combineImages from "./combinePhotos.js";

export const checkFaceRecognition = async (
  {
    token,
    handleSetAudioSrc,
    setCounter,
    setBlocker,
    language,
    counter,
    webcamRef,

    setActionFinState,
  },
  { theme, isNoUsed, isCountered, index, maxCounter = 3 }
) => {
  const imageSrc = webcamRef.current.getScreenshot();

  console.log("Fetching person images...");
  const resp = await fetch(
    "https://izabellaaibackend-xisces6vkq-lm.a.run.app/get-persons",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!resp.ok) {
    setActionFinState(() => "theme : " + theme + " error");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    throw new Error("Failed to fetch person images");
  }

  const images = await resp.json();

  const data = "data:image/jpeg;base64," + images[index].base64String;

  console.log("recognition of : ", images[index].name, " index : ", index);
  const hen = await generateInstances(imageSrc, data, language);
  if (!hen) {
    console.error("No instances generated");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return;
  }

  const payload = JSON.stringify(hen);

  const response = await fetch("http://85.65.185.254:8000/process", {
    method: "POST",
    Authorization: `Bearer ${token}`,

    headers: {
      "Content-Type": "application/json",
    },

    body: payload,
  });

  if (!response.ok) {
    console.log(theme, "error");

    setActionFinState(() => "theme : " + theme + " error");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    throw new Error("Network response was not ok");
  }

  const answer = (await response.json()).answer;
  console.log(theme, ": ", answer);
  setActionFinState(() => "theme : " + theme + " succeded: " + answer);
  if (isNoUsed && answer.includes("no")) {
    if (isCountered) {
      setCounter(
        Object.assign({}, { ...counter, [theme]: counter[theme] + 1 })
      );
    }

    if (isCountered && counter[theme] >= maxCounter - 1) {
      await voiceTheAction(answer);
      setCounter({}, { ...counter, [theme]: 0 });
    }
  }

  if (answer.includes("yes")) {
    await voiceTheAction(answer);
    if (counter[theme] > 0) {
      setCounter(Object.assign({}, { ...counter, [theme]: 0 }));
    }
  }

  async function voiceTheAction(action) {
    console.log("Voice the action", language, theme, action);
    const randomIndex = Math.floor(
      Math.random() * phraseDataBase[language][theme][action]?.length || 1
    );

    const payload = {
      input: {
        text: phraseDataBase[language][theme][action][randomIndex],
      },
      voice: {
        languageCode: language,
        name: phraseDataBase[language].voice,
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
          Authorization: `Bearer ${token}`,
          "x-goog-user-project": "streamingai-33a74",
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!result2.ok) {
      console.log(result2);
      await new Promise((resolve) => setTimeout(resolve, 2000));
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

    handleSetAudioSrc(audioUrl);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return answer2;
  }
};

const generateInstances = async (imagesr, image, language) => {
  try {
    console.log("Combining images for instance...");
    const combiner = await combineImages(imagesr, image, 880, 880);

    if (combiner.split(",")[0] !== "data:image/jpeg;base64") {
      console.error("Failed to combine images");
      return;
    }
    return {
      text: phraseDataBase[language]["facerecognition"].question,
      image: combiner.split(",")[1],
    };
  } catch (error) {
    console.error("Error generating instance:", error);
  }
};
