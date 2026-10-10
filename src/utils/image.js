// Riduce una foto prima dell'upload: lato lungo massimo 1600px, JPEG di qualità 0,85
// (PNG con trasparenza resta PNG). Così le foto del telefono (3-8 MB) diventano
// di poche centinaia di KB: upload sotto i limiti dell'hosting e sito più veloce.
const MAX_SIDE = 1600;

export const compressImage = async (file) => {
  if (!file || !/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    // Già piccola e leggera: si carica così com'è
    if (scale === 1 && file.size < 400 * 1024) {
      bitmap.close?.();
      return file;
    }
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();

    const keepPng = file.type === 'image/png';
    const type = keepPng ? 'image/png' : 'image/jpeg';
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, 0.85));
    if (!blob || blob.size >= file.size) return file;
    const name = file.name.replace(/\.[^.]+$/, '') + (keepPng ? '.png' : '.jpg');
    return new File([blob], name, { type });
  } catch {
    return file; // browser senza supporto: si carica l'originale
  }
};
