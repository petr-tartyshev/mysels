'use client'

import { useState, useEffect, Suspense } from 'react'
import { X, Heart, ChevronRight, ArrowLeft, ChevronLeft, Plus, Menu, Search } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import 'maplibre-gl/dist/maplibre-gl.css'

const Map = dynamic(() => import('react-map-gl/maplibre'), {
  ssr: false,
})

const Marker = dynamic(() => import('react-map-gl/maplibre').then((mod) => mod.Marker), {
  ssr: false,
})

const Source = dynamic(() => import('react-map-gl/maplibre').then((mod) => mod.Source), {
  ssr: false,
})

const Layer = dynamic(() => import('react-map-gl/maplibre').then((mod) => mod.Layer), {
  ssr: false,
})

// Types
interface Location {
  id: string
  name: string
  latitude: number
  longitude: number
  type: 'featured' | 'regular' | 'outdoor' | 'gym' | 'bike' | 'water'
  description: string
  price: string
  rating: number
}

interface BikeRoute {
  id: string
  number: number
  name: string
  description: string[]
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  path: Array<{ lat: number; lng: number }>
  color: string
}

interface WaterRoute {
  id: string
  number: number
  name: string
  description: string[]
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  path: Array<{ lat: number; lng: number }>
  color: string
}

interface Booking {
  id: string
  userName: string
  userHandle: string
  time: string
  description: string
  date: Date
  avatarColor: string
}

// Locations in Moscow with real addresses
const locations: Location[] = [
  {
    id: '1',
    name: 'Футбольное поле в парке Яуза',
    latitude: 55.8228,
    longitude: 37.6602,
    type: 'outdoor',
    description: 'Общественная городская площадка в парке Яуза рядом с Храмом воздуха. Искусственное покрытие, освещение, раздевалки.',
    price: 'Бесплатно',
    rating: 4,
  },
  {
    id: '2',
    name: 'Спортплощадка Сокольники',
    latitude: 55.7967,
    longitude: 37.6700,
    type: 'outdoor',
    description: 'Современная спортивная площадка в парке Сокольники. Футбол, баскетбол, волейбол.',
    price: 'Бесплатно',
    rating: 5,
  },
  {
    id: '3',
    name: 'Стадион Лужники',
    latitude: 55.7150,
    longitude: 37.5550,
    type: 'outdoor',
    description: 'Главный стадион Москвы. Профессиональное футбольное поле, беговые дорожки.',
    price: '500₽/час',
    rating: 5,
  },
  {
    id: '4',
    name: 'Парк Горького',
    latitude: 55.7308,
    longitude: 37.6014,
    type: 'outdoor',
    description: 'Парк с множеством спортивных зон для активного отдыха. Беговые дорожки, площадки для воркаута, зоны для йоги и растяжки. Идеальное место для утренних пробежек и вечерних тренировок.',
    price: 'Бесплатно',
    rating: 5,
  },
  {
    id: '5',
    name: 'Воробьевы горы',
    latitude: 55.7105,
    longitude: 37.5420,
    type: 'outdoor',
    description: 'Открытые площадки на Воробьевых горах с видом на Москву-реку. Воркаут, йога, бег.',
    price: 'Бесплатно',
    rating: 5,
  },
]

// Веломаршруты
const bikeRoutes: BikeRoute[] = [
  {
    id: 'bike-1',
    number: 1,
    name: 'Город 1',
    description: [
      '16 км по исторической части города',
      'Маршрут проходит через центр Москвы с посещением основных достопримечательностей'
    ],
    startLat: 55.7558,
    startLng: 37.6173,
    endLat: 55.7558,
    endLng: 37.6173,
    path: [
      { lat: 55.7558, lng: 37.6173 },
      { lat: 55.7650, lng: 37.6250 },
      { lat: 55.7750, lng: 37.6350 },
      { lat: 55.7850, lng: 37.6400 },
      { lat: 55.7900, lng: 37.6300 },
      { lat: 55.7800, lng: 37.6200 },
      { lat: 55.7700, lng: 37.6100 },
      { lat: 55.7600, lng: 37.6150 },
      { lat: 55.7558, lng: 37.6173 },
    ],
    color: '#DC2626',
  },
  {
    id: 'bike-2',
    number: 2,
    name: 'Парковый',
    description: [
      '12 км по паркам и набережным',
      'Живописный маршрут вдоль Москвы-реки через парки Сокольники и Измайлово'
    ],
    startLat: 55.7308,
    startLng: 37.6014,
    endLat: 55.7308,
    endLng: 37.6014,
    path: [
      { lat: 55.7308, lng: 37.6014 },
      { lat: 55.7400, lng: 37.6100 },
      { lat: 55.7500, lng: 37.6200 },
      { lat: 55.7600, lng: 37.6150 },
      { lat: 55.7550, lng: 37.6050 },
      { lat: 55.7450, lng: 37.5950 },
      { lat: 55.7350, lng: 37.6000 },
      { lat: 55.7308, lng: 37.6014 },
    ],
    color: '#2563EB',
  },
  {
    id: 'bike-3',
    number: 3,
    name: 'Воробьевы горы',
    description: [
      '8 км по Воробьевым горам',
      'Короткий, но живописный маршрут с панорамными видами на город'
    ],
    startLat: 55.7105,
    startLng: 37.5420,
    endLat: 55.7105,
    endLng: 37.5420,
    path: [
      { lat: 55.7105, lng: 37.5420 },
      { lat: 55.7150, lng: 37.5500 },
      { lat: 55.7200, lng: 37.5550 },
      { lat: 55.7180, lng: 37.5450 },
      { lat: 55.7120, lng: 37.5400 },
      { lat: 55.7105, lng: 37.5420 },
    ],
    color: '#059669',
  },
]

