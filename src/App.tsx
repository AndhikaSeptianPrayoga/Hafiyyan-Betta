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
const ShopPage = lazy(() => import('./pages/ShopPage'))
const KebutuhanPage = lazy(() => import('./pages/KebutuhanPage'))
const IkanPage = lazy(() => import('./pages/IkanPage'))
const KompetisiPage = lazy(() => import('./pages/KompetisiPage'))
const DetailKompetisi = lazy(() => import('./pages/DetailKompetisi'))
const DetailArtikel = lazy(() => import('./pages/DetailArtikel'))
const DetailIkan = lazy(() => import('./pages/DetailIkan'))
const DetailKebutuhan = lazy(() => import('./pages/DetailKebutuhan'))
const DemoErrorPage = lazy(() => import('./pages/DemoErrorPage'))
// Customer auth & checkout pages
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const AccountPage = lazy(() => import('./pages/AccountPage'))

const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const Dashboard = lazy(() => import('./admin/pages/Dashboard'))
const ArtikelAdminPage = lazy(() => import('./admin/pages/ArtikelAdminPage'))
const KebutuhanAdminPage = lazy(() => import('./admin/pages/KebutuhanAdminPage'))
const IkanAdminPage = lazy(() => import('./admin/pages/IkanAdminPage'))
const UserAdminPage = lazy(() => import('./admin/pages/UserAdminPage'))
const LoginAdminPage = lazy(() => import('./admin/pages/LoginAdminPage'))

const enhance = (Comp: ComponentType<any>, label: string) =>
  withPerformance(withErrorBoundary(withSuspense(Comp)), label)

const EnhancedHome = enhance(HomePage, 'HomePage')
const EnhancedProfil = enhance(ProfilPage, 'ProfilPage')
const EnhancedArtikel = enhance(ArtikelPage, 'ArtikelPage')
const EnhancedDetailArtikel = enhance(DetailArtikel, 'DetailArtikel')
const EnhancedShop = enhance(ShopPage, 'ShopPage')
const EnhancedKebutuhan = enhance(KebutuhanPage, 'KebutuhanPage')
const EnhancedDetailKebutuhan = enhance(DetailKebutuhan, 'DetailKebutuhan')
const EnhancedIkan = enhance(IkanPage, 'IkanPage')
const EnhancedDetailIkan = enhance(DetailIkan, 'DetailIkan')
const EnhancedKompetisi = enhance(KompetisiPage, 'KompetisiPage')
const EnhancedDetailKompetisi = enhance(DetailKompetisi, 'DetailKompetisi')
const EnhancedDemoError = enhance(DemoErrorPage, 'DemoErrorPage')
const EnhancedLogin = enhance(LoginPage, 'LoginPage')
const EnhancedRegister = enhance(RegisterPage, 'RegisterPage')
const EnhancedCheckout = enhance(CheckoutPage, 'CheckoutPage')
const EnhancedAccount = enhance(AccountPage, 'AccountPage')

const EnhancedAdminLayout = enhance(AdminLayout, 'AdminLayout')
const EnhancedDashboard = enhance(Dashboard, 'Dashboard')
const EnhancedArtikelAdmin = enhance(ArtikelAdminPage, 'ArtikelAdminPage')
const EnhancedKebutuhanAdmin = enhance(KebutuhanAdminPage, 'KebutuhanAdminPage')
const EnhancedIkanAdmin = enhance(IkanAdminPage, 'IkanAdminPage')
const EnhancedUserAdmin = enhance(UserAdminPage, 'UserAdminPage')
const EnhancedLoginAdmin = enhance(LoginAdminPage, 'LoginAdminPage')
const CompetitionAdminPage = lazy(() => import('./admin/pages/CompetitionAdminPage'))
const EnhancedCompetitionAdmin = enhance(CompetitionAdminPage, 'CompetitionAdminPage')
const CompetitionRegistrationsPage = lazy(() => import('./admin/pages/CompetitionRegistrationsPage'))
const EnhancedCompetitionRegistrations = enhance(CompetitionRegistrationsPage, 'CompetitionRegistrationsPage')

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout children={<EnhancedHome />} />} />
        <Route path="/profil" element={<Layout children={<EnhancedProfil />} />} />
        <Route path="/artikel" element={<Layout children={<EnhancedArtikel />} />} />
        <Route path="/artikel/:id" element={<Layout children={<EnhancedDetailArtikel />} />} />
        <Route path="/shop" element={<Layout children={<EnhancedShop />} />} />
        <Route path="/kebutuhan" element={<Layout children={<EnhancedKebutuhan />} />} />
        <Route path="/kebutuhan/:id" element={<Layout children={<EnhancedDetailKebutuhan />} />} />
        <Route path="/ikan" element={<Layout children={<EnhancedIkan />} />} />
        <Route path="/ikan/:id" element={<Layout children={<EnhancedDetailIkan />} />} />
        <Route path="/lomba" element={<Layout children={<EnhancedKompetisi />} />} />
        <Route path="/lomba/:id" element={<Layout children={<EnhancedDetailKompetisi />} />} />
        {/* Auth & Checkout */}
        <Route path="/login" element={<Layout children={<EnhancedLogin />} />} />
        <Route path="/register" element={<Layout children={<EnhancedRegister />} />} />
        <Route path="/checkout" element={<Layout children={<EnhancedCheckout />} />} />
        <Route path="/account" element={<Layout children={<EnhancedAccount />} />} />
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
        <Route
          path="/admin/users"
          element={
            <EnhancedAdminLayout children={<RequireAdmin children={<EnhancedUserAdmin />} />} />
          }
        />
        <Route
          path="/admin/kompetisi"
          element={
            <EnhancedAdminLayout children={<RequireAdmin children={<EnhancedCompetitionAdmin />} />} />
          }
        />
        <Route
          path="/admin/kompetisi/:id/peserta"
          element={
            <EnhancedAdminLayout children={<RequireAdmin children={<EnhancedCompetitionRegistrations />} />} />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
