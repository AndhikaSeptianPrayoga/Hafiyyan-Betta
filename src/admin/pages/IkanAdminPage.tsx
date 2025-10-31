import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'
import useModal from '../../hooks/useModal'
import useDebouncedValue from '../../hooks/useDebouncedValue'
import useToast from '../../hooks/useToast'
import { listFish, createFish, updateFish, deleteFish } from '../services/api'
import RupiahInput from '../components/RupiahInput'

type Fish = {
  id: number
  name: string
  price: number
  discountPercent: number
  variety?: string
  description: string
  typeText: string
  sizeCm: string
  color: string
  gender: 'Jantan' | 'Betina' | ''
  condition: string
  age: string
  origin: string
  stock: number
  advantages: string[]
  careGuide: string[]
  mainImage: string
  images: string[]
}

// Form internal type to allow empty string while typing for numeric fields
type FishForm = {
  name: string
  price: number
  discountPercent: number | ''
  variety?: string
  description: string
  typeText: string
  sizeCm: string
  color: string
  gender: 'Jantan' | 'Betina' | ''
  condition: string
  age: string
  origin: string
  stock: number | ''
  advantages: string[]
  careGuide: string[]
  mainImage: string
  images: string[]
}

export default function IkanAdminPage() {
  const [items, setItems] = useState<Fish[]>([])
  const formModal = useModal()
  const [editing, setEditing] = useState<Fish | null>(null)
  const [form, setForm] = useState<FishForm>({
    name: '',
    price: 0,
    discountPercent: 0,
    variety: '',
    description: '',
    typeText: '',
    sizeCm: '',
    color: '',
    gender: '',
    condition: '',
    age: '',
    origin: '',
    stock: 0,
    advantages: [],
    careGuide: [],
    mainImage: '',
    images: [],
  })
  const [query, setQuery] = useState('')
  const toast = useToast()
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const [advInput, setAdvInput] = useState('')
  const [careInput, setCareInput] = useState('')
  const debouncedQuery = useDebouncedValue(query, 300)

  useEffect(() => {
    listFish()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => toast.show('Gagal memuat ikan', { type: 'error' }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({
      name: '',
      price: 0,
      discountPercent: 0,
      variety: '',
      description: '',
      typeText: '',
      sizeCm: '',
      color: '',
      gender: '',
      condition: '',
      age: '',
      origin: '',
      stock: 0,
      advantages: [],
      careGuide: [],
      mainImage: '',
      images: [],
    })
    setAdvInput('')
    setCareInput('')
    formModal.open()
  }
  const openEdit = (n: Fish) => {
    setEditing(n)
    setForm({
      name: n.name,
      price: n.price,
      discountPercent: n.discountPercent,
      variety: n.variety ?? '',
      description: n.description,
      typeText: n.typeText,
      sizeCm: n.sizeCm,
      color: n.color,
      gender: n.gender,
      condition: n.condition,
      age: n.age,
      origin: n.origin,
      stock: n.stock,
      advantages: n.advantages ?? [],
      careGuide: n.careGuide ?? [],
      mainImage: n.mainImage,
      images: n.images ?? [],
    })
    setAdvInput('')
    setCareInput('')
    formModal.open()
  }
  const removeItem = (id: number) => setConfirmId(id)
  const submitForm = (e: React.FormEvent) => {
    e.preventDefault()
    const discount = typeof form.discountPercent === 'number' ? form.discountPercent : 0
    // Backend diinterpretasikan menyimpan harga akhir; kirim harga setelah diskon
    const finalPrice = Math.round(form.price * (1 - discount / 100))
    const payload = {
      ...form,
      price: finalPrice,
      discountPercent: discount,
      stock: typeof form.stock === 'number' ? form.stock : 0,
    }
    if (editing) {
      updateFish(editing.id, payload)
        .then((updated) => {
          setItems((prev) => prev.map((i) => (i.id === editing.id ? updated : i)))
          toast.show('Perubahan disimpan')
        })
        .catch((err) => toast.show(err?.message || 'Gagal menyimpan perubahan', { type: 'error' }))
    } else {
      createFish(payload)
        .then((created) => {
          setItems((prev) => [created, ...prev])
          toast.show('Ikan baru ditambahkan')
        })
        .catch((err) => toast.show(err?.message || 'Gagal menambahkan ikan', { type: 'error' }))
    }
    formModal.close()
  }

  const addAdvantage = () => {
    const v = advInput.trim()
    if (!v) return
    setForm((f) => ({ ...f, advantages: [v, ...f.advantages] }))
    setAdvInput('')
  }
  const removeAdvantageAt = (idx: number) => {
    setForm((f) => ({ ...f, advantages: f.advantages.filter((_, i) => i !== idx) }))
  }
  const addCareGuide = () => {
    const v = careInput.trim()
    if (!v) return
    setForm((f) => ({ ...f, careGuide: [v, ...f.careGuide] }))
    setCareInput('')
  }
  const removeCareAt = (idx: number) => {
    setForm((f) => ({ ...f, careGuide: f.careGuide.filter((_, i) => i !== idx) }))
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

  // Memudahkan set gambar utama langsung dari galeri
  const setMainFromGallery = (img: string) => {
    setForm((f) => ({ ...f, mainImage: img }))
  }

  const removeImageAt = (index: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Kelola Ikan Cupang</h2>
          <p className="text-sm text-gray-500">Tambah, ubah, dan hapus ikan cupang</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg bg-primary-main text-white hover:bg-primary-dark"
        >
          Tambah Ikan
        </button>
      </div>

      <Modal
        isOpen={formModal.isOpen}
        title={editing ? 'Edit Ikan' : 'Tambah Ikan'}
        onClose={formModal.close}
      >
        <form onSubmit={submitForm} className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="form-label">Nama</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="form-input"
              placeholder="Nama ikan"
            />
          </div>
          <div>
            <label className="form-label">Varietas</label>
            <input
              value={form.variety}
              onChange={(e) => setForm((f) => ({ ...f, variety: e.target.value }))}
              className="form-input"
              placeholder="Halfmoon, Plakat, dll"
            />
          </div>
          <div>
            <label className="form-label">Harga (Rp)</label>
            <RupiahInput
              value={form.price}
              onChange={(v) => setForm((f) => ({ ...f, price: v }))}
              placeholder="Masukkan harga, otomatis pakai titik"
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
            <p className="form-helper">Pilih satu gambar utama ikan. Disarankan resolusi cukup tinggi.</p>
            <div className="mt-2">
              <div className="aspect-square rounded-lg overflow-hidden border bg-gray-50">
                {form.mainImage ? (
                  <img
                    src={form.mainImage}
                    alt="Gambar Utama"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                    Belum ada gambar utama
                  </div>
                )}
              </div>
            </div>
            <p className="form-helper">Format JPG/PNG. Disarankan rasio 1:1 atau 4:3.</p>
          </div>

          <div className="md:col-span-2">
            <label className="form-label">Galeri (Sub Gambar)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onGalleryChange(e.target.files)}
              className="form-input"
            />
            <p className="form-helper">Anda bisa memilih beberapa file sekaligus untuk galeri.</p>
            {form.images.length > 0 && (
              <div className="mt-2 grid grid-cols-4 gap-3">
                {form.images.map((img, idx) => {
                  const isMain = form.mainImage === img
                  return (
                    <div
                      key={idx}
                      className={`relative rounded-lg overflow-hidden border cursor-pointer ${
                        isMain ? 'ring-2 ring-primary-main border-primary-main' : 'border-gray-200'
                      }`}
                      onClick={() => setMainFromGallery(img)}
                      title={isMain ? 'Gambar Utama' : 'Set sebagai gambar utama'}
                    >
                      <div className="aspect-square">
                        <img
                          src={img}
                          alt={`Galeri ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {isMain && (
                        <span className="absolute bottom-1 left-1 text-[10px] px-2 py-0.5 rounded bg-primary-main text-white">
                          Utama
                        </span>
                      )}
                      <button
                        type="button"
                        className="absolute top-1 right-1 text-xs bg-white/90 rounded px-2 py-1 border"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImageAt(idx)
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
            <p className="form-helper">Klik gambar untuk menjadikannya gambar utama. Pilih beberapa file sekaligus untuk menambah galeri.</p>
          </div>
          <div>
            <label className="form-label">Diskon (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={typeof form.discountPercent === 'string' ? '' : form.discountPercent}
              onChange={(e) => {
                const v = e.target.value
                if (v === '') {
                  setForm((f) => ({ ...f, discountPercent: '' as '' }))
                } else {
                  const num = Math.max(0, Math.min(100, Number(v)))
                  setForm((f) => ({ ...f, discountPercent: num }))
                }
              }}
              className="form-input no-spin"
              placeholder="0-100"
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
          <div>
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
          <div className="md:col-span-4">
            <label className="form-label">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="form-textarea"
              rows={3}
              placeholder="Deskripsi singkat ikan"
            />
          </div>
          <div className="md:col-span-4">
            <h3 className="text-sm font-semibold text-gray-900">Spesifikasi</h3>
            <div className="grid md:grid-cols-4 gap-4 mt-2">
              <div>
                <label className="form-label text-xs">Jenis</label>
                <input
                  value={form.typeText}
                  onChange={(e) => setForm((f) => ({ ...f, typeText: e.target.value }))}
                  className="form-input"
                  placeholder="Halfmoon, Plakat, dll"
                />
              </div>
              <div>
                <label className="form-label text-xs">Ukuran (cm)</label>
                <select
                  value={form.sizeCm}
                  onChange={(e) => setForm((f) => ({ ...f, sizeCm: e.target.value }))}
                  className="form-select"
                >
                  <option value="">Pilih ukuran</option>
                  <option value="3-4 cm">3-4 cm</option>
                  <option value="4-5 cm">4-5 cm</option>
                  <option value="5-6 cm">5-6 cm</option>
                  <option value="6-7 cm">6-7 cm</option>
                </select>
              </div>
              <div>
                <label className="form-label text-xs">Warna</label>
                <input
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  className="form-input"
                  placeholder="Merah, Koi, Marble, dll"
                />
              </div>
              <div>
                <label className="form-label text-xs">Jenis Kelamin</label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={form.gender === 'Jantan'}
                      onChange={() => setForm((f) => ({ ...f, gender: 'Jantan' }))}
                      className="form-radio"
                    />
                    Jantan
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={form.gender === 'Betina'}
                      onChange={() => setForm((f) => ({ ...f, gender: 'Betina' }))}
                      className="form-radio"
                    />
                    Betina
                  </label>
                </div>
              </div>
              <div>
                <label className="form-label text-xs">Kondisi</label>
                <input
                  value={form.condition}
                  onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}
                  className="form-input"
                  placeholder="Sehat & Aktif"
                />
              </div>
              <div>
                <label className="form-label text-xs">Umur</label>
                <input
                  value={form.age}
                  onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                  className="form-input"
                  placeholder="3-4 bulan"
                />
              </div>
              <div>
                <label className="form-label text-xs">Asal</label>
                <input
                  value={form.origin}
                  onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))}
                  className="form-input"
                  placeholder="Breeding Lokal"
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Keunggulan</label>
            <div className="flex gap-2">
              <input
                value={advInput}
                onChange={(e) => setAdvInput(e.target.value)}
                className="form-input flex-1"
                placeholder="Tambahkan keunggulan lalu klik +"
              />
              <button
                type="button"
                onClick={addAdvantage}
                className="btn-outline"
              >
                +
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.advantages.map((a, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded-full bg-primary-light text-primary-dark text-xs inline-flex items-center gap-1"
                >
                  {a}
                  <button
                    type="button"
                    className="text-red-600"
                    onClick={() => removeAdvantageAt(idx)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Panduan Perawatan</label>
            <div className="flex gap-2">
              <input
                value={careInput}
                onChange={(e) => setCareInput(e.target.value)}
                className="form-input flex-1"
                placeholder="Tambahkan panduan lalu klik +"
              />
              <button
                type="button"
                onClick={addCareGuide}
                className="btn-outline"
              >
                +
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.careGuide.map((a, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs inline-flex items-center gap-1"
                >
                  {a}
                  <button type="button" className="text-red-600" onClick={() => removeCareAt(idx)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="md:col-span-4 form-actions sticky bottom-0 bg-white py-3">
            <button type="button" className="btn-outline" onClick={formModal.close}>
              Batal
            </button>
            <button type="submit" className="btn-primary">
              {editing ? 'Simpan Perubahan' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500">
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Varietas</th>
              <th className="px-4 py-3">Harga</th>
              <th className="px-4 py-3">Diskon</th>
              <th className="px-4 py-3">Stok</th>
              <th className="px-4 py-3">Gambar</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items
              .filter(
                (i) =>
                  i.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                  (i.variety ?? '').toLowerCase().includes(debouncedQuery.toLowerCase())
              )
              .map((i) => (
                <tr key={i.id} className="text-sm">
                  <td className="px-4 py-3 font-medium text-gray-900">{i.name}</td>
                  <td className="px-4 py-3 text-gray-600">{i.variety}</td>
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
          placeholder="Cari ikan..."
        />
      </div>

      <ConfirmDialog
        open={confirmId !== null}
        title="Hapus Ikan?"
        description="Tindakan ini tidak bisa dibatalkan."
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId !== null) {
            deleteFish(confirmId)
              .then(() => {
                setItems((prev) => prev.filter((i) => i.id !== confirmId))
                toast.show('Ikan dihapus')
              })
              .catch((err) => toast.show(err?.message || 'Gagal menghapus ikan', { type: 'error' }))
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