// Речные маршруты для сапов/байдарок (по реальным руслам рек Москвы, до 5 км)
const waterRoutes: WaterRoute[] = [
  {
    id: 'water-1',
    number: 1,
    name: 'Москва-река: Парк Горького - Воробьевы горы',
    description: [
      '4 км по Москве-реке',
      'Короткий маршрут от Парка Горького до Воробьевых гор с видом на город'
    ],
    // Начало: Москва-река у Парка Горького (Крымский мост)
    startLat: 55.7308,
    startLng: 37.6014,
    // Конец: Москва-река у Воробьевых гор
    endLat: 55.7105,
    endLng: 37.5420,
    path: [
      // Москва-река - реальное русло от Парка Горького до Воробьевых гор
      { lat: 55.7308, lng: 37.6014 }, // Парк Горького (Крымский мост)
      { lat: 55.7280, lng: 37.5950 }, // Нескучный сад (изгиб реки)
      { lat: 55.7230, lng: 37.5850 }, // Лужники (изгиб реки)
      { lat: 55.7170, lng: 37.5700 }, // Воробьевы горы (изгиб реки)
      { lat: 55.7105, lng: 37.5420 }, // Конец маршрута
    ],
    color: '#0891B2',
  },
  {
    id: 'water-2',
    number: 2,
    name: 'Яуза: Парк Яуза - Впадение',
    description: [
      '3 км по реке Яуза',
      'Маршрут от парка Яуза до впадения в Москву-реку у Сыромятнической набережной'
    ],
    // Начало: Яуза в парке Яуза (Храм воздуха)
    startLat: 55.8228,
    startLng: 37.6602,
    // Конец: Яуза впадает в Москву-реку (Сыромятническая набережная)
    endLat: 55.7550,
    endLng: 37.6550,
    path: [
      // Река Яуза - реальное русло от парка до впадения
      { lat: 55.8228, lng: 37.6602 }, // Парк Яуза (Храм воздуха)
      { lat: 55.8150, lng: 37.6580 }, // Преображенская площадь (изгиб реки)
      { lat: 55.8000, lng: 37.6565 }, // Электрозаводская (изгиб реки)
      { lat: 55.7800, lng: 37.6555 }, // Семеновская (изгиб реки)
      { lat: 55.7550, lng: 37.6550 }, // Впадение в Москву-реку
    ],
    color: '#0284C7',
  },
  {
    id: 'water-3',
    number: 3,
    name: 'Москва-река: Серебряный бор - Крылатское',
    description: [
      '5 км по Москве-реке',
      'Живописный маршрут через Серебряный бор и Крылатское с природными пляжами'
    ],
    // Начало: Москва-река в Серебряном бору
    startLat: 55.7800,
    startLng: 37.4200,
    // Конец: Москва-река в Крылатском
    endLat: 55.7600,
    endLng: 37.4300,
    path: [
      // Москва-река - реальное русло в северо-западной части
      { lat: 55.7800, lng: 37.4200 }, // Серебряный бор (изгиб реки)
      { lat: 55.7750, lng: 37.4220 }, // Изгиб реки
      { lat: 55.7700, lng: 37.4250 }, // Крылатское (изгиб реки)
      { lat: 55.7650, lng: 37.4280 }, // Изгиб реки
      { lat: 55.7600, lng: 37.4300 }, // Конец маршрута
    ],
    color: '#0EA5E9',
  },
  {
    id: 'water-4',
    number: 4,
    name: 'Сетунь: Кунцево - Впадение',
    description: [
      '4 км по реке Сетунь',
      'Спокойный маршрут по одной из самых чистых рек Москвы от Кунцево до впадения'
    ],
    // Начало: Сетунь в районе Кунцево
    startLat: 55.7300,
    startLng: 37.4000,
    // Конец: Сетунь впадает в Москву-реку
    endLat: 55.7300,
    endLng: 37.5800,
    path: [
      // Река Сетунь - реальное русло
      { lat: 55.7300, lng: 37.4000 }, // Кунцево (начало маршрута)
      { lat: 55.7300, lng: 37.4500 }, // Изгиб реки
      { lat: 55.7300, lng: 37.5000 }, // Фили (изгиб реки)
      { lat: 55.7300, lng: 37.5400 }, // Изгиб реки
      { lat: 55.7300, lng: 37.5800 }, // Впадение в Москву-реку
    ],
    color: '#06B6D4',
  },
]

// Sample bookings
const sampleBookings: Booking[] = [
  {
    id: '1',
    userName: 'Petr Tartyshev',
    userHandle: '@petrtar',
    time: '18.00-19.00',
    description: 'Вечерняя игра в футбол. Ищу игроков!',
    date: new Date(2026, 0, 21),
    avatarColor: 'bg-blue-400',
  },
  {
    id: '2',
    userName: 'Сергей Иванов',
    userHandle: '@sergeyiv',
    time: '16.00-17.30',
    description:
      'Тренировка по футболу для всех желающих. Приходите, будем работать над техникой и выносливостью. Подходит для любого уровня подготовки!',
    date: new Date(2026, 0, 21),
    avatarColor: 'bg-green-500',
  },
]

