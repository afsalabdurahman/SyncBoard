export const getFileTypeFromUrl = (url: string): string => {
  // Extract the part after the last '/' and before  query params
  const pathname = url.split('/').pop()?.split('?')[0] || '';

  // Get the extension (everything after the last dot)
  const extensionMatch = pathname.match(/\.([^.]+)$/);
  const extension = extensionMatch ? extensionMatch[1].toLowerCase() : '';

  // Define types based on extension
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension)) {
    return 'image';
  }
  if (extension === 'pdf') {
    return 'pdf';
  }
  if (['doc', 'docx'].includes(extension)) {
    return 'doc';
  }
  if (['mp4', 'webm', 'ogg'].includes(extension)) {
    return 'video';
  }
  if (['mp3', 'wav', 'ogg'].includes(extension)) {
    return 'audio';
  }

  // Default fallback
  return 'file';
};