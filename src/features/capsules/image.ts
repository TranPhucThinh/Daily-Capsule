import imageCompression from 'browser-image-compression';

export async function prepareCapsuleImage(file: File) {
  return imageCompression(file, {
    fileType: 'image/webp',
    initialQuality: 0.82,
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
  });
}
