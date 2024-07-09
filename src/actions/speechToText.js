export const speechToText = async (audioRecordData) => {
  const audioData = await convertBlobToBase64(audioRecordData);
  const payloadJson = JSON.stringify({
    audio: audioData,
  });
  const payload = JSON.stringify(payloadJson);
  console.log("payload", payload);
  const response = await fetch("https://85.65.185.254/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
  });
  const answer = await response.json();
  console.log(answer);
  return answer.answer;
};
const convertBlobToBase64 = async (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1]; // Get only the Base64 string
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
