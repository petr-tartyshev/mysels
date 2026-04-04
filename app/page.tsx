'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

/**
 * Главная страница - точная реализация по Figma CSS
 * Desktop - 1: 1440px × 1827px
 */

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen w-full bg-white text-black">
      {/* Контейнер для обоих блоков */}
      <div className="relative" style={{ width: '1440px', margin: '0 auto' }}>
      {/* Desktop - 1: 1440px × 1827px, position: relative, background: #FFFFFF */}
      <section
        className="relative bg-white"
        style={{ width: '1440px', height: '1827px' }}
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

        {/* Логотип SELS - фиксированный, слева от синего блока на 100px, двигается при скролле */}
        <div
          className="fixed z-50 flex items-center gap-[10px]"
          style={{
            left: '44px', // 144px (начало синего блока) - 100px (отступ) = 44px
            top: `${65 + scrollY * 0.1}px`, // движение при скролле
            width: 'fit-content',
          }}
        >
          {/* Ромбики: 22.61px × 23.16px, rotate(-45deg) */}
          <div
            className="w-[22.61px] h-[23.16px] grid grid-cols-2 grid-rows-2 gap-[2px]"
            style={{ transform: 'rotate(-45deg)' }}
          >
            <div className="bg-[#006FFD] rounded-[2px]" />
            <div className="bg-[#006FFD] rounded-[2px]" />
            <div className="bg-[#006FFD] rounded-[2px]" />
            <div className="bg-[#006FFD] rounded-[2px]" />
          </div>

          {/* Текст "SELS": 50px × 20px */}
          <span
            className="font-[700] text-[20px] leading-[20px] text-[#006FFD] flex items-center"
            style={{
              width: '50px',
              height: '20px',
              fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont',
            }}
          >
            SELS
          </span>
        </div>

        {/* Container: left: 144px, right: 586px, top: 0px, bottom: 1430px */}
        <div
          className="absolute"
          style={{
            left: '144px',
            right: '586px',
            top: '0px',
            bottom: '1430px',
          }}
        >
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

          {/* Heading 2: 497px × 60px, left: 62px, top: 671px, font-size: 20px, line-height: 20px */}
          <p
            className="absolute font-[300] text-white flex items-center"
            style={{
              width: '497px',
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

          {/* Link (кнопка): 262px × 48px, left: 62px, top: calc(50% - 48px/2 + 620.5px), border-radius: 20px */}
          <Link
            href="/register"
            className="absolute box-border border border-white rounded-[20px] flex items-center justify-center text-white hover:bg-white/10 transition"
            style={{
              width: '262px',
              height: '48px',
              left: '62px',
              top: 'calc(50% - 24px + 620.5px)',
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

      {/* Desktop - 2: 1440px × 871px, position: absolute, background: #FFFFFF */}
      {/* Расстояние 100px от конца синего фрейма (903px) = 1003px от начала контейнера */}
      <section
        className="absolute bg-white"
        style={{ width: '1440px', height: '871px', top: '1003px', left: '0' }}
      >
        {/* Heading 1: width: 767px, height: 210px, left: 144px, top: 69px */}
        <h2
          className="absolute flex items-center text-black"
          style={{
            width: '767px',
            height: '210px',
            left: '144px',
            top: '69px',
            fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '100px',
            lineHeight: '70px',
            color: '#000000',
          }}
        >
          Улучшение
          <br />
          качества
          <br />
          жизни
        </h2>

        {/* Heading 1: width: 572px, height: 90px, left: 704px, top: 179px */}
        <p
          className="absolute flex items-center text-black"
          style={{
            width: '572px',
            height: '90px',
            left: '704px',
            top: '179px',
            fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '30px',
            lineHeight: '30px',
            color: '#000000',
          }}
        >
          при регулярном занятии командным спортом подтверждаются международными
        </p>

        {/* Link (кнопка "исследованиями"): width: 264px, height: 34px, left: 969px, top: calc(50% - 34px/2 - 175.5px), border-radius: 30px */}
        <div
          className="absolute box-border bg-[#006FFD] border border-[#006FFD] rounded-[30px] flex items-center justify-center"
          style={{
            width: '264px',
            height: '34px',
            left: '969px',
            top: 'calc(50% - 17px - 175.5px)',
          }}
        >
          {/* исследованиями: width: 247px, height: 0px, left: calc(50% - 247px/2 - 0.5px), top: calc(50% - 0px/2 - 6px) */}
          <span
            className="absolute flex items-center text-center underline text-white"
            style={{
              width: '247px',
              height: 'auto',
              left: 'calc(50% - 123.5px - 0.5px)',
              top: 'calc(50% - 6px)',
              fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '30px',
              lineHeight: '0px',
              textDecorationLine: 'underline',
              color: '#FFFFFF',
            }}
          >
            исследованиями
          </span>
        </div>

        {/* Frame 142: width: 360px, height: 450px, left: 144px, top: 352px, background: #005BFF, border-radius: 50px */}
        <div
          className="absolute"
          style={{
            width: '360px',
            height: '450px',
            left: '144px',
            top: '352px',
            background: '#005BFF',
            borderRadius: '50px',
          }}
        >
          {/* Heading 2: width: 308px, height: 160px, left: 26px, top: 64px */}
          <p
            className="absolute text-white"
            style={{
              width: '308px',
              height: '160px',
              left: '26px',
              top: '64px',
              fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont',
              fontStyle: 'normal',
              fontWeight: 300,
              fontSize: '20px',
              lineHeight: '20px',
              color: '#FFFFFF',
            }}
          >
            Участие в командных видах спорта связано с более низкими показателями тревоги и депрессии
            — примерно на 40% реже по сравнению с теми, кто спортом не занимается или занимается
            соло.
          </p>
        </div>

        {/* Frame 143: width: 360px, height: 450px, left: 528px, top: 352px, background: #4587FF, border-radius: 50px */}
        <div
          className="absolute"
          style={{
            width: '360px',
            height: '450px',
            left: '528px',
            top: '352px',
            background: '#4587FF',
            borderRadius: '50px',
          }}
        >
          {/* Heading 2: width: 308px, height: 160px, left: 26px, top: 64px */}
          <p
            className="absolute text-white"
            style={{
              width: '308px',
              height: '160px',
              left: '26px',
              top: '64px',
              fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont',
              fontStyle: 'normal',
              fontWeight: 300,
              fontSize: '20px',
              lineHeight: '20px',
              color: '#FFFFFF',
              display: 'block',
              verticalAlign: 'top',
              textAlign: 'left',
            }}
          >
            Люди, участвующие в командном спорте, на 27–28% реже имеют вредные привычки, такие как
            курение и злоупотребление алкоголем.
          </p>
        </div>

        {/* Frame 144: width: 360px, height: 450px, left: 916px, top: 352px, background: #4587FF, border-radius: 50px */}
        <div
          className="absolute overflow-hidden"
          style={{
            width: '360px',
            height: '450px',
            left: '916px',
            top: '352px',
            background: '#4587FF',
            borderRadius: '50px',
          }}
        >
          {/* Heading 2: visibility: hidden */}
          <p
            className="absolute flex items-center text-white"
            style={{
              width: '308px',
              height: '160px',
              left: '26px',
              top: '64px',
              visibility: 'hidden',
              fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont',
              fontStyle: 'normal',
              fontWeight: 300,
              fontSize: '20px',
              lineHeight: '20px',
              color: '#FFFFFF',
            }}
          >
            Hidden text
          </p>

          {/* hero-court 1: width: 450px, height: 360px, left: 916px, top: 352px, border-radius: 50px, transform: rotate(-90deg) */}
          <div
            className="absolute"
            style={{
              width: '450px',
              height: '360px',
              left: '-45px',
              top: '45px',
              borderRadius: '50px',
              backgroundImage: 'url(/hero-court2.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
            }}
          />
        </div>

        {/* Heading 1 (40%): width: 341px, height: 100px, left: 157px, top: 702px (нижний край карточки) */}
        <div
          className="absolute flex items-center text-white"
          style={{
            width: '341px',
            height: '100px',
            left: '157px',
            top: '702px', // 352px (top карточки) + 450px (height карточки) - 100px (height цифры) = 702px
            fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '160px',
            lineHeight: '100px',
            color: '#FFFFFF',
          }}
        >
          40%
        </div>

        {/* Heading 1 (27%): width: 320px, height: 100px, left: 548px, top: 702px (нижний край карточки) */}
        <div
          className="absolute flex items-center text-white"
          style={{
            width: '320px',
            height: '100px',
            left: '548px',
            top: '702px', // 352px (top карточки) + 450px (height карточки) - 100px (height цифры) = 702px
            fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '160px',
            lineHeight: '100px',
            color: '#FFFFFF',
          }}
        >
          27%
        </div>
      </section>
      </div>
    </div>
  )
}
