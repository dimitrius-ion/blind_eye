self.addEventListener('message', async (event) => {
  const { image } = event.data;

  // Get the image source URL
  const imageUrl = image.src;

  // Create an offscreen image element
  const offscreenImage = document.createElement('img');

  // Load the image source
  offscreenImage.src = imageUrl;

  // Wait for the image to load
  await new Promise((resolve) => {
    offscreenImage.onload = resolve;
  });

  // Calculate the new dimensions
  const maxWidth = image.width;
  const maxHeight = 600;
  let newWidth, newHeight;

  if (offscreenImage.height > maxHeight) {
    newHeight = maxHeight;
    newWidth = (offscreenImage.width / offscreenImage.height) * newHeight;
  } else {
    newWidth = offscreenImage.width;
    newHeight = offscreenImage.height;
  }

  // Create a canvas element to draw the resized image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = newWidth;
  canvas.height = newHeight;

  // Draw the resized image onto the canvas
  ctx.drawImage(offscreenImage, 0, 0, newWidth, newHeight);

  // Convert the canvas image to a data URL
  const resizedImageUrl = canvas.toDataURL();

  // Send a request to the API endpoint
  const response = await fetch('https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: "Bearer {API_TOKEN}"
    },
    body: JSON.stringify({ imageUrl: resizedImageUrl }),
  });

  // Get the alt text from the API response
  const { altText } = await response.json();

  // Send the processed image data back to the main thread
  self.postMessage({ image, altText });
});