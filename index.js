

const worker = new Worker('worker.js');

// Listen for messages from the Web Worker
worker.addEventListener('message', (event) => {
  const { image, altText } = event.data;

  // Set the alt attribute of the image to the returned alt text
  image.alt = altText;
});

// Get all the img tags without the alt attribute
const imagesWithoutAlt = Array.from(document.querySelectorAll('img:not([alt])'));

// Send each image to the Web Worker for processing
imagesWithoutAlt.forEach((image) => {
  // Send the image data to the Web Worker
  worker.postMessage({ image });
});