function MapPageContent() {
  const searchParams = useSearchParams()
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [showBooking, setShowBooking] = useState(false)
  const [dbLocations, setDbLocations] = useState<Location[]>([])
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null)
  const [hoveredWaterRoute, setHoveredWaterRoute] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Названия фильтров для отображения
  const filterNames: Record<string, string> = {
    outdoor: 'Уличные площадки',
    gym: 'Спортивные залы',
    bike: 'Веломаршруты',
    water: 'Сапы / байдарки',
  }

  // Загрузка локаций из БД (только публичные для карты)
  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations?public=true')
      if (response.ok) {
        const locationsData = await response.json()
        // Преобразуем локации из БД в формат Location
        const formattedLocations: Location[] = locationsData.map((loc: any) => ({
          id: loc.id,
          name: loc.name,
          latitude: loc.lat,
          longitude: loc.lng,
          type: (loc.type === 'outdoor' ? 'outdoor' : 
                 loc.type === 'gym' ? 'gym' : 
                 loc.type === 'water' ? 'water' : 
                 loc.type === 'bike' ? 'bike' :
                 loc.type === 'featured' ? 'featured' : 'regular') as Location['type'],
          description: loc.description || '',
          price: loc.cost || 'Бесплатно',
          rating: loc.rating || 0,
        }))
        setDbLocations(formattedLocations)
      }
    } catch (error) {
      console.error('Ошибка загрузки локаций:', error)
      // Используем захардкоженные локации в случае ошибки
      setDbLocations(locations)
    }
  }

  useEffect(() => {
    fetchLocations()
    
    // Обновляем локации каждые 30 секунд, чтобы видеть новые публичные локации
    const interval = setInterval(fetchLocations, 30000)
    return () => clearInterval(interval)
  }, [])

  // Auto-open location from URL parameter
  useEffect(() => {
    const locationId = searchParams.get('location')
    if (locationId) {
      // Сначала ищем в БД локациях, потом в захардкоженных
      const location = dbLocations.find((loc) => loc.id === locationId) || 
                       locations.find((loc) => loc.id === locationId)
      if (location) {
        setSelectedLocation(location)
      }
    }
  }, [searchParams, dbLocations])

  const handleBook = () => {
    setShowBooking(true)
  }

  const handleCloseBooking = () => {
    setShowBooking(false)
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Sidebar Menu */}
      {sidebarOpen && (
        <div className="w-64 bg-white border-r border-gray-200 p-6 sticky top-0 h-screen flex flex-col relative transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">SELS</h2>
          <nav className="space-y-2 flex-1">
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
              className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-[#2F80ED] rounded-xl font-medium"
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
        </div>
      )}

      {/* Map Container */}
      <div className="flex-1 relative" onClick={() => setFiltersOpen(false)}>
        {/* Search Bar with Filters */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <div className="relative bg-white rounded-lg shadow-lg border border-gray-200 flex items-center">
            {/* Burger Menu Button */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="p-3 hover:bg-gray-50 rounded-l-lg transition"
            >
              <Menu size={20} className="text-gray-700" />
            </button>
            
            {/* Search Input */}
            <div className="flex items-center px-4 py-3 border-l border-gray-200">
              <Search size={18} className="text-gray-400 mr-2" />
              {activeFilter ? (
                <div className="flex items-center gap-2">
                  <span className="text-[#2F80ED] font-medium">{filterNames[activeFilter]}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveFilter(null)
                      setSearchQuery('')
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="outline-none text-gray-700 placeholder-gray-400 w-64"
                />
              )}
            </div>
          </div>
          
          {/* Sidebar Toggle Button - справа от поиска */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-[#2F80ED] text-white rounded-lg px-4 py-3 shadow-lg hover:bg-blue-600 transition flex items-center justify-center"
          >
            {sidebarOpen ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
          
          {/* Filters Dropdown */}
          {filtersOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] z-30">
              <button
                onClick={() => {
                  setActiveFilter(activeFilter === 'outdoor' ? null : 'outdoor')
                  setFiltersOpen(false)
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition ${
                  activeFilter === 'outdoor' ? 'bg-blue-50 text-[#2F80ED] font-medium' : 'text-gray-700'
                }`}
              >
                Уличные площадки
              </button>
              <button
                onClick={() => {
                  setActiveFilter(activeFilter === 'gym' ? null : 'gym')
                  setFiltersOpen(false)
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition ${
                  activeFilter === 'gym' ? 'bg-blue-50 text-[#2F80ED] font-medium' : 'text-gray-700'
                }`}
              >
                Спортивные залы
              </button>
              <button
                onClick={() => {
                  setActiveFilter(activeFilter === 'bike' ? null : 'bike')
                  setFiltersOpen(false)
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition ${
                  activeFilter === 'bike' ? 'bg-blue-50 text-[#2F80ED] font-medium' : 'text-gray-700'
                }`}
              >
                Веломаршруты
              </button>
              <button
                onClick={() => {
                  setActiveFilter(activeFilter === 'water' ? null : 'water')
                  setFiltersOpen(false)
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition ${
                  activeFilter === 'water' ? 'bg-blue-50 text-[#2F80ED] font-medium' : 'text-gray-700'
                }`}
              >
                Сапы / байдарки
              </button>
            </div>
          )}
        </div>
        
        {/* MapLibre Map */}
        <Map
          initialViewState={{
            latitude: 55.7558,
            longitude: 37.6173,
            zoom: 11,
          }}
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
          {/* Water Routes */}
          {activeFilter === 'water' && waterRoutes.map((route: WaterRoute) => (
            <div key={route.id}>
              {/* Route Path using Source and Layer */}
              <Source
                id={`water-route-${route.id}`}
                type="geojson"
                data={{
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: route.path.map((p: { lat: number; lng: number }) => [p.lng, p.lat]),
                  },
                  properties: {
                    routeId: route.id,
                  },
                }}
              >
                <Layer
                  id={`water-route-line-${route.id}`}
                  type="line"
                  paint={{
                    'line-color': route.color,
                    'line-width': 4,
                    'line-opacity': 0.7,
                  }}
                />
              </Source>
              
              {/* Start Marker */}
              <Marker
                latitude={route.startLat}
                longitude={route.startLng}
                anchor="bottom"
              >
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredWaterRoute(route.id)}
                  onMouseLeave={() => setHoveredWaterRoute(null)}
                >
                  <svg
                    width="32"
                    height="42"
                    viewBox="0 0 32 42"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="cursor-pointer hover:scale-110 transition-transform"
                  >
                    <path
                      d="M16 0C7.163 0 0 7.163 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.163 24.837 0 16 0Z"
                      fill={route.color}
                    />
                    <circle cx="16" cy="16" r="6" fill="white" />
                  </svg>
                  {/* Hover Bubble */}
                  {hoveredWaterRoute === route.id && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white rounded-lg shadow-xl p-4 border border-gray-200 z-50 pointer-events-none">
                      <h3 className="font-bold text-gray-900 mb-1">
                        Водный маршрут №{route.number} "{route.name}"
                      </h3>
                      {route.description.map((line: string, idx: number) => (
                        <p key={idx} className="text-sm text-gray-600 mb-1">
                          {line}
                        </p>
                      ))}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
                      </div>
                    </div>
                  )}
                </div>
              </Marker>
              
              {/* End Marker (smaller) */}
              <Marker
                latitude={route.endLat}
                longitude={route.endLng}
                anchor="bottom"
              >
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredWaterRoute(route.id)}
                  onMouseLeave={() => setHoveredWaterRoute(null)}
                >
                  <svg
                    width="16"
                    height="21"
                    viewBox="0 0 32 42"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="cursor-pointer hover:scale-110 transition-transform"
                  >
                    <path
                      d="M16 0C7.163 0 0 7.163 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.163 24.837 0 16 0Z"
                      fill={route.color}
                    />
                    <circle cx="16" cy="16" r="6" fill="white" />
                  </svg>
                </div>
              </Marker>
            </div>
          ))}

          {/* Bike Routes */}
          {activeFilter === 'bike' && bikeRoutes.map((route) => (
            <div key={route.id}>
              {/* Route Path using Source and Layer */}
              <Source
                id={`route-${route.id}`}
                type="geojson"
                data={{
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: route.path.map(p => [p.lng, p.lat]),
                  },
                  properties: {
                    routeId: route.id,
                  },
                }}
              >
                <Layer
                  id={`route-line-${route.id}`}
                  type="line"
                  paint={{
                    'line-color': route.color,
                    'line-width': 4,
                    'line-opacity': 0.7,
                  }}
                />
              </Source>
              
              {/* Start/End Marker */}
              <Marker
                latitude={route.startLat}
                longitude={route.startLng}
                anchor="bottom"
              >
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredRoute(route.id)}
                  onMouseLeave={() => setHoveredRoute(null)}
                >
                  <svg
                    width="32"
                    height="42"
                    viewBox="0 0 32 42"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="cursor-pointer hover:scale-110 transition-transform"
                  >
                    <path
                      d="M16 0C7.163 0 0 7.163 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.163 24.837 0 16 0Z"
                      fill={route.color}
                    />
                    <circle cx="16" cy="16" r="6" fill="white" />
                  </svg>
                  {/* Hover Bubble */}
                  {hoveredRoute === route.id && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white rounded-lg shadow-xl p-4 border border-gray-200 z-50 pointer-events-none">
                      <h3 className="font-bold text-gray-900 mb-1">
                        Веломаршрут №{route.number} "{route.name}"
                      </h3>
                      {route.description.map((line, idx) => (
                        <p key={idx} className="text-sm text-gray-600 mb-1">
                          {line}
                        </p>
                      ))}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
                      </div>
                    </div>
                  )}
                </div>
              </Marker>
            </div>
          ))}

          {/* Map Markers */}
          {(dbLocations.length > 0 ? dbLocations : locations)
            .filter((location) => {
              // Если есть поисковый запрос, фильтруем по нему
              if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase()
                const matchesSearch = location.name.toLowerCase().includes(query) ||
                                     location.description.toLowerCase().includes(query)
                if (!matchesSearch) return false
                
                // Если есть поисковый запрос без фильтра, показываем все совпадения
                if (!activeFilter) return true
              }
              
              // Фильтрация по типу (разделу)
              if (activeFilter === 'outdoor') return location.type === 'outdoor'
              if (activeFilter === 'gym') return location.type === 'gym'
              if (activeFilter === 'water') return location.type === 'water'
              if (activeFilter === 'bike') return location.type === 'bike' // Показываем веломаршруты из БД (точки локаций)
              
              // Если нет активного фильтра и нет поискового запроса, не показываем точки
              // (чтобы карта не была перегружена)
              if (!activeFilter && !searchQuery.trim()) return false
              
              return false
            })
            .map((location) => (
            <Marker
              key={location.id}
              latitude={location.latitude}
              longitude={location.longitude}
              anchor="bottom"
            >
              <button
                onClick={() => setSelectedLocation(location)}
                className="hover:scale-110 transition-transform cursor-pointer"
              >
                <svg
                  width="32"
                  height="42"
                  viewBox="0 0 32 42"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 0C7.163 0 0 7.163 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.163 24.837 0 16 0Z"
                    fill={selectedLocation?.id === location.id ? '#DC2626' : '#2F80ED'}
                  />
                  <circle cx="16" cy="16" r="6" fill="white" />
                </svg>
              </button>
            </Marker>
          ))}
        </Map>
      </div>

      {/* Location Details Modal */}
      {selectedLocation && !showBooking && (
        <LocationModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
          onBook={handleBook}
        />
      )}

      {/* Booking Modal */}
      {selectedLocation && showBooking && (
        <BookingModal location={selectedLocation} onClose={handleCloseBooking} />
      )}
    </div>
  )
}

