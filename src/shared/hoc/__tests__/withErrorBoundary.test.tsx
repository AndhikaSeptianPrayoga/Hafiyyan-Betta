import React from 'react'
import { render, screen } from '@testing-library/react'
import withErrorBoundary from '../withErrorBoundary'

const Boom: React.FC = () => {
  throw new Error('boom')
}

test('withErrorBoundary renders fallback when child throws', () => {
  const Fallback = () => <div data-testid="fallback">Fallback UI</div>
  const Wrapped = withErrorBoundary(Boom, <Fallback />)
  render(<Wrapped />)
  expect(screen.getByTestId('fallback')).toBeInTheDocument()
})