import Link from 'next/link'

/**
 * Главная страница.
 *
 * Цели:
 * - На экране 1920×1080 выглядеть максимально близко к макету из Figma и скринам.
 * - При этом не использовать жёсткую обёртку 1920px и кучу absolute‑позиционирования,
 *   чтобы страница оставалась адаптивной.
 *
 * Подход:
 * - Строим лэйаут через flex / grid.
 * - Ограничиваем контент контейнером max-w-[1920px] и центрируем его.
 * - Размеры и скругления оставляем «пиксельными», как в макете.
 */

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-white text-black">
      {/* HERO */}
      <section className="w-full flex justify-center px-4 pt-6 lg:pt-10">
        <div className="relative w-full max-w-[1920px]">
          {/* Синий контейнер с закруглением, как Rectangle 16 */}
          <div className="relative mx-auto bg-[#006FFD] rounded-[70px] lg:rounded-[100px] overflow-hidden px-6 py-8 lg:px-[100px] lg:py-[65px] flex flex-col lg:flex-row gap-6 lg:gap-0">
            {/* Левая текстовая колонка */}
            <div className="flex-1 flex flex-col justify-between lg:pr-10">
              {/* Логотип */}
              <div className="flex items-center gap-3 mb-10">
                <div className="w-7 h-7 flex flex-wrap rotate-[-45deg]">
                  <div className="w-3 h-3 bg-[#006FFD] rounded-[2px]" />
                  <div className="w-3 h-3 bg-[#006FFD] rounded-[2px]" />
                  <div className="w-3 h-3 bg-[#006FFD] rounded-[2px]" />
                  <div className="w-3 h-3 bg-[#006FFD] rounded-[2px]" />
                </div>
                <span className="text-[20px] font-bold text-[#006FFD] bg-white rounded-full px-3 py-1 leading-[20px]">
                  SELS
                </span>
              </div>

              {/* Заголовок */}
              <h1
                className="font-[700] text-white leading-[0.7] mb-8"
                style={{
                  fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont',
                  fontSize: '64px',
                }}
              >
                <span className="block text-[64px] lg:text-[100px]">
                  Когда
                  <br />
                  хочется
                  <br />
                  спорта,
                  <br />
                  но сложно
                  <br />
                  начать
                </span>
              </h1>

              {/* Подзаголовок */}
              <p
                className="max-w-[547px] text-white text-[16px] lg:text-[20px] leading-[1.1] mb-8"
                style={{ fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont' }}
              >
                Мы убрали всё лишнее между тобой и движением: поиск, сомнения, выбор. Подскажем,
                куда пойти, с чего начать и с кем играть.
              </p>

              {/* Кнопка */}
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-[#006FFD] border border-white rounded-[20px] px-7 py-3 text-white text-[15px] font-medium hover:bg-white/10 transition"
                style={{ fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont' }}
              >
                <span className="text-[18px] leading-none">🏓</span>
                <span>Попробовать бесплатно</span>
              </Link>
            </div>

            {/* Правая колонка с картинкой и навигацией */}
            <div className="relative flex-1 min-h-[260px] lg:min-h-[540px] xl:min-h-[620px]">
              {/* Навигация поверх картинки */}
              <div className="absolute top-3 right-6 z-20 hidden lg:flex items-center gap-6 text-[18px] font-bold text-black">
                <button className="flex items-center gap-2 hover:opacity-80 transition">
                  <span className="text-[16px]">🎾</span>
                  <span>О проекте</span>
                </button>
                <button className="flex items-center gap-2 hover:opacity-80 transition">
                  <span className="text-[16px]">🔍</span>
                  <span>Карта локаций</span>
                </button>
                <button className="flex items-center gap-2 hover:opacity-80 transition">
                  <span className="text-[16px]">❓</span>
                  <span>FAQ</span>
                </button>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center bg-[#006FFD] text-white rounded-[20px] px-5 py-2 text-[15px] font-medium hover:bg-[#0055cc] transition"
                >
                  🏓 Войти
                </Link>
              </div>

              {/* Большая картинка справа */}
              <div className="absolute inset-0 left-[10%] lg:left-[5%]">
                <div
                  className="w-full h-full rounded-[70px] lg:rounded-[100px] bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url(https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=80)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* СЕКЦИЯ 2 — Улучшение качества жизни */}
      <section className="w-full flex justify-center px-4 py-20 lg:py-28">
        <div className="w-full max-w-[1920px]">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)] gap-10 xl:gap-20 mb-16">
            {/* Заголовок слева */}
            <div>
              <h2
                className="text-[40px] lg:text-[72px] font-[700] leading-[0.9] mb-4"
                style={{ fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont' }}
              >
                Улучшение
                <br />
                качества
                <br />
                жизни
              </h2>
            </div>

            {/* Текст справа */}
            <div className="flex flex-col justify-center">
              <p
                className="text-[20px] lg:text-[28px] leading-[1.25] mb-4"
                style={{ fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont' }}
              >
                при регулярном занятии командным спортом подтверждаются международными{' '}
                <span className="inline-block px-3 py-1 rounded-full bg-[#006FFD] text-white underline">
                  исследованиями
                </span>
              </p>
            </div>
          </div>

          {/* Три карточки снизу */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
            {/* Карточка 1 */}
            <div className="bg-[#006FFD] rounded-[40px] lg:rounded-[50px] text-white px-8 pt-8 pb-10 flex flex-col justify-between min-h-[320px]">
              <p className="text-[14px] lg:text-[16px] leading-[1.4] mb-6 max-w-[360px]">
                Участие в командных видах спорта связано с более низкими показателями тревоги и
                депрессии — примерно на 40% реже по сравнению с теми, кто спортом не занимается или
                занимается соло.
              </p>
              <p
                className="text-[64px] lg:text-[96px] font-[500] mt-auto"
                style={{ fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont' }}
              >
                40%
              </p>
            </div>

            {/* Карточка 2 */}
            <div className="bg-[#4587FF] rounded-[40px] lg:rounded-[50px] text-white px-8 pt-8 pb-10 flex flex-col justify-between min-h-[320px]">
              <p className="text-[14px] lg:text-[16px] leading-[1.4] mb-6 max-w-[360px]">
                Люди, участвующие в командном спорте, на 27–28% реже имеют вредные привычки, такие
                как курение и злоупотребление алкоголем.
              </p>
              <p
                className="text-[64px] lg:text-[96px] font-[500] mt-auto"
                style={{ fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont' }}
              >
                27%
              </p>
            </div>

            {/* Карточка 3 — изображение */}
            <div className="bg-[#B3E5FC] rounded-[40px] lg:rounded-[50px] overflow-hidden flex items-center justify-center min-h-[320px]">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1601000938259-9e4b8532a4bb?auto=format&fit=crop&w=1200&q=80)',
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
