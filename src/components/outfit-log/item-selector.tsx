"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ClothingItem } from "@/types"

interface Props {
  items: ClothingItem[]
  selected: string[]
  onChange: (ids: string[]) => void
}

export function ItemSelector({ items, selected, onChange }: Props) {
  const [query, setQuery] = useState("")

  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  )

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search items…"
          className="pl-8 rounded-xl h-9 text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">No items found</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto pb-1">
          {filtered.map((item) => {
            const isSelected = selected.includes(item.id)
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(item.id)}
                className={cn(
                  "relative rounded-xl border overflow-hidden text-left transition-all",
                  isSelected ? "border-primary ring-1 ring-primary" : "border-border"
                )}
              >
                <div className="aspect-[3/4] bg-muted relative">
                  {item.photo_url ? (
                    <Image src={item.photo_url} alt={item.name} fill className="object-cover" sizes="120px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-lg text-muted-foreground/30">{item.category.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check size={11} className="text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-[10px] font-medium px-1.5 py-1 truncate">{item.name}</p>
              </button>
            )
          })}
        </div>
      )}

      {selected.length > 0 && (
        <p className="text-xs text-muted-foreground">{selected.length} item{selected.length !== 1 ? "s" : ""} selected</p>
      )}
    </div>
  )
}
