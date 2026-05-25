import Link from "next/link"
import { format, parseISO } from "date-fns"
import type { LaundrySession } from "@/types"

const STATUS_STYLES: Record<string, string> = {
  ongoing: "border-l-[3px] border-l-laundry",
  completed: "border-l-[3px] border-l-secondary",
  partial: "border-l-[3px] border-l-destructive",
}

const STATUS_LABEL: Record<string, string> = {
  ongoing: "Ongoing",
  completed: "Returned",
  partial: "Partial",
}

interface Props {
  session: LaundrySession
}

export function LaundrySessionCard({ session }: Props) {
  const itemCount = session.items?.length ?? 0
  const returnedCount = session.items?.filter((i) => i.returned).length ?? 0

  return (
    <Link href={`/laundry/${session.id}`} className="block">
      <div className={`rounded-2xl bg-card border border-border shadow-[0_2px_12px_rgba(45,38,38,0.06)] overflow-hidden active:scale-[0.98] transition-transform ${STATUS_STYLES[session.status]}`}>
        <div className="p-4 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold leading-tight">{session.location_name}</p>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
              session.status === "completed"
                ? "bg-secondary/20 text-secondary"
                : session.status === "partial"
                ? "bg-destructive/15 text-destructive"
                : "bg-laundry/20 text-foreground"
            }`}>
              {STATUS_LABEL[session.status]}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {format(parseISO(session.start_date), "MMM d, yyyy")}
          </p>
          {itemCount > 0 && (
            <p className="text-xs text-muted-foreground">
              {returnedCount}/{itemCount} items returned
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
