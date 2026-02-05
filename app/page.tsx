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
      <section className="w-full bg-white flex justify-center">
        <div className="w-full max-w-[1920px] flex relative">
          {/* Левая белая колонка с логотипом - отступ 50px от левого края */}
          <div className="bg-white flex items-start pt-10 pl-[50px]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 flex flex-wrap rotate-[-45deg]">
                <div className="w-3 h-3 bg-[#006FFD] rounded-[2px]" />
                <div className="w-3 h-3 bg-[#006FFD] rounded-[2px]" />
                <div className="w-3 h-3 bg-[#006FFD] rounded-[2px]" />
                <div className="w-3 h-3 bg-[#006FFD] rounded-[2px]" />
              </div>
              <span className="text-[20px] font-bold text-[#006FFD]">SELS</span>
            </div>
          </div>

          {/* Центральный синий блок - gap 50px от логотипа, продлен под картинку до красной линии, скругление только слева */}
          <div className="flex-1 flex items-stretch relative ml-[50px] overflow-visible">
            {/* Синий блок - скругление только слева, уходит под картинку глубже внутрь до красной линии */}
            <div
              className="flex-1 bg-[#006FFD] rounded-l-[50px] h-[1053px] flex flex-col px-[100px] pt-[60px] pb-[40px] relative z-0"
              style={{ marginRight: '-260px' }}
            >
              {/* Контент с резиновой версткой через gap - поднят вверх для одного скролла */}
              <div className="flex flex-col gap-5">
                {/* Заголовок - ровно 5 строк */}
                <h1
                  className="font-[700] text-white leading-[0.7]"
                  style={{
                    fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont',
                    fontSize: '70px',
                  }}
                >
                  Когда
                  <br />
                  хочется
                  <br />
                  спорта,
                  <br />
                  НО сложно начать
                </h1>

                {/* Подзаголовок */}
                <p
                  className="max-w-[547px] text-white text-[20px] leading-[20px]"
                  style={{ fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont' }}
                >
                  Мы убрали всё лишнее между тобой и движением: поиск, сомнения, выбор. Подскажем,
                  куда пойти, с чего начать и с кем играть.
                </p>

                {/* Кнопка */}
                <div className="flex">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 w-[360px] h-[56px] border border-white rounded-[28px] text-white text-[16px] font-medium hover:bg-white/10 transition"
                    style={{ fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont' }}
                  >
                    <span className="text-[18px] leading-none">🏓</span>
                    <span>Попробовать бесплатно</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Правая картинка с радиусом 50 - поверх синего блока */}
            <div className="w-[800px] h-[1053px] ml-[40px] relative z-10 flex-shrink-0">
              {/* Навигация поверх картинки - правая кнопка с отступом 50px от правого края */}
              <div className="absolute top-[24px] right-[50px] z-20 flex items-center gap-8 text-[20px] font-bold text-black">
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

              <div
                className="w-full h-full rounded-[50px] bg-cover bg-center overflow-hidden"
                style={{
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=80)',
                }}
              />
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
