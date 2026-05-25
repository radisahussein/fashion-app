import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { format, parseISO } from "date-fns"
import { getLaundrySession } from "@/lib/db/laundry"
import { ReturnChecklist } from "@/components/laundry/return-checklist"
import { DeleteSessionButton } from "@/components/laundry/delete-session-button"

const STATUS_LABEL: Record<string, string> = {
  ongoing: "Ongoing",
  completed: "Returned",
  partial: "Partial",
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function LaundrySessionPage({ params }: Props) {
  const { id } = await params
  const session = await getLaundrySession(id)
  if (!session) notFound()

  return (
    <main className="px-4 pt-6 pb-6 space-y-5">
      <div className="flex items-center justify-between">
        <Link href="/laundry" className="text-muted-foreground">
          <ChevronLeft size={20} strokeWidth={1.5} />
        </Link>
        <DeleteSessionButton id={id} />
      </div>

      <div>
        <h1 className="text-xl font-semibold">{session.location_name}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {format(parseISO(session.start_date), "MMMM d, yyyy")}
          {session.end_date && ` – ${format(parseISO(session.end_date), "MMMM d, yyyy")}`}
        </p>
      </div>

      {/* Status + meta */}
      <div className="rounded-2xl border border-border divide-y divide-border">
        <div className="flex justify-between px-4 py-3 text-sm">
          <span className="text-muted-foreground">Status</span>
          <span className={`font-medium ${
            session.status === "completed" ? "text-secondary"
            : session.status === "partial" ? "text-destructive"
            : "text-laundry-foreground"
          }`}>
            {STATUS_LABEL[session.status]}
          </span>
        </div>
        {session.price != null && (
          <div className="flex justify-between px-4 py-3 text-sm">
            <span className="text-muted-foreground">Price</span>
            <span className="font-medium">${session.price.toFixed(2)}</span>
          </div>
        )}
        {session.weight_kg != null && (
          <div className="flex justify-between px-4 py-3 text-sm">
            <span className="text-muted-foreground">Weight</span>
            <span className="font-medium">{session.weight_kg} kg</span>
          </div>
        )}
        {session.notes && (
          <div className="flex justify-between px-4 py-3 text-sm">
            <span className="text-muted-foreground">Notes</span>
            <span className="font-medium max-w-[180px] text-right">{session.notes}</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Return checklist</p>
        <ReturnChecklist session={session} />
      </div>
    </main>
  )
}
