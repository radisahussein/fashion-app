"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      setError("Invalid email or password")
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-card border border-border p-6 space-y-4 shadow-[0_2px_12px_rgba(45,38,38,0.06)]"
    >
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-xl"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded-xl"
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  )
}
