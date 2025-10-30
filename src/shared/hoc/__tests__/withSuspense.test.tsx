import React from 'react'
import { render, screen, act } from '@testing-library/react'
import withSuspense from '../withSuspense'

const LazyComp = React.lazy(() =>
  Promise.resolve({ default: () => <div data-testid="loaded">Loaded</div> })
)

test('withSuspense shows fallback then loads lazy component', async () => {
  const Wrapped = withSuspense(LazyComp, <div data-testid="fallback">Loading...</div>)
  render(<Wrapped />)
  // Fallback should be visible first
  expect(screen.getByTestId('fallback')).toBeInTheDocument()
  // Let microtasks flush to resolve the lazy component
  await act(async () => {
    await Promise.resolve()
  })
  expect(screen.getByTestId('loaded')).toBeInTheDocument()
})