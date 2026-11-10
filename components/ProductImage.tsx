import Image from "next/image";
import { BottleIcon } from "./icons";

export default function ProductImage({
  src,
  alt,
  sizes,
  priority = false,
  padding = "p-4",
}: {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  padding?: string;
}) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center text-linea">
        <BottleIcon className="h-1/3 w-1/3" />
      </div>
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-contain ${padding}`} />;
}
