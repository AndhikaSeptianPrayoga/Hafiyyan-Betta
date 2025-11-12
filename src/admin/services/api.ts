const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

type LoginResponse = {
  token: string
  user: { id: number; name: string; email: string; role: string }
}

export async function adminLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    let message = 'Login gagal'
    try {
      const data = await res.json()
      message = data?.error || message
    } catch {}
    throw new Error(message)
  }
  return res.json()
}

export async function getMe(token: string) {
  const res = await fetch(`${API_BASE}/api/admin/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    let message = 'Sesi admin tidak valid'
    try {
      const data = await res.json()
      message = data?.error || message
    } catch {}
    throw new Error(message)
  }
  return res.json()
}

function authHeader(): Record<string, string> {
  const token = localStorage.getItem('admin_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Articles CRUD
export async function listArticles() {
  const res = await fetch(`${API_BASE}/api/articles`)
  if (!res.ok) throw new Error('Gagal memuat artikel')
  return res.json()
}

export async function getArticle(id: number) {
  const res = await fetch(`${API_BASE}/api/articles/${id}`)
  if (!res.ok) throw new Error('Artikel tidak ditemukan')
  return res.json()
}

export async function createArticle(payload: any) {
  const res = await fetch(`${API_BASE}/api/articles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal membuat artikel')
  }
  return res.json()
}

export async function updateArticle(id: number, payload: any) {
  const res = await fetch(`${API_BASE}/api/articles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal memperbarui artikel')
  }
  return res.json()
}

export async function deleteArticle(id: number) {
  const res = await fetch(`${API_BASE}/api/articles/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal menghapus artikel')
  }
  return res.json()
}

// Fish CRUD
export async function listFish() {
  const res = await fetch(`${API_BASE}/api/fish`)
  if (!res.ok) throw new Error('Gagal memuat ikan')
  return res.json()
}

export async function getFish(id: number) {
  const res = await fetch(`${API_BASE}/api/fish/${id}`)
  if (!res.ok) throw new Error('Ikan tidak ditemukan')
  return res.json()
}

export async function createFish(payload: any) {
  const res = await fetch(`${API_BASE}/api/fish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal membuat ikan')
  }
  return res.json()
}

export async function updateFish(id: number, payload: any) {
  const res = await fetch(`${API_BASE}/api/fish/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal memperbarui ikan')
  }
  return res.json()
}

export async function deleteFish(id: number) {
  const res = await fetch(`${API_BASE}/api/fish/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal menghapus ikan')
  }
  return res.json()
}

// Needs CRUD
export async function listNeeds() {
  const res = await fetch(`${API_BASE}/api/needs`)
  if (!res.ok) throw new Error('Gagal memuat kebutuhan')
  return res.json()
}

export async function getNeed(id: number) {
  const res = await fetch(`${API_BASE}/api/needs/${id}`)
  if (!res.ok) throw new Error('Produk kebutuhan tidak ditemukan')
  return res.json()
}

export async function createNeed(payload: any) {
  const res = await fetch(`${API_BASE}/api/needs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal membuat kebutuhan')
  }
  return res.json()
}

export async function updateNeed(id: number, payload: any) {
  const res = await fetch(`${API_BASE}/api/needs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal memperbarui kebutuhan')
  }
  return res.json()
}

export async function deleteNeed(id: number) {
  const res = await fetch(`${API_BASE}/api/needs/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal menghapus kebutuhan')
  }
  return res.json()
}

// Customers (Admin only)
export async function listCustomers() {
  const res = await fetch(`${API_BASE}/api/admin/customers`, {
    headers: authHeader(),
  })
  if (!res.ok) throw new Error('Gagal memuat pengguna')
  return res.json()
}

export async function getCustomer(id: number) {
  const res = await fetch(`${API_BASE}/api/admin/customers/${id}`, {
    headers: authHeader(),
  })
  if (!res.ok) throw new Error('Pengguna tidak ditemukan')
  return res.json()
}

export async function createCustomer(payload: { name: string; email: string; password: string }) {
  const res = await fetch(`${API_BASE}/api/admin/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal membuat pengguna')
  }
  return res.json()
}

export async function updateCustomer(
  id: number,
  payload: { name?: string; email?: string; password?: string }
) {
  const res = await fetch(`${API_BASE}/api/admin/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal memperbarui pengguna')
  }
  return res.json()
}

