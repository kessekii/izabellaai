import { phraseDataBase } from "../data/phraseDataBase.js"; // Import the phraseDataBase variable from the appropriate file

const resizeImage = async (base64Image1) => {
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 576;
  const ctx = canvas.getContext("2d");

  try {
    const img1 = await loadImage(base64Image1);

    // Draw the first image resized to 125x125
    ctx.drawImage(img1, 0, 0, 720, 576);
    // Draw the second image resized to 125x125, positioned next to the first image

    return canvas.toDataURL(); // Return the combined image as a base64 string
  } catch (error) {
    console.error("Error loading images:", error);
  }
};

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

    response = await fetch("https://85.65.185.254:8000/process", {
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
      const randomIndex = Math.floor(
        Math.random() * phraseDataBase[language][theme][action].length
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
  } catch (error) {
    console.error("Error in checkActionByTheme:", error);
  }
}
