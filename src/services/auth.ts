const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export type AuthUser = { id: number; name: string; email: string; role: string }
export type AuthResponse = { token: string; user: AuthUser }

export async function userRegister(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Registrasi gagal')
  }
  return res.json()
}

export async function userLogin(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Login gagal')
  }
  return res.json()
}

export async function userMe(token: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Sesi tidak valid')
  }
  return res.json()
}

export function saveAuth(auth: AuthResponse) {
  localStorage.setItem('user_token', auth.token)
  localStorage.setItem('user_info', JSON.stringify(auth.user))
}

export function getAuth() {
  const token = localStorage.getItem('user_token')
  const infoRaw = localStorage.getItem('user_info')
  const user = infoRaw ? (JSON.parse(infoRaw) as AuthUser) : null
  return { token, user }
}

export function clearAuth() {
  localStorage.removeItem('user_token')
  localStorage.removeItem('user_info')
}