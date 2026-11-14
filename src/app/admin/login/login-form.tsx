"use client"

import { useActionState } from "react"
import { login } from "./actions"

const field = "h-12 rounded-xl border border-border bg-background px-4 text-base outline-none focus:border-foreground"

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null)
  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        שם משתמש
        <input name="username" required autoComplete="username" autoCapitalize="none" dir="ltr" className={field} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        סיסמה
        <input name="password" type="password" required autoComplete="current-password" dir="ltr" className={field} />
      </label>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <button disabled={pending} className="h-12 rounded-full bg-foreground text-base font-bold text-background disabled:opacity-50">
        {pending ? "נכנסים…" : "כניסה"}
      </button>
    </form>
  )
}
