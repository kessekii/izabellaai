import { database } from "../data/peopleDataBase.js";
import { phraseDataBase } from "../data/phraseDataBase.js";
import { Base64 } from "js-base64";
import { resizeImage, combineImages, voiceTheAction } from "./helpers.js";
import peter from "../data/images/peter.jpg";
import roma from "../data/images/roma.jpg";
import izabella from "../data/images/izabella.jpg";

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
  // const resp = await fetch(
  //   "https://izabellaaibackend-xisces6vkq-lm.a.run.app/get-persons",
  const cropPayload = {
    image: imageSrc.split(",")[1],
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

    name: database[index].name["en"].toLowerCase(),
  };

  const compareResponce = await fetch("https://85.65.185.254/compare", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payloadObj),
  });

  if (!compareResponce.ok) {
    console.log(theme, "error");

    setActionFinState(() => "theme : " + theme + " error");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    throw new Error("Network response was not ok");
  }

  const answer = (await compareResponce.json()).answer;
  console.log(theme, ": ", answer);
  setActionFinState(() => "theme : " + theme + " succeded: " + answer);
  if (isNoUsed && answer.includes("no")) {
    if (isCountered) {
      setCounter(
        Object.assign({}, { ...counter, [theme]: counter[theme] + 1 })
      );
    }

    if (isCountered && counter[theme] >= maxCounter - 1) {
      await voiceTheAction(answer, language, theme, handleSetAudioSrc);
      setCounter({}, { ...counter, [theme]: 0 });
    }
  }
  console.log(answer);
  if (answer.includes("yes")) {
    const nameString = database[index].name[language];
    await voiceTheAction(
      answer,
      language,
      theme,
      handleSetAudioSrc,
      nameString
    );
    if (counter[theme] > 0) {
      setCounter(Object.assign({}, { ...counter, [theme]: 0 }));
    }
  }
};

// const generateInstances = async (imagesr, image, language) => {
//   try {
//     console.log("Combining images for instance...");
//     const combiner = await combineImages(imagesr, image, 880, 880);

//     if (combiner.split(",")[0] !== "data:image/jpeg;base64") {
//       console.error("Failed to combine images");
//       return;
//     }
//     return {
//       text: phraseDataBase[language]["facerecognition"].question,
//       image: combiner.split(",")[1],
//     };
//   } catch (error) {
//     console.error("Error generating instance:", error);
//   }
// };
