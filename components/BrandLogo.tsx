import Image from "next/image";
import { BRAND } from "@/data/brand";

interface BrandLogoProps {
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  alt?: string;
}

export default function BrandLogo({
  className = "block h-auto w-[150px] max-md:w-[120px] max-sm:w-[95px] object-contain drop-shadow-sm",
  priority = false,
  width = 848,
  height = 250,
  alt = BRAND.name,
}: BrandLogoProps) {
  return (
    <Image
      src={BRAND.logo}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );
}
