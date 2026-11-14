import { LoginForm } from "./login-form"

export const metadata = { title: "כניסה | clearbrick admin" }

export default function LoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-1">
          <span className="flex items-baseline gap-2 text-xl font-black">
            clearbrick <span className="rounded bg-foreground px-1.5 py-0.5 text-xs font-bold text-background">admin</span>
          </span>
          <p className="text-muted-foreground">כניסה לפאנל הניהול</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
