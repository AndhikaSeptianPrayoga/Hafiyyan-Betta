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