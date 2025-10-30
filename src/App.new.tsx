// Main App component dengan Tailwind CSS dan struktur yang rapi
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProfilPage from './pages/ProfilPage'
import ArtikelPage from './pages/ArtikelPage'
import KebutuhanPage from './pages/KebutuhanPage'
import IkanPage from './pages/ikanpage'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Layout children={<HomePage />} />} />
          <Route path="/profil" element={<Layout children={<ProfilPage />} />} />
          <Route path="/artikel" element={<Layout children={<ArtikelPage />} />} />
          <Route path="/kebutuhan" element={<Layout children={<KebutuhanPage />} />} />
          <Route path="/ikan" element={<Layout children={<IkanPage />} />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}
