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
          <p className="text-sm text-gray-500 text-center mb-4">Быстрый вход (тестовые аккаунты):</p>
          <div className="space-y-2 text-sm">
            <button
              onClick={async () => {
                setEmail('petr@sels.com')
                setPassword('password123')
                // Автоматический вход
                setTimeout(async () => {
                  const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: 'petr@sels.com', password: 'password123' }),
                  })
                  if (response.ok) {
                    router.push('/profile')
                    router.refresh()
                  }
                }, 100)
              }}
              className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-transparent rounded-lg transition"
            >
              <div className="font-medium text-gray-900">Petr Tartyshev</div>
              <div className="text-gray-600 text-xs">petr@sels.com</div>
            </button>
            <button
              onClick={async () => {
                setEmail('sergey@sels.com')
                setPassword('password123')
                // Автоматический вход
                setTimeout(async () => {
                  const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: 'sergey@sels.com', password: 'password123' }),
                  })
                  if (response.ok) {
                    router.push('/profile')
                    router.refresh()
                  }
                }, 100)
              }}
              className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-transparent rounded-lg transition"
            >
              <div className="font-medium text-gray-900">Сергей Иванов</div>
              <div className="text-gray-600 text-xs">sergey@sels.com</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
