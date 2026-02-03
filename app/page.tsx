import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Левая секция - Синий фон */}
      <div className="w-full lg:w-[40%] bg-[#2F80ED] relative flex flex-col justify-between p-8 lg:p-12 text-white min-h-screen">
        {/* Логотип */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 flex flex-wrap">
            <div className="w-3 h-3 bg-white rounded-sm"></div>
            <div className="w-3 h-3 bg-white rounded-sm"></div>
            <div className="w-3 h-3 bg-white rounded-sm"></div>
            <div className="w-3 h-3 bg-white rounded-sm"></div>
          </div>
          <h1 className="text-2xl font-bold">SELS</h1>
        </div>

        {/* Заголовок */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-6xl font-bold leading-tight mb-8">
            Когда<br />
            хочется<br />
            спорта,<br />
            но сложно<br />
            начать
          </h2>
          
          <p className="text-xl leading-relaxed mb-8 text-white/90">
            Мы убрали всё лишнее между тобой и движением:
            поиск, сомнения, выбор. Подскажем, куда пойти,
            с чего начать и с кем играть.
          </p>

          {/* Кнопка */}
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-[#2F80ED] transition text-lg w-fit"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Попробовать бесплатно
          </Link>
        </div>
      </div>

      {/* Правая секция - Светло-голубой фон с иллюстрацией */}
      <div className="hidden lg:flex flex-1 bg-[#E8F4FD] relative overflow-hidden">
        {/* Навигация сверху */}
        <div className="absolute top-0 right-0 left-0 z-20 p-6 flex items-center justify-end gap-6">
          <button className="flex items-center gap-2 text-gray-700 hover:text-[#2F80ED] transition">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">О</span>
            </div>
            <span className="text-sm font-medium">О проекте</span>
          </button>
          
          <button className="flex items-center gap-2 text-gray-700 hover:text-[#2F80ED] transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span className="text-sm font-medium">Карта локаций</span>
          </button>
          
          <button className="flex items-center gap-2 text-gray-700 hover:text-[#2F80ED] transition">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">?</span>
            </div>
            <span className="text-sm font-medium">FAQ</span>
          </button>
          
          <Link
            href="/login"
            className="px-6 py-2 bg-gradient-to-r from-[#2F80ED] to-[#1E5FA8] text-white rounded-lg font-semibold hover:opacity-90 transition flex items-center gap-2 text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Войти
          </Link>
        </div>

        {/* Иллюстрация баскетбольной площадки */}
        <div className="absolute inset-0 flex items-center justify-center p-8 lg:p-12">
          <div className="relative w-full h-full max-w-5xl">
            {/* Баскетбольная площадка */}
            <svg
              viewBox="0 0 1000 750"
              className="w-full h-full"
              style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))' }}
            >
              {/* Фон площадки с текстурой */}
              <defs>
                <pattern id="courtTexture" patternUnits="userSpaceOnUse" width="4" height="4">
                  <rect width="4" height="4" fill="#B3E5FC" />
                  <circle cx="2" cy="2" r="0.5" fill="#90CAF9" opacity="0.3" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="1000" height="750" fill="url(#courtTexture)" />
              
              {/* Линии площадки */}
              <rect x="0" y="0" width="1000" height="750" fill="none" stroke="#FFFFFF" strokeWidth="10" />
              
              {/* Центральный круг */}
              <circle cx="500" cy="375" r="100" fill="none" stroke="#FFFFFF" strokeWidth="8" />
              <line x1="500" y1="0" x2="500" y2="750" stroke="#FFFFFF" strokeWidth="8" />
              
              {/* Трехочковая линия справа */}
              <path
                d="M 1000 0 Q 750 200 750 375 Q 750 550 1000 750"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="8"
              />
              
              {/* Штрафная зона справа */}
              <rect x="750" y="250" width="250" height="250" fill="none" stroke="#FFFFFF" strokeWidth="8" />
              <path
                d="M 750 300 Q 800 375 750 450"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="8"
              />
              
              {/* Кольцо и щит */}
              <rect x="920" y="350" width="60" height="50" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="3" rx="2" />
              <circle cx="950" cy="375" r="25" fill="none" stroke="#FF6B35" strokeWidth="5" />
              <circle cx="950" cy="375" r="22" fill="none" stroke="#FFFFFF" strokeWidth="3" />
              
              {/* Мяч в кольце */}
              <circle cx="950" cy="375" r="15" fill="#FF6B35" />
              <path
                d="M 950 360 Q 950 375 950 390"
                stroke="#FFFFFF"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M 940 375 Q 950 380 960 375"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                fill="none"
              />
              
              {/* Игроки с тенями - улучшенная версия */}
              {/* Игрок 1 - верх слева (желтая майка) */}
              <g transform="translate(200, 120)">
                <ellipse cx="0" cy="0" rx="25" ry="35" fill="#FFD700" />
                <ellipse cx="0" cy="30" rx="35" ry="18" fill="#1A1A1A" />
                <ellipse cx="-28" cy="0" rx="18" ry="30" fill="#4A90E2" />
                <ellipse cx="28" cy="0" rx="18" ry="30" fill="#4A90E2" />
                {/* Тень - длинная и темная */}
                <ellipse cx="-40" cy="60" rx="50" ry="20" fill="#1565C0" opacity="0.5" />
              </g>
              
              {/* Игрок 2 - центр слева (белая майка) */}
              <g transform="translate(250, 320)">
                <ellipse cx="0" cy="0" rx="25" ry="35" fill="#FFFFFF" />
                <ellipse cx="0" cy="30" rx="35" ry="18" fill="#1A1A1A" />
                <ellipse cx="-28" cy="0" rx="18" ry="30" fill="#4A90E2" />
                <ellipse cx="28" cy="0" rx="18" ry="30" fill="#4A90E2" />
                {/* Тень */}
                <ellipse cx="-40" cy="60" rx="50" ry="20" fill="#1565C0" opacity="0.5" />
              </g>
              
              {/* Игрок 3 - центр площадки (маленький, красная майка) */}
              <g transform="translate(500, 240)">
                <ellipse cx="0" cy="0" rx="18" ry="26" fill="#FF6B6B" />
                <ellipse cx="0" cy="22" rx="26" ry="14" fill="#FFD700" />
                <ellipse cx="-22" cy="0" rx="14" ry="24" fill="#4A90E2" />
                <ellipse cx="22" cy="0" rx="14" ry="24" fill="#4A90E2" />
                {/* Тень */}
                <ellipse cx="-30" cy="45" rx="35" ry="15" fill="#1565C0" opacity="0.5" />
              </g>
              
              {/* Игрок 4 - центр справа, у штрафной (белая майка) */}
              <g transform="translate(700, 360)">
                <ellipse cx="0" cy="0" rx="25" ry="35" fill="#FFFFFF" />
                <ellipse cx="0" cy="30" rx="35" ry="18" fill="#1A1A1A" />
                <ellipse cx="-28" cy="0" rx="18" ry="30" fill="#4A90E2" />
                <ellipse cx="28" cy="0" rx="18" ry="30" fill="#4A90E2" />
                {/* Тень */}
                <ellipse cx="-40" cy="60" rx="50" ry="20" fill="#1565C0" opacity="0.5" />
              </g>
              
              {/* Игрок 5 - справа, у кольца (белая майка) */}
              <g transform="translate(850, 380)">
                <ellipse cx="0" cy="0" rx="25" ry="35" fill="#FFFFFF" />
                <ellipse cx="0" cy="30" rx="35" ry="18" fill="#1A1A1A" />
                <ellipse cx="-28" cy="0" rx="18" ry="30" fill="#4A90E2" />
                <ellipse cx="28" cy="0" rx="18" ry="30" fill="#4A90E2" />
                {/* Тень */}
                <ellipse cx="-40" cy="60" rx="50" ry="20" fill="#1565C0" opacity="0.5" />
              </g>
              
              {/* Игрок 6 - низ справа, у трехочковой (желтая майка) */}
              <g transform="translate(820, 560)">
                <ellipse cx="0" cy="0" rx="25" ry="35" fill="#FFD700" />
                <ellipse cx="0" cy="30" rx="35" ry="18" fill="#1A1A1A" />
                <ellipse cx="-28" cy="0" rx="18" ry="30" fill="#4A90E2" />
                <ellipse cx="28" cy="0" rx="18" ry="30" fill="#4A90E2" />
                {/* Тень */}
                <ellipse cx="-40" cy="60" rx="50" ry="20" fill="#1565C0" opacity="0.5" />
              </g>
            </svg>
          </div>
        </div>

        {/* Органическая изогнутая линия разделителя */}
        <div className="absolute left-0 top-0 bottom-0 w-32 pointer-events-none">
          <svg
            viewBox="0 0 200 1000"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 0 Q 50 200 30 400 T 20 600 T 40 800 T 0 1000"
              fill="#2F80ED"
              opacity="0.1"
            />
            <path
              d="M 0 0 Q 80 150 60 350 T 50 550 T 70 750 T 0 1000"
              fill="#2F80ED"
              opacity="0.15"
            />
            <path
              d="M 0 0 Q 100 100 90 300 T 80 500 T 100 700 T 0 1000"
              fill="#2F80ED"
              opacity="0.2"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
