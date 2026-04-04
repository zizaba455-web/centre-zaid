'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { section: 'Principal' },
  { href: '/dashboard', label: 'Tableau de bord', icon: '◈' },
  { href: '/eleves', label: 'Élèves', icon: '◉' },
  { href: '/presences/eleves', label: 'Présences élèves', icon: '◎' },
  { href: '/presences/profs', label: 'Présences profs', icon: '◈' },
  { href: '/finance', label: 'Finance & caisse', icon: '◉', badge: '3' },
  { section: 'Pôles' },
  { href: '/daara', label: 'Daara', icon: '◉' },
  { href: '/profs', label: 'Enseignants', icon: '◎' },
  { href: '/messages', label: 'Messages', icon: '◈', badge: '5' },
  { section: 'Admin' },
  { href: '/salaires', label: 'Salaires', icon: '◉' },
  { href: '/documents', label: 'Documents', icon: '◎' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-[#1a2818] fixed top-0 left-0 h-screen flex flex-col z-50">
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#c8961a] flex items-center justify-center text-[#1a2818] font-bold text-sm flex-shrink-0">
            ZT
          </div>
          <div>
            <div className="text-white text-xs font-medium leading-tight">
              Centre Zaïd Ibn Thabit
            </div>
            <div className="text-white/40 text-[9px] mt-0.5">
              UCED — علم وعمل السلف الصالح
            </div>
            <span className="text-[9px] font-medium bg-[#c8961a]/20 text-[#c8961a] px-2 py-0.5 rounded-full mt-1 inline-block">
              Dir. Opérationnel
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 overflow-y-auto">
        {navItems.map((item, i) => {
          if ('section' in item) {
            return (
              <div key={i} className="text-[9px] font-medium text-white/30 uppercase tracking-widest px-2 pt-3 pb-1">
                {item.section}
              </div>
            )
          }
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-2 py-2 rounded-lg text-xs mb-0.5 transition-all ${
                active
                  ? 'bg-[#2d6a2d] text-white font-medium'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/90'
              }`}
            >
              <span>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-red-600 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2 p-2">
          <div className="w-7 h-7 rounded-full bg-[#2d6a2d] flex items-center justify-center text-white text-[10px] font-semibold">
            DO
          </div>
          <div>
            <div className="text-white/70 text-xs font-medium">Dir. Opérationnel</div>
            <div className="text-white/30 text-[9px]">Accès complet</div>
          </div>
        </div>
      </div>
    </aside>
  )
}