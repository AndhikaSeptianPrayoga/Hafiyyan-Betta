interface IconProps {
  className?: string
  viewBox?: string
}

// Dashboard - Ikon aquarium dengan ikan betta
export function DashboardIcon({ className = "w-4 h-4", viewBox = "0 0 24 24" }: IconProps) {
  return (
    <svg className={className} viewBox={viewBox} fill="none">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 8h18" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="13" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 13l-1.5-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 11h2v6H7z" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.2" />
    </svg>
  )
}

// Artikel - Ikon artikel/blog dengan bubbles air
export function ArticleIcon({ className = "w-4 h-4", viewBox = "0 0 24 24" }: IconProps) {
  return (
    <svg className={className} viewBox={viewBox} fill="none">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 7h10M7 11h10M7 15h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17" cy="6" r="1" fill="currentColor" fillOpacity="0.3" />
      <circle cx="19" cy="8" r="0.5" fill="currentColor" fillOpacity="0.4" />
      <circle cx="18" cy="10" r="0.8" fill="currentColor" fillOpacity="0.2" />
    </svg>
  )
}

// Kebutuhan - Ikon kotak/package dengan gelembung
export function NeedsIcon({ className = "w-4 h-4", viewBox = "0 0 24 24" }: IconProps) {
  return (
    <svg className={className} viewBox={viewBox} fill="none">
      <rect x="4" y="6" width="16" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 10h16" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 6V4a1 1 0 011-1h3a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="14" r="1" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="14" r="1" stroke="currentColor" strokeWidth="1" />
      <circle cx="16" cy="14" r="1" stroke="currentColor" strokeWidth="1" />
      <path d="M6 12v4M18 12v4" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
    </svg>
  )
}

// Ikan - Ikon betta fish yang elegan
export function FishIcon({ className = "w-4 h-4", viewBox = "0 0 24 24" }: IconProps) {
  return (
    <svg className={className} viewBox={viewBox} fill="none">
      {/* Body */}
      <ellipse cx="12" cy="12" rx="4" ry="2.5" stroke="currentColor" strokeWidth="1.5" />
      {/* Tail */}
      <path d="M8 12c-2 0-4-1-5-2.5C4 8 6 7 8 7v2.5L8 12l0 2.5V17c-2 0-4-1-5-2.5C4 16 6 15 8 15v-3z" 
            stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.1" />
      {/* Dorsal fin */}
      <path d="M10 9.5c1-1.5 2.5-2 4-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Ventral fin */}
      <path d="M10 14.5c1 1.5 2.5 2 4 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Eye */}
      <circle cx="14" cy="11.5" r="0.8" fill="currentColor" />
      {/* Bubbles */}
      <circle cx="19" cy="8" r="0.5" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="20" cy="10" r="0.3" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="18.5" cy="11.5" r="0.4" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  )
}

// Hamburger menu - untuk mobile toggle
export function MenuIcon({ className = "w-5 h-5", viewBox = "0 0 24 24" }: IconProps) {
  return (
    <svg className={className} viewBox={viewBox} fill="none" stroke="currentColor">
      <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}