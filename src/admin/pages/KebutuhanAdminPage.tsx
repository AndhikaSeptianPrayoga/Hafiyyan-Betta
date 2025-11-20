import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'
import useModal from '../../hooks/useModal'
import useDebouncedValue from '../../hooks/useDebouncedValue'
import useToast from '../../hooks/useToast'
import { listNeeds, createNeed, updateNeed, deleteNeed } from '../services/api'
import RupiahInput from '../components/RupiahInput'

type Need = {
  id: number
  name: string // Judul produk
  description: string
  price: number
  discountPercent: number
  specs: string[]
  includes: string[]
  stock: number
  mainImage: string
  images: string[]
}

// Form internal type to allow empty string while typing for numeric fields
type NeedForm = {
  name: string
  description: string
  price: number
  discountAmount: number
  specs: string[]
  includes: string[]
  stock: number | ''
  mainImage: string
  images: string[]
}

export default function KebutuhanAdminPage() {
  const [items, setItems] = useState<Need[]>([])
  const formModal = useModal()
  const [editing, setEditing] = useState<Need | null>(null)
  const [form, setForm] = useState<NeedForm>({
    name: '',
    description: '',
    price: 0,
    discountAmount: 0,
    specs: [],
    includes: [],
    stock: 0,
    mainImage: '',
    images: [],
  })
  const [specInput, setSpecInput] = useState('')
  const [includeInput, setIncludeInput] = useState('')
  
  const [query, setQuery] = useState('')
  const toast = useToast()
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const debouncedQuery = useDebouncedValue(query, 300)

  useEffect(() => {
    listNeeds()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => toast.show('Gagal memuat kebutuhan', { type: 'error' }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({
      name: '',
      description: '',
      price: 0,
      discountAmount: 0,
      specs: [],
      includes: [],
      stock: 0,
      mainImage: '',
      images: [],
    })
    setSpecInput('')
    setIncludeInput('')
    formModal.open()
  }
  const openEdit = (n: Need) => {
    setEditing(n)
    const hasDiscount = typeof n.discountPercent === 'number' && n.discountPercent > 0
    const estimatedOriginal = hasDiscount ? Math.round(n.price / (1 - n.discountPercent / 100)) : n.price
    const discountAmount = Math.max(0, estimatedOriginal - n.price)
    setForm({
      name: n.name,
      description: n.description,
      price: n.price,
      discountAmount,
      specs: [...n.specs],
      includes: [...n.includes],
      stock: n.stock,
      mainImage: n.mainImage,
      images: [...n.images],
    })
    setSpecInput('')
    setIncludeInput('')
    formModal.open()
  }
  const removeItem = (id: number) => setConfirmId(id)
  const submitForm = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Math.max(0, Math.min(form.price, form.discountAmount || 0))
    const finalPrice = Math.max(0, form.price - amount)
    const discountPercent = form.price > 0 ? Math.round((amount / form.price) * 100) : 0
    const payload = {
      name: form.name,
      description: form.description,
      price: finalPrice,
      discountPercent,
      specs: form.specs,
      includes: form.includes,
      stock: typeof form.stock === 'number' ? form.stock : 0,
      mainImage: form.mainImage,
      images: form.images,
    }
    if (editing) {
      updateNeed(editing.id, payload)
        .then((updated) => {
          setItems((prev) => prev.map((i) => (i.id === editing.id ? updated : i)))
          toast.show('Perubahan disimpan')
        })
        .catch((err) => toast.show(err?.message || 'Gagal menyimpan perubahan', { type: 'error' }))
    } else {
      createNeed(payload)
        .then((created) => {
          setItems((prev) => [created, ...prev])
          toast.show('Item baru ditambahkan')
        })
        .catch((err) => toast.show(err?.message || 'Gagal menambahkan item', { type: 'error' }))
    }
    formModal.close()
  }

  const addListItem = (key: 'specs' | 'includes', value: string) => {
    const v = value.trim()
    if (!v) return
    setForm((f) => ({ ...f, [key]: [...f[key], v] }))
    if (key === 'specs') setSpecInput('')
    if (key === 'includes') setIncludeInput('')
  }

  const removeListItem = (key: 'specs' | 'includes', index: number) => {
    setForm((f) => ({ ...f, [key]: f[key].filter((_, i) => i !== index) }))
  }

  const onMainImageChange = (file?: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm((f) => ({ ...f, mainImage: String(reader.result) }))
    reader.readAsDataURL(file)
  }

  const onGalleryChange = (files?: FileList | null) => {
    if (!files || files.length === 0) return
    const readers: Promise<string>[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      readers.push(
        new Promise((resolve) => {
          const r = new FileReader()
          r.onload = () => resolve(String(r.result))
          r.readAsDataURL(file)
        })
      )
    }
    Promise.all(readers).then((urls) => {
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }))
    })
  }

  const removeImageAt = (index: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Kelola Kebutuhan Cupang</h2>
          <p className="text-sm text-gray-500">Tambah, ubah, dan hapus kebutuhan</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg bg-primary-main text-white hover:bg-primary-dark"
        >
          Tambah Item
        </button>
      </div>

      <Modal
        isOpen={formModal.isOpen}
        title={editing ? 'Edit Kebutuhan' : 'Tambah Kebutuhan'}
        onClose={formModal.close}
      >
        <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <label className="form-label">Judul</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="form-input"
              placeholder="Judul produk"
            />
          </div>
          <div className="md:col-span-1">
            <label className="form-label">Harga (Rp)</label>
            <RupiahInput
              value={form.price}
              onChange={(v) => setForm((f) => ({ ...f, price: v }))}
              placeholder="Masukkan harga, otomatis pakai titik"
            />
          </div>

          <div className="md:col-span-2">
            <label className="form-label">Diskon (Rp)</label>
            <RupiahInput
              value={form.discountAmount}
              onChange={(v) => setForm((f) => ({ ...f, discountAmount: v }))}
              placeholder="Masukkan potongan harga dalam rupiah"
            />
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Stok</label>
            <input
              type="number"
              min={0}
              value={typeof form.stock === 'string' ? '' : form.stock}
              onChange={(e) => {
                const v = e.target.value
                if (v === '') {
                  setForm((f) => ({ ...f, stock: '' as '' }))
                } else {
                  const num = Math.max(0, Number(v))
                  setForm((f) => ({ ...f, stock: num }))
                }
              }}
              className="form-input no-spin"
              placeholder="Jumlah stok tersedia"
              onWheel={(e) => {
                e.preventDefault()
                ;(e.currentTarget as HTMLInputElement).blur()
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              onKeyDown={(e) => {
                const allowedKeys = [
                  'Backspace',
                  'Tab',
                  'Enter',
                  'Escape',
                  'Delete',
                  'ArrowLeft',
                  'ArrowRight',
                  'Home',
                  'End',
                ]
                const isCtrlCombo = e.ctrlKey || e.metaKey
                const isCtrlAllowed = ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())
                const isNumberKey = /[0-9]/.test(e.key)
                const isNumpadKey = e.code?.startsWith('Numpad') && /[0-9]/.test(e.key)
                if (
                  allowedKeys.includes(e.key) ||
                  (isCtrlCombo && isCtrlAllowed) ||
                  isNumberKey ||
                  isNumpadKey
                ) {
                  return
                }
                if (
                  e.key === 'ArrowUp' ||
                  e.key === 'ArrowDown' ||
                  e.key === '.' ||
                  e.key === ',' ||
                  e.key === '-' ||
                  e.key === '+' ||
                  e.key.toLowerCase() === 'e'
                ) {
                  e.preventDefault()
                } else {
                  e.preventDefault()
                }
              }}
            />
          </div>

          {/* Upload Gambar */}
          <div className="md:col-span-2">
            <label className="form-label">Gambar Utama</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onMainImageChange(e.target.files?.[0])}
              className="form-input"
            />
            <p className="form-helper">
              Pilih satu gambar utama produk. Disarankan resolusi cukup tinggi.
            </p>
            {form.mainImage && (
              <div className="mt-2">
                <img
                  src={form.mainImage}
                  alt="Gambar Utama"
                  className="w-full h-40 object-cover rounded-lg border"
                />
              </div>
            )}
            <p className="form-helper">
              Format JPG/PNG. Disarankan rasio 1:1 atau 4:3.
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="form-label">
              Galeri (Sub Gambar)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onGalleryChange(e.target.files)}
              className="form-input"
            />
            <p className="form-helper">
              Anda bisa memilih beberapa file sekaligus untuk galeri.
            </p>
            {form.images.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      alt={`Galeri ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 text-xs bg-white/80 rounded px-2 py-1 border"
                      onClick={() => removeImageAt(idx)}
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="form-helper">
              Pilih beberapa file sekaligus untuk menambah galeri.
            </p>
          </div>

          <div className="md:col-span-4">
            <label className="form-label">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="form-textarea min-h-[120px]"
              placeholder="Deskripsi singkat produk"
            />
          </div>

          {/* Spesifikasi Produk */}
          <div className="md:col-span-2">
            <label className="form-label">
              Spesifikasi Produk (list)
            </label>
            <div className="flex gap-2">
              <input
                value={specInput}
                onChange={(e) => setSpecInput(e.target.value)}
                className="form-input flex-1"
                placeholder="Tambahkan spesifikasi"
              />
              <button
                type="button"
                className="btn-outline"
                onClick={() => addListItem('specs', specInput)}
              >
                Tambah
              </button>
            </div>
            <ul className="mt-2 space-y-1">
              {form.specs.map((s, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 rounded-md bg-gray-50"
                >
                  <span className="text-sm text-gray-700">{s}</span>
                  <button
                    type="button"
                    className="text-xs text-red-600 hover:underline"
                    onClick={() => removeListItem('specs', idx)}
                  >
                    Hapus
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Yang Termasuk */}
          <div className="md:col-span-2">
            <label className="form-label">
              Yang Termasuk (list)
            </label>
            <div className="flex gap-2">
              <input
                value={includeInput}
                onChange={(e) => setIncludeInput(e.target.value)}
                className="form-input flex-1"
                placeholder="Tambahkan item termasuk"
              />
              <button
                type="button"
                className="btn-outline"
                onClick={() => addListItem('includes', includeInput)}
              >
                Tambah
              </button>
            </div>
            <ul className="mt-2 space-y-1">
              {form.includes.map((s, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 rounded-md bg-gray-50"
                >
                  <span className="text-sm text-gray-700">{s}</span>
                  <button
                    type="button"
                    className="text-xs text-red-600 hover:underline"
                    onClick={() => removeListItem('includes', idx)}
                  >
                    Hapus
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Keunggulan Produk dihilangkan sesuai permintaan */}

          <div className="md:col-span-4 flex items-center justify-end gap-2 sticky bottom-0 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-3 border-t">
            <button
              type="button"
              className="btn-outline"
              onClick={formModal.close}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {editing ? 'Simpan Perubahan' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500">
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">Harga</th>
              <th className="px-4 py-3">Diskon (%)</th>
              <th className="px-4 py-3">Stok</th>
              <th className="px-4 py-3">Gambar</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items
              .filter((i) => i.name.toLowerCase().includes(debouncedQuery.toLowerCase()))
              .map((i) => (
                <tr key={i.id} className="text-sm">
                  <td className="px-4 py-3 font-medium text-gray-900">{i.name}</td>
                  <td className="px-4 py-3 text-gray-600">Rp {i.price.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3 text-gray-600">{i.discountPercent}%</td>
                  <td className="px-4 py-3 text-gray-600">{i.stock}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {(i.mainImage ? 1 : 0) + i.images.length} foto
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(i)}
                        className="px-3 py-1 rounded-md border hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeItem(i.id)}
                        className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-3 px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-main focus:ring-primary-main text-sm"
          placeholder="Cari kebutuhan..."
        />
      </div>

      <ConfirmDialog
        open={confirmId !== null}
        title="Hapus Item?"
        description="Tindakan ini tidak bisa dibatalkan."
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId !== null) {
            deleteNeed(confirmId)
              .then(() => {
                setItems((prev) => prev.filter((i) => i.id !== confirmId))
                toast.show('Item dihapus')
              })
              .catch((err) => toast.show(err?.message || 'Gagal menghapus item', { type: 'error' }))
            setConfirmId(null)
          }
        }}
      />

      {toast.message && (
        <Toast message={toast.message} type={toast.type} onClose={toast.clear} />
      )}
    </div>
  )
}
