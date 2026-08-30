"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

export function SkeletonImage({
  className,
  ...props
}: ImageProps) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && (
        <div className={cn("absolute inset-0 z-0 animate-pulse bg-muted-foreground/15", className)} />
      )}
      <Image
        className={cn(
          "transition-opacity duration-300",
          loading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={() => setLoading(false)}
        unoptimized={true}
        {...props}
      />
    </>
  );
}
