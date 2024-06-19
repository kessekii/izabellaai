import { phraseDataBase } from "../data/phraseDataBase.js";
import combineImages from "./combinePhotos.js";

export const checkFaceRecognition = async (
  { token,
    handleSetAudioSrc,
    setCounter,
    setBlocker,
    language,
    counter,
    webcamRef, },
  { theme, isNoUsed, isCountered, maxCounter = 3, index }
) => {
  const imageSrc = webcamRef.current.getScreenshot();
  if (!imageSrc) {
    console.error("No image source provided");
    return;
  }

  try {
    console.log('Fetching person images...');
    const resp = await fetch("http://localhost:8000/get-persons", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!resp.ok) {
      throw new Error("Failed to fetch person images");
    }

    const images = await resp.json();
    
    
      const data = "data:image/jpeg;base64," + images[index].base64String;
      
      console.log('recognition of : ', images[index].name, ' index : ', index)
      const hen = await generateInstances(imageSrc, data, language);
      if (!hen) {
        console.error("No instances generated");
        return;}
      
      const response = await fetch("https://us-central1-aiplatform.googleapis.com/v1/projects/streamingai-33a74/locations/us-central1/publishers/google/models/imagetext:predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          instances: [hen],
          parameters: {
            sampleCount: 1,
            language: language,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction");
      }

      const { predictions } = await response.json();
      const answer = predictions[0].toLowerCase();
      

      if (answer.includes("no")) {
        
          // await voiceTheAction({ token, setAudioSrc, language }, answer);
          setCounter(0);
          
          
        
      } else if (answer.includes("yes")) {
        
        await voiceTheAction({ token, handleSetAudioSrc, language }, images[index].name);
      } 
      
    
  } catch (error) {
    console.error("Error in face recognition process:", error);
  }
};

const generateInstances = async (imagesr, image, language) => {
  try {
    console.log('Combining images for instance...');
    const combiner = await combineImages(imagesr, image, 880, 880);

    if (combiner.split(",")[0] !== "data:image/jpeg;base64") {
      console.error("Failed to combine images");
      return;
    }
    return {
      prompt: phraseDataBase[language]["facerecognition"].question,
      image: {
        bytesBase64Encoded: combiner.split(",")[1],
      },
    };
  } catch (error) {
    console.error("Error generating instance:", error);
  }
};

const voiceTheAction = async ({ token, handleSetAudioSrc, language, theme }, name) => {
  try {
    const randomIndex = Math.floor(
      Math.random() * phraseDataBase[language]["facerecognition"].recognised.length
    );

    const payload = {
      input: {
        text: phraseDataBase[language]["facerecognition"]['recognised'][randomIndex] + name + "!",
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

    const result = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-goog-user-project": "streamingai-33a74",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (!result.ok) {
      throw new Error("Failed to synthesize speech");
    }

    const { audioContent } = await result.json();
    const audioBlob = new Blob(
      [Uint8Array.from(atob(audioContent), (c) => c.charCodeAt(0))],
      { type: "audio/mp3" }
    );
    const audioUrl = URL.createObjectURL(audioBlob);

    handleSetAudioSrc(audioUrl);
    return audioContent;
  } catch (error) {
    console.error("Error in voice action:", error);
  }
};