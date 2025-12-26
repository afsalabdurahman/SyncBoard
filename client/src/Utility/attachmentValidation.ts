const ALLOWED_MIME_TYPES = [
  // Images
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  // PDF
  'application/pdf',
  // Videos
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime', // .mov
  'video/x-msvideo', // .avi
  'video/mpeg',
];
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
export const channelAttachement = (files:File[]) =>{
   return files.every((file) => {
    const isTypeAllowed = ALLOWED_MIME_TYPES.includes(file.type);
    const isSizeAllowed = file.size <= MAX_FILE_SIZE_BYTES;

    return isTypeAllowed && isSizeAllowed;
  });

}