/**
 * Converte um arquivo de imagem em data URL JPEG redimensionada.
 * @param file - Arquivo selecionado no formulário
 * @param maxWidth - Largura máxima em pixels
 * @param quality - Qualidade JPEG entre 0 e 1
 * @returns Data URL pronta para envio/gravação
 */
export function fileToCompressedDataUrl(
  file: File,
  maxWidth = 1400,
  quality = 0.85,
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/") && !/\.(jpe?g|png|webp|gif)$/i.test(file.name)) {
      reject(new Error("Selecione uma imagem JPG, PNG, WEBP ou GIF."));
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      reject(new Error("A imagem deve ter no máximo 8 MB."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Falha ao converter a imagem."));
        return;
      }

      const img = document.createElement("img");
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.naturalWidth);
        const width = Math.max(1, Math.round(img.naturalWidth * scale));
        const height = Math.max(1, Math.round(img.naturalHeight * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Não foi possível processar a imagem."));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        try {
          resolve(canvas.toDataURL("image/jpeg", quality));
        } catch {
          reject(new Error("Falha ao compactar a imagem."));
        }
      };
      img.onerror = () => reject(new Error("Arquivo de imagem inválido."));
      img.src = result;
    };
    reader.readAsDataURL(file);
  });
}
