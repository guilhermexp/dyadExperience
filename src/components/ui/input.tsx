import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-white placeholder:text-white/40 selection:bg-white/20 selection:text-white bg-white/5 backdrop-blur-sm border-white/15 flex h-7 w-full min-w-0 rounded-md border px-2 py-1 text-xs shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 text-white",
        "focus-visible:border-white/30 focus-visible:ring-white/20 focus-visible:ring-[2px]",
        "aria-invalid:ring-red-400/20 aria-invalid:border-red-400",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
