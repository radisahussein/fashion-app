"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { deleteClothingItemAction } from "@/app/actions/clothing"

export function DeleteItemButton({ id }: { id: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm("Remove this item from your closet?")) return
    startTransition(async () => {
      await deleteClothingItemAction(id)
      router.push("/closet")
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-destructive disabled:opacity-50"
      aria-label="Delete item"
    >
      <Trash2 size={18} strokeWidth={1.5} />
    </button>
  )
}
