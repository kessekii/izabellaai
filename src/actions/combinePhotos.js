import React from "react";

const base64ToImage = async (base64Str) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => resolve(img);
  });
};

const arrayToImage = async (array, width, height) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const imageData = ctx.createImageData(width, height);

      for (let i = 0; i < array.length; i++) {
        imageData.data[i] = array[i];
      }

      ctx.putImageData(imageData, 0, 0);
    }
    // Create ImageData from array

    const img = new Image();
    img.src = canvas.toDataURL();
    img.onload = () => resolve(img);
  });
};
