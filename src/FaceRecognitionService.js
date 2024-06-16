import React, { useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import Dropzone from 'react-dropzone';

const FaceRecognition = () => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [labeledDescriptors, setLabeledDescriptors] = useState([]);
  const [recognizedFaces, setRecognizedFaces] = useState([]);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = './faces';
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
    };

    loadModels();
  }, []);

  const loadLabeledImages = async () => {
    const labels = ['Peter']; // Replace with actual names
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <= 3; i++) {
          const img = await faceapi.fetchImage(`/labeled_images/${label}/${i}.jpg`);
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
          if (detections) {
            descriptions.push(detections.descriptor);
          }
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  };

  const handleDrop = async (acceptedFiles) => {
    const img = await faceapi.bufferToImage(acceptedFiles[0]);
    const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();

    if (detections.length > 0 && labeledDescriptors.length > 0) {
      const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
      const results = detections.map((d) => faceMatcher.findBestMatch(d.descriptor));
      const recognized = results.filter((result) => result.label !== 'unknown').map((result) => result.label);
      setRecognizedFaces(recognized);
    } else {
      setRecognizedFaces([]);
    }
  };

  useEffect(() => {
    if (modelsLoaded) {
      loadLabeledImages().then((descriptors) => {
        setLabeledDescriptors(descriptors);
      });
    }
  }, [modelsLoaded]);

  return (
    <div>
      <h1>Face Recognition</h1>
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} style={{ border: '2px dashed #000', padding: '20px', cursor: 'pointer' }}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop a photo here, or click to select a file</p>
          </div>
        )}
      </Dropzone>
      {recognizedFaces.length > 0 && (
        <div>
          <h2>Recognized Faces:</h2>
          <ul>
            {recognizedFaces.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FaceRecognition;