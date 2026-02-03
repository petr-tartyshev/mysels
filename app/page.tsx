import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Левая секция - Синий фон */}
      <div className="w-[40%] bg-[#2F80ED] relative flex flex-col justify-between p-12 text-white">
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
      <div className="flex-1 bg-[#E8F4FD] relative overflow-hidden">
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
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="relative w-full h-full max-w-4xl">
            {/* Баскетбольная площадка */}
            <svg
              viewBox="0 0 800 600"
              className="w-full h-full"
              style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
            >
              {/* Фон площадки */}
              <rect x="0" y="0" width="800" height="600" fill="#B3E5FC" />
              
              {/* Линии площадки */}
              <rect x="0" y="0" width="800" height="600" fill="none" stroke="#FFFFFF" strokeWidth="8" />
              
              {/* Центральный круг */}
              <circle cx="400" cy="300" r="80" fill="none" stroke="#FFFFFF" strokeWidth="6" />
              <line x1="400" y1="0" x2="400" y2="600" stroke="#FFFFFF" strokeWidth="6" />
              
              {/* Трехочковая линия справа */}
              <path
                d="M 800 0 Q 600 150 600 300 Q 600 450 800 600"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="6"
              />
              
              {/* Штрафная зона справа */}
              <rect x="600" y="200" width="200" height="200" fill="none" stroke="#FFFFFF" strokeWidth="6" />
              <path
                d="M 600 250 Q 650 300 600 350"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="6"
              />
              
              {/* Кольцо и щит */}
              <rect x="750" y="280" width="50" height="40" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
              <circle cx="775" cy="300" r="20" fill="none" stroke="#FF6B35" strokeWidth="4" />
              <circle cx="775" cy="300" r="18" fill="none" stroke="#FFFFFF" strokeWidth="2" />
              
              {/* Мяч в кольце */}
              <circle cx="775" cy="300" r="12" fill="#FF6B35" />
              <path
                d="M 775 288 Q 775 300 775 312"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                fill="none"
              />
              
              {/* Игроки с тенями */}
              {/* Игрок 1 - верх слева */}
              <g transform="translate(150, 100)">
                <ellipse cx="0" cy="0" rx="20" ry="30" fill="#FFD700" />
                <ellipse cx="0" cy="25" rx="30" ry="15" fill="#1A1A1A" />
                <ellipse cx="-25" cy="0" rx="15" ry="25" fill="#4A90E2" />
                <ellipse cx="25" cy="0" rx="15" ry="25" fill="#4A90E2" />
                {/* Тень */}
                <ellipse cx="-30" cy="50" rx="40" ry="15" fill="#1976D2" opacity="0.4" />
              </g>
              
              {/* Игрок 2 - центр слева */}
              <g transform="translate(200, 250)">
                <ellipse cx="0" cy="0" rx="20" ry="30" fill="#FFFFFF" />
                <ellipse cx="0" cy="25" rx="30" ry="15" fill="#1A1A1A" />
                <ellipse cx="-25" cy="0" rx="15" ry="25" fill="#4A90E2" />
                <ellipse cx="25" cy="0" rx="15" ry="25" fill="#4A90E2" />
                {/* Тень */}
                <ellipse cx="-30" cy="50" rx="40" ry="15" fill="#1976D2" opacity="0.4" />
              </g>
              
              {/* Игрок 3 - центр площадки (маленький) */}
              <g transform="translate(400, 200)">
                <ellipse cx="0" cy="0" rx="15" ry="22" fill="#FF6B6B" />
                <ellipse cx="0" cy="18" rx="22" ry="12" fill="#FFD700" />
                <ellipse cx="-18" cy="0" rx="12" ry="20" fill="#4A90E2" />
                <ellipse cx="18" cy="0" rx="12" ry="20" fill="#4A90E2" />
                {/* Тень */}
                <ellipse cx="-25" cy="40" rx="30" ry="12" fill="#1976D2" opacity="0.4" />
              </g>
              
              {/* Игрок 4 - центр справа, у штрафной */}
              <g transform="translate(550, 280)">
                <ellipse cx="0" cy="0" rx="20" ry="30" fill="#FFFFFF" />
                <ellipse cx="0" cy="25" rx="30" ry="15" fill="#1A1A1A" />
                <ellipse cx="-25" cy="0" rx="15" ry="25" fill="#4A90E2" />
                <ellipse cx="25" cy="0" rx="15" ry="25" fill="#4A90E2" />
                {/* Тень */}
                <ellipse cx="-30" cy="50" rx="40" ry="15" fill="#1976D2" opacity="0.4" />
              </g>
              
              {/* Игрок 5 - справа, у кольца */}
              <g transform="translate(680, 300)">
                <ellipse cx="0" cy="0" rx="20" ry="30" fill="#FFFFFF" />
                <ellipse cx="0" cy="25" rx="30" ry="15" fill="#1A1A1A" />
                <ellipse cx="-25" cy="0" rx="15" ry="25" fill="#4A90E2" />
                <ellipse cx="25" cy="0" rx="15" ry="25" fill="#4A90E2" />
                {/* Тень */}
                <ellipse cx="-30" cy="50" rx="40" ry="15" fill="#1976D2" opacity="0.4" />
              </g>
              
              {/* Игрок 6 - низ справа, у трехочковой */}
              <g transform="translate(650, 450)">
                <ellipse cx="0" cy="0" rx="20" ry="30" fill="#FFD700" />
                <ellipse cx="0" cy="25" rx="30" ry="15" fill="#1A1A1A" />
                <ellipse cx="-25" cy="0" rx="15" ry="25" fill="#4A90E2" />
                <ellipse cx="25" cy="0" rx="15" ry="25" fill="#4A90E2" />
                {/* Тень */}
                <ellipse cx="-30" cy="50" rx="40" ry="15" fill="#1976D2" opacity="0.4" />
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
