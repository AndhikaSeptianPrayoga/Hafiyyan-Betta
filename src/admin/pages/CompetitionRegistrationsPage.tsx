import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import useModal from '../../hooks/useModal'
import useToast from '../../hooks/useToast'
import Modal from '../components/Modal'
import {
  type Competition,
  type CompetitionRegistration,
  getCompetition,
  listRegistrations,
  updateRegistrationStatus,
  updateRegistrationRank,
  addRegistrationScore,
} from '../services/api'

function isUrl(val: any) {
  return typeof val === 'string' && /^https?:\/\//i.test(val)
}

export default function CompetitionRegistrationsPage() {
  const { id } = useParams()
  const cid = Number(id)
  const toast = useToast()
  const [comp, setComp] = useState<Competition | null>(null)
  const [regs, setRegs] = useState<CompetitionRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const evalModal = useModal()
  const [currentReg, setCurrentReg] = useState<CompetitionRegistration | null>(null)
  const [totalScore, setTotalScore] = useState<string>('')
  const [comment, setComment] = useState('')
  const [rankInputs, setRankInputs] = useState<Record<number, { ranking: string; finalPosition: string }>>({})
  const [statusConfirm, setStatusConfirm] = useState<{ regId: number; status: 'pending' | 'approved' | 'rejected'; name: string } | null>(null)

  useEffect(() => {
    if (!cid) {
      setError('Kompetisi tidak ditemukan')
      setLoading(false)
      return
    }
    Promise.all([getCompetition(cid), listRegistrations(cid)])
      .then(([c, r]) => {
        setComp(c)
        setRegs(Array.isArray(r) ? r : [])
      })
      .catch((err) => setError(err?.message || 'Gagal memuat data'))
      .finally(() => setLoading(false))
  }, [cid])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return regs.filter((r) =>
      (r.customer_name || '').toLowerCase().includes(q) ||
      (r.customer_email || '').toLowerCase().includes(q) ||
      Object.values(r.answers || {}).some((v) => String(v).toLowerCase().includes(q))
    )
  }, [regs, query])

  const openEval = (r: CompetitionRegistration) => {
    setCurrentReg(r)
    setTotalScore(r.last_score?.total_score != null ? String(r.last_score?.total_score) : '')
    setComment(r.last_score?.comment || '')
    evalModal.open()
  }

  const saveEval = async () => {
    if (!currentReg || !cid) return
    try {
      const scoreNum = totalScore ? Number(totalScore) : null
      await addRegistrationScore(cid, currentReg.id, { totalScore: scoreNum, comment })
      const latest = await listRegistrations(cid)
      setRegs(Array.isArray(latest) ? latest : [])
      toast.show('Penilaian disimpan')
      evalModal.close()
    } catch (e: any) {
      toast.show(e?.message || 'Gagal menyimpan penilaian', { type: 'error' })
    }
  }

  const changeStatus = async (regId: number, status: 'pending' | 'approved' | 'rejected') => {
    if (!cid) return
    try {
      const up = await updateRegistrationStatus(cid, regId, status)
      setRegs((prev) => prev.map((r) => (r.id === regId ? { ...r, ...up } : r)))
      const person = regs.find((r) => r.id === regId)
      const label = status === 'approved' ? 'di-approve' : status === 'rejected' ? 'di-reject' : 'diubah ke pending'
      toast.show(`Peserta ${person?.customer_name || ''} ${label}`)
    } catch (e: any) {
      toast.show(e?.message || 'Gagal memperbarui status', { type: 'error' })
    }
  }

  const saveRank = async (regId: number) => {
    if (!cid) return
    const current = rankInputs[regId] || { ranking: '', finalPosition: '' }
    const ranking = current.ranking ? Number(current.ranking) : null
    const finalPosition = current.finalPosition || null
    try {
      const up = await updateRegistrationRank(cid, regId, ranking, finalPosition || null)
      setRegs((prev) => prev.map((r) => (r.id === regId ? { ...r, ...up } : r)))
      toast.show('Peringkat tersimpan')
    } catch (e: any) {
      toast.show(e?.message || 'Gagal menyimpan peringkat', { type: 'error' })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Peserta Kompetisi</h1>
            <p className="text-sm text-gray-500">Memuat data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !comp) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Peserta Kompetisi</h1>
            <p className="text-sm text-gray-500">{error || 'Kompetisi tidak ditemukan'}</p>
          </div>
          <Link to="/admin/kompetisi" className="btn-outline">Kembali</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Manajemen Peserta: {comp.title}</h1>
          <p className="text-sm text-gray-500">Lihat data pendaftaran, salin URL gambar, dan nilai peserta.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-main focus:ring-primary-main text-sm"
            placeholder="Cari peserta atau jawaban..."
          />
          <Link to="/admin/kompetisi" className="px-3 py-2 rounded-md border hover:bg-gray-50">Kembali ke daftar kompetisi</Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-600">Belum ada peserta mendaftar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500">
                <th className="px-4 py-3">Peserta</th>
                <th className="px-4 py-3">Jawaban Form</th>
                <th className="px-4 py-3">Penilaian Terakhir</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t align-top">
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium text-gray-900">{r.customer_name}</div>
                    <div className="text-xs text-gray-500">{r.customer_email}</div>
                    <div className="mt-1">
                      <span className="px-2 py-1 rounded bg-gray-100 text-xs">{r.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="space-y-1">
                      {Object.entries(r.answers || {}).map(([k, v]) => (
                        <div key={k} className="flex items-center gap-2">
                          <span className="text-gray-500 text-xs min-w-[120px]">{k}</span>
                          {isUrl(v) ? (
                            <>
                              <a href={String(v)} target="_blank" rel="noreferrer" className="text-primary-main hover:underline break-all">
                                {String(v)}
                              </a>
                              <button
                                className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                                onClick={() => {
                                  navigator.clipboard.writeText(String(v)).then(() => toast.show('URL disalin'))
                                }}
                              >Salin</button>
                            </>
                          ) : (
                            <span className="break-all">{String(v)}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {r.last_score ? (
                      <div>
                        <div className="text-xs text-gray-500">Skor: <span className="font-medium text-gray-800">{r.last_score.total_score ?? '-'}</span></div>
                        <div className="text-xs text-gray-500">Komentar: <span className="font-medium text-gray-800">{r.last_score.comment || '-'}</span></div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">Belum ada penilaian</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setStatusConfirm({ regId: r.id, status: 'pending', name: r.customer_name ?? '' })} className="text-xs px-2 py-1 rounded border hover:bg-gray-50">Pending</button>
                        <button onClick={() => setStatusConfirm({ regId: r.id, status: 'approved', name: r.customer_name ?? '' })} className="text-xs px-2 py-1 rounded border hover:bg-gray-50">Approve</button>
                        <button onClick={() => setStatusConfirm({ regId: r.id, status: 'rejected', name: r.customer_name ?? '' })} className="text-xs px-2 py-1 rounded border hover:bg-gray-50">Reject</button> 
                      </div>
                      <div className="flex items-center gap-2 w-full justify-end">
                        <input
                          className="form-input w-20"
                          placeholder="#Rank"
                          value={rankInputs[r.id] ? rankInputs[r.id].ranking : ''}
                          onChange={(e) => setRankInputs((prev) => ({ ...prev, [r.id]: { ...(prev[r.id] || { ranking: '', finalPosition: '' }), ranking: e.target.value } }))}
                        />
                        <input
                          className="form-input w-36"
                          placeholder="Posisi Akhir"
                          value={rankInputs[r.id] ? rankInputs[r.id].finalPosition : ''}
                          onChange={(e) => setRankInputs((prev) => ({ ...prev, [r.id]: { ...(prev[r.id] || { ranking: '', finalPosition: '' }), finalPosition: e.target.value } }))}
                        />
                        <button onClick={() => saveRank(r.id)} className="text-xs px-2 py-1 rounded bg-primary-main text-white hover:bg-primary-dark">Simpan</button>
                      </div>
                      <button onClick={() => openEval(r)} className="text-xs px-3 py-1 rounded bg-gray-900 text-white hover:bg-gray-800">Nilai Peserta</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={evalModal.isOpen} title={currentReg ? `Nilai: ${currentReg.customer_name}` : 'Nilai Peserta'} onClose={evalModal.close} size="xl">
        <div className="space-y-3">
          <div>
            <label className="form-label">Skor Total</label>
            <input
              className="form-input"
              type="number"
              placeholder="Masukkan skor total"
              value={totalScore}
              onChange={(e) => setTotalScore(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Komentar</label>
            <textarea
              className="form-input"
              rows={6}
              placeholder="Catatan evaluasi detail untuk peserta"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button className="btn-outline" onClick={evalModal.close}>Batal</button>
            <button className="btn-primary" onClick={saveEval}>Simpan Penilaian</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!statusConfirm}
        title="Konfirmasi Status Peserta"
        description={statusConfirm ? `Yakin ingin mengubah status peserta "${statusConfirm.name}" menjadi ${statusConfirm.status === 'approved' ? 'Approved' : statusConfirm.status === 'rejected' ? 'Rejected' : 'Pending'}?` : ''}
        confirmText="Ya, Ubah"
        cancelText="Batal"
        onConfirm={() => {
          if (!statusConfirm) return
          changeStatus(statusConfirm.regId, statusConfirm.status)
          setStatusConfirm(null)
        }}
        onCancel={() => setStatusConfirm(null)}
      />
    </div>
  )
}