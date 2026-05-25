import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Wardrobe
          </h1>
          <p className="text-sm text-muted-foreground">
            Your personal outfit tracker
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
