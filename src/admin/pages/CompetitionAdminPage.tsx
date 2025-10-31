import { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'
import useModal from '../../hooks/useModal'
import useToast from '../../hooks/useToast'
import {
  type Competition,
  type CompetitionField,
  listCompetitions,
  createCompetition,
  updateCompetition,
  deleteCompetition,
  listRegistrations,
  updateRegistrationStatus,
  updateRegistrationRank,
  addRegistrationScore,
  uploadCompetitionPoster,
} from '../services/api'

type CompForm = {
  title: string
  description: string
  status: 'draft' | 'open' | 'closed'
  startAt: string
  endAt: string
  requirements: string[]
  formFields: CompetitionField[]
  maxParticipants: number | null
  posterImage: string
}

export default function CompetitionAdminPage() {
  const [items, setItems] = useState<Competition[]>([])
  const [query, setQuery] = useState('')
  const toast = useToast()
  const formModal = useModal()
  const [editing, setEditing] = useState<Competition | null>(null)
  const [reqInput, setReqInput] = useState('')
  const [form, setForm] = useState<CompForm>({
    title: '',
    description: '',
    status: 'draft',
    startAt: '',
    endAt: '',
    requirements: [],
    formFields: [
      { name: 'nama_ikan', label: 'Nama Ikan', type: 'text', required: true },
      { name: 'kategori', label: 'Kategori', type: 'text', required: true },
    ],
    maxParticipants: null,
    posterImage: '',
  })
  const [confirmId, setConfirmId] = useState<number | null>(null)

  const participantsModal = useModal()
  const [selectedComp, setSelectedComp] = useState<Competition | null>(null)
  const [registrations, setRegistrations] = useState<any[]>([])
  const [scoreInputs, setScoreInputs] = useState<Record<number, string>>({})
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({})
  const [posterUploading, setPosterUploading] = useState(false)

  useEffect(() => {
    listCompetitions()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => toast.show(err?.message || 'Gagal memuat kompetisi', { type: 'error' }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({
      title: '',
      description: '',
      status: 'draft',
      startAt: '',
      endAt: '',
      requirements: ['Wajib menyertakan foto ikan (tautan URL)'],
      formFields: [
        { name: 'nama_ikan', label: 'Nama Ikan', type: 'text', required: true },
        { name: 'kategori', label: 'Kategori', type: 'text', required: true },
        { name: 'foto_ikan', label: 'Foto Ikan (URL)', type: 'text', required: true },
      ],
      maxParticipants: null,
      posterImage: '',
    })
    formModal.open()
  }

  const openEdit = (c: Competition) => {
    setEditing(c)
    setForm({
      title: c.title,
      description: c.description || '',
      status: (c.status as any) || 'draft',
      startAt: c.start_at || '',
      endAt: c.end_at || '',
      requirements: (c.requirements as any) || [],
      formFields: (c.form_fields as any) || [],
      maxParticipants: (c as any).max_participants ?? null,
      posterImage: (c as any).poster_image || '',
    })
    formModal.open()
  }

  const handlePosterFile = (file?: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        setPosterUploading(true)
        const dataUrl = String(reader.result || '')
        const { url } = await uploadCompetitionPoster(dataUrl)
        setForm((f) => ({ ...f, posterImage: url }))
        toast.show('Poster diunggah')
      } catch (e: any) {
        toast.show(e?.message || 'Gagal mengunggah poster', { type: 'error' })
      } finally {
        setPosterUploading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const getFishPhotoOption = (): 'required' | 'optional' | 'none' => {
    const idx = form.formFields.findIndex((f) => f.name === 'foto_ikan')
    if (idx === -1) return 'none'
    return form.formFields[idx].required ? 'required' : 'optional'
  }
  const setFishPhotoOption = (mode: 'required' | 'optional' | 'none') => {
    setForm((f) => {
      let fields = [...f.formFields]
      const idx = fields.findIndex((x) => x.name === 'foto_ikan')
      if (mode === 'none') {
        if (idx !== -1) fields.splice(idx, 1)
        const reqs = f.requirements.filter((r) => !r.toLowerCase().includes('wajib menyertakan foto ikan'))
        return { ...f, formFields: fields, requirements: reqs }
      }
      const base = { name: 'foto_ikan', label: 'Foto Ikan (URL)', type: 'text' as const, required: mode === 'required' }
      if (idx === -1) fields = [...fields, base]
      else fields[idx] = { ...fields[idx], required: mode === 'required', label: fields[idx].label || 'Foto Ikan (URL)', type: 'text' }
      let reqs = [...f.requirements]
      const msg = 'Wajib menyertakan foto ikan (tautan URL)'
      const hasMsg = reqs.some((r) => r.toLowerCase().includes('wajib menyertakan foto ikan'))
      if (mode === 'required' && !hasMsg) reqs.push(msg)
      if (mode !== 'required') reqs = reqs.filter((r) => !r.toLowerCase().includes('wajib menyertakan foto ikan'))
      return { ...f, formFields: fields, requirements: reqs }
    })
  }

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      title: form.title,
      description: form.description,
      status: form.status,
      startAt: form.startAt || null,
      endAt: form.endAt || null,
      requirements: form.requirements,
      formFields: form.formFields,
      maxParticipants: form.maxParticipants,
      posterImage: form.posterImage || null,
    }
    if (editing) {
      updateCompetition(editing.id, payload)
        .then((updated) => {
          setItems((prev) => prev.map((i) => (i.id === editing.id ? updated : i)))
          toast.show('Kompetisi diperbarui')
          formModal.close()
        })
        .catch((err) => toast.show(err?.message || 'Gagal menyimpan', { type: 'error' }))
    } else {
      createCompetition(payload)
        .then((created) => {
          setItems((prev) => [created, ...prev])
          toast.show('Kompetisi dibuat')
          formModal.close()
        })
        .catch((err) => toast.show(err?.message || 'Gagal membuat', { type: 'error' }))
    }
  }

  const removeItem = (id: number) => setConfirmId(id)

  const confirmDelete = () => {
    if (confirmId === null) return
    deleteCompetition(confirmId)
      .then(() => {
        setItems((prev) => prev.filter((i) => i.id !== confirmId))
        toast.show('Kompetisi dihapus')
      })
      .catch((err) => toast.show(err?.message || 'Gagal menghapus kompetisi', { type: 'error' }))
    setConfirmId(null)
  }

  const openParticipants = (c: Competition) => {
    setSelectedComp(c)
    participantsModal.open()
    listRegistrations(c.id)
      .then((rows) => setRegistrations(Array.isArray(rows) ? rows : []))
      .catch((err) => toast.show(err?.message || 'Gagal memuat peserta', { type: 'error' }))
  }

  const setStatus = (regId: number, status: 'pending' | 'approved' | 'rejected') => {
    if (!selectedComp) return
    updateRegistrationStatus(selectedComp.id, regId, status)
      .then((up) => {
        setRegistrations((prev) => prev.map((r) => (r.id === regId ? up : r)))
        toast.show('Status peserta diperbarui')
      })
      .catch((err) => toast.show(err?.message || 'Gagal memperbarui status', { type: 'error' }))
  }

  const setRank = (regId: number, rank: number | null, finalPosition?: string | null) => {
    if (!selectedComp) return
    updateRegistrationRank(selectedComp.id, regId, rank, finalPosition)
      .then((up) => {
        setRegistrations((prev) => prev.map((r) => (r.id === regId ? up : r)))
        toast.show('Peringkat tersimpan')
      })
      .catch((err) => toast.show(err?.message || 'Gagal menyimpan peringkat', { type: 'error' }))
  }

  const saveScore = (regId: number, totalScore: number | null, comment: string) => {
    if (!selectedComp) return
    addRegistrationScore(selectedComp.id, regId, { totalScore, comment })
      .then(() => {
        // refresh last score quickly
        listRegistrations(selectedComp.id)
          .then((rows) => setRegistrations(Array.isArray(rows) ? rows : []))
        toast.show('Penilaian disimpan')
      })
      .catch((err) => toast.show(err?.message || 'Gagal menyimpan penilaian', { type: 'error' }))
  }

  const filtered = items.filter((i) =>
    i.title.toLowerCase().includes(query.toLowerCase()) ||
    (i.description || '').toLowerCase().includes(query.toLowerCase())
  )

  const addRequirement = (text: string) => {
    const t = text.trim()
    if (!t) return
    setForm((f) => ({ ...f, requirements: [...f.requirements, t] }))
  }
  const removeRequirement = (idx: number) => {
    setForm((f) => ({ ...f, requirements: f.requirements.filter((_, i) => i !== idx) }))
  }
  const addField = () => {
    setForm((f) => ({
      ...f,
      formFields: [...f.formFields, { name: `field_${f.formFields.length + 1}`, label: 'Field Baru', type: 'text', required: false }],
    }))
  }
  const removeField = (idx: number) => {
    setForm((f) => ({ ...f, formFields: f.formFields.filter((_, i) => i !== idx) }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Kelola Kompetisi Cupang</h1>
          <p className="text-sm text-gray-500">Buat event, atur form pendaftaran, nilai peserta realtime.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-main focus:ring-primary-main text-sm"
            placeholder="Cari kompetisi..."
          />
          <button className="btn-primary" onClick={openCreate}>Buat Kompetisi</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500">
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{c.title}</div>
                  <div className="text-xs text-gray-500 line-clamp-1">{c.description}</div>
                </td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded bg-gray-100 text-xs">{c.status}</span></td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {(c.start_at || '')} {(c.end_at ? `- ${c.end_at}` : '')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openParticipants(c)} className="px-3 py-1 rounded-md border hover:bg-gray-50">Peserta</button>
                    <button onClick={() => openEdit(c)} className="px-3 py-1 rounded-md border hover:bg-gray-50">Edit</button>
                    <button onClick={() => removeItem(c.id)} className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={formModal.isOpen} title={editing ? 'Edit Kompetisi' : 'Buat Kompetisi'} onClose={formModal.close}>
        <form onSubmit={submitForm} className="grid md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="form-label">Judul</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="form-input"
              placeholder="Nama kompetisi"
            />
          </div>
          <div>
            <label className="form-label">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as CompForm['status'] }))}
              className="form-input"
            >
              <option value="draft">Draft</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
        </div>
        <div>
          <label className="form-label">Maksimum Peserta</label>
          <input
            type="number"
            className="form-input"
            min={0}
            placeholder="Tanpa batas"
            value={form.maxParticipants ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, maxParticipants: e.target.value ? Number(e.target.value) : null }))}
          />
        </div>
        <div>
          <label className="form-label">Mulai</label>
          <input type="datetime-local" value={form.startAt} onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))} className="form-input" />
        </div>
        <div>
          <label className="form-label">Selesai</label>
          <input type="datetime-local" value={form.endAt} onChange={(e) => setForm((f) => ({ ...f, endAt: e.target.value }))} className="form-input" />
        </div>
        <div className="md:col-span-4">
          <label className="form-label">Deskripsi</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="form-input"
            rows={3}
            placeholder="Deskripsi singkat"
          />
        </div>
        <div className="md:col-span-4 grid md:grid-cols-2 gap-3">
          <div>
            <label className="form-label">Upload Poster</label>
            <div className="flex items-center gap-2">
              <input type="file" accept="image/*" onChange={(e) => handlePosterFile(e.target.files?.[0])} />
              {posterUploading && <span className="text-xs text-gray-500">Mengunggah...</span>}
            </div>
            {form.posterImage && (
              <div className="mt-2 w-40 aspect-square bg-gray-100 overflow-hidden rounded">
                <img src={form.posterImage} alt="Poster" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="mt-2">
              <label className="form-label">Poster Image URL (opsional)</label>
              <input
                value={form.posterImage}
                onChange={(e) => setForm((f) => ({ ...f, posterImage: e.target.value }))}
                className="form-input"
                placeholder="https://... atau akan terisi otomatis setelah upload"
              />
            </div>
          </div>
          <div>
            <label className="form-label">Kirim Foto Ikan saat daftar</label>
            <select className="form-input" value={getFishPhotoOption()} onChange={(e) => setFishPhotoOption(e.target.value as any)}>
              <option value="required">Wajib</option>
              <option value="optional">Opsional</option>
              <option value="none">Tidak perlu</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Jika wajib, sistem akan memvalidasi pengisian saat pendaftaran.</p>
          </div>
        </div>
        <div className="md:col-span-4">
          <label className="form-label">Requirement Lomba</label>
          <div className="flex gap-2">
            <input value={reqInput} onChange={(e) => setReqInput(e.target.value)} className="form-input flex-1" placeholder="Tambah syarat..." />
            <button type="button" className="btn-outline" onClick={() => { addRequirement(reqInput); setReqInput('') }}>Tambah</button>
          </div>
          <ul className="mt-2 space-y-2">
            {form.requirements.map((r, idx) => (
              <li key={idx} className="flex items-center justify-between px-3 py-2 rounded-md bg-gray-50">
                <span className="text-sm text-gray-700">{r}</span>
                <button type="button" className="text-xs text-red-600 hover:underline" onClick={() => removeRequirement(idx)}>Hapus</button>
              </li>
            ))}
          </ul>
        </div>
          <div className="md:col-span-4">
            <div className="flex items-center justify-between">
              <label className="form-label">Field Form Pendaftaran</label>
              <button type="button" className="btn-outline" onClick={addField}>Tambah Field</button>
            </div>
            <div className="space-y-2">
              {form.formFields.map((fld, idx) => (
                <div key={idx} className="grid md:grid-cols-5 gap-2 bg-gray-50 p-3 rounded-md">
                  <input value={fld.label} onChange={(e) => setForm((f) => ({ ...f, formFields: f.formFields.map((x, i) => i === idx ? { ...x, label: e.target.value } : x) }))} className="form-input" placeholder="Label" />
                  <input value={fld.name} onChange={(e) => setForm((f) => ({ ...f, formFields: f.formFields.map((x, i) => i === idx ? { ...x, name: e.target.value } : x) }))} className="form-input" placeholder="Nama field (unik)" />
                  <select value={fld.type} onChange={(e) => setForm((f) => ({ ...f, formFields: f.formFields.map((x, i) => i === idx ? { ...x, type: e.target.value as CompetitionField['type'] } : x) }))} className="form-input">
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                  </select>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!fld.required} onChange={(e) => setForm((f) => ({ ...f, formFields: f.formFields.map((x, i) => i === idx ? { ...x, required: e.target.checked } : x) }))} /> Wajib</label>
                  <div className="flex justify-end">
                    <button type="button" className="text-xs text-red-600 hover:underline" onClick={() => removeField(idx)}>Hapus</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-4 flex items-center justify-end gap-2 sticky bottom-0 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-3 border-t">
            <button type="button" className="btn-outline" onClick={formModal.close}>Batal</button>
            <button type="submit" className="btn-primary">{editing ? 'Simpan Perubahan' : 'Simpan'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={participantsModal.isOpen} title={selectedComp ? `Peserta: ${selectedComp.title}` : 'Peserta'} onClose={participantsModal.close}>
        <div className="space-y-4">
          {!selectedComp ? (
            <p className="text-sm text-gray-600">Pilih kompetisi untuk melihat peserta.</p>
          ) : registrations.length === 0 ? (
            <p className="text-sm text-gray-600">Belum ada peserta.</p>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500">
                  <th className="px-3 py-2">Peserta</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Peringkat</th>
                  <th className="px-3 py-2">Komentar Terakhir</th>
                  <th className="px-3 py-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-3 py-2">
                      <div className="font-medium text-gray-900">{r.customer_name}</div>
                      <div className="text-xs text-gray-500">{r.customer_email}</div>
                    </td>
                    <td className="px-3 py-2">
                      <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value as any)} className="form-input text-xs">
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <input type="number" className="form-input w-24 text-xs" value={r.ranking ?? ''} onChange={(e) => setRank(r.id, e.target.value ? Number(e.target.value) : null, r.final_position)} />
                        <input className="form-input w-32 text-xs" placeholder="Juara (ops)" value={r.final_position ?? ''} onChange={(e) => setRank(r.id, r.ranking ?? null, e.target.value || null)} />
                      </div>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-700">
                      {r.last_score?.comment || '-'}
                    </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-2">
                        <input type="number" className="form-input w-24 text-xs" placeholder="Skor" value={scoreInputs[r.id] ?? ''} onChange={(e) => setScoreInputs((prev) => ({ ...prev, [r.id]: e.target.value }))} />
                        <input className="form-input w-44 text-xs" placeholder="Komentar" value={commentInputs[r.id] ?? ''} onChange={(e) => setCommentInputs((prev) => ({ ...prev, [r.id]: e.target.value }))} />
                        <button className="px-3 py-1 rounded-md border hover:bg-gray-50" onClick={() => {
                          const sVal = scoreInputs[r.id] ? Number(scoreInputs[r.id]) : null
                          const cVal = commentInputs[r.id] || ''
                          saveScore(r.id, sVal, cVal)
                          setScoreInputs((prev) => ({ ...prev, [r.id]: '' }))
                          setCommentInputs((prev) => ({ ...prev, [r.id]: '' }))
                        }}>Simpan Penilaian</button>
                    </div>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmId !== null}
        title="Hapus Kompetisi?"
        description="Tindakan ini tidak bisa dibatalkan."
        onCancel={() => setConfirmId(null)}
        onConfirm={confirmDelete}
      />

      {toast.message && (
        <Toast message={toast.message} type={toast.type} onClose={toast.clear} />
      )}
    </div>
  )
}