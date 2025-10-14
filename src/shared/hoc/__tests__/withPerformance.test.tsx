import React from 'react'
import { render } from '@testing-library/react'
import withPerformance from '../withPerformance'

function Sample() {
  return <div>ok</div>
}

test('withPerformance logs mount duration', () => {
  const spy = jest.spyOn(console, 'debug').mockImplementation(() => {})
  const Wrapped = withPerformance(Sample, 'SampleLabel')
  render(<Wrapped />)
  expect(spy).toHaveBeenCalled()
  const calls = spy.mock.calls.map((c) => String(c[0]))
  expect(calls.some((msg) => msg.includes('[Perf]') && msg.includes('SampleLabel'))).toBe(true)
  spy.mockRestore()
})