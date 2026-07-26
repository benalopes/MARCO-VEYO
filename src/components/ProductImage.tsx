type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
};

/**
 * Exibe imagem de produto a partir de caminho público ou data URL.
 * @param props - Propriedades da imagem
 * @param props.src - URL, caminho local ou data URL
 * @param props.alt - Texto alternativo
 * @param props.className - Classe CSS opcional
 * @param props.width - Largura opcional
 * @param props.height - Altura opcional
 * @returns Elemento de imagem
 */
export function ProductImage({
  src,
  alt,
  className,
  width,
  height,
}: ProductImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
    />
  );
}
