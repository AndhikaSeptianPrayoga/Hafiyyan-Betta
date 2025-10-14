import React, { type ComponentType, type ReactNode } from 'react'
import ErrorBoundary from '../ErrorBoundary'

export default function withErrorBoundary<TProps>(
  Component: ComponentType<TProps>,
  fallback?: ReactNode
): ComponentType<TProps> {
  const Wrapped = (props: TProps) => (
    <ErrorBoundary fallback={fallback}>{React.createElement(Component, props)}</ErrorBoundary>
  )
  Wrapped.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`
  return Wrapped
}
