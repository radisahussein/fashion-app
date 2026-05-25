"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { deleteLookbookAction } from "@/app/actions/lookbooks"

export function DeleteLookbookButton({ id }: { id: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm("Delete this lookbook?")) return
    startTransition(async () => {
      await deleteLookbookAction(id)
      router.push("/lookbook")
      router.refresh()
    })
  }

  return (
    <button onClick={handleDelete} disabled={isPending} className="text-destructive disabled:opacity-50" aria-label="Delete lookbook">
      <Trash2 size={18} strokeWidth={1.5} />
    </button>
  )
}
