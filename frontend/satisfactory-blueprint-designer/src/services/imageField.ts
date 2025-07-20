// src/services/imageField.ts
import { imageService } from './imageService';

/**
 * Helper to synchronize an image field (iconKey) and underlying blob
 *
 * @param oldKey The original key stored in the entity (undefined if none)
 * @param newKey The key the user entered in the form ('' if cleared)
 * @param file   A File object if the user uploaded a new image, else undefined
 * @returns the final key string to send in the entity update payload
 */
export async function syncImageField(
  oldKey: string | undefined,
  newKey: string,
  file?: File
): Promise<string> {
  // 1) Removal: user cleared the key and no new file => delete old blob
  if (newKey === '' && !file && oldKey) {
    await imageService.delete(oldKey);
    return '';
  }

  // Helper to convert Blob/File to base64 payload
  const toBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  // 2) Upload new file if provided
  if (file) {
    const base64 = await toBase64(file);
    const resp = await imageService.upload({
      key: newKey,
      contentType: file.type,
      data: base64,
    });
    const finalKey = resp.key;
    // Clean up old blob if it differed
    if (oldKey && oldKey !== finalKey) {
      await imageService.delete(oldKey);
    }
    return finalKey;
  }

  // 3) Re-key existing blob if key changed only
  if (newKey && oldKey && newKey !== oldKey) {
    // fetch existing blob
    const blob = await imageService.get(oldKey);
    const base64 = await toBase64(blob);
    const resp = await imageService.upload({
      key: newKey,
      contentType: blob.type,
      data: base64,
    });
    // delete old key
    await imageService.delete(oldKey);
    return resp.key;
  }

  // 4) No change: keep original key or blank
  return oldKey ?? '';
}
