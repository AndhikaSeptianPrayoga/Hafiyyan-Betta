import { useCallback, useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export default function useToast(defaultDuration = 2000) {
  const [message, setMessage] = useState<string | null>(null)
  const [type, setType] = useState<ToastType>('success')
  const [duration, setDuration] = useState<number>(defaultDuration)

  const show = useCallback((msg: string, opts?: { type?: ToastType; duration?: number }) => {
    setMessage(msg)
    if (opts?.type) setType(opts.type)
    setDuration(opts?.duration ?? defaultDuration)
  }, [defaultDuration])

  const clear = useCallback(() => setMessage(null), [])

  useEffect(() => {
    if (!message) return
    const t = setTimeout(clear, duration)
    return () => clearTimeout(t)
  }, [message, duration, clear])

  return { message, type, duration, show, clear }
}