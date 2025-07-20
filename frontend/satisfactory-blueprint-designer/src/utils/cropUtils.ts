// src/utils/cropUtils.ts

/**
 * Creates an HTMLImageElement from a URL or blob URL.
 * @param src - The source URL of the image.
 * @returns A promise that resolves to the loaded HTMLImageElement.
 */
export function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (error) => reject(error));
    img.src = src;
  });
}

/**
 * Crops an image given its source and cropping rectangle.
 * @param imageSrc - URL (or blob URL) of the source image.
 * @param pixelCrop - Object with { x, y, width, height } specifying the crop box.
 * @returns A promise that resolves to a Blob of the cropped image (PNG format).
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob> {
  // 1) Load the image
  const image = await createImage(imageSrc);

  // 2) Create a canvas of the desired size
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // 3) Draw the cropped area onto the canvas
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get 2D context');

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // 4) Convert canvas to Blob
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas is empty'));
    }, 'image/png');
  });
}
