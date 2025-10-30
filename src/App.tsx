import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import { lazy, type ComponentType } from 'react'
import withErrorBoundary from './shared/hoc/withErrorBoundary'
import withSuspense from './shared/hoc/withSuspense'
import withPerformance from './shared/hoc/withPerformance'
import RequireAdmin from './admin/RequireAdmin'

// Lazy-load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const ProfilPage = lazy(() => import('./pages/ProfilPage'))
const ArtikelPage = lazy(() => import('./pages/ArtikelPage'))
const KebutuhanPage = lazy(() => import('./pages/KebutuhanPage'))
const IkanPage = lazy(() => import('./pages/ikanpage'))
const DetailArtikel = lazy(() => import('./pages/DetailArtikel'))
const DetailIkan = lazy(() => import('./pages/DetailIkan'))
const DetailKebutuhan = lazy(() => import('./pages/DetailKebutuhan'))
const DemoErrorPage = lazy(() => import('./pages/DemoErrorPage'))

const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const Dashboard = lazy(() => import('./admin/pages/Dashboard'))
const ArtikelAdminPage = lazy(() => import('./admin/pages/ArtikelAdminPage'))
const KebutuhanAdminPage = lazy(() => import('./admin/pages/KebutuhanAdminPage'))
const IkanAdminPage = lazy(() => import('./admin/pages/IkanAdminPage'))
const LoginAdminPage = lazy(() => import('./admin/pages/LoginAdminPage'))

const enhance = (Comp: ComponentType<any>, label: string) =>
  withPerformance(withErrorBoundary(withSuspense(Comp)), label)

const EnhancedHome = enhance(HomePage, 'HomePage')
const EnhancedProfil = enhance(ProfilPage, 'ProfilPage')
const EnhancedArtikel = enhance(ArtikelPage, 'ArtikelPage')
const EnhancedDetailArtikel = enhance(DetailArtikel, 'DetailArtikel')
const EnhancedKebutuhan = enhance(KebutuhanPage, 'KebutuhanPage')
const EnhancedDetailKebutuhan = enhance(DetailKebutuhan, 'DetailKebutuhan')
const EnhancedIkan = enhance(IkanPage, 'IkanPage')
const EnhancedDetailIkan = enhance(DetailIkan, 'DetailIkan')
const EnhancedDemoError = enhance(DemoErrorPage, 'DemoErrorPage')

const EnhancedAdminLayout = enhance(AdminLayout, 'AdminLayout')
const EnhancedDashboard = enhance(Dashboard, 'Dashboard')
const EnhancedArtikelAdmin = enhance(ArtikelAdminPage, 'ArtikelAdminPage')
const EnhancedKebutuhanAdmin = enhance(KebutuhanAdminPage, 'KebutuhanAdminPage')
const EnhancedIkanAdmin = enhance(IkanAdminPage, 'IkanAdminPage')
const EnhancedLoginAdmin = enhance(LoginAdminPage, 'LoginAdminPage')

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout children={<EnhancedHome />} />} />
        <Route path="/profil" element={<Layout children={<EnhancedProfil />} />} />
        <Route path="/artikel" element={<Layout children={<EnhancedArtikel />} />} />
        <Route path="/artikel/:id" element={<Layout children={<EnhancedDetailArtikel />} />} />
        <Route path="/kebutuhan" element={<Layout children={<EnhancedKebutuhan />} />} />
        <Route path="/kebutuhan/:id" element={<Layout children={<EnhancedDetailKebutuhan />} />} />
        <Route path="/ikan" element={<Layout children={<EnhancedIkan />} />} />
        <Route path="/ikan/:id" element={<Layout children={<EnhancedDetailIkan />} />} />
        {/* Demo Route for ErrorBoundary */}
        <Route path="/demo/error" element={<Layout children={<EnhancedDemoError />} />} />
        {/* Admin Login */}
        <Route path="/admin/login" element={<EnhancedLoginAdmin />} />
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <EnhancedAdminLayout children={<RequireAdmin children={<EnhancedDashboard />} />} />
          }
        />
        <Route
          path="/admin/artikel"
          element={
            <EnhancedAdminLayout children={<RequireAdmin children={<EnhancedArtikelAdmin />} />} />
          }
        />
        <Route
          path="/admin/kebutuhan"
          element={
            <EnhancedAdminLayout children={<RequireAdmin children={<EnhancedKebutuhanAdmin />} />} />
          }
        />
        <Route
          path="/admin/ikan"
          element={
            <EnhancedAdminLayout children={<RequireAdmin children={<EnhancedIkanAdmin />} />} />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
