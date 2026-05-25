import { NavBar } from "@/components/layout/nav-bar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh]" style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}>
      {children}
      <NavBar />
    </div>
  )
}
