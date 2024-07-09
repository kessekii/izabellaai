import { phraseDataBase } from "../data/phraseDataBase";

export const resizeImage = async (base64Image1) => {
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

export const combineImages = async (base64Image1, base64Image2) => {
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const canvas = document.createElement("canvas");
  canvas.width = 250;
  canvas.height = 125;
  const ctx = canvas.getContext("2d");

  try {
    const img1 = await loadImage(base64Image1);
    const img2 = await loadImage(base64Image2);

    // Draw the first image resized to 125x125
    ctx.drawImage(img1, 0, 0, 125, 125);
    // Draw the second image resized to 125x125, positioned next to the first image
    ctx.drawImage(img2, 125, 0, 125, 125);

    return canvas.toDataURL(); // Return the combined image as a base64 string
  } catch (error) {
    console.error("Error loading images:", error);
  }
};
export const getSentence = async (
  theme,
  language,
  nameString,
  handleSetAudioSrc
) => {
  if (!nameString || nameString === "") {
    nameString = "";
  }

  const payload = {
    // text: phraseDataBase[language][theme][action][randomIndex] + nameString,
    language: language,
    theme: theme,
    name: nameString,
  };

  const result2 = await fetch("https://85.65.185.254/getSentence", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!result2.ok) {
    console.log(result2);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    throw new Error("Network response was not ok");
  }

  const answerData = result2.body;

  const answerSent = await result2.json();

  const answerArray = answerSent.answer;
  console.log(answerArray);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const audioUrl = await voiceTheAction(
    answerArray,
    language,
    handleSetAudioSrc
  );

  return audioUrl;
};
export const voiceTheAction = async (answer, language, handleSetAudioSrc) => {
  const anwer_ready = answer;

  const paylpad2 = JSON.stringify({
    answer: answer,
    language: language,
  });
  console.log(paylpad2);
  const result2 = await fetch("https://85.65.185.254/voice", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
    body: paylpad2,
  });

  if (!result2.ok) {
    console.log(result2);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    throw new Error("Network response was not ok");
  }

  const audioResp = (await result2.json()).audio;
  // const adui = "data:audio/mp3;base64," + audioResp.audio;
  const audioBlob = new Blob(
    [Uint8Array.from(atob(audioResp), (c) => c.charCodeAt(0))],
    { type: "audio/mp3" }
  );
  const url = URL.createObjectURL(audioBlob);
  // console.log("here", url);

  return url;
};
