'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/glosario', label: 'Glosario IA' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-5 h-5 rounded-sm bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
            AI
          </span>
          <span className="text-slate-200 text-sm font-semibold tracking-tight group-hover:text-white transition-colors">
            Ai Visibility
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  active
                    ? 'bg-slate-800 text-slate-100'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

      </div>
    </nav>
  )
}

