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
  canvas.width = 300;
  canvas.height = 240;
  const ctx = canvas.getContext("2d");

  try {
    const img1 = await loadImage(base64Image1);

    // Draw the first image resized to 125x125
    ctx.drawImage(img1, 0, 0, 300, 240);
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
export const voiceTheAction = async (
  answer,
  language,
  theme,
  handleSetAudioSrc,
  nameString
) => {
  // const randomIndex = Math.floor(
  //   Math.random() * phraseDataBase[language][theme][action]?.length || 1
  // );
  //   const generatorPhrase =
  //     phraseDataBase[language][theme][action][randomIndex] +
  //     " reformulate this phrase in a free manner";

  //   const imageTemplate =
  //     "/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAABwn/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdAAYqm//Z";
  //   const resizedImage = await resizeImage(imageTemplate);
  //   const payloadObj = {
  //     image: resizedImage,
  //     text: generatorPhrase,
  //   };
  if (!nameString || nameString === "") {
    nameString = "";
  }

  const token =
    "AAAAAAAAAAAAAAAAAAAAAMLheAAAAAAA0%2BuSeid%2BULvsea4JtiGRiSDSJSI%3DEUifiRBkKG5E2XzMDjRfl76ZC9Ub0wnz4XsNiRVBChTYbJcE3F";
  //   const response = await fetch("https://85.65.185.254/process", {
  //     method: "POST",
  //     Authorization: `Bearer ${token}`,

  //     headers: {
  //       "Content-Type": "application/json",
  //     },

  //     body: JSON.stringify(payloadObj),
  //   });
  const payload = {
    theme: theme,
    answer: answer,
    language: language,
    name: nameString,
  };

  const result2 = await fetch("https://85.65.185.254/voice", {
    method: "POST",
    Authorization: `Bearer ${token}`,

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

  const audioResp = (await result2.json()).audio;
  // const adui = "data:audio/mp3;base64," + audioResp.audio;
  const audioBlob = new Blob(
    [Uint8Array.from(atob(audioResp), (c) => c.charCodeAt(0))],
    { type: "audio/mp3" }
  );
  const url = URL.createObjectURL(audioBlob);
  // console.log("here", url);
  handleSetAudioSrc(url);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return result2;
};
