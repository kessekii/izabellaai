import { resizeImage, getSentence } from "./helpers.js";

export const checkFaceRecognition = async ({
  handleSetAudioSrc,
  setCounter,
  language,
  counter,
  webcamRef,
  setActionFinState,
}) => {
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
};
