import { phraseDataBase } from "../data/phraseDataBase.js"; // Import the phraseDataBase variable from the appropriate file
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
    const imageSrc = webcamRef.current.getScreenshot();
    let response;
    try {
      response = await fetch(
        "https://us-central1-aiplatform.googleapis.com/v1/projects/streamingai-33a74/locations/us-central1/publishers/google/models/imagetext:predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            instances: [
              {
                prompt: phraseDataBase[language][theme].question,
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
    } catch (error) {
      setActionFinState("theme : " + theme + " error");
      console.error("No image source provided");
      return;
    }

    if (!response.ok) {
      console.log(theme, "error");

      setActionFinState(() => "theme : " + theme + " error");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      throw new Error("Network response was not ok");
    }

    const answer = (await response.json()).predictions[0].toLowerCase();
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
      return answer2;
    }
  } catch (error) {
    console.error("Error in checkActionByTheme:", error);
  }
}
