'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Перенаправить на профиль
        router.push('/profile')
        router.refresh()
      } else {
        setError(data.error || 'Ошибка входа')
      }
    } catch (error) {
      setError('Ошибка соединения с сервером')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">SELS</h1>
          <p className="text-gray-600">Войдите в свой аккаунт</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-blue-100"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-blue-100"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#2F80ED] text-white rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Нет аккаунта?{' '}
            <Link href="/register" className="text-[#2F80ED] font-semibold hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center mb-4">Войти через:</p>
          <div className="space-y-3">
            <a
              href="/api/auth/oauth/yandex"
              className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-[#FC3F1D] text-white rounded-xl font-semibold hover:bg-[#E02E0F] transition"
            >
              <span className="text-xl">Я</span>
              <span>Яндекс</span>
            </a>
            <a
              href="/api/auth/oauth/vk"
              className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-[#0077FF] text-white rounded-xl font-semibold hover:bg-[#0066DD] transition"
            >
              <span className="text-xl">VK</span>
              <span>ВКонтакте</span>
            </a>
            <button
              onClick={() => {
                const telegram = (window as any).Telegram
                // Telegram использует виджет, нужно будет добавить скрипт
                if (telegram && telegram.Login) {
                  telegram.Login.auth(
                    { bot_id: process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID, request_access: true },
                    (data: any) => {
                      fetch('/api/auth/oauth/telegram', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                      }).then((res) => {
                        if (res.ok) {
                          router.push('/profile')
                          router.refresh()
                        }
                      })
                    }
                  )
                } else {
                  alert('Telegram виджет не загружен. Установите NEXT_PUBLIC_TELEGRAM_BOT_ID')
                }
              }}
              className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-[#0088CC] text-white rounded-xl font-semibold hover:bg-[#0077BB] transition"
            >
              <span className="text-xl">✈️</span>
              <span>Telegram</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
