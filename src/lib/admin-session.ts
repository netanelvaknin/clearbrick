// Admin session cookie: "<expiry>.<hmac>", signed with ADMIN_PASSWORD (changing the password logs everyone out).
// Web Crypto only, so it runs in the proxy and in server actions alike.
export const SESSION_COOKIE = "cb_admin"
export const SESSION_DAYS = 30

const enc = new TextEncoder()

async function sign(value: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(process.env.ADMIN_PASSWORD ?? ""), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value))
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/[+/=]/g, (c) => ({ "+": "-", "/": "_", "=": "" })[c]!)
}

export async function createSession() {
  const expires = Date.now() + SESSION_DAYS * 86_400_000
  return `${expires}.${await sign(`admin:${expires}`)}`
}

export async function verifySession(token: string | undefined) {
  if (!token || !process.env.ADMIN_PASSWORD) return false
  const [expires, sig] = token.split(".")
  if (!expires || !sig || Number(expires) < Date.now()) return false
  return safeEqual(sig, await sign(`admin:${expires}`))
}

// Constant-time string compare.
export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}
