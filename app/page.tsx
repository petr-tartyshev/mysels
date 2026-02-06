'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

/**
 * Главная страница - точная реализация по Figma CSS
 * Desktop - 1: 1440px × 1024px
 */

export default function HomePage() {
  // Лёгкое движение логотипа вниз при скролле
  const [logoOffset, setLogoOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || 0
      const offset = Math.min(40, y * 0.1)
      setLogoOffset(offset)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen w-full bg-white text-black">
      {/* Desktop - 1: 1440px × 1024px, position: relative, background: #FFFFFF */}
      <section
        className="relative bg-white"
        style={{ width: '1440px', height: '1024px', margin: '0 auto' }}
      >
        {/* Rectangle 18: 1296px × 903px, left: 144px, top: 0px, background: #006FFD, border-radius: 100px */}
        <div
          className="absolute bg-[#006FFD]"
          style={{
            width: '1296px',
            height: '903px',
            left: '144px',
            top: '0px',
            borderRadius: '100px',
          }}
        />

        {/* Rectangle 19: 628px × 903px, left: 812px, top: 0px, background: #006FFD */}
        <div
          className="absolute bg-[#006FFD]"
          style={{
            width: '628px',
            height: '903px',
            left: '812px',
            top: '0px',
          }}
        />

        {/* Container: left: 144px, right: 586px, top: 0px, bottom: 121px */}
        <div
          className="absolute"
          style={{
            left: '144px',
            right: '586px',
            top: '0px',
            bottom: '121px',
          }}
        >
          {/* Логотип: 22.61px × 23.16px, left: 29px, top: 65px, rotate(-45deg) */}
          <div
            className="absolute"
            style={{
              width: '22.61px',
              height: '23.16px',
              left: '29px',
              top: `${65 + logoOffset}px`,
              transform: 'rotate(-45deg)',
            }}
          >
            <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[2px]">
              <div className="bg-[#006FFD] rounded-[2px]" />
              <div className="bg-[#006FFD] rounded-[2px]" />
              <div className="bg-[#006FFD] rounded-[2px]" />
              <div className="bg-[#006FFD] rounded-[2px]" />
            </div>
          </div>

          {/* Текст "SELS": 50px × 20px, left: 71px, top: 71.09px */}
          <div
            className="absolute font-[700] text-[20px] leading-[20px] text-[#006FFD] flex items-center"
            style={{
              width: '50px',
              height: '20px',
              left: '71px',
              top: `${71.09 + logoOffset}px`,
            }}
          >
            SELS
          </div>

          {/* Heading 1: 586px × 351px, left: 62px, top: 65px, font-size: 100px, line-height: 70px */}
          <h1
            className="absolute font-[700] text-white flex items-center"
            style={{
              width: '586px',
              height: '351px',
              left: '62px',
              top: '65px',
              fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont',
              fontSize: '100px',
              lineHeight: '70px',
            }}
          >
            Когда
            <br />
            хочется
            <br />
            спорта,
            <br />
            но сложно
            <br />
            начать
          </h1>

          {/* Heading 2: 547px × 60px, left: 62px, top: 671px, font-size: 20px, line-height: 20px */}
          <p
            className="absolute font-[300] text-white flex items-center"
            style={{
              width: '547px',
              height: '60px',
              left: '62px',
              top: '671px',
              fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont',
              fontSize: '20px',
              lineHeight: '20px',
            }}
          >
            Мы убрали всё лишнее между тобой и движением: поиск, сомнения, выбор. Подскажем, куда
            пойти, с чего начать и с кем играть.
          </p>

          {/* Link (кнопка): 262px × 48px, left: 62px, top: calc(50% - 48px/2 + 369.5px), border-radius: 20px */}
          <Link
            href="/register"
            className="absolute box-border border border-white rounded-[20px] flex items-center justify-center text-white hover:bg-white/10 transition"
            style={{
              width: '262px',
              height: '48px',
              left: '62px',
              top: 'calc(50% - 24px + 369.5px)',
              fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont',
              fontSize: '15.3px',
              lineHeight: '21px',
            }}
          >
            <span className="mr-2">🏓</span>
            Попробовать бесплатно
          </Link>
        </div>

        {/* Картинка 1: 687px × 903px, left: 753px, top: 0px, border-radius: 100px */}
        <div
          className="absolute overflow-hidden"
          style={{
            width: '687px',
            height: '903px',
            left: '753px',
            top: '0px',
            borderRadius: '100px',
          }}
        >
          <img
            src="/hero-court.png"
            alt="Люди на спортивной площадке сверху"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'right 30%' }}
          />
        </div>

        {/* Картинка 2: 422px × 903px, left: 1018px, top: 0px (без скругления) */}
        <div
          className="absolute overflow-hidden"
          style={{
            width: '422px',
            height: '903px',
            left: '1018px',
            top: '0px',
          }}
        >
          <img
            src="/hero-court.png"
            alt="Люди на спортивной площадке сверху"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'right 30%' }}
          />
        </div>

        {/* Group 422 (Навигация): 599px × 39px, left: 816px, top: 13px, gap: 58px 30px */}
        <div
          className="absolute flex flex-row items-center"
          style={{
            width: '599px',
            height: '39px',
            left: '816px',
            top: '13px',
            gap: '30px',
            padding: '0px',
          }}
        >
          {/* О проекте */}
          <button className="flex items-center gap-2 font-[700] text-[20px] leading-[20px] text-black hover:opacity-80 transition">
            <span className="text-[16px]">🎾</span>
            <span>О проекте</span>
          </button>

          {/* Карта локаций */}
          <button className="flex items-center gap-2 font-[700] text-[20px] leading-[20px] text-black hover:opacity-80 transition">
            <span className="text-[16px]">🔍</span>
            <span>Карта локаций</span>
          </button>

          {/* FAQ */}
          <button className="flex items-center gap-2 font-[700] text-[20px] leading-[20px] text-black hover:opacity-80 transition">
            <span className="text-[16px]">❓</span>
            <span>FAQ</span>
          </button>

          {/* Link: Войти */}
          <Link
            href="/login"
            className="box-border bg-[#006FFD] border border-[#006FFD] rounded-[20px] flex items-center justify-center text-white hover:bg-[#0055cc] transition"
            style={{
              width: '116px',
              height: '39px',
              fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont',
              fontSize: '15.3px',
              lineHeight: '21px',
            }}
          >
            🏓 Войти
          </Link>
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
