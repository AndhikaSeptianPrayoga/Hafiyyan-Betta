import { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'
import useModal from '../../hooks/useModal'
import useDebouncedValue from '../../hooks/useDebouncedValue'
import useToast from '../../hooks/useToast'
import { listCustomers, createCustomer, updateCustomer, deleteCustomer } from '../services/api'

type Customer = {
  id: number
  name: string
  email: string
}

export default function UserAdminPage() {
  const [items, setItems] = useState<Customer[]>([])
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 250)
  const toast = useToast()

  const formModal = useModal()
  const [editing, setEditing] = useState<Customer | null>(null)
  const [form, setForm] = useState<{ name: string; email: string; password: string }>({
    name: '',
    email: '',
    password: '',
  })
  const [confirmId, setConfirmId] = useState<number | null>(null)

  useEffect(() => {
    listCustomers()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => toast.show(err?.message || 'Gagal memuat pengguna', { type: 'error' }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', email: '', password: '' })
    formModal.open()
  }

  const openEdit = (u: Customer) => {
    setEditing(u)
    setForm({ name: u.name, email: u.email, password: '' })
    formModal.open()
  }

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      const payload: Partial<typeof form> = { name: form.name, email: form.email }
      if (form.password.trim()) payload.password = form.password
      updateCustomer(editing.id, payload)
        .then((updated) => {
          setItems((prev) => prev.map((i) => (i.id === editing.id ? { ...i, ...updated } : i)))
          toast.show('Perubahan pengguna disimpan')
          formModal.close()
        })
        .catch((err) => toast.show(err?.message || 'Gagal menyimpan perubahan', { type: 'error' }))
    } else {
      if (!form.password.trim()) {
        toast.show('Password wajib diisi untuk pengguna baru', { type: 'error' })
        return
      }
      createCustomer({ name: form.name, email: form.email, password: form.password })
        .then((created) => {
          setItems((prev) => [created, ...prev])
          toast.show('Pengguna baru ditambahkan')
          formModal.close()
        })
        .catch((err) => toast.show(err?.message || 'Gagal menambahkan pengguna', { type: 'error' }))
    }
  }

  const removeItem = (id: number) => setConfirmId(id)

  const confirmDelete = () => {
    if (!confirmId) return
    deleteCustomer(confirmId)
      .then(() => {
        setItems((prev) => prev.filter((i) => i.id !== confirmId))
        toast.show('Pengguna dihapus')
      })
      .catch((err) => toast.show(err?.message || 'Gagal menghapus pengguna', { type: 'error' }))
      .finally(() => setConfirmId(null))
  }

  const filtered = items.filter((i) => {
    const q = debouncedQuery.trim().toLowerCase()
    if (!q) return true
    return i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Kelola Pengguna</h2>
          <p className="text-sm text-gray-500">Tambah, ubah, dan hapus akun pengguna</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg bg-primary-main text-white hover:bg-primary-dark"
        >
          Tambah Pengguna
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <input
          className="form-input max-w-xs"
          placeholder="Cari nama atau email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-600 border-b">
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3 w-40">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="px-4 py-3 text-gray-900 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm"
                        onClick={() => openEdit(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 text-sm"
                        onClick={() => removeItem(u.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                    Tidak ada pengguna
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={formModal.isOpen}
        title={editing ? 'Edit Pengguna' : 'Tambah Pengguna'}
        onClose={formModal.close}
      >
        <form onSubmit={submitForm} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Nama</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="form-input"
              placeholder="Nama pengguna"
            />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="form-input"
              placeholder="email@contoh.com"
            />
          </div>
          <div className="md:col-span-2">
            <label className="form-label">{editing ? 'Password (opsional untuk ubah)' : 'Password'}</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="form-input"
              placeholder={editing ? 'Kosongkan jika tidak diubah' : 'Minimal 8 karakter'}
              onWheel={(e) => {
                e.preventDefault()
                ;(e.currentTarget as HTMLInputElement).blur()
              }}
            />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={formModal.close}>
              Batal
            </button>
            <button type="submit" className="btn-primary">
              {editing ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        title="Hapus Pengguna"
        description="Aksi ini tidak dapat dibatalkan. Pengguna akan dihapus permanen."
        onCancel={() => setConfirmId(null)}
        onConfirm={confirmDelete}
      />

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={toast.clear}
          duration={toast.duration}
        />
      )}
    </div>
  )
}