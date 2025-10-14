# Hafiyyan Betta - Project Structure dengan Tailwind CSS

## 📁 Struktur Folder

```
src/
├── components/           # Komponen UI yang reusable
│   ├── Navbar.tsx       # Navigation bar
│   ├── Footer.tsx       # Footer component
│   ├── CartModal.tsx    # Modal untuk keranjang belanja
│   └── Layout.tsx       # Layout wrapper utama
├── pages/               # Halaman-halaman utama
│   ├── HomePage.tsx     # Halaman beranda
│   ├── ProfilPage.tsx   # Halaman profil perusahaan
│   ├── ArtikelPage.tsx  # Halaman artikel
│   ├── KebutuhanPage.tsx # Halaman kebutuhan cupang
│   └── IkanPage.tsx     # Halaman ikan cupang
├── hooks/               # Custom React hooks
│   └── useReducer.ts    # State management logic
├── context/             # React Context
│   └── AppContext.tsx   # Global state context
├── types/               # TypeScript type definitions
│   └── index.ts         # Semua interface & types
├── utils/               # Utility functions
├── icons/               # Icon components
└── ...
```

## 🎨 Konversi dari Bootstrap ke Tailwind

### Class Mapping Examples:

- `container` → `container mx-auto px-4`
- `row` → `grid grid-cols-*`
- `col-md-6` → `col-span-6`
- `btn btn-primary` → `bg-primary-main text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors`
- `text-primary` → `text-primary-main`
- `shadow-sm` → `shadow-sm`
- `fs-1` → `text-4xl`

### Color Palette:

- Primary: `#4682B4` (Steel Blue)
- Primary Dark: `#2E5984`
- Primary Light: `#87CEEB`
- Secondary: `#E0ECEE`
- Secondary Light: `#F5F9FC`

## 🔧 Features:

- ✅ Navigation dengan mobile menu responsive
- ✅ Shopping cart dengan state management
- ✅ Tailwind CSS styling
- ✅ TypeScript types safety
- ✅ Component-based architecture
- ✅ Context API untuk global state
