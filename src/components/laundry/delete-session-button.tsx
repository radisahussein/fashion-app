"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { deleteLaundrySessionAction } from "@/app/actions/laundry"

export function DeleteSessionButton({ id }: { id: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm("Delete this laundry session?")) return
    startTransition(async () => {
      await deleteLaundrySessionAction(id)
      router.push("/laundry")
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-destructive disabled:opacity-50"
      aria-label="Delete session"
    >
      <Trash2 size={18} strokeWidth={1.5} />
    </button>
  )
}
