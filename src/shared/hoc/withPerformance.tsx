import React, { useEffect } from 'react'

export default function withPerformance<TProps extends object>(
  Component: React.ComponentType<TProps>,
  label?: string
): React.ComponentType<TProps> {
  const name = label || Component.displayName || Component.name || 'Component'
  const Wrapped: React.FC<TProps> = (props: TProps) => {
    const start = performance.now()
    useEffect(() => {
      const end = performance.now()
      const duration = Math.round(end - start)
      // Simple performance log, can be sent to analytics later
      console.debug(`[Perf] ${name} mounted in ${duration}ms`)
    }, [])
    return <Component {...props} />
  }
  Wrapped.displayName = `withPerformance(${name})`
  return Wrapped
}
