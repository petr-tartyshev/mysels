'use client'

import { Search } from 'lucide-react'
import Link from 'next/link'

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar Menu */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 sticky top-0 h-screen">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">SELS</h2>
        <nav className="space-y-2">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            Мой профиль
          </Link>
          <Link
            href="/map"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Карта
          </Link>
          <Link
            href="/news"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
            </svg>
            Новости
          </Link>
          <Link
            href="/search"
            className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-[#2F80ED] rounded-xl font-medium"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            Поиск
          </Link>
          <Link
            href="/chats"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            Чаты
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Поиск</h1>
          
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              placeholder="Поиск команд, мероприятий, локаций..."
              className="w-full pl-14 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F80ED] text-lg"
            />
          </div>

          <div className="text-center py-12">
            <Search size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Введите запрос для поиска</p>
          </div>
        </div>
      </div>
    </div>
  )
}
