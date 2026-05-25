import { AlertCircle } from "lucide-react"
import type { RequirementViolation } from "@/types"

export function RequirementViolations({ violations }: { violations: RequirementViolation[] }) {
  if (violations.length === 0) return null
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 space-y-1.5">
      {violations.map((v) => (
        <div key={v.rule} className="flex items-start gap-2">
          <AlertCircle size={14} className="text-destructive mt-0.5 shrink-0" strokeWidth={1.5} />
          <p className="text-xs text-destructive">{v.message}</p>
        </div>
      ))}
    </div>
  )
}
