import { phraseDataBase } from "../data/phraseDataBase.js"; // Import the phraseDataBase variable from the appropriate file
import { Buffer } from "buffer"; // Import the Buffer class from the buffer module
import { Base64 } from "js-base64"; // Import the Base64 class from the js-base64 module
import axios from "axios";
function base64ToByteArray(base64) {
  // Decode base64 to raw binary string using Base64 library
  const binaryString = Base64.encode(base64);
  // Create a Uint8Array to hold the bytes
  const byteArray = new Uint8Array(binaryString.length);
  // Fill the Uint8Array with the byte values
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }
  return byteArray;
}
function base64ToArrayBuffer(base64) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
function byteArrayToUtf8(byteArray) {
  // Use TextDecoder to convert byte array to UTF-8 string
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(byteArray);
}

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

    const jsonfile = {
      image: imageSrc.split(",")[1],

      text: phrase,
    };

    const payload = JSON.stringify(jsonfile);

    response = await fetch("http://85.65.185.254:8000/process", {
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