export async function deleteCustomer(id: number) {
  const res = await fetch(`${API_BASE}/api/admin/customers/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal menghapus pengguna')
  }
  return res.json()
}

// Competitions (Admin & User)
export type CompetitionField = { name: string; label: string; type: 'text' | 'number'; required?: boolean }
export type Competition = {
  id: number
  title: string
  description?: string
  requirements?: string[]
  form_fields?: CompetitionField[]
  status: 'draft' | 'open' | 'closed'
  start_at?: string | null
  end_at?: string | null
  max_participants?: number | null
  poster_image?: string | null
}

// Payload untuk create/update kompetisi (menggunakan camelCase untuk field baru)
export type CompetitionPayload = {
  title?: string
  description?: string
  status?: 'draft' | 'open' | 'closed'
  startAt?: string | null
  endAt?: string | null
  requirements?: string[]
  formFields?: CompetitionField[]
  maxParticipants?: number | null
  posterImage?: string | null
}

export async function listCompetitions() {
  const res = await fetch(`${API_BASE}/api/competitions`)
  if (!res.ok) throw new Error('Gagal memuat kompetisi')
  return res.json()
}

export async function listOpenCompetitions() {
  const res = await fetch(`${API_BASE}/api/competitions/open`)
  if (!res.ok) throw new Error('Gagal memuat kompetisi')
  return res.json()
}

export async function getCompetition(id: number) {
  const res = await fetch(`${API_BASE}/api/competitions/${id}`)
  if (!res.ok) throw new Error('Kompetisi tidak ditemukan')
  return res.json()
}

export async function createCompetition(payload: CompetitionPayload) {
  const res = await fetch(`${API_BASE}/api/competitions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal membuat kompetisi')
  }
  return res.json()
}

export async function updateCompetition(id: number, payload: CompetitionPayload) {
  const res = await fetch(`${API_BASE}/api/competitions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal memperbarui kompetisi')
  }
  return res.json()
}

export async function deleteCompetition(id: number) {
  const res = await fetch(`${API_BASE}/api/competitions/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal menghapus kompetisi')
  }
  return res.json()
}

export async function uploadCompetitionPoster(imageBase64: string): Promise<{ url: string }> {
  const res = await fetch(`${API_BASE}/api/competitions/poster`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ imageBase64 }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal mengunggah poster')
  }
  const data = await res.json()
  const relative = data?.url as string
  try {
    // Pastikan menjadi URL absolut agar bisa dipakai di frontend
    const absolute = new URL(relative, API_BASE).toString()
    return { url: absolute }
  } catch {
    return { url: `${API_BASE}${relative}` }
  }
}

export async function uploadCompetitionFishPhoto(imageBase64: string): Promise<{ url: string }> {
  const token = localStorage.getItem('user_token') || ''
  const res = await fetch(`${API_BASE}/api/competitions/upload-fish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ imageBase64 }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal mengunggah foto ikan')
  }
  const data = await res.json()
  const relative = data?.url as string
  try {
    const absolute = new URL(relative, API_BASE).toString()
    return { url: absolute }
  } catch {
    return { url: `${API_BASE}${relative}` }
  }
}

export type CompetitionRegistration = {
  id: number
  competition_id: number
  customer_id: number
  answers: Record<string, any>
  status: 'pending' | 'approved' | 'rejected'
  ranking?: number | null
  final_position?: string | null
  customer_name?: string
  customer_email?: string
  last_score?: { total_score?: number | null; comment?: string | null; created_at?: string | null }
}

export async function listRegistrations(competitionId: number): Promise<CompetitionRegistration[]> {
  const res = await fetch(`${API_BASE}/api/competitions/${competitionId}/registrations`, {
    headers: authHeader(),
  })
  if (!res.ok) throw new Error('Gagal memuat pendaftaran')
  return res.json()
}

export async function updateRegistrationStatus(competitionId: number, regId: number, status: 'pending' | 'approved' | 'rejected') {
  const res = await fetch(`${API_BASE}/api/competitions/${competitionId}/registrations/${regId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal memperbarui status pendaftaran')
  }
  return res.json()
}

export async function updateRegistrationRank(competitionId: number, regId: number, ranking: number | null, finalPosition?: string | null) {
  const res = await fetch(`${API_BASE}/api/competitions/${competitionId}/registrations/${regId}/rank`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ ranking, finalPosition }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal menyimpan peringkat')
  }
  return res.json()
}

export async function addRegistrationScore(competitionId: number, regId: number, payload: { scores?: Record<string, any>; totalScore?: number | null; comment?: string }) {
  const res = await fetch(`${API_BASE}/api/competitions/${competitionId}/registrations/${regId}/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal menyimpan penilaian')
  }
  return res.json()
}

// User ops
export async function registerCompetition(competitionId: number, answers: Record<string, any>) {
  const token = localStorage.getItem('user_token') || ''
  const res = await fetch(`${API_BASE}/api/competitions/${competitionId}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ answers }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal mendaftar kompetisi')
  }
  return res.json()
}

export async function myCompetitions() {
  const token = localStorage.getItem('user_token') || ''
  const res = await fetch(`${API_BASE}/api/competitions/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Gagal memuat kompetisi saya')
  }
  return res.json()
}