// Location Modal Component
function LocationModal({
  location,
  onClose,
  onBook,
}: {
  location: Location
  onClose: () => void
  onBook: () => void
}) {
  return (
    <div
      className="absolute top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-30 overflow-y-auto"
      style={{ maxWidth: '500px' }}
    >
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
        <h2 className="text-xl font-bold text-gray-900">{location.name}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Image Placeholder */}
        <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl h-48 flex items-center justify-center">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="opacity-30">
            <rect x="15" y="20" width="50" height="40" rx="4" stroke="#2F80ED" strokeWidth="3" />
            <circle cx="28" cy="32" r="4" fill="#2F80ED" />
            <path d="M20 48L30 38L40 48L52 36L60 44V55H20V48Z" fill="#2F80ED" />
          </svg>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">{location.price}</span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill={i < location.rating ? '#2F80ED' : '#E5E7EB'}
              >
                <path d="M10 1L12.5 7.5H19L14 11.5L16 18L10 14L4 18L6 11.5L1 7.5H7.5L10 1Z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">О локации</h3>
          <p className="text-gray-600">{location.description}</p>
          <p className="text-gray-600 mt-2">
            Общественная городская площадка. Можно разделить на две. Нет раздевалок. Искусственное
            покрытие без дыр. В основном играют команды из районов.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onBook}
            className="w-full py-3 bg-[#2F80ED] text-white rounded-xl font-semibold hover:bg-blue-600 transition"
          >
            Забронировать
          </button>
          <Link
            href={`/profile?locationId=${location.id}&locationName=${encodeURIComponent(location.name)}&createEvent=true`}
            className="w-full py-3 bg-white border-2 border-[#2F80ED] text-[#2F80ED] rounded-xl font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Создать событие
          </Link>
          <button className="w-full py-3 border-2 border-[#DC2626] text-[#DC2626] rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition">
            <Heart size={20} />
            Отметить посещение
          </button>
        </div>

        {/* Users Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Люди, которые посещают это место
          </h3>
          <div className="space-y-3">
            {['Профи', 'Новички', 'Ищу партнера'].map((category, idx) => (
              <div
                key={category}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer"
              >
                <div className="flex -space-x-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center ${
                        idx === 0 ? 'bg-gray-700' : idx === 1 ? 'bg-green-500' : 'bg-orange-500'
                      }`}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  ))}
                </div>
                <span className="flex-1 font-medium text-gray-900">{category}</span>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Booking Modal Component  
function BookingModal({
  location,
  onClose,
}: {
  location: Location
  onClose: () => void
}) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState(today)
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [bookings, setBookings] = useState(sampleBookings)
  const [events, setEvents] = useState<any[]>([]) // События из БД
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const monthNames = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ]

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentYear, currentMonth, day))
  }

  // Загрузка событий из БД для выбранной локации
  useEffect(() => {
    const fetchEvents = async () => {
      if (!location.id) return
      
      setLoadingEvents(true)
      try {
        const response = await fetch(`/api/events?locationId=${location.id}`)
        if (response.ok) {
          const eventsData = await response.json()
          console.log('Загружены события для локации:', location.id, eventsData)
          setEvents(eventsData)
        } else {
          console.error('Ошибка загрузки событий:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('Ошибка загрузки событий:', error)
      } finally {
        setLoadingEvents(false)
      }
    }

    fetchEvents()
  }, [location.id])

  // Преобразование даты из разных форматов в Date
  const parseEventDate = (dateString: string): Date | null => {
    if (!dateString) return null
    
    // Формат "2026-01-23" (ISO из input type="date")
    if (dateString.includes('-') && dateString.split('-').length === 3) {
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        return date
      }
    }
    
    // Формат "21.01.2026" (DD.MM.YYYY)
    if (dateString.includes('.')) {
      const parts = dateString.split('.')
      if (parts.length === 3) {
        const day = parseInt(parts[0])
        const month = parseInt(parts[1]) - 1 // месяцы в JS начинаются с 0
        const year = parseInt(parts[2])
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          return new Date(year, month, day)
        }
      }
    }
    
    return null
  }

  // Фильтрация событий по выбранной дате
  const eventsForDate = events.filter((event) => {
    const eventDate = parseEventDate(event.date)
    if (!eventDate) {
      console.log('Не удалось распарсить дату события:', event.date, event.id)
      return false
    }
    
    const matches = (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    )
    
    if (matches) {
      console.log('Событие соответствует дате:', event.title, event.date, eventDate, selectedDate)
    }
    
    return matches
  })

  // Объединяем захардкоженные bookings и события из БД
  const bookingsForDate = bookings.filter((booking) => {
    return (
      booking.date.getDate() === selectedDate.getDate() &&
      booking.date.getMonth() === selectedDate.getMonth() &&
      booking.date.getFullYear() === selectedDate.getFullYear()
    )
  })

  // Преобразуем события из БД в формат Booking для отображения
  const dbEventsForDate = eventsForDate.map((event) => {
    const eventDate = parseEventDate(event.date)
    return {
      id: event.id,
      userName: `${event.user.firstName} ${event.user.lastName}`,
      userHandle: `@${event.user.username}`,
      time: `${event.timeStart}-${event.timeEnd}`,
      description: event.title,
      date: eventDate || new Date(),
      avatarColor: 'bg-blue-400',
    } as Booking
  })

  // Объединяем все события для отображения
  const allEventsForDate = [...bookingsForDate, ...dbEventsForDate]

  const handleCreateEvent = (newEvent: {
    description: string
    startTime: string
    endTime: string
  }) => {
    const newBooking: Booking = {
      id: Date.now().toString(),
      userName: 'Petr Tartyshev',
      userHandle: '@petrtar',
      time: `${newEvent.startTime}-${newEvent.endTime}`,
      description: newEvent.description,
      date: selectedDate,
      avatarColor: 'bg-purple-500',
    }
    setBookings([...bookings, newBooking])
    setShowCreateEvent(false)
  }

  return (
    <div
      className="absolute top-0 right-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-30 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h2 className="text-xl font-bold text-gray-900 flex-1 text-center">
            {location.name}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X size={24} className="text-gray-600" />
          </button>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{location.price}</span>
          <span className="text-gray-600">2 результата</span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill={i < location.rating ? '#2F80ED' : '#E5E7EB'}
              >
                <path d="M10 1L12.5 7.5H19L14 11.5L16 18L10 14L4 18L6 11.5L1 7.5H7.5L10 1Z" />
              </svg>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Calendar */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-lg font-semibold">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
              <div key={day} className="text-sm text-gray-500 font-medium">
                {day}
              </div>
            ))}

            {Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const isSelected =
                day === selectedDate.getDate() &&
                currentMonth === selectedDate.getMonth() &&
                currentYear === selectedDate.getFullYear()

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`p-2 rounded-lg transition ${
                    isSelected
                      ? 'bg-[#DC2626] text-white font-bold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>

          <div className="mt-4 text-center text-lg font-semibold text-gray-900">
            {selectedDate.getDate()} {monthNames[selectedDate.getMonth()].toLowerCase()}
          </div>
        </div>

        {/* Events Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Мероприятия</h3>
          <button
            onClick={() => setShowCreateEvent(true)}
            className="p-2 bg-[#2F80ED] text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Bookings List */}
        {loadingEvents ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F80ED] mx-auto"></div>
            <p className="text-gray-500 mt-4">Загрузка событий...</p>
          </div>
        ) : allEventsForDate.length > 0 ? (
          <div className="space-y-3">
            {allEventsForDate.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onClick={() => {
                  // Проверяем, это событие из БД или захардкоженное
                  const dbEvent = eventsForDate.find(e => e.id === booking.id)
                  if (dbEvent) {
                    // Для событий из БД используем их ID
                    setSelectedEventId(booking.id)
                  } else {
                    // Для захардкоженных используем маппинг
                    const eventIdMap: Record<string, string> = {
                      '1': '1',
                      '2': '2',
                    }
                    setSelectedEventId(eventIdMap[booking.id] || '1')
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Нет мероприятий на эту дату</p>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateEvent && (
        <CreateEventModal
          date={selectedDate}
          onClose={() => setShowCreateEvent(false)}
          onCreate={handleCreateEvent}
        />
      )}

      {/* Event Detail Modal */}
      {selectedEventId && (
        <EventDetailModal
          eventId={selectedEventId}
          onClose={() => setSelectedEventId(null)}
        />
      )}
    </div>
  )
}

function BookingCard({
  booking,
  onClick,
}: {
  booking: Booking
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition"
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`w-12 h-12 ${booking.avatarColor} rounded-full flex items-center justify-center flex-shrink-0`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900">{booking.userName}</p>
          <p className="text-sm text-gray-500">{booking.userHandle}</p>
        </div>
        <div className="flex-shrink-0 px-3 py-1 bg-[#2F80ED] text-white rounded-full text-sm font-semibold">
          {booking.time}
        </div>
      </div>
      <p className="text-gray-700 mb-3">{booking.description}</p>
      <div className="flex justify-end">
        <div className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ChevronRight size={20} className="text-[#2F80ED]" />
        </div>
      </div>
    </button>
  )
}

function CreateEventModal({
  date,
  onClose,
  onCreate,
}: {
  date: Date
  onClose: () => void
  onCreate: (event: { description: string; startTime: string; endTime: string }) => void
}) {
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('18:00')
  const [endTime, setEndTime] = useState('19:00')

  const handleSubmit = () => {
    if (description) {
      onCreate({ description, startTime, endTime })
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Создать мероприятие</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Дата</label>
            <input
              type="text"
              value={date.toLocaleDateString('ru-RU')}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Начало</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F80ED]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Конец</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F80ED]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Расскажите о мероприятии..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl h-32 resize-none focus:outline-none focus:border-[#2F80ED]"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!description}
            className="w-full py-3 bg-[#2F80ED] text-white rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  )
}

// Image Slider Component
function ImageSlider({ images }: { images: string[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const hasImages = images && images.length > 0
  const totalImages = hasImages ? images.length : 1

  // Автосмена изображений каждые 3 секунды
  useEffect(() => {
    if (!hasImages || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [hasImages, images.length])

  return (
    <div className="px-6 pt-6">
      <div className="bg-[#E8F4FD] rounded-2xl h-64 flex items-center justify-center overflow-hidden relative">
        {hasImages ? (
          <img
            src={images[currentImageIndex]}
            alt={`Event image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-[#2F80ED] mb-2">SELS</div>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="opacity-30">
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
      {totalImages > 1 && (
        <div className="flex justify-center gap-1.5 mt-4 mb-6">
          {Array.from({ length: totalImages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentImageIndex ? 'w-6 bg-[#2F80ED]' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Event Detail Modal Component (simplified version for booking modal)
function EventDetailModal({
  eventId,
  onClose,
}: {
  eventId: string
  onClose: () => void
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  // Загрузка текущего пользователя
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          // API возвращает { user: ... }, нужно извлечь user
          const user = data.user || data
          console.log('Текущий пользователь загружен в EventDetailModal:', user?.id, user?.username)
          if (user && user.id) {
            setCurrentUser(user)
          } else {
            console.error('Пользователь не имеет ID:', user)
            setCurrentUser(null)
          }
        } else {
          console.log('Пользователь не авторизован в EventDetailModal')
          setCurrentUser(null)
        }
      } catch (error) {
        console.error('Ошибка загрузки пользователя в EventDetailModal:', error)
        setCurrentUser(null)
      }
    }
    fetchCurrentUser()
  }, [])

  // Состояние для участников события
  const [eventParticipants, setEventParticipants] = useState<any[]>([])

  // Функция для загрузки участников события
  const fetchEventParticipants = async (eventIdParam: string) => {
    try {
      const requestsResponse = await fetch(`/api/event-requests?eventId=${eventIdParam}`)
      if (requestsResponse.ok) {
        const requests = await requestsResponse.json()
        const participants = requests
          .filter((req: any) => req.status === 'accepted')
          .map((req: any) => ({
            id: req.requester.id,
            firstName: req.requester.firstName,
            lastName: req.requester.lastName,
            username: req.requester.username,
            avatar: req.requester.avatar,
          }))
        setEventParticipants(participants)
        return participants
      }
    } catch (error) {
      console.error('Ошибка загрузки участников:', error)
    }
    return []
  }

  // Загрузка события из БД
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events`)
        if (response.ok) {
          const events = await response.json()
          const foundEvent = events.find((e: any) => e.id === eventId)
          console.log('Найденное событие:', foundEvent?.id, 'Уровень:', foundEvent?.level)
          if (foundEvent) {
            // Загружаем принятые запросы на участие
            await fetchEventParticipants(foundEvent.id)

            setEvent({
              id: foundEvent.id,
              userId: foundEvent.userId, // Важно: сохраняем userId организатора
              organizer: {
                name: `${foundEvent.user.firstName} ${foundEvent.user.lastName}`,
                handle: `@${foundEvent.user.username}`,
                description: foundEvent.user.bio || 'Организатор события',
                avatarColor: 'bg-blue-400',
              },
              title: foundEvent.title,
              date: foundEvent.date,
              timeSlot: `${foundEvent.timeStart}-${foundEvent.timeEnd}`,
              price: foundEvent.location.cost || 'Бесплатно',
              availableSpots: foundEvent.capacity - foundEvent.participants,
              participants: [],
              images: foundEvent.images || [], // Добавляем изображения из БД
              type: foundEvent.description ? 'description' : 'program',
              content: foundEvent.description
                ? {
                    description: foundEvent.description,
                    matchDetails: {
                      duration: `${foundEvent.timeStart}-${foundEvent.timeEnd}`,
                      teamSize: `${foundEvent.capacity} чел.`,
                      level: foundEvent.level || 'Не указан',
                    },
                  }
                : {
                    program: foundEvent.program || [],
                  },
              bannerColor: 'bg-blue-100',
              statusColor: foundEvent.capacity - foundEvent.participants > 0 ? 'bg-green-500' : 'bg-red-500',
            })
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки события:', error)
      } finally {
        setLoading(false)
      }
    }

    // Проверяем, это событие из БД (UUID) или захардкоженное
    if (eventId && eventId.length > 10) {
      // Вероятно, это ID из БД
      fetchEvent()
      // Обновляем участников каждые 5 секунд
      const interval = setInterval(() => {
        if (eventId) {
          fetchEventParticipants(eventId)
        }
      }, 5000)
      return () => clearInterval(interval)
    } else {
      // Захардкоженное событие
      setLoading(false)
    }
  }, [eventId])

  const eventsData: Record<string, any> = {
    '1': {
      id: '1',
      organizer: {
        name: 'Дима Кузнецов',
        handle: '@dmKyyyyz',
        description: 'Футбольный тренер с 10-летним стажем. Спортсмен и отец двоих детей',
        avatarColor: 'bg-blue-400',
      },
      title: 'Функциональная тренировка с мячом для детей. Любой уровень!',
      date: '19 СЕНТ',
      timeSlot: '15.00-16.00',
      price: 'Бесплатно',
      availableSpots: null,
      participants: ['blue', 'darkblue', 'black', 'red', 'green', 'purple', 'orange', 'navy'],
      images: [], // Пустой массив для захардкоженных событий
      type: 'program',
      content: {
        program: [
          {
            time: '15.00-15.15',
            description: 'Размика на все группы мышц. Беговые упражнений. Силовые упражнения.',
          },
          {
            time: '15.15-15.40',
            description: 'Тренировка с мячом. Обучение дриблингу. Ускорения с мячом.',
          },
          { time: '15.40-15.55', description: 'Товарищеский матч.' },
          { time: '15.55-16.00', description: 'Растяжка. Заминка.' },
        ],
      },
      bannerColor: 'bg-purple-100',
      statusColor: 'bg-red-500',
    },
    '2': {
      id: '2',
      organizer: {
        name: 'Серега Футбол',
        handle: '@d_serj',
        description: 'Футбольный тренер с 10-летним стажем. Спортсмен и отец двоих детей',
        avatarColor: 'bg-blue-400',
      },
      title: 'Футбол. Командный матч',
      date: '19 СЕНТ',
      timeSlot: '15.00-16.00',
      price: 'Бесплатно',
      availableSpots: 3,
      participants: ['blue', 'darkblue', 'black'],
      images: [], // Пустой массив для захардкоженных событий
      type: 'description',
      content: {
        description:
          'Привет! Мы с командой периодически играем на этом поле. Все любители. Мячи и манишки в наличии.',
        matchDetails: { duration: '20 мин.', teamSize: '4 чел.' },
      },
      bannerColor: 'bg-green-100',
      statusColor: 'bg-green-500',
    },
  }

  const avatarColors: Record<string, string> = {
    blue: 'bg-blue-400',
    darkblue: 'bg-blue-700',
    black: 'bg-gray-800',
    red: 'bg-red-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    navy: 'bg-blue-900',
  }

  const displayEvent = event || eventsData[eventId] || eventsData['1']

  if (loading) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center md:justify-end p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl w-full max-w-md md:max-w-lg md:h-[95vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F80ED]"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center md:justify-end p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md md:max-w-lg md:h-[95vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-700" />
              <span className="font-medium text-gray-700">Назад</span>
            </button>
          </div>
        </div>


        {/* Image Gallery */}
        <ImageSlider images={displayEvent.images || []} />

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          {/* Organizer */}
          <Link href={`/profile?username=${displayEvent.organizer.handle.replace('@', '')}`}>
            <div className="bg-white rounded-2xl p-4 shadow-sm hover:bg-gray-50 transition cursor-pointer">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 ${displayEvent.organizer.avatarColor} rounded-full flex items-center justify-center`}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{displayEvent.organizer.name}</p>
                  <p className="text-sm text-gray-600">{displayEvent.organizer.description}</p>
                </div>
                <ChevronRight size={24} className="text-gray-400" />
              </div>
            </div>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900">{displayEvent.title}</h1>
          <p className="text-gray-600">{displayEvent.price}</p>

          {/* Participants */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {eventParticipants.map((participant: any, index: number) => (
                <div
                  key={participant.id || index}
                  className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center overflow-hidden bg-gray-200"
                  title={`${participant.firstName} ${participant.lastName}`}
                >
                  {participant.avatar ? (
                    <img
                      src={participant.avatar}
                      alt={`${participant.firstName} ${participant.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#2F80ED] flex items-center justify-center text-white text-xs font-bold">
                      {participant.firstName?.[0]}{participant.lastName?.[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`px-4 py-2 rounded-full text-sm font-bold text-white ${
                  displayEvent.availableSpots === null || displayEvent.availableSpots === 0
                    ? 'bg-red-500'
                    : displayEvent.availableSpots <= 2
                    ? 'bg-orange-500'
                    : displayEvent.statusColor
                }`}
              >
                {displayEvent.availableSpots === null || displayEvent.availableSpots === 0
                  ? 'МЕСТ НЕТ'
                  : `${displayEvent.availableSpots} МЕСТ${displayEvent.availableSpots === 1 ? 'О' : displayEvent.availableSpots < 5 ? 'А' : ''}`}
              </div>
              {displayEvent.availableSpots > 0 && displayEvent.availableSpots <= 2 && (
                <span className="text-xs text-orange-600 font-medium">Осталось мало мест!</span>
              )}
            </div>
          </div>

          {/* Program/Description */}
          {displayEvent.type === 'program' && displayEvent.content.program && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Программа</h2>
              <div className="space-y-4">
                {displayEvent.content.program.map((item: any, index: number) => (
                  <div key={index}>
                    <p className="font-semibold text-gray-900 mb-1">{item.time}</p>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {displayEvent.type === 'description' && (
            <>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Описание</h2>
                <p className="text-gray-600">{displayEvent.content.description}</p>
              </div>
              
              {displayEvent.content.matchDetails && (
                <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Информация о тренировке</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Время</span>
                      <span className="font-semibold">{displayEvent.content.matchDetails.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Участники</span>
                      <span className="font-semibold">{displayEvent.content.matchDetails.teamSize}</span>
                    </div>
                    {displayEvent.content.matchDetails.level && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Уровень участников тренировки</span>
                        <span className="font-semibold">
                          {displayEvent.content.matchDetails.level === 'новичок' ? 'Новичок' :
                           displayEvent.content.matchDetails.level === 'любитель' ? 'Любитель' :
                           displayEvent.content.matchDetails.level === 'профи' ? 'Профи' :
                           displayEvent.content.matchDetails.level}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Registered Participants */}
          {eventParticipants.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Зарегистрированные участники</h3>
              <div className="flex flex-wrap gap-3">
                {eventParticipants.map((participant: any) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                      {participant.avatar ? (
                        <img
                          src={participant.avatar}
                          alt={`${participant.firstName} ${participant.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#2F80ED] flex items-center justify-center text-white text-xs font-bold">
                          {participant.firstName?.[0]}{participant.lastName?.[0]}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {participant.firstName} {participant.lastName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          {(() => {
            // Показываем кнопку, если пользователь залогинен и не является организатором
            const isOrganizer = currentUser && event && event.userId === currentUser.id
            const canRequest = currentUser && event && !isOrganizer

            if (!currentUser) {
              return (
                <Link
                  href="/login"
                  className="block w-full py-4 border-2 border-[#2F80ED] text-[#2F80ED] rounded-xl font-bold hover:bg-blue-50 transition text-center"
                >
                  Войти, чтобы отправить запрос
                </Link>
              )
            }

            if (isOrganizer) {
              return null // Не показываем кнопку организатору
            }

            return (
              <button
              onClick={async () => {
                console.log('Клик по кнопке отправки запроса')
                console.log('Текущий пользователь:', currentUser)
                console.log('Событие:', event)
                
                if (!currentUser) {
                  console.error('Пользователь не загружен')
                  alert('Пожалуйста, войдите в систему')
                  return
                }
                
                if (!event) {
                  console.error('Событие не загружено')
                  alert('Ошибка: событие не найдено')
                  return
                }
                
                if (!currentUser.id) {
                  console.error('У пользователя нет ID:', currentUser)
                  alert('Ошибка: не удалось определить пользователя')
                  return
                }
                
                if (!event.id) {
                  console.error('У события нет ID:', event)
                  alert('Ошибка: не удалось определить событие')
                  return
                }
                
                const requestData = {
                  eventId: event.id,
                  requesterId: currentUser.id,
                }
                
                console.log('Отправка запроса на участие:', requestData)
                setRequestStatus('loading')
                
                try {
                  const response = await fetch('/api/event-requests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
                  })
                  
                  console.log('Ответ сервера:', response.status, response.statusText)
                  
                  if (response.ok) {
                    const data = await response.json()
                    console.log('Запрос создан:', data.id)
                    setRequestStatus('success')
                    alert('Запрос на участие отправлен! Проверьте раздел "Чаты" для ответа организатора.')
                    // Обновляем событие и участников после отправки запроса
                    const eventsResponse = await fetch(`/api/events`)
                    if (eventsResponse.ok) {
                      const events = await eventsResponse.json()
                      const updatedEvent = events.find((e: any) => e.id === eventId)
                      if (updatedEvent) {
                        setEvent((prev: any) => ({
                          ...prev,
                          availableSpots: updatedEvent.capacity - updatedEvent.participants,
                        }))
                      }
                    }
                  } else {
                    const data = await response.json()
                    console.error('Ошибка создания запроса:', data)
                    setRequestStatus('error')
                    alert(data.error || 'Не удалось отправить запрос')
                  }
                } catch (error) {
                  console.error('Ошибка при отправке запроса:', error)
                  setRequestStatus('error')
                  alert('Ошибка при отправке запроса')
                }
              }}
                disabled={requestStatus === 'loading' || requestStatus === 'success'}
                className={`w-full py-4 border-2 border-[#2F80ED] text-[#2F80ED] rounded-xl font-bold transition ${
                  requestStatus === 'loading'
                    ? 'opacity-50 cursor-not-allowed'
                    : requestStatus === 'success'
                    ? 'bg-green-50 border-green-500 text-green-600'
                    : 'hover:bg-blue-50'
                }`}
              >
                {requestStatus === 'loading'
                  ? 'Отправка...'
                  : requestStatus === 'success'
                  ? 'Запрос отправлен ✓'
                  : 'Отправить запрос на участие'}
              </button>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Загрузка карты...</div>}>
      <MapPageContent />
    </Suspense>
  )
}
