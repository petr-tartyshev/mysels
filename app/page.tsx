import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
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

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#2F80ED">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Карта площадок</h3>
            <p className="text-gray-600">Находите спортивные площадки рядом с вами</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#10B981">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Сообщество</h3>
            <p className="text-gray-600">Общайтесь с игроками и создавайте команды</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#8B5CF6">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Мероприятия</h3>
            <p className="text-gray-600">Создавайте и участвуйте в спортивных событиях</p>
          </div>
        </div>
      </div>
    </div>
  )
}
