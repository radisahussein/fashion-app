"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CheckCircle, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateReturnedItemsAction } from "@/app/actions/laundry"
import type { LaundrySession } from "@/types"

interface Props {
  session: LaundrySession
}

export function ReturnChecklist({ session }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [returnedIds, setReturnedIds] = useState<Set<string>>(
    new Set((session.items ?? []).filter((i) => i.returned).map((i) => i.clothing_item_id))
  )

  function toggle(id: string) {
    setReturnedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleSave() {
    startTransition(async () => {
      await updateReturnedItemsAction(session.id, Array.from(returnedIds))
      router.refresh()
    })
  }

  const items = session.items ?? []

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No items in this session.</p>
  }

  return (
    <div className="space-y-3">
      <div className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
        {items.map((li) => {
          const item = li.clothing_item
          const checked = returnedIds.has(li.clothing_item_id)
          return (
            <button
              key={li.id}
              type="button"
              onClick={() => toggle(li.clothing_item_id)}
              className="w-full flex items-center gap-3 px-4 py-3 active:bg-muted transition-colors text-left"
            >
              <div className="w-10 h-12 rounded-lg bg-muted overflow-hidden relative shrink-0">
                {item?.photo_url ? (
                  <Image src={item.photo_url} alt={item.name ?? ""} fill className="object-cover" sizes="40px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-sm text-muted-foreground/40 font-light">
                      {(item?.category ?? "?").charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item?.name ?? "Unknown item"}</p>
                {item?.category && (
                  <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                )}
              </div>
              {checked
                ? <CheckCircle size={20} strokeWidth={1.5} className="text-secondary shrink-0" />
                : <Circle size={20} strokeWidth={1.5} className="text-muted-foreground shrink-0" />
              }
            </button>
          )
        })}
      </div>

      <Button
        onClick={handleSave}
        disabled={isPending}
        className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isPending ? "Saving…" : "Save returned items"}
      </Button>
    </div>
  )
}
