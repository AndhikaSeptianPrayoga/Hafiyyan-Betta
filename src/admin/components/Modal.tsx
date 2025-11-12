interface ModalProps {
  isOpen: boolean
  title?: string
  onClose: () => void
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function Modal({ isOpen, title, onClose, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <div
          className={
            `w-full bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col max-h-[90vh] ` +
            (size === 'sm'
              ? 'sm:max-w-md'
              : size === 'md'
              ? 'sm:max-w-2xl'
              : size === 'lg'
              ? 'sm:max-w-3xl'
              : 'sm:max-w-4xl')
          }
        >
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b bg-white">
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="w-4 h-4 text-gray-700"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <div className="p-4 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  )
}
