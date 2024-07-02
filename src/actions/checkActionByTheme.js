import { phraseDataBase } from "../data/phraseDataBase.js"; // Import the phraseDataBase variable from the appropriate file
import { resizeImage, voiceTheAction, combineImages } from "./helpers.js"; // Import the resizeImage function from the appropriate file
// Example usage

export async function checkActionByTheme(
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
  { theme, isNoUsed, isCountered, maxCounter = 3 }
) {
  try {
    let imageSrc = webcamRef.current.getScreenshot();

    const phrase = phraseDataBase[language][theme].question.toString();
    let response;
    const resizedImage = await resizeImage(imageSrc);
    const payloadObj = {
      image: resizedImage.split(",")[1],

      text: phrase,
    };

    const payload = JSON.stringify(payloadObj);

    response = await fetch("https://85.65.185.254/process", {
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
        await voiceTheAction(answer, language, theme, handleSetAudioSrc);
        setCounter({}, { ...counter, [theme]: 0 });
      }
    }

    if (answer.includes("yes")) {
      await voiceTheAction(answer, language, theme, handleSetAudioSrc);
      if (counter[theme] > 0) {
        setCounter(Object.assign({}, { ...counter, [theme]: 0 }));
      }
    }
  } catch (error) {
    console.error("Error in checkActionByTheme:", error);
  }
}
