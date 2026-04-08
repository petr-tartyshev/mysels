'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, Clock3, MapPin, Users } from 'lucide-react'
import AppNavigation from '@/components/AppNavigation'

interface EventAuthor {
  id: string
  firstName: string
  lastName: string
  username: string
  avatar: string | null
}

interface EventLocation {
  id: string
  name: string
  address: string | null
}

interface FeedEvent {
  id: string
  title: string
  description: string | null
  images: string[]
  date: string
  timeStart: string
  timeEnd: string
  level: string | null
  capacity: number | null
  participants: number
  createdAt: string
  user: EventAuthor
  location: EventLocation
}

type FeedFilter = 'all' | 'training' | 'coach' | 'booking'

function formatEventDate(rawDate: string): string {
  const parsed = new Date(rawDate)
  if (Number.isNaN(parsed.getTime())) {
    return rawDate
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    weekday: 'short',
  }).format(parsed)
}

function formatCreatedAt(rawDate: string): string {
  const parsed = new Date(rawDate)
  if (Number.isNaN(parsed.getTime())) {
    return 'только что'
  }

  const diffMs = Date.now() - parsed.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  if (diffMinutes < 1) return 'только что'
  if (diffMinutes < 60) return `${diffMinutes} мин назад`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} ч назад`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} дн назад`
}

export default function FeedPage() {
  const router = useRouter()
  const [events, setEvents] = useState<FeedEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FeedFilter>('all')

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const meResponse = await fetch('/api/auth/me')
        if (!meResponse.ok) {
          router.push('/login')
          return
        }

        const eventsResponse = await fetch('/api/events')
        if (!eventsResponse.ok) {
          setEvents([])
          return
        }

        const data = await eventsResponse.json()
        setEvents(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Ошибка загрузки ленты:', error)
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    bootstrap()
  }, [router])

  const feedTitle = useMemo(() => {
    if (loading) return 'Загрузка ленты...'
    return `Лента событий · ${events.length}`
  }, [events.length, loading])

  const filteredEvents = useMemo(() => {
    if (activeFilter === 'all') return events

    return events.filter((event) => {
      const source = `${event.title} ${event.description || ''} ${event.location?.name || ''}`.toLowerCase()

      if (activeFilter === 'training') {
        return source.includes('трениров') || source.includes('спарринг') || source.includes('practice')
      }
      if (activeFilter === 'coach') {
        return source.includes('тренер') || source.includes('coach') || source.includes('наставник')
      }
      if (activeFilter === 'booking') {
        return source.includes('бронир') || source.includes('аренда') || source.includes('корт')
      }

      return true
    })
  }, [events, activeFilter])

  return (
    <div className="min-h-screen bg-[#F7F9FA] md:flex">
      <AppNavigation mobileTitle="Лента" />

      <main className="flex-1 min-w-0 w-full max-w-3xl border-x border-gray-200 bg-white pb-24 md:pb-8">
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200 px-4 md:px-6 py-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">{feedTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">Новые спортивные эвенты от пользователей</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter('training')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeFilter === 'training' ? 'bg-[#2F80ED] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Найти тренировку
            </button>
            <button
              onClick={() => setActiveFilter('coach')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeFilter === 'coach' ? 'bg-[#2F80ED] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Найти тренера
            </button>
            <button
              onClick={() => setActiveFilter('booking')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeFilter === 'booking' ? 'bg-[#2F80ED] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Забронировать
            </button>
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Все
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2F80ED]" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="px-4 md:px-6 py-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">По фильтру ничего не найдено</h2>
            <p className="text-gray-600">Попробуй другой фильтр или переключись на "Все".</p>
          </div>
        ) : (
          <div>
            {filteredEvents.map((event) => {
              const coverImage = Array.isArray(event.images) && event.images.length > 0 ? event.images[0] : null
              const freePlaces =
                typeof event.capacity === 'number'
                  ? Math.max(event.capacity - (event.participants || 0), 0)
                  : null

              return (
                <article key={event.id} className="px-4 md:px-6 py-5 border-b border-gray-100 hover:bg-gray-50/70 transition-colors">
                  <div className="flex gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-[#2F80ED] text-white flex items-center justify-center font-semibold shrink-0">
                      {event.user?.avatar ? (
                        <img src={event.user.avatar} alt={event.user.firstName} className="w-full h-full object-cover" />
                      ) : (
                        <span>{event.user?.firstName?.[0] || 'S'}</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                        <span className="font-semibold text-gray-900">
                          {event.user.firstName} {event.user.lastName}
                        </span>
                        <span className="text-gray-500">@{event.user.username}</span>
                        <span className="text-gray-400">· {formatCreatedAt(event.createdAt)}</span>
                      </div>

                      <h2 className="mt-2 text-lg md:text-xl font-bold text-gray-900">{event.title}</h2>
                      {event.description && <p className="mt-2 text-gray-700 whitespace-pre-wrap">{event.description}</p>}

                      {coverImage && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200">
                          <img src={coverImage} alt={event.title} className="w-full max-h-80 object-cover" />
                        </div>
                      )}

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CalendarDays size={16} className="text-[#2F80ED]" />
                          <span>{formatEventDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock3 size={16} className="text-[#2F80ED]" />
                          <span>
                            {event.timeStart} - {event.timeEnd}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <MapPin size={16} className="text-[#2F80ED]" />
                          <span className="truncate">{event.location?.name || 'Локация не указана'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Users size={16} className="text-[#2F80ED]" />
                          <span>
                            {event.participants || 0}
                            {freePlaces !== null ? `/${event.capacity}` : ''} участников
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        {event.level && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-[#2F80ED]">
                            Уровень: {event.level}
                          </span>
                        )}
                        <button
                          onClick={() => router.push(`/profile?username=${event.user.username}`)}
                          className="ml-auto px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-black transition-colors"
                        >
                          Профиль автора
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
