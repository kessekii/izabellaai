import { phraseDataBase } from "./WebCamCapture"; // Import the phraseDataBase variable from the appropriate file
export async function checkActionByTheme(
  imageSrc,
  token,
  setAudioSrc,
  setAnswer,
  language,
  counterNo,
  theme,
  isCountered
) {
  const response = await fetch(
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

  if (!response.ok) {
    console.log(response);
    throw new Error("Network response was not ok");
  }
  const answer = await response.json();
  if (isCountered && answer.predictions[0] === "no") {
    counterNo = counterNo + 1;
    if (counterNo >= 1) {
      await voiceTheAction("ask");
    }
  }

  if (answer.predictions[0] === "yes") {
    await voiceTheAction("thanks");
  }
  setAnswer(answer.predictions);

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
    counterNo = 0;
    setAudioSrc(audioUrl);
    return answer2;
  }
}
