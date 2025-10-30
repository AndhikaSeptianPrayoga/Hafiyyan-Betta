import { Suspense, type ComponentType, type ReactNode } from 'react'

export default function withSuspense<TProps extends object>(
  Component: ComponentType<TProps>,
  fallback?: ReactNode
): ComponentType<TProps> {
  const Wrapped = (props: TProps) => (
    <Suspense
      fallback={
        fallback ?? <div className="p-6 text-center text-sm text-gray-600">Memuat konten...</div>
      }
    >
      <Component {...props} />
    </Suspense>
  )
  Wrapped.displayName = `withSuspense(${Component.displayName || Component.name || 'Component'})`
  return Wrapped
}
