"use client";

import { SkeletonImage } from "@/components/ui/skeleton-image";
import { NoneIllustration } from "@/components/intake/none-illustration";

/** Renders an option's illustration, or the drawn "none" fallback when we
 *  don't have a photo for it — so a tile is never just an empty gray box. */
export function OptionImage({ src, alt, sizes }: { src?: string; alt: string; sizes?: string }) {
  if (!src) return <NoneIllustration className="absolute inset-0 h-full w-full" />;
  return <SkeletonImage src={src} alt={alt} fill className="object-cover" sizes={sizes ?? "200px"} />;
}
