import React from "react";
import { clsx } from "clsx";

export default function Card({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={clsx("glass p-4 sm:p-6", className)}>
      {children}
    </div>
  );
}
