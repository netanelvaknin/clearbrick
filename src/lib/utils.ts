import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Teach tailwind-merge our custom display sizes so they override shadcn's text-* defaults.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": ["text-display-xl", "text-display-lg", "text-display-md", "text-display-sm", "text-eyebrow"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
