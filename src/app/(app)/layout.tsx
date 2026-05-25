import { NavBar } from "@/components/layout/nav-bar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] pb-20">
      {children}
      <NavBar />
    </div>
  )
}
