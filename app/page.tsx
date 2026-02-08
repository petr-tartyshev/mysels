'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

/**
 * Главная страница - точная реализация по Figma CSS
 * Desktop - 1: 1440px × 1827px
 * Все элементы с абсолютным позиционированием строго по Figma
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
      {/* Desktop - 1: 1440px × 903px, position: relative, background: #FFFFFF */}
      <section
        className="relative bg-white"
        style={{ width: '1440px', height: '903px', margin: '0 auto' }}
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

        {/* Container: left: 144px, right: 586px, top: 0px, bottom: 0px */}
        <div
          className="absolute"
          style={{
            left: '144px',
            right: '586px',
            top: '0px',
            bottom: '0px',
          }}
        >
          {/* Component 1: width: 92.36px, height: 32.36px, left: 23px, top: 65px */}
          <div
            className="absolute flex flex-row items-center"
            style={{
              width: '92.36px',
              height: '32.36px',
              left: '23px',
              top: `${65 + logoOffset}px`,
              gap: '10px',
              padding: '0px',
            }}
          >
            {/* Categories: width: 22.61px, height: 23.16px, transform: rotate(-45deg) */}
            <div
              className="flex-none"
              style={{
                width: '22.61px',
                height: '23.16px',
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

            {/* SELS text: width: 50px, height: 20px */}
            <span
              className="flex-none flex items-center text-[#006FFD]"
              style={{
                width: '50px',
                height: '20px',
                fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '20px',
                lineHeight: '20px',
              }}
            >
              SELS
            </span>
          </div>

          {/* Heading 1: 586px × 351px, left: 62px, top: 65px, font-size: 100px, line-height: 70px */}
          <h1
            className="absolute flex items-center text-white"
            style={{
              width: '586px',
              height: '351px',
              left: '62px',
              top: '65px',
              fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont',
              fontStyle: 'normal',
              fontWeight: 700,
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
            className="absolute flex items-center text-white"
            style={{
              width: '547px',
              height: '60px',
              left: '62px',
              top: '671px',
              fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont',
              fontStyle: 'normal',
              fontWeight: 300,
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
              background: '#006FFD',
              fontFamily: 'Aeroport, system-ui, -apple-system, BlinkMacSystemFont',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '15.3px',
              lineHeight: '21px',
            }}
          >
            {/* 🏓 Попробовать бесплатно: width: 205px, height: 21px, left: calc(50% - 205px/2 - 0.5px), top: calc(50% - 21px/2 - 0.5px) */}
            <span
              className="flex items-center text-center"
              style={{
                width: '205px',
                height: '21px',
                left: 'calc(50% - 102.5px - 0.5px)',
                top: 'calc(50% - 10.5px - 0.5px)',
                position: 'relative',
              }}
            >
              🏓 Попробовать бесплатно
            </span>
          </Link>
        </div>

        {/* Group 424: width: 687px, height: 903px, left: 753px, top: 0px */}
        <div
          className="absolute"
          style={{
            width: '687px',
            height: '903px',
            left: '753px',
            top: '0px',
          }}
        >
          {/* hero-court 2: width: 687px, height: 903px, left: 753px, top: 0px, border-radius: 100px */}
          <div
            className="absolute overflow-hidden"
            style={{
              width: '687px',
              height: '903px',
              left: '0px',
              top: '0px',
              borderRadius: '100px',
              backgroundImage: 'url(/hero-court.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
            }}
          />

          {/* hero-court 3: width: 529px, height: 903px, left: 911px, top: 0px */}
          <div
            className="absolute overflow-hidden"
            style={{
              width: '529px',
              height: '903px',
              left: '158px',
              top: '0px',
              backgroundImage: 'url(/hero-court.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
            }}
          />
        </div>

        {/* Group 422 (Навигация): width: 599px, height: 39px, left: 816px, top: 13px, gap: 58px 30px */}
        <div
          className="absolute flex flex-row flex-wrap items-center justify-center"
          style={{
            width: '599px',
            height: '39px',
            left: '816px',
            top: '13px',
            gap: '30px',
            padding: '0px',
          }}
        >
          {/* Group 415: width: 142px, height: 21px */}
          <div className="flex-none relative" style={{ width: '142px', height: '21px' }}>
            {/* 🎾: left: 0%, right: 97.33%, top: 23.08%, bottom: 23.08% */}
            <span
              className="absolute flex items-center"
              style={{
                left: '0%',
                right: '97.33%',
                top: '23.08%',
                bottom: '23.08%',
                fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '65px',
                color: '#000000',
              }}
            >
              🎾
            </span>
            {/* О проекте: left: 4.17%, right: 76.29%, top: 23.08%, bottom: 23.08% */}
            <span
              className="absolute flex items-center"
              style={{
                left: '4.17%',
                right: '76.29%',
                top: '23.08%',
                bottom: '23.08%',
                fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '20px',
                lineHeight: '20px',
                color: '#000000',
              }}
            >
              О проекте
            </span>
          </div>

          {/* Group 416: width: 185px, height: 21px */}
          <div className="flex-none relative" style={{ width: '185px', height: '21px' }}>
            {/* 🔍: left: 28.71%, right: 68.61%, top: 23.08%, bottom: 23.08% */}
            <span
              className="absolute flex items-center"
              style={{
                left: '28.71%',
                right: '68.61%',
                top: '23.08%',
                bottom: '23.08%',
                fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '65px',
                color: '#000000',
              }}
            >
              🔍
            </span>
            {/* Карта локаций: left: 32.89%, right: 40.4%, top: 23.08%, bottom: 23.08% */}
            <span
              className="absolute flex items-center"
              style={{
                left: '32.89%',
                right: '40.4%',
                top: '23.08%',
                bottom: '23.08%',
                fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '20px',
                lineHeight: '20px',
                color: '#000000',
              }}
            >
              Карта локаций
            </span>
          </div>

          {/* Group 417: width: 66px, height: 21px */}
          <div className="flex-none relative" style={{ width: '66px', height: '21px' }}>
            {/* ❓: left: 64.61%, right: 32.72%, top: 23.08%, bottom: 23.08% */}
            <span
              className="absolute flex items-center"
              style={{
                left: '64.61%',
                right: '32.72%',
                top: '23.08%',
                bottom: '23.08%',
                fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '65px',
                color: '#000000',
              }}
            >
              ❓
            </span>
            {/* FAQ: left: 68.78%, right: 24.37%, top: 23.08%, bottom: 23.08% */}
            <span
              className="absolute flex items-center"
              style={{
                left: '68.78%',
                right: '24.37%',
                top: '23.08%',
                bottom: '23.08%',
                fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '20px',
                lineHeight: '20px',
                color: '#000000',
              }}
            >
              FAQ
            </span>
          </div>

          {/* Link: width: 116px, height: 39px, background: #006FFD, border-radius: 20px */}
          <Link
            href="/login"
            className="flex-none box-border bg-[#006FFD] border border-[#006FFD] rounded-[20px] flex items-center justify-center text-white hover:bg-[#0055cc] transition relative"
            style={{
              width: '116px',
              height: '39px',
            }}
          >
            {/* 🏓 Войти: width: 88px, height: 21px, left: calc(50% - 88px/2), top: calc(50% - 21px/2) */}
            <span
              className="absolute flex items-center text-center"
              style={{
                width: '88px',
                height: '21px',
                left: 'calc(50% - 44px)',
                top: 'calc(50% - 10.5px)',
                fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '15.3px',
                lineHeight: '21px',
                color: '#FFFFFF',
              }}
            >
              🏓 Войти
            </span>
          </Link>
        </div>

      </section>

      {/* Desktop - 2: 1440px × 871px, position: relative, background: #FFFFFF */}
      <section
        className="relative bg-white"
        style={{ width: '1440px', height: '871px', margin: '0 auto' }}
      >
        {/* Container для выравнивания с первым блоком: left: 144px */}
        <div
          className="absolute"
          style={{
            left: '144px',
            right: '0px',
            top: '0px',
            bottom: '0px',
          }}
        >
          {/* Component 1: width: 92.36px, height: 32.36px, left: 23px, top: 69px */}
          <div
            className="absolute flex flex-row items-center"
            style={{
              width: '92.36px',
              height: '32.36px',
              left: '23px',
              top: `${69 + logoOffset}px`,
              gap: '10px',
              padding: '0px',
            }}
          >
            {/* Categories: width: 22.61px, height: 23.16px, transform: rotate(-45deg) */}
            <div
              className="flex-none"
              style={{
                width: '22.61px',
                height: '23.16px',
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

            {/* SELS text: width: 50px, height: 20px */}
            <span
              className="flex-none flex items-center text-[#006FFD]"
              style={{
                width: '50px',
                height: '20px',
                fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '20px',
                lineHeight: '20px',
              }}
            >
              SELS
            </span>
          </div>
        </div>

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
            className="absolute flex items-center text-white"
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
            className="absolute flex items-center text-white"
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

        {/* Heading 1 (40%): width: 341px, height: 100px, left: 157px, top: 693px */}
        <div
          className="absolute flex items-center text-white"
          style={{
            width: '341px',
            height: '100px',
            left: '157px',
            top: '693px',
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

        {/* Heading 1 (27%): width: 320px, height: 100px, left: 548px, top: 693px */}
        <div
          className="absolute flex items-center text-white"
          style={{
            width: '320px',
            height: '100px',
            left: '548px',
            top: '693px',
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
  )
}
