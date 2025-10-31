import { useRef, useState, useEffect } from 'react'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'
import useModal from '../../hooks/useModal'
import useDebouncedValue from '../../hooks/useDebouncedValue'
import useToast from '../../hooks/useToast'
import { listArticles, createArticle, updateArticle, deleteArticle } from '../services/api'

type Article = {
  id: number
  title: string
  date: string
  excerpt: string
  image: string
  author: string
  content: string
  tags: string[]
}

export default function ArtikelAdminPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const formModal = useModal()
  const [editing, setEditing] = useState<Article | null>(null)
  const [form, setForm] = useState<Omit<Article, 'id'>>({
    title: '',
    date: '',
    excerpt: '',
    image: '',
    author: '',
    content: '',
    tags: [],
  })
  const [query, setQuery] = useState('')
  const toast = useToast()
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const [tagInput, setTagInput] = useState('')
  const editorRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebouncedValue(query, 300)

  useEffect(() => {
    listArticles()
      .then((data) => setArticles(Array.isArray(data) ? data : []))
      .catch(() => toast.show('Gagal memuat artikel', { type: 'error' }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({
      title: '',
      date: new Date().toISOString().slice(0, 10),
      excerpt: '',
      image: '',
      author: '',
      content: '',
      tags: [],
    })
    formModal.open()
    // Reset isi editor saat create
    setTimeout(() => {
      const el = editorRef.current
      if (!formModal.isOpen && !el) return
      if (el) el.innerHTML = ''
    }, 0)
  }

  const openEdit = (a: Article) => {
    setEditing(a)
    setForm({
      title: a.title,
      date: a.date,
      excerpt: a.excerpt,
      image: a.image,
      author: a.author,
      content: a.content,
      tags: a.tags,
    })
    formModal.open()
    // Set isi editor dari konten artikel saat edit
    setTimeout(() => {
      const el = editorRef.current
      if (!formModal.isOpen && !el) return
      if (el) el.innerHTML = a.content || ''
    }, 0)
  }

  const removeArticle = (id: number) => {
    setConfirmId(id)
  }

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault()
    const currentContent = editorRef.current?.innerHTML || form.content
    if (editing) {
      updateArticle(editing.id, { ...form, content: currentContent })
        .then((updated) => {
          setArticles((prev) => prev.map((a) => (a.id === editing.id ? updated : a)))
          toast.show('Perubahan artikel disimpan')
        })
        .catch((err) => toast.show(err?.message || 'Gagal menyimpan perubahan', { type: 'error' }))
    } else {
      createArticle({ ...form, content: currentContent })
        .then((created) => {
          setArticles((prev) => [created, ...prev])
          toast.show('Artikel baru ditambahkan')
        })
        .catch((err) => toast.show(err?.message || 'Gagal menambahkan artikel', { type: 'error' }))
    }
    formModal.close()
  }

  const applyCmd = (cmd: string) => {
    try {
      // Pastikan editor fokus sebelum menjalankan command
      editorRef.current?.focus()
      if ((document as any).queryCommandSupported?.(cmd) || true) {
        document.execCommand(cmd)
      }
    } catch (err) {
      // Abaikan jika browser tidak mendukung; ini mencegah error runtime
      console.warn('Command not supported or failed:', cmd, err)
    }
  }

  const insertImageNode = (src: string) => {
    const el = editorRef.current
    if (!el) return
    el.focus()
    const img = document.createElement('img')
    img.src = src
    img.alt = ''
    img.style.maxWidth = '100%'
    img.style.height = 'auto'
    img.style.borderRadius = '0.5rem'
    img.style.margin = '0.5rem 0'

    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0)
      range.deleteContents()
      range.insertNode(img)
      // Pindahkan caret setelah gambar
      range.setStartAfter(img)
      range.setEndAfter(img)
      sel.removeAllRanges()
      sel.addRange(range)
    } else {
      el.appendChild(img)
    }
    // Sinkronkan isi form
    setForm((f) => ({ ...f, content: el.innerHTML }))
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => insertImageNode(String(reader.result))
    reader.readAsDataURL(file)
    // reset input agar bisa pilih file yang sama dua kali
    e.target.value = ''
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Kelola Artikel</h2>
          <p className="text-sm text-gray-500">Tambah, ubah, dan hapus artikel website</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="hidden md:block px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-main focus:ring-primary-main text-sm"
            placeholder="Cari artikel..."
          />
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-lg bg-primary-main text-white hover:bg-primary-dark"
          >
            Tambah Artikel
          </button>
        </div>
      </div>

      <Modal
        isOpen={formModal.isOpen}
        title={editing ? 'Edit Artikel' : 'Tambah Artikel'}
        onClose={formModal.close}
      >
        <form onSubmit={submitForm} className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="form-label">Judul</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="form-input"
              placeholder="Judul artikel yang informatif"
            />
            <p className="form-helper">Gunakan kalimat jelas dan singkat.</p>
          </div>
          <div>
            <label className="form-label">Tanggal</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="form-input"
            />
            <p className="form-helper">Tanggal publikasi artikel.</p>
          </div>

          <div className="md:col-span-3 grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="form-label">Ringkasan</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                className="form-textarea"
                rows={3}
                placeholder="Ringkasan singkat yang menarik"
              />
              <p className="form-helper">Ditampilkan di kartu daftar artikel.</p>
            </div>
            <div>
              <label className="form-label">Penulis</label>
              <input
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                className="form-input"
                placeholder="Nama penulis/creator"
              />
              <p className="form-helper">Isi nama penulis untuk atribusi.</p>
            </div>
          </div>

          <div className="md:col-span-3 grid md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Gambar Sampul</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => setForm((f) => ({ ...f, image: String(reader.result) }))
                  reader.readAsDataURL(file)
                }}
                className="form-input"
              />
              {form.image && (
                <div className="mt-2">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
              <p className="form-helper">Format: JPG/PNG. Disarankan rasio 16:9.</p>
            </div>

            <div className="md:col-span-2">
              <label className="form-label">Tag</label>
              <div className="flex items-center gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const t = tagInput.trim()
                      if (t && !form.tags.includes(t)) {
                        setForm((f) => ({ ...f, tags: [...f.tags, t] }))
                      }
                      setTagInput('')
                    }
                  }}
                  className="form-input flex-1"
                  placeholder="Ketik tag lalu Enter"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      className="text-gray-500 hover:text-red-600"
                      onClick={() =>
                        setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="form-label mb-2">Konten Detail</label>
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                className="btn-outline"
                onClick={() => applyCmd('bold')}
              >
                B
              </button>
              <button
                type="button"
                className="btn-outline italic"
                onClick={() => applyCmd('italic')}
              >
                I
              </button>
              <button
                type="button"
                className="btn-outline underline"
                onClick={() => applyCmd('underline')}
              >
                U
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => applyCmd('insertUnorderedList')}
              >
                • List
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => applyCmd('insertOrderedList')}
              >
                1. List
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => imageInputRef.current?.click()}
              >
                Gambar
              </button>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageFileChange}
              />
            </div>
            <div
              ref={editorRef}
              contentEditable
              className="form-textarea min-h-[200px] p-3"
              onInput={() =>
                setForm((f) => ({ ...f, content: editorRef.current?.innerHTML || '' }))
              }
              onPaste={(e) => {
                const items = e.clipboardData?.items
                if (!items) return
                for (let i = 0; i < items.length; i++) {
                  const item = items[i]
                  if (item.type.startsWith('image/')) {
                    e.preventDefault()
                    const file = item.getAsFile()
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = () => insertImageNode(String(reader.result))
                    reader.readAsDataURL(file)
                    return
                  }
                }
                // default paste untuk teks/HTML
              }}
            />
            <p className="form-helper">
              Gunakan toolbar di atas atau tempel (paste) dari sumber lain. Konten disimpan sebagai
              HTML.
            </p>
          </div>

          <div className="md:col-span-3 form-actions sticky bottom-0 bg-white py-3">
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
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Penulis</th>
              <th className="px-4 py-3">Tag</th>
              <th className="px-4 py-3">Ringkasan</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {articles
              .filter((a) => a.title.toLowerCase().includes(debouncedQuery.toLowerCase()))
              .map((a) => (
                <tr key={a.id} className="text-sm">
                  <td className="px-4 py-3 font-medium text-gray-900">{a.title}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(a.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{a.author}</td>
                  <td className="px-4 py-3 text-gray-600">{a.tags?.join(', ')}</td>
                  <td className="px-4 py-3 text-gray-600">{a.excerpt}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(a)}
                        className="px-3 py-1 rounded-md border hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeArticle(a.id)}
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

      <ConfirmDialog
        open={confirmId !== null}
        title="Hapus Artikel?"
        description="Tindakan ini tidak bisa dibatalkan."
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId !== null) {
            deleteArticle(confirmId)
              .then(() => {
                setArticles((prev) => prev.filter((a) => a.id !== confirmId))
                toast.show('Artikel dihapus')
              })
              .catch((err) => toast.show(err?.message || 'Gagal menghapus artikel', { type: 'error' }))
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
