import { phraseDataBase } from "../data/phraseDataBase.js"; // Import the phraseDataBase variable from the appropriate file
import { resizeImage, voiceTheAction, combineImages } from "./helpers.js"; // Import the resizeImage function from the appropriate file
// Example usage

export async function checkActionByTheme({
  language,
  webcamRef,
  setActionFinState,
  theme,
  isNoUsed,
  setBlocker,
  handleSetAudioSrc,
}) {
  try {
    let imageSrc = webcamRef.current.getScreenshot();

    let response;
    const resizedImage = await resizeImage(imageSrc);
    const payloadObj = {
      image: resizedImage.split(",")[1],
      language: language,
      theme: theme,
    };

    const payload = JSON.stringify(payloadObj);
    console.log("Fetching person images...");
    response = await fetch("https://85.65.185.254/process", {
      method: "POST",

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
      setBlocker(false);
      const audioSrc = await voiceTheAction(
        phraseDataBase[language][theme][answer],
        language
      );
      handleSetAudioSrc(audioSrc);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    if (answer.includes("yes")) {
      setBlocker(false);
      const audioSrc = await voiceTheAction(
        phraseDataBase[language][theme][answer],
        language
      );
      handleSetAudioSrc(audioSrc);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  } catch (error) {
    console.error("Error in checkActionByTheme:", error);
  }
}
