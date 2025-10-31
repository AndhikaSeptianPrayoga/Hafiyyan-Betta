import { NavLink } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { DashboardIcon, ArticleIcon, NeedsIcon, FishIcon, MenuIcon } from '../icons/BettaIcons'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    // Tandai body sebagai halaman admin agar tidak offset navbar
    document.body.classList.add('admin-page')
    document.body.classList.remove('has-navbar')
    return () => {
      document.body.classList.remove('admin-page')
    }
  }, [])
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      {/* overlay for mobile */}
      {open && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setOpen(false)} />
      )}
      <aside
        className={`z-40 ${open ? 'fixed inset-y-0 left-0' : 'hidden'} md:flex md:static w-64 bg-white border-r border-gray-200 flex-col`}
      >
        <div className="h-16 flex items-center gap-3 px-6 border-b">
          <img src="/img/logo.png" alt="Hafiyyan Betta" className="w-8 h-8 rounded" />
          <div>
            <span className="block text-base font-bold text-primary-dark leading-tight">
              Hafiyyan Betta
            </span>
            <span className="block text-xs text-gray-500">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <p className="px-3 text-xs font-semibold text-gray-500">Konten Website</p>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'}`
            }
          >
            <DashboardIcon />
            Dashboard
          </NavLink>
          <p className="px-3 mt-4 text-xs font-semibold text-gray-500">Manajemen</p>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'}`
            }
          >
            <DashboardIcon />
            Kelola Pengguna
          </NavLink>
          <NavLink
            to="/admin/artikel"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'}`
            }
          >
            <ArticleIcon />
            Kelola Artikel
          </NavLink>
          <NavLink
            to="/admin/kebutuhan"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'}`
            }
          >
            <NeedsIcon />
            Kelola Kebutuhan Cupang
          </NavLink>
          <NavLink
            to="/admin/ikan"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'}`
            }
          >
            <FishIcon />
            Kelola Ikan Cupang
          </NavLink>
          <NavLink
            to="/admin/kompetisi"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'}`
            }
          >
            <DashboardIcon />
            Kelola Kompetisi
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            {/* mobile toggle */}
            <button
              className="md:hidden p-2 rounded-md border hover:bg-gray-50"
              onClick={() => setOpen(!open)}
              aria-label="Toggle sidebar"
            >
            <MenuIcon />
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-gray-900">Dashboard Admin</h1>
            <p className="text-xs text-gray-500">Kelola konten website Anda dengan mudah</p>
          </div>
          <div className="flex items-center gap-3">
            {/* notifications */}
            <button className="p-2 rounded-md hover:bg-gray-100" aria-label="Notifications">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5 text-gray-700"
              >
                <path
                  d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm7-6V11a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
            <button className="p-2 rounded-md hover:bg-gray-100" aria-label="Settings">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5 text-gray-700"
              >
                <path
                  d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M19.4 15a7.96 7.96 0 0 0 .1-2 7.96 7.96 0 0 0-.1-2l2.1-1.6-2-3.4-2.5.6a8.04 8.04 0 0 0-3.4-2l-.5-2.6H9l-.5 2.6a8.04 8.04 0 0 0-3.4 2l-2.5-.6-2 3.4 2.1 1.6a7.96 7.96 0 0 0-.1 2c0 .7.1 1.3.1 2L.6 16.6l2 3.4 2.5-.6a8.04 8.04 0 0 0 3.4 2l.5 2.6h4l.5-2.6a8.04 8.04 0 0 0 3.4-2l2.5.6 2-3.4-2.1-1.6Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
            <span className="hidden sm:block text-sm text-gray-600">Super Admin</span>
            <div className="w-8 h-8 rounded-full bg-primary-main/80 text-white flex items-center justify-center font-semibold">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
