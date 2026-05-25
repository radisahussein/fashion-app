"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const PRESET_COLORS = [
  "black", "white", "grey", "navy", "brown",
  "beige", "red", "pink", "orange", "yellow",
  "green", "blue", "purple", "cream", "olive",
]

interface Props {
  value: string[]
  onChange: (colors: string[]) => void
}

export function ColorPicker({ value, onChange }: Props) {
  const [custom, setCustom] = useState("")

  function toggle(color: string) {
    if (value.includes(color)) {
      onChange(value.filter((c) => c !== color))
    } else {
      onChange([...value, color])
    }
  }

  function addCustom() {
    const trimmed = custom.trim().toLowerCase()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setCustom("")
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => toggle(color)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors capitalize ${
              value.includes(color)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            {color}
          </button>
        ))}
      </div>

      {value.filter((c) => !PRESET_COLORS.includes(c)).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value
            .filter((c) => !PRESET_COLORS.includes(c))
            .map((color) => (
              <span
                key={color}
                className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-primary text-primary-foreground capitalize"
              >
                {color}
                <button type="button" onClick={() => toggle(color)}>
                  <X size={10} />
                </button>
              </span>
            ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Add custom color…"
          className="rounded-xl text-sm h-9"
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={addCustom}
          className="rounded-xl h-9 px-3"
        >
          <Plus size={14} />
        </Button>
      </div>
    </div>
  )
}
