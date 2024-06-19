import React from 'react';

const base64ToImage = async (base64Str) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => resolve(img);
    });
};

const arrayToImage = async (array, width, height) => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Create ImageData from array
        const imageData = ctx.createImageData(width, height);
        
        for (let i = 0; i < array.length; i++) {
            imageData.data[i] = array[i];
        }

        ctx.putImageData(imageData, 0, 0);

        const img = new Image();
        img.src = canvas.toDataURL();
        img.onload = () => resolve(img);
    });
};

const combineImages = async (base64Image, arrayImage, arrayWidth, arrayHeight) => {
    
    const img1 = await base64ToImage(base64Image);
    const img2 = await base64ToImage(arrayImage);


    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

   
    const combinedWidth = img1.width + img2.width;
    const combinedHeight = Math.max(img1.height, img2.height);

    canvas.width = combinedWidth;
    canvas.height = combinedHeight;

    ctx.drawImage(img1, 0, 0);
    ctx.drawImage(img2, img1.width, 0);

    return canvas.toDataURL('image/jpeg');
};

export default combineImages;