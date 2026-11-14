"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createSession, safeEqual, SESSION_COOKIE, SESSION_DAYS } from "@/lib/admin-session"

export async function login(_: string | null, form: FormData): Promise<string | null> {
  const user = process.env.ADMIN_USER
  const pass = process.env.ADMIN_PASSWORD
  if (!user || !pass) return "הכניסה לא מוגדרת בשרת"

  const okUser = safeEqual(String(form.get("username") ?? ""), user)
  const okPass = safeEqual(String(form.get("password") ?? ""), pass)
  if (!okUser || !okPass) {
    await new Promise((r) => setTimeout(r, 600)) // slow down guessing
    return "שם משתמש או סיסמה שגויים"
  }

  ;(await cookies()).set(SESSION_COOKIE, await createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  })
  redirect("/admin")
}

export async function logout() {
  ;(await cookies()).delete(SESSION_COOKIE)
  redirect("/admin/login")
}
