import { resizeImage, getSentence } from "./helpers.js"; // Import the resizeImage function from the appropriate file
// Example usage
export const checkAnalyzeMoment = async ({
  handleSetAudioSrc,
  setCounter,
  language,
  counter,
  webcamRef,
  setActionFinState,
}) => {
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
};
