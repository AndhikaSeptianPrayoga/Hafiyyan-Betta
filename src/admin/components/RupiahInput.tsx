import React, { useEffect, useState } from 'react'

type RupiahInputProps = {
  value: number
  onChange: (value: number) => void
  placeholder?: string
  className?: string
  min?: number
  name?: string
}

function formatThousands(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return ''
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function sanitizeDigits(input: string): string {
  return input.replace(/[^\d]/g, '')
}

export default function RupiahInput({ value, onChange, placeholder, className = 'form-input', min = 0, name }: RupiahInputProps) {
  const [display, setDisplay] = useState<string>(formatThousands(value))

  useEffect(() => {
    setDisplay(formatThousands(value))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = sanitizeDigits(e.target.value)
    if (raw === '') {
      setDisplay('')
      onChange(min ?? 0)
      return
    }
    const num = Number(raw)
    const bounded = Math.max(min ?? 0, num)
    setDisplay(formatThousands(bounded))
    onChange(bounded)
  }

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    // Hindari perubahan nilai karena scroll pada beberapa browser
    e.preventDefault()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
    if (allowed.includes(e.key)) return
    if (/^\d$/.test(e.key)) return
    e.preventDefault()
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      name={name}
      value={display}
      onChange={handleChange}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={className}
    />
  )
}