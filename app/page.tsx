import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="flex items-center justify-center p-4 py-20">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            SELS
          </h1>
          <p className="text-2xl text-gray-700 mb-4">
            Спортивное сообщество
          </p>
          <p className="text-xl text-gray-600 mb-12">
            Находите команды, бронируйте площадки, участвуйте в мероприятиях
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/login"
              className="px-8 py-4 bg-[#2F80ED] text-white rounded-xl font-semibold hover:bg-blue-600 transition text-lg shadow-lg"
            >
              Войти
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-[#2F80ED] rounded-xl font-semibold hover:bg-gray-50 transition text-lg shadow-lg border-2 border-[#2F80ED]"
            >
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </div>

      {/* Блок 1: Проблема */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Иллюстрация */}
            <div className="relative">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  {/* Иконка одиночества */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-xl">😔</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Проблемные элементы */}
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl mx-auto mb-2 flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <line x1="9" y1="3" x2="9" y2="21" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-600">Фитнес-клубы</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl mx-auto mb-2 flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-600">Дейтинги</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl mx-auto mb-2 flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-600">Случайные чаты</p>
                    </div>
                  </div>
                  
                  {/* Стрелка вниз */}
                  <div className="flex justify-center mt-4">
                    <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="3">
                        <path d="M12 5v14M19 12l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Дом */}
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gray-300 rounded-xl flex items-center justify-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Текст */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Когда хочется спорта и людей,<br />но сложно начать
              </h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>
                  Хочется заниматься спортом и быть среди единомышленников,
                  но одному тяжело: не хватает мотивации, страшно идти в новое место и знакомиться с незнакомыми людьми.
                </p>
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <p className="font-semibold text-red-900 mb-2">Проблемы существующих решений:</p>
                  <ul className="space-y-2 text-red-800">
                    <li className="flex items-start">
                      <span className="mr-2">❌</span>
                      <span>Фитнес-клубы не дают ощущения комьюнити</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">❌</span>
                      <span>Дейтинги — не про спорт</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">❌</span>
                      <span>Случайные чаты и группы быстро разваливаются</span>
                    </li>
                  </ul>
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  Ты откладываешь, сомневаешься и в итоге остаёшься дома.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Блок 2: Решение */}
      <div className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Текст */}
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                SELS снижает порог входа<br />и помогает сделать первый шаг
              </h2>
              <div className="space-y-6 text-lg text-gray-700">
                <p>
                  SELS показывает спортивные активности рядом с тобой:
                  пробежки, тренировки, игры, выезды — с понятным форматом, местом и людьми.
                </p>
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                  <p className="font-semibold text-green-900 mb-2">Преимущества SELS:</p>
                  <ul className="space-y-2 text-green-800">
                    <li className="flex items-start">
                      <span className="mr-2">✅</span>
                      <span>Ты приходишь не знакомиться, а заниматься спортом</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✅</span>
                      <span>Общение возникает само — без неловкости и давления</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✅</span>
                      <span>Понятный формат, место и люди</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Иллюстрация */}
            <div className="order-1 lg:order-2 relative">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  {/* Карта с активностями */}
                  <div className="relative">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">Активности рядом</h3>
                        <div className="w-8 h-8 bg-[#2F80ED] rounded-full flex items-center justify-center">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                          </svg>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xl">🏃</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">Пробежка в парке</p>
                            <p className="text-xs text-gray-600">Сегодня, 19:00</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xl">⚽</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">Футбол на стадионе</p>
                            <p className="text-xs text-gray-600">Завтра, 18:00</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xl">🚴</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">Велопрогулка</p>
                            <p className="text-xs text-gray-600">Послезавтра, 10:00</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Стрелка вверх */}
                  <div className="flex justify-center">
                    <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <path d="M12 19V5M5 12l7-7 7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Группа людей */}
                  <div className="flex justify-center gap-2">
                    <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center shadow-lg">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div className="w-16 h-16 bg-purple-400 rounded-full flex items-center justify-center shadow-lg">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Смайлик счастья */}
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-4xl">😊</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Возможности платформы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-[#2F80ED] transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#2F80ED">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Карта площадок</h3>
              <p className="text-gray-600 text-center">Находите спортивные площадки рядом с вами</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-[#2F80ED] transition">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#10B981">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Сообщество</h3>
              <p className="text-gray-600 text-center">Общайтесь с игроками и создавайте команды</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-[#2F80ED] transition">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#8B5CF6">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Мероприятия</h3>
              <p className="text-gray-600 text-center">Создавайте и участвуйте в спортивных событиях</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
