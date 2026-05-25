"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ItemSelector } from "@/components/outfit-log/item-selector"
import { createLaundrySessionAction } from "@/app/actions/laundry"
import type { ClothingItem } from "@/types"

interface Props {
  availableItems: ClothingItem[]
}

export function LaundrySessionForm({ availableItems }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formRef.current) return
    const fd = new FormData(formRef.current)
    selectedItems.forEach((id) => fd.append("item_ids", id))

    startTransition(async () => {
      const result = await createLaundrySessionAction(fd)
      if ("error" in result) {
        setError(result.error ?? "Unknown error")
        return
      }
      router.push(`/laundry/${result.id}`)
      router.refresh()
    })
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 pb-6">
      <div className="space-y-1.5">
        <Label htmlFor="location_name" className="text-sm font-medium">Location *</Label>
        <Input
          id="location_name"
          name="location_name"
          placeholder="Laundromat on Main St"
          className="rounded-xl"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="start_date" className="text-sm font-medium">Drop-off date *</Label>
        <Input
          id="start_date"
          name="start_date"
          type="date"
          defaultValue={today}
          className="rounded-xl"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="price" className="text-sm font-medium">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={0}
            step="0.01"
            placeholder="0.00"
            className="rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="weight_kg" className="text-sm font-medium">Weight (kg)</Label>
          <Input
            id="weight_kg"
            name="weight_kg"
            type="number"
            min={0}
            step="0.1"
            placeholder="0.0"
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          placeholder="Any special instructions..."
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Items</Label>
        {availableItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">All items are already in laundry.</p>
        ) : (
          <ItemSelector items={availableItems} selected={selectedItems} onChange={setSelectedItems} />
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isPending ? "Creating…" : "Start session"}
        </Button>
      </div>
    </form>
  )
}
