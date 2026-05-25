"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Shirt, Plus, BookOpen, WashingMachine } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/closet", icon: Shirt, label: "Closet" },
  { href: "/outfit-log/new", icon: Plus, label: "Log", isFab: true },
  { href: "/lookbook", icon: BookOpen, label: "Lookbook" },
  { href: "/laundry", icon: WashingMachine, label: "Laundry" },
]

export function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-t border-border">
      <div className="flex items-center justify-around px-2 pb-safe pt-2 h-16">
        {tabs.map(({ href, icon: Icon, label, isFab }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href.replace("/new", "")))

          if (isFab) {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 active:scale-95 transition-transform">
                  <Icon size={22} strokeWidth={1.5} />
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center"
            >
              <span
                className={cn(
                  "flex items-center justify-center w-10 h-8 rounded-full transition-colors",
                  isActive ? "bg-muted" : ""
                )}
              >
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  className={cn(
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium uppercase tracking-wide",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
