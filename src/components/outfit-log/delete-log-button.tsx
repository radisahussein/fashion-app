"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { deleteOutfitLogAction } from "@/app/actions/outfit-logs"

export function DeleteLogButton({ id }: { id: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm("Delete this outfit log?")) return
    startTransition(async () => {
      await deleteOutfitLogAction(id)
      router.push("/outfit-log")
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-destructive disabled:opacity-50"
      aria-label="Delete log"
    >
      <Trash2 size={18} strokeWidth={1.5} />
    </button>
  )
}
