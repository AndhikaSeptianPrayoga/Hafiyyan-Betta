interface ConfirmDialogProps {
  open: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title = 'Konfirmasi',
  description,
  confirmText = 'Ya',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-4 py-3 border-b">
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          </div>
          <div className="p-4 text-sm text-gray-700">{description}</div>
          <div className="px-4 py-3 flex items-center justify-end gap-2 border-t">
            <button className="px-4 py-2 rounded-lg border" onClick={onCancel}>
              {cancelText}
            </button>
            <button className="px-4 py-2 rounded-lg bg-red-600 text-white" onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
