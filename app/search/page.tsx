'use client'

import { Search } from 'lucide-react'
import AppNavigation from '@/components/AppNavigation'

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <AppNavigation mobileTitle="Поиск" />

      {/* Main Content */}
      <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
        <div className="bg-white rounded-2xl p-5 md:p-8 shadow-sm">
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
