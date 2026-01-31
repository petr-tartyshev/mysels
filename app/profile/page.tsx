'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Settings, Calendar, BarChart3, Plus, X, Upload, MapPin, List, Map as MapIcon, LogOut, Trash2 } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import 'maplibre-gl/dist/maplibre-gl.css'

const Map = dynamic(() => import('react-map-gl/maplibre'), {
  ssr: false,
})

const Marker = dynamic(() => import('react-map-gl/maplibre').then((mod) => mod.Marker), {
  ssr: false,
})

interface LocationOption {
  id: string
  name: string
  lat: number
  lng: number
  type?: 'outdoor' | 'bike' | 'water'
}

function ProfilePageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const viewUsername = searchParams.get('username') // Профиль для просмотра
  
  const [activeTab, setActiveTab] = useState('publications')
  const [showNewPost, setShowNewPost] = useState(false)
  const [showNewEvent, setShowNewEvent] = useState(false)
  const [showCreateMenu, setShowCreateMenu] = useState(false) // Меню выбора: пост или событие
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({})
  const [posts, setPosts] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null) // Текущий авторизованный пользователь
  const [viewUser, setViewUser] = useState<any>(null) // Пользователь, профиль которого просматривается
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [newPostText, setNewPostText] = useState('')
  const [newPostImages, setNewPostImages] = useState<string[]>([])
  const [newPostLocation, setNewPostLocation] = useState<{ name: string; id: string } | null>(null)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [locationPickerMode, setLocationPickerMode] = useState<'map' | 'list'>('list')
  
  // Состояние для создания события
  const [newEventTitle, setNewEventTitle] = useState('')
  const [newEventDescription, setNewEventDescription] = useState('')
  const [newEventImages, setNewEventImages] = useState<string[]>([])
  const [newEventLocation, setNewEventLocation] = useState<{ name: string; id: string } | null>(null)
  const [newEventDate, setNewEventDate] = useState('')
  const [newEventTimeStart, setNewEventTimeStart] = useState('')
  const [newEventTimeEnd, setNewEventTimeEnd] = useState('')
  const [newEventCapacity, setNewEventCapacity] = useState('')
  const [newEventLevel, setNewEventLevel] = useState('новичок')

  // Состояние для создания локации
  const [showNewLocation, setShowNewLocation] = useState(false)
  const [newLocationName, setNewLocationName] = useState('')
  const [newLocationDescription, setNewLocationDescription] = useState('')
  const [newLocationType, setNewLocationType] = useState<'outdoor' | 'bike' | 'water' | 'gym'>('outdoor')
  const [newLocationIsPublic, setNewLocationIsPublic] = useState(false)
  const [newLocationCoords, setNewLocationCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [newLocationAddress, setNewLocationAddress] = useState('')
  const [newLocationCost, setNewLocationCost] = useState('Бесплатно')

  // Загрузка локаций из БД
  const [availableLocations, setAvailableLocations] = useState<LocationOption[]>([
    { id: '1', name: 'Футбольное поле в парке Яуза', lat: 55.8228, lng: 37.6602, type: 'outdoor' },
    { id: '2', name: 'Спортплощадка Сокольники', lat: 55.7967, lng: 37.6700, type: 'outdoor' },
    { id: '3', name: 'Стадион Лужники', lat: 55.7150, lng: 37.5550, type: 'outdoor' },
    { id: '4', name: 'Парк Горького', lat: 55.7308, lng: 37.6014, type: 'outdoor' },
    { id: '5', name: 'Воробьевы горы', lat: 55.7105, lng: 37.5420, type: 'outdoor' },
  ])

  // Загрузка локаций из БД (все локации теперь хранятся в базе данных)
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/locations')
        
        if (response.ok) {
          const locationsData = await response.json()
          const formattedLocations: LocationOption[] = locationsData.map((loc: any) => ({
            id: loc.id,
            name: loc.name,
            lat: loc.lat,
            lng: loc.lng,
            type: (loc.type === 'outdoor' ? 'outdoor' : 
                   loc.type === 'bike' ? 'bike' : 
                   loc.type === 'water' ? 'water' : 
                   'outdoor') as LocationOption['type'],
          }))
          setAvailableLocations(formattedLocations)
        } else {
          console.error('Ошибка загрузки локаций:', response.status)
        }
      } catch (error) {
        console.error('Ошибка загрузки локаций:', error)
      }
    }

    fetchLocations()
  }, [])

  // Загрузка текущего авторизованного пользователя
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setCurrentUser(data.user)
        }
      } catch (error) {
        console.error('Ошибка загрузки текущего пользователя:', error)
      }
    }

    fetchCurrentUser()
  }, [])

  // Проверка query параметров для автоматической установки локации из map-point
  useEffect(() => {
    const locationId = searchParams.get('locationId')
    const locationName = searchParams.get('locationName')
    const createEvent = searchParams.get('createEvent') === 'true'
    
    if (locationId && locationName) {
      if (createEvent) {
        // Автоматически открываем форму создания события с выбранной локацией
        setNewEventLocation({ id: locationId, name: locationName })
        setShowNewEvent(true)
      }
    }
  }, [searchParams])

  // Загрузка данных пользователя для просмотра и постов
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return // Ждём загрузки текущего пользователя

      try {
        // Определяем, какой профиль показывать
        const targetUsername = viewUsername || currentUser.username

        // Загрузка пользователя для просмотра
        const userResponse = await fetch(`/api/users?username=${targetUsername}`)
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setViewUser(userData)
          
          // Проверяем, является ли это профиль текущего пользователя
          setIsOwnProfile(userData.id === currentUser.id)

          // Загрузка постов пользователя
          const postsResponse = await fetch(`/api/posts?userId=${userData.id}`)
          if (postsResponse.ok) {
            const postsData = await postsResponse.json()
            // Форматируем посты для отображения
            const formattedPosts = postsData.map((post: any) => ({
              id: post.id,
              date: new Date(post.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }),
              text: post.text,
              location: post.location.name,
              locationId: post.location.id,
              images: post.images || [],
              author: {
                id: post.user.id,
                firstName: post.user.firstName,
                lastName: post.user.lastName,
                username: post.user.username,
                avatar: post.user.avatar,
              },
            }))
            setPosts(formattedPosts)
          }

          // Загрузка событий пользователя
          const eventsResponse = await fetch(`/api/events?userId=${userData.id}`)
          if (eventsResponse.ok) {
            const eventsData = await eventsResponse.json()
            setEvents(eventsData)
          }
        } else {
          // Пользователь не найден
          setViewUser(null)
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentUser, viewUsername])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Ошибка выхода:', error)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот пост?')) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Удаляем пост из списка
        setPosts(posts.filter((post) => post.id !== postId))
      } else {
        alert('Не удалось удалить пост')
      }
    } catch (error) {
      console.error('Ошибка удаления поста:', error)
      alert('Ошибка при удалении поста')
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Вы уверены, что хотите удалить это событие? Событие будет удалено из всех мест, включая карту.')) return

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Удаляем событие из списка
        setEvents(events.filter((event) => event.id !== eventId))
        // Обновляем страницу, чтобы события обновились на карте
        router.refresh()
        alert('Событие успешно удалено')
      } else {
        const data = await response.json()
        alert(data.error || 'Не удалось удалить событие')
      }
    } catch (error) {
      console.error('Ошибка удаления события:', error)
      alert('Ошибка при удалении события')
    }
  }

  const handleCreateEvent = async () => {
    if (!newEventTitle || !newEventLocation || !newEventDate || !newEventTimeStart || !newEventTimeEnd || !newEventCapacity || !currentUser) {
      alert('Пожалуйста, заполните все обязательные поля')
      return
    }

    try {
      // Валидация и очистка данных перед отправкой
      // Проверяем, что изображения имеют правильный формат data URL
      const cleanImages = Array.isArray(newEventImages) 
        ? newEventImages.filter((img: string) => {
            if (!img || typeof img !== 'string' || img.length === 0) return false
            // Проверяем, что это валидный data URL для изображения
            const isValidDataUrl = /^data:image\/(jpeg|jpg|png|gif|webp|bmp);base64,/.test(img)
            if (!isValidDataUrl) {
              console.warn('Пропущено невалидное изображение:', img.substring(0, 50) + '...')
              return false
            }
            return true
          })
        : []

      // Преобразуем дату из формата YYYY-MM-DD (input type="date") в нужный формат
      // Если дата уже в правильном формате, оставляем как есть
      let formattedDate = newEventDate
      if (newEventDate && newEventDate.includes('.')) {
        // Если дата в формате DD.MM.YYYY, преобразуем в YYYY-MM-DD
        const parts = newEventDate.split('.')
        if (parts.length === 3) {
          formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`
        }
      }

      const eventData = {
        title: newEventTitle.trim(),
        description: newEventDescription && newEventDescription.trim().length > 0 
          ? newEventDescription.trim() 
          : null,
        images: cleanImages,
        locationId: newEventLocation.id,
        userId: currentUser.id,
        date: formattedDate,
        timeStart: newEventTimeStart,
        timeEnd: newEventTimeEnd,
        capacity: parseInt(newEventCapacity, 10),
        level: newEventLevel,
      }

      console.log('Отправка события:', { 
        ...eventData, 
        images: eventData.images.length + ' изображений',
        originalDate: newEventDate,
        formattedDate: formattedDate,
        capacity: eventData.capacity,
        capacityType: typeof eventData.capacity,
      })

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Неизвестная ошибка' }))
        console.error('Ошибка ответа сервера:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        })
        const errorMessage = errorData.error || 'Неизвестная ошибка'
        alert(`Ошибка создания события: ${errorMessage}`)
        return
      }

      const savedEvent = await response.json()
      console.log('Событие создано:', savedEvent)
      
      // Добавляем событие в список
      setEvents([savedEvent, ...events])
      
      // Закрываем форму и очищаем поля
      setShowNewEvent(false)
      setNewEventTitle('')
      setNewEventDescription('')
      setNewEventImages([])
      setNewEventLocation(null)
      setNewEventDate('')
      setNewEventTimeStart('')
      setNewEventTimeEnd('')
      setNewEventCapacity('')
      
      alert('Событие успешно создано!')
      router.refresh()
    } catch (error) {
      console.error('Ошибка создания события:', error)
      alert(`Не удалось создать событие: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
    }
  }

  const handleEventImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    const imageUrls: string[] = []
    let loadedCount = 0

    Array.from(files).forEach((file) => {
      // Проверка размера файла
      if (file.size > MAX_FILE_SIZE) {
        alert(`Файл ${file.name} слишком большой. Максимальный размер: 5MB`)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          const dataUrl = e.target.result
          // Проверяем, что это валидный data URL для изображения
          if (/^data:image\/(jpeg|jpg|png|gif|webp|bmp);base64,/.test(dataUrl)) {
            imageUrls.push(dataUrl)
          } else {
            console.error('Невалидный формат изображения:', file.name, dataUrl.substring(0, 50))
            alert(`Ошибка: файл ${file.name} имеет невалидный формат`)
          }
          loadedCount++
          
          // Когда все файлы загружены, обновляем состояние
          if (loadedCount === files.length) {
            setNewEventImages((prev) => [...prev, ...imageUrls])
          }
        } else {
          console.error('Ошибка чтения файла:', file.name)
          alert(`Ошибка чтения файла: ${file.name}`)
          loadedCount++
          if (loadedCount === files.length && imageUrls.length > 0) {
            setNewEventImages((prev) => [...prev, ...imageUrls])
          }
        }
      }
      reader.onerror = () => {
        console.error('Ошибка чтения файла:', file.name)
        alert(`Ошибка чтения файла: ${file.name}`)
        loadedCount++
        if (loadedCount === files.length && imageUrls.length > 0) {
          setNewEventImages((prev) => [...prev, ...imageUrls])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleCreatePost = async () => {
    if (!newPostText || !newPostLocation || !currentUser) return

    try {
      // Сохранение поста в БД
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newPostText,
          images: newPostImages,
          locationId: newPostLocation.id,
          userId: currentUser.id,
        }),
      })

      if (response.ok) {
        const savedPost = await response.json()
        
        // Добавляем пост в UI
        const formattedPost = {
          id: savedPost.id,
          date: new Date(savedPost.createdAt).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          text: savedPost.text,
          location: savedPost.location.name,
          locationId: savedPost.location.id,
          images: savedPost.images || [],
          author: {
            id: savedPost.user.id,
            firstName: savedPost.user.firstName,
            lastName: savedPost.user.lastName,
            username: savedPost.user.username,
            avatar: savedPost.user.avatar,
          },
        }

        setPosts([formattedPost, ...posts])
        setShowNewPost(false)
        setNewPostText('')
        setNewPostImages([])
        setNewPostLocation(null)
      }
    } catch (error) {
      console.error('Ошибка создания поста:', error)
      alert('Не удалось создать пост. Попробуйте снова.')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const imageUrls: string[] = []
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          imageUrls.push(e.target.result as string)
          if (imageUrls.length === files.length) {
            setNewPostImages([...newPostImages, ...imageUrls])
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const togglePost = (postId: string) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  const getPreviewText = (text: string) => {
    const lines = text.split('. ')
    return lines.slice(0, 2).join('. ') + (lines.length > 2 ? '.' : '')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar Menu */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 sticky top-0 h-screen flex flex-col">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">SELS</h2>
        <nav className="space-y-2 flex-1">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-[#2F80ED] rounded-xl font-medium"
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
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition"
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

        {/* Settings and Logout buttons at the bottom */}
        {isOwnProfile && currentUser && (
          <div className="mt-auto pt-6 border-t border-gray-200 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition">
              <Settings size={20} className="text-gray-600" />
              Настройки
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition"
            >
              <LogOut size={20} className="text-gray-600" />
              Выйти
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto p-8">
        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F80ED]"></div>
          </div>
        ) : !currentUser ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Требуется авторизация</h2>
            <p className="text-gray-600 mb-6">Войдите в аккаунт, чтобы просмотреть профиль</p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-[#2F80ED] text-white rounded-xl font-medium hover:bg-blue-600 transition"
            >
              Войти
            </Link>
          </div>
        ) : !viewUser ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Пользователь не найден</h2>
            <p className="text-gray-600 mb-6">Профиль с username "{viewUsername}" не существует</p>
            <Link
              href="/profile"
              className="inline-block px-6 py-3 bg-[#2F80ED] text-white rounded-xl font-medium hover:bg-blue-600 transition"
            >
              Вернуться к своему профилю
            </Link>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-blue-400 rounded-full flex items-center justify-center overflow-hidden">
                    {viewUser?.avatar ? (
                      <img
                        src={viewUser.avatar}
                        alt={viewUser.firstName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(viewUser?.firstName + ' ' + viewUser?.lastName)}&background=2F80ED&color=fff&size=128&bold=true`}
                        alt={viewUser?.firstName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {viewUser?.firstName} {viewUser?.lastName}
                    </h1>
                    <p className="text-gray-600">@{viewUser?.username}</p>
                    {viewUser?.bio && (
                      <p className="text-gray-500 text-sm mt-2">{viewUser.bio}</p>
                    )}
                  </div>
                </div>
              </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('publications')}
              className={`pb-3 px-4 font-medium transition ${
                activeTab === 'publications'
                  ? 'text-[#2F80ED] border-b-2 border-[#2F80ED]'
                  : 'text-gray-600'
              }`}
            >
              Публикации
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`pb-3 px-4 font-medium transition flex items-center gap-2 ${
                activeTab === 'events'
                  ? 'text-[#2F80ED] border-b-2 border-[#2F80ED]'
                  : 'text-gray-600'
              }`}
            >
              <Calendar size={20} />
              События
            </button>
          </div>
        </div>

        {/* Publications */}
        {activeTab === 'publications' && (
          <div className="space-y-4">
            {posts.map((post) => {
              const isExpanded = expandedPosts[post.id]
              return (
                <div
                  key={post.id}
                  className="bg-[#E8F4FD] rounded-2xl p-6 shadow-sm"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-[#A8D5F2] rounded-full flex items-center justify-center overflow-hidden">
                        {post.author?.avatar ? (
                          <img
                            src={post.author.avatar}
                            alt={post.author.firstName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.firstName + ' ' + post.author?.lastName)}&background=2F80ED&color=fff&size=128&bold=true`}
                            alt={post.author?.firstName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900">{post.author?.firstName} </span>
                        <span className="text-gray-600">@{post.author?.username} </span>
                        <span className="text-gray-600">{post.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isOwnProfile && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                          title="Удалить пост"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                      <button onClick={() => togglePost(post.id)} className="p-1">
                        {isExpanded ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="text-gray-600"
                          >
                            <path
                              d="M5 7.5L10 2.5L15 7.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="text-gray-600"
                          >
                            <path
                              d="M5 12.5L10 17.5L15 12.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Post Content */}
                  {isExpanded ? (
                    <>
                      <p className="text-gray-900 mb-4">{post.text}</p>

                      {/* Details/Bullet Points */}
                      <div className="space-y-3 mb-4">
                        <p className="text-gray-800">
                          Размика на все группы мышц. Беговые упражнений.
                          <br />
                          Силовые упражнения.
                        </p>
                        <p className="text-gray-800">
                          Размика на все группы мышц. Беговые упражнений.
                          <br />
                          Силовые упражнения.
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-900 font-bold mb-4">{getPreviewText(post.text)}</p>
                  )}

                  {/* Location Tag */}
                  <div className="mb-4">
                    <Link
                      href={`/map?location=${post.locationId}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border-2 border-[#2F80ED] hover:bg-blue-50 transition"
                    >
                      <MapPin size={18} className="text-[#2F80ED]" />
                      <span className="text-[#2F80ED] font-medium">{post.location}</span>
                    </Link>
                  </div>

                  {/* Images - Show if exist */}
                  {post.images && post.images.length > 0 && (
                    <>
                      <div className="bg-white rounded-2xl overflow-hidden mb-4">
                        <img
                          src={post.images[0]}
                          alt=""
                          className="w-full h-auto object-contain"
                        />
                      </div>

                      {/* Carousel Dots - Only if multiple images */}
                      {post.images.length > 1 && (
                        <div className="flex justify-center gap-2 mb-4">
                          {post.images.map((_: string, idx: number) => (
                            <div
                              key={idx}
                              className={`w-2.5 h-2.5 rounded-full ${
                                idx === 0 ? 'bg-[#2F80ED]' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Events */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            {events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event.id}
                  className="bg-[#E8F4FD] rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                      {event.description && (
                        <p className="text-gray-700 mb-3">{event.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{event.timeStart} - {event.timeEnd}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <Link
                            href={`/map?location=${event.location.id}`}
                            className="text-[#2F80ED] hover:underline"
                          >
                            {event.location.name}
                          </Link>
                        </div>
                        <div>
                          <span>Участников: {event.participants}/{event.capacity}</span>
                        </div>
                      </div>
                    </div>
                    {isOwnProfile && (
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                        title="Удалить событие"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                  {/* Event Image */}
                  <div className="mt-4">
                    {event.images && event.images.length > 0 ? (
                      <img
                        src={event.images[0]}
                        alt={event.title}
                        className="w-full h-auto rounded-xl object-cover"
                      />
                    ) : (
                      <div className="bg-[#E8F4FD] rounded-xl h-64 flex flex-col items-center justify-center">
                        <div className="text-4xl font-bold text-[#2F80ED] mb-2">SELS</div>
                        <svg width="60" height="60" viewBox="0 0 80 80" fill="none" className="opacity-30">
                          <rect
                            x="15"
                            y="20"
                            width="50"
                            height="40"
                            rx="4"
                            stroke="#B8D4F1"
                            strokeWidth="3"
                          />
                          <circle cx="28" cy="32" r="4" fill="#B8D4F1" />
                          <path d="M20 48L30 38L40 48L52 36L60 44V55H20V48Z" fill="#B8D4F1" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Нет созданных событий</p>
              </div>
            )}
          </div>
        )}

        {/* Floating Action Button - только для своего профиля */}
        {isOwnProfile && (
          <>
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="fixed bottom-8 right-8 w-14 h-14 bg-[#2F80ED] text-white rounded-full shadow-lg hover:bg-blue-600 transition flex items-center justify-center z-40"
            >
              <Plus size={28} />
            </button>
            
            {/* Menu for choosing post, event or location */}
            {showCreateMenu && (
              <div className="fixed bottom-24 right-8 bg-white rounded-xl shadow-xl border border-gray-200 z-50 min-w-[200px]">
                <button
                  onClick={() => {
                    setShowCreateMenu(false)
                    setShowNewPost(true)
                  }}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 rounded-t-xl transition flex items-center gap-3"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                  </svg>
                  Создать пост
                </button>
                <button
                  onClick={() => {
                    setShowCreateMenu(false)
                    setShowNewEvent(true)
                  }}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition flex items-center gap-3 border-t border-gray-200"
                >
                  <Calendar size={20} />
                  Создать событие
                </button>
                <button
                  onClick={() => {
                    setShowCreateMenu(false)
                    setShowNewLocation(true)
                  }}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 rounded-b-xl transition flex items-center gap-3 border-t border-gray-200"
                >
                  <MapPin size={20} />
                  Создать локацию
                </button>
              </div>
            )}
            
            {/* Overlay to close menu */}
            {showCreateMenu && (
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowCreateMenu(false)}
              />
            )}
          </>
        )}
      </>
      )}
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowNewPost(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Новая публикация</h3>
              <button
                onClick={() => setShowNewPost(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <textarea
              placeholder="Что у вас нового?"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 h-32 resize-none focus:outline-none focus:border-[#2F80ED]"
            />

            {/* Location Picker - REQUIRED */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Локация <span className="text-red-500">*</span>
              </label>
              {newPostLocation ? (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border-2 border-[#2F80ED]">
                  <div className="flex items-center gap-2">
                    <MapPin size={20} className="text-[#2F80ED]" />
                    <span className="text-[#2F80ED] font-medium">{newPostLocation.name}</span>
                  </div>
                  <button
                    onClick={() => setNewPostLocation(null)}
                    className="p-1 hover:bg-blue-100 rounded-lg transition"
                  >
                    <X size={18} className="text-[#2F80ED]" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLocationPicker(true)}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#2F80ED] transition text-center"
                >
                  <MapPin size={32} className="mx-auto text-gray-400 mb-2" />
                  <span className="text-gray-600">Выбрать локацию</span>
                </button>
              )}
            </div>

            <label className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-[#2F80ED] transition mb-4">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <span className="text-gray-600">Добавить фото</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {newPostImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {newPostImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt=""
                    className="rounded-lg w-full h-32 object-cover"
                  />
                ))}
              </div>
            )}

            <button
              onClick={handleCreatePost}
              disabled={!newPostText || !newPostLocation}
              className="w-full py-3 bg-[#2F80ED] text-white rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Опубликовать
            </button>
          </div>
        </div>
      )}

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
          onClick={() => setShowLocationPicker(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Выбрать локацию</h3>
                <button
                  onClick={() => setShowLocationPicker(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mode Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setLocationPickerMode('list')}
                  className={`flex-1 py-2 px-4 rounded-xl font-medium transition ${
                    locationPickerMode === 'list'
                      ? 'bg-[#2F80ED] text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <List size={20} className="inline mr-2" />
                  Список
                </button>
                <button
                  onClick={() => setLocationPickerMode('map')}
                  className={`flex-1 py-2 px-4 rounded-xl font-medium transition ${
                    locationPickerMode === 'map'
                      ? 'bg-[#2F80ED] text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <MapIcon size={20} className="inline mr-2" />
                  Карта
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {locationPickerMode === 'list' ? (
                <div className="space-y-6">
                  {/* Уличные площадки */}
                  {availableLocations.filter(loc => loc.type === 'outdoor' || !loc.type).length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Уличные площадки</h4>
                      <div className="space-y-3">
                        {availableLocations
                          .filter(loc => loc.type === 'outdoor' || !loc.type)
                          .map((location) => (
                            <button
                              key={location.id}
                              onClick={() => {
                                if (showNewPost) {
                                  setNewPostLocation({ name: location.name, id: location.id })
                                }
                                if (showNewEvent) {
                                  setNewEventLocation({ name: location.name, id: location.id })
                                }
                                setShowLocationPicker(false)
                              }}
                              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#2F80ED] hover:bg-blue-50 transition text-left"
                            >
                              <div className="flex items-center gap-3">
                                <MapPin size={24} className="text-[#2F80ED]" />
                                <span className="font-medium text-gray-900">{location.name}</span>
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Веломаршруты */}
                  {availableLocations.filter(loc => loc.type === 'bike').length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Веломаршруты</h4>
                      <div className="space-y-3">
                        {availableLocations
                          .filter(loc => loc.type === 'bike')
                          .map((location) => (
                            <button
                              key={location.id}
                              onClick={() => {
                                if (showNewPost) {
                                  setNewPostLocation({ name: location.name, id: location.id })
                                }
                                if (showNewEvent) {
                                  setNewEventLocation({ name: location.name, id: location.id })
                                }
                                setShowLocationPicker(false)
                              }}
                              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#2F80ED] hover:bg-blue-50 transition text-left"
                            >
                              <div className="flex items-center gap-3">
                                <MapPin size={24} className="text-[#2563EB]" />
                                <span className="font-medium text-gray-900">{location.name}</span>
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Сапы / байдарки */}
                  {availableLocations.filter(loc => loc.type === 'water').length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Сапы / байдарки</h4>
                      <div className="space-y-3">
                        {availableLocations
                          .filter(loc => loc.type === 'water')
                          .map((location) => (
                            <button
                              key={location.id}
                              onClick={() => {
                                if (showNewPost) {
                                  setNewPostLocation({ name: location.name, id: location.id })
                                }
                                if (showNewEvent) {
                                  setNewEventLocation({ name: location.name, id: location.id })
                                }
                                setShowLocationPicker(false)
                              }}
                              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#2F80ED] hover:bg-blue-50 transition text-left"
                            >
                              <div className="flex items-center gap-3">
                                <MapPin size={24} className="text-[#0891B2]" />
                                <span className="font-medium text-gray-900">{location.name}</span>
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <MapIcon size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Выберите точку на карте</p>
                    <p className="text-sm text-gray-500 mt-2">
                      (Интерактивная карта будет добавлена)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Event Modal */}
      {showNewEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowNewEvent(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Создать событие</h3>
              <button
                onClick={() => setShowNewEvent(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Service Header */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-900 font-medium">
                Создайте тренировку или матч! Кратко опишите условия и позовите друзей.
              </p>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заголовок события <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Например: Футбольная тренировка"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F80ED]"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание события
              </label>
              <textarea
                placeholder="Опишите детали события (необязательно)"
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl h-32 resize-none focus:outline-none focus:border-[#2F80ED]"
              />
            </div>

            {/* Images */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Фотографии
              </label>
              <label className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-[#2F80ED] transition">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <span className="text-gray-600">Добавить фото</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleEventImageUpload}
                  className="hidden"
                />
              </label>
              {newEventImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {newEventImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt=""
                      className="rounded-lg w-full h-32 object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Location */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Локация <span className="text-red-500">*</span>
              </label>
              {newEventLocation ? (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border-2 border-[#2F80ED]">
                  <div className="flex items-center gap-2">
                    <MapPin size={20} className="text-[#2F80ED]" />
                    <span className="text-[#2F80ED] font-medium">{newEventLocation.name}</span>
                  </div>
                  <button
                    onClick={() => setNewEventLocation(null)}
                    className="p-1 hover:bg-blue-100 rounded-lg transition"
                  >
                    <X size={18} className="text-[#2F80ED]" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowLocationPicker(true)}
                    className="flex-1 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#2F80ED] transition text-center"
                  >
                    <MapPin size={32} className="mx-auto text-gray-400 mb-2" />
                    <span className="text-gray-600">Выбрать локацию</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Сохраняем состояние модального окна создания события
                      // и открываем модальное окно создания локации
                      setShowNewLocation(true)
                    }}
                    className="flex-1 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#2F80ED] transition text-center bg-gray-50 hover:bg-gray-100"
                  >
                    <Plus size={32} className="mx-auto text-gray-400 mb-2" />
                    <span className="text-gray-600 font-medium">Добавить локацию</span>
                  </button>
                </div>
              )}
            </div>

            {/* Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F80ED]"
              />
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Время начала <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={newEventTimeStart}
                  onChange={(e) => setNewEventTimeStart(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F80ED]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Время окончания <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={newEventTimeEnd}
                  onChange={(e) => setNewEventTimeEnd(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F80ED]"
                />
              </div>
            </div>

            {/* Capacity and Level */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Количество человек <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Например: 12"
                  value={newEventCapacity}
                  onChange={(e) => setNewEventCapacity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F80ED]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Укажите уровень <span className="text-red-500">*</span>
                </label>
                <select
                  value={newEventLevel}
                  onChange={(e) => setNewEventLevel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F80ED] bg-white"
                >
                  <option value="новичок">Новичок</option>
                  <option value="любитель">Любитель</option>
                  <option value="профи">Профи</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleCreateEvent}
              disabled={
                !newEventTitle?.trim() || 
                !newEventLocation || 
                !newEventDate || 
                !newEventTimeStart || 
                !newEventTimeEnd || 
                !newEventCapacity || 
                newEventCapacity === '' || 
                parseInt(newEventCapacity) < 1 ||
                !newEventLevel
              }
              className="w-full py-3 bg-[#2F80ED] text-white rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Создать событие
            </button>
          </div>
        </div>
      )}

      {/* New Location Modal */}
      {showNewLocation && (
        <CreateLocationModal
          onClose={() => {
            setShowNewLocation(false)
            setNewLocationName('')
            setNewLocationDescription('')
            setNewLocationType('outdoor')
            setNewLocationIsPublic(false)
            setNewLocationCoords(null)
            setNewLocationAddress('')
            setNewLocationCost('Бесплатно')
            // Если модальное окно создания события было открыто, возвращаемся к нему
            // (showNewEvent уже true, просто закрываем модальное окно локации)
          }}
          onSuccess={(createdLocation) => {
            setShowNewLocation(false)
            setNewLocationName('')
            setNewLocationDescription('')
            setNewLocationType('outdoor')
            setNewLocationIsPublic(false)
            setNewLocationCoords(null)
            setNewLocationAddress('')
            setNewLocationCost('Бесплатно')
            
            // Если создана локация и открыто модальное окно создания события, выбираем созданную локацию
            if (createdLocation && showNewEvent) {
              setNewEventLocation({ id: createdLocation.id, name: createdLocation.name })
            }
            
            // Обновляем список локаций
            const fetchLocations = async () => {
              try {
                const response = await fetch('/api/locations')
                if (response.ok) {
                  const locationsData = await response.json()
                  const formattedLocations: LocationOption[] = locationsData.map((loc: any) => ({
                    id: loc.id,
                    name: loc.name,
                    lat: loc.lat,
                    lng: loc.lng,
                    type: (loc.type === 'outdoor' ? 'outdoor' : 
                           loc.type === 'bike' ? 'bike' : 
                           loc.type === 'water' ? 'water' : 
                           'outdoor') as LocationOption['type'],
                  }))
                  setAvailableLocations(formattedLocations)
                }
              } catch (error) {
                console.error('Ошибка загрузки локаций:', error)
              }
            }
            fetchLocations()
          }}
        />
      )}
    </div>
  )
}

// Create Location Modal Component
function CreateLocationModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: (location?: { id: string; name: string }) => void
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<'outdoor' | 'bike' | 'water' | 'gym'>('outdoor')
  const [isPublic, setIsPublic] = useState(false)
  const [address, setAddress] = useState('')
  const [cost, setCost] = useState('Бесплатно')
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [viewState, setViewState] = useState({
    latitude: 55.7558,
    longitude: 37.6173,
    zoom: 11,
  })
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setCurrentUser(data.user)
        }
      } catch (error) {
        console.error('Ошибка загрузки пользователя:', error)
      }
    }
    fetchCurrentUser()
  }, [])

  const handleMapClick = (event: any) => {
    const { lngLat } = event
    setSelectedCoords({ lat: lngLat.lat, lng: lngLat.lng })
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Введите название локации')
      return
    }

    if (!selectedCoords) {
      alert('Выберите точку на карте')
      return
    }

    if (!currentUser) {
      alert('Необходима авторизация')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          lat: selectedCoords.lat,
          lng: selectedCoords.lng,
          address: address.trim() || null,
          cost: cost || 'Бесплатно',
          type,
          isPublic,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Неизвестная ошибка' }))
        alert(`Ошибка создания локации: ${errorData.error || 'Неизвестная ошибка'}`)
        return
      }

      const savedLocation = await response.json()
      console.log('Локация создана:', savedLocation)
      alert('Локация успешно создана!')
      onSuccess({ id: savedLocation.id, name: savedLocation.name })
    } catch (error) {
      console.error('Ошибка создания локации:', error)
      alert(`Не удалось создать локацию: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Создать локацию</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Form */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название локации <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Например: Футбольное поле в парке"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F80ED]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  placeholder="Опишите локацию (необязательно)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl h-32 resize-none focus:outline-none focus:border-[#2F80ED]"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Раздел <span className="text-red-500">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'outdoor' | 'bike' | 'water' | 'gym')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F80ED]"
                >
                  <option value="outdoor">Уличные площадки</option>
                  <option value="bike">Веломаршруты</option>
                  <option value="water">Сапы / байдарки</option>
                  <option value="gym">Спортивные залы</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Адрес
                </label>
                <input
                  type="text"
                  placeholder="Например: Парк Горького, Москва"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F80ED]"
                />
              </div>

              {/* Cost */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Стоимость
                </label>
                <input
                  type="text"
                  placeholder="Например: Бесплатно или 500₽/час"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F80ED]"
                />
              </div>

              {/* Public Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Сделать доступной для всех
                  </label>
                  <p className="text-xs text-gray-500">
                    Локация появится на общей карте для всех пользователей
                  </p>
                </div>
                <button
                  onClick={() => setIsPublic(!isPublic)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isPublic ? 'bg-[#2F80ED]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isPublic ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Right: Map */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Выберите точку на карте <span className="text-red-500">*</span>
                </label>
                <div className="h-[400px] rounded-xl overflow-hidden border border-gray-300">
                  <Map
                    {...viewState}
                    onMove={(evt) => setViewState(evt.viewState)}
                    onClick={handleMapClick}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle={{
                      version: 8,
                      sources: {
                        osm: {
                          type: 'raster',
                          tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
                          tileSize: 256,
                          attribution: '&copy; OpenStreetMap Contributors',
                          maxzoom: 19,
                        },
                      },
                      layers: [
                        {
                          id: 'osm',
                          type: 'raster',
                          source: 'osm',
                        },
                      ],
                    }}
                  >
                    {selectedCoords && (
                      <Marker
                        latitude={selectedCoords.lat}
                        longitude={selectedCoords.lng}
                        anchor="bottom"
                      >
                        <div className="relative">
                          <svg
                            width="32"
                            height="42"
                            viewBox="0 0 32 42"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16 0C7.163 0 0 7.163 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.163 24.837 0 16 0Z"
                              fill="#DC2626"
                            />
                            <circle cx="16" cy="16" r="6" fill="white" />
                          </svg>
                        </div>
                      </Marker>
                    )}
                  </Map>
                </div>
                {selectedCoords && (
                  <p className="text-sm text-gray-600 mt-2">
                    Координаты: {selectedCoords.lat.toFixed(6)}, {selectedCoords.lng.toFixed(6)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !selectedCoords || loading}
            className="px-6 py-2 bg-[#2F80ED] text-white rounded-xl font-medium hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Создание...' : 'Создать локацию'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Загрузка профиля...</div>}>
      <ProfilePageContent />
    </Suspense>
  )
}
