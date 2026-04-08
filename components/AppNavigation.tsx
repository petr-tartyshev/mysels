'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, User, Search, MessageCircle, LogOut } from 'lucide-react'

const navItems = [
  { href: '/feed', label: 'Лента', icon: Home },
  { href: '/profile', label: 'Профиль', icon: User },
  { href: '/search', label: 'Поиск', icon: Search },
  { href: '/chats', label: 'Чаты', icon: MessageCircle },
]

interface AppNavigationProps {
  mobileTitle?: string
}

export default function AppNavigation({ mobileTitle = 'SELS' }: AppNavigationProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Ошибка выхода:', error)
    }
  }

  return (
    <>
      {/* Desktop Sidebar — X/Twitter style */}
      <aside className="hidden md:flex w-72 bg-white border-r border-gray-100 px-4 py-4 sticky top-0 h-screen flex-col">
        {/* Logo */}
        <div className="px-3 py-3 mb-4">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl leading-none">S</span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname?.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-3 py-3 rounded-full transition-colors hover:bg-gray-100 ${
                  isActive ? 'font-bold text-gray-900' : 'text-gray-700 font-normal'
                }`}
              >
                <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xl">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout at bottom left */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-3 py-3 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors w-full text-left"
        >
          <LogOut size={26} strokeWidth={2} />
          <span className="text-xl">Выйти</span>
        </button>
      </aside>

      {/* Mobile top header */}
      <div className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">{mobileTitle}</h1>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-2 py-2">
        <div className="grid grid-cols-4 gap-1">
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
