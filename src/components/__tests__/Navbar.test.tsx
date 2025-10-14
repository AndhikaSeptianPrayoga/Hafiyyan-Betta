import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../Navbar'

describe('Navbar', () => {
  test('renders navigation links', () => {
    render(
      <MemoryRouter>
        <Navbar cartCount={0} onToggleCart={() => {}} />
      </MemoryRouter>
    )

    expect(screen.getByText(/Hafiyyan Betta/i)).toBeInTheDocument()
    expect(screen.getByText(/Home/i)).toBeInTheDocument()
    expect(screen.getByText(/Profil/i)).toBeInTheDocument()
    expect(screen.getByText(/Artikel/i)).toBeInTheDocument()
    expect(screen.getByText(/Kebutuhan Cupang/i)).toBeInTheDocument()
    expect(screen.getByText(/Ikan Cupang/i)).toBeInTheDocument()
  })

  test('shows cart badge when count > 0', () => {
    render(
      <MemoryRouter>
        <Navbar cartCount={3} onToggleCart={() => {}} />
      </MemoryRouter>
    )

    const badge = screen.getByText('3')
    expect(badge).toBeInTheDocument()
  })

  test('calls onToggleCart when cart button clicked', () => {
    const onToggleCart = jest.fn()
    render(
      <MemoryRouter>
        <Navbar cartCount={0} onToggleCart={onToggleCart} />
      </MemoryRouter>
    )

    const cartButton = screen.getByText(/Cart/i)
    fireEvent.click(cartButton)
    expect(onToggleCart).toHaveBeenCalledTimes(1)
  })
})