'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Search, MessageCircle } from 'lucide-react'

const navItems = [
  { href: '/profile', label: 'Мой профиль', icon: User },
  { href: '/search', label: 'Поиск', icon: Search },
  { href: '/chats', label: 'Чаты', icon: MessageCircle },
]

interface AppNavigationProps {
  mobileTitle?: string
}

export default function AppNavigation({ mobileTitle = 'SELS' }: AppNavigationProps) {
  const pathname = usePathname()

  return (
    <>
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 p-6 sticky top-0 h-screen flex-col">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">SELS</h2>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname?.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                  isActive
                    ? 'bg-blue-50 text-[#2F80ED]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={22} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">{mobileTitle}</h1>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-2 py-2">
        <div className="grid grid-cols-3 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname?.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center rounded-lg py-2 text-xs transition ${
                  isActive ? 'text-[#2F80ED] bg-blue-50' : 'text-gray-500'
                }`}
              >
                <Icon size={18} />
                <span className="mt-1">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
