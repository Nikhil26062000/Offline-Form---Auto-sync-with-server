import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file to reduce size for storage or transmission.
 * @param {File} image - The image file to be compressed.
 * @returns {Promise<File>} - The compressed image file.
 */
export const compressImage = async (image) => {
  try {
    // Compression options
    const options = {
      maxSizeMB: 1, // Target file size (1 MB max)
      maxWidthOrHeight: 1024, // Resize image to max 1024px width/height
      useWebWorker: true, // Enable faster processing
    };

    // Compress image
    const compressedImage = await imageCompression(image, options);
    console.log('Compressed image:', compressedImage);

    return compressedImage;
  } catch (error) {
    console.error('Error during image compression:', error);
    throw error;
  }
};
