import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import Layout from '../Layout'
import store from '../../redux/store'

describe('Layout integration', () => {
  test('renders Navbar, Footer, and main content', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Layout>
            <div data-testid="content">Hello Content</div>
          </Layout>
        </MemoryRouter>
      </Provider>
    )

    // Verifikasi teks navbar muncul
    expect(screen.getAllByText(/Hafiyyan Betta/i)).toHaveLength(2) // Navbar dan Footer
    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  test('toggles CartModal via Navbar Cart button', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Layout>
            <div />
          </Layout>
        </MemoryRouter>
      </Provider>
    )

    const cartButton = screen.getByText(/Cart/i)
    fireEvent.click(cartButton)

    // Modal muncul dengan judul keranjang kosong saat tidak ada item
    expect(screen.getByText(/Keranjang Kosong/i)).toBeInTheDocument()
  })
})