import React, { useState, useRef } from "react";
import { speechToText } from "../actions/speechToText.js";
import { checkAnalyzeMoment } from "../actions/checkAnalyzeMoment.js";
import { getSentence } from "../actions/helpers.js";
const Recorder = ({
  setTranscribedText,
  language,
  handleSetAudioSrc,
  setBlocker,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/wav",
      });
      var base64 = "";
      //   audioBlob
      //     .stream()
      //     .getReader()
      //     .read()
      //     .then(async ({ value, done }) => {
      //       base64 = btoa(
      //         new Uint8Array(value).reduce(
      //           (data, byte) => data + String.fromCharCode(byte),
      //           ""
      //         )
      //       );
      //       console.log("base64", base64);
      const text = await speechToText(audioBlob);
      //     });

      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
      //   const base64Audio = await convertBlobToBase64(audioBlob);
      console.log("Blob Audio: ", base64);
      if (text !== "") {
        setTranscribedText(text);
        const audioUrl = await getSentence(
          text,
          language,
          "",
          handleSetAudioSrc,
          text
        );
        setBlocker(false);
        handleSetAudioSrc(audioUrl);
      }
      setTranscribedText("no");

      // Send Base64 string to the server
      //   await speechToText(base64);
    };
    setBlocker(true);
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();

    setIsRecording(false);
  };

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioURL && <audio controls src={audioURL}></audio>}
    </div>
  );
};

export default Recorder;
