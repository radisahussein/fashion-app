"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  value: number | null
  onChange: (rating: number | null) => void
}

export function RatingStars({ value, onChange }: Props) {
  const [hovered, setHovered] = useState<number | null>(null)
  const display = hovered ?? value

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(value === star ? null : star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          className="p-0.5"
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
        >
          <Star
            size={22}
            strokeWidth={1.5}
            className={cn(
              "transition-colors",
              display !== null && star <= display
                ? "fill-primary text-primary"
                : "text-border"
            )}
          />
        </button>
      ))}
    </div>
  )
}
