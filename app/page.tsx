import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen bg-white overflow-x-hidden" style={{ minWidth: '1920px', minHeight: '3716px' }}>
      {/* Rectangle 16 - Синий фон с закруглением */}
      <div 
        className="absolute bg-[#006FFD] rounded-[100px]"
        style={{
          width: '1758px',
          height: '903px',
          left: '162px',
          top: '0px',
        }}
      >
        {/* Rectangle 17 - Внутренний синий прямоугольник */}
        <div 
          className="absolute bg-[#006FFD]"
          style={{
            width: '1620px',
            height: '903px',
            left: '300px',
            top: '0px',
          }}
        >
          {/* Container - Левая часть с текстом */}
          <div 
            className="absolute"
            style={{
              left: '172px',
              right: '1038px',
              top: '0px',
              bottom: '2813px',
            }}
          >
            {/* Логотип с иконкой */}
            <div 
              className="absolute"
              style={{
                width: '22.61px',
                height: '23.16px',
                left: '27px',
                top: '24px',
                transform: 'rotate(-45deg)',
              }}
            >
              <div 
                className="absolute bg-[#006FFD]"
                style={{
                  left: '11.93%',
                  right: '4.74%',
                  top: '11.64%',
                  bottom: '5.02%',
                  transform: 'rotate(-45deg)',
                }}
              />
            </div>
            
            <div 
              className="absolute font-bold text-[20px] leading-[20px] text-[#006FFD]"
              style={{
                width: '50px',
                height: '20px',
                left: '69px',
                top: '30.09px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              SELS
            </div>

            {/* Heading 1 - Заголовок */}
            <div 
              className="absolute text-white flex items-center"
              style={{
                width: '586px',
                height: '351px',
                left: '100px',
                top: '65px',
                fontFamily: 'Aeroport, sans-serif',
                fontWeight: 700,
                fontSize: '100px',
                lineHeight: '70px',
              }}
            >
              Когда<br />
              хочется<br />
              спорта,<br />
              но сложно<br />
              начать
            </div>

            {/* Heading 2 - Подзаголовок */}
            <div 
              className="absolute text-white flex items-center"
              style={{
                width: '547px',
                height: '60px',
                left: '100px',
                top: '671px',
                fontFamily: 'Aeroport, sans-serif',
                fontWeight: 300,
                fontSize: '20px',
                lineHeight: '20px',
              }}
            >
              Мы убрали всё лишнее между тобой и движением:
              поиск, сомнения, выбор. Подскажем, куда пойти,
              с чего начать и с кем играть.
            </div>

            {/* Кнопка "Попробовать бесплатно" */}
            <Link
              href="/register"
              className="absolute box-border bg-[#006FFD] border border-white rounded-[20px] flex items-center justify-center"
              style={{
                width: '262px',
                height: '48px',
                left: '100px',
                top: 'calc(50% - 48px/2 + 369.5px)',
              }}
            >
              <span 
                className="text-white text-center"
                style={{
                  width: '205px',
                  height: '21px',
                  fontFamily: 'Aeroport, sans-serif',
                  fontWeight: 500,
                  fontSize: '15.3px',
                  lineHeight: '21px',
                }}
              >
                🏓 Попробовать бесплатно
              </span>
            </Link>
          </div>

          {/* Изображение справа - fd628e190b0208d769beaa442e2bccf0 */}
          <div 
            className="absolute rounded-[100px] bg-cover bg-center"
            style={{
              width: '990px',
              height: '903px',
              left: '930px',
              top: '0px',
              backgroundImage: 'url(https://images.unsplash.com/photo-1518611012118-696072aa579a?w=990&h=903&fit=crop)',
            }}
          />
          
          <div 
            className="absolute bg-cover bg-center"
            style={{
              width: '776px',
              height: '903px',
              left: '1144px',
              top: '0px',
              backgroundImage: 'url(https://images.unsplash.com/photo-1518611012118-696072aa579a?w=776&h=903&fit=crop&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Навигация сверху справа */}
          <div 
            className="absolute"
            style={{
              width: '682px',
              height: '39px',
              left: '1119px',
              top: '13px',
            }}
          >
            {/* О проекте */}
            <div 
              className="absolute flex items-center"
              style={{
                width: '142px',
                height: '21px',
                left: '0px',
                top: '9px',
              }}
            >
              <span 
                className="font-bold text-[20px] leading-[20px] text-black"
                style={{
                  width: '16px',
                  height: '21px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  lineHeight: '65px',
                }}
              >
                🎾
              </span>
              <span 
                className="font-bold text-[20px] leading-[20px] text-black ml-2"
                style={{
                  width: '117px',
                  height: '21px',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                О проекте
              </span>
            </div>

            {/* Карта локаций */}
            <div 
              className="absolute flex items-center"
              style={{
                width: '185px',
                height: '21px',
                left: '183px',
                top: '9px',
              }}
            >
              <span 
                className="font-bold text-[20px] leading-[20px] text-black"
                style={{
                  width: '16px',
                  height: '21px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  lineHeight: '65px',
                }}
              >
                🔍
              </span>
              <span 
                className="font-bold text-[20px] leading-[20px] text-black ml-2"
                style={{
                  width: '160px',
                  height: '21px',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Карта локаций
              </span>
            </div>

            {/* FAQ */}
            <div 
              className="absolute flex items-center"
              style={{
                width: '66px',
                height: '21px',
                left: '409px',
                top: '9px',
              }}
            >
              <span 
                className="font-bold text-[20px] leading-[20px] text-black"
                style={{
                  width: '16px',
                  height: '21px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  lineHeight: '65px',
                }}
              >
                ❓
              </span>
              <span 
                className="font-bold text-[20px] leading-[20px] text-black ml-2"
                style={{
                  width: '41px',
                  height: '21px',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                FAQ
              </span>
            </div>

            {/* Кнопка "Войти" */}
            <Link
              href="/login"
              className="absolute box-border bg-[#006FFD] border border-[#006FFD] rounded-[20px] flex items-center justify-center"
              style={{
                width: '116px',
                height: '39px',
                left: '566px',
                top: '0px',
              }}
            >
              <span 
                className="text-white text-center"
                style={{
                  width: '88px',
                  height: '21px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '15.3px',
                  lineHeight: '21px',
                }}
              >
                🏓 Войти
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Вторая секция - Group 421 */}
      <div 
        className="absolute"
        style={{
          width: '1596px',
          height: '1048px',
          left: '162px',
          top: '1055px',
        }}
      >
        {/* Group 420 */}
        <div 
          className="absolute"
          style={{
            width: '1596px',
            height: '372px',
            left: '0px',
            top: '0px',
          }}
        >
          {/* Заголовок слева */}
          <div 
            className="absolute text-black flex items-center"
            style={{
              width: '802px',
              height: '210px',
              left: '0px',
              top: '0px',
              fontFamily: 'Aeroport, sans-serif',
              fontWeight: 700,
              fontSize: '100px',
              lineHeight: '70px',
            }}
          >
            SELS снижает порог входа и помогает сделать первый шаг
          </div>

          {/* Group 422 - Текст справа */}
          <div 
            className="absolute"
            style={{
              width: '950px',
              height: '162px',
              left: '646px',
              top: '210px',
            }}
          >
            <div 
              className="absolute text-black flex items-center"
              style={{
                width: '950px',
                height: '150px',
                left: '0px',
                top: '0px',
                fontFamily: 'Aeroport, sans-serif',
                fontWeight: 400,
                fontSize: '50px',
                lineHeight: '50px',
              }}
            >
              SELS показывает спортивные активности рядом с тобой:
              пробежки, тренировки, игры, выезды — с понятным форматом, местом и людьми.
            </div>
          </div>

          {/* Кнопка справа */}
          <Link
            href="/register"
            className="absolute box-border bg-[#006FFD] border border-[#006FFD] rounded-[30px] flex items-center justify-center"
            style={{
              width: '440.01px',
              height: '55px',
              left: '1090px',
              top: '317px',
            }}
          >
            <span 
              className="text-white text-center underline"
              style={{
                width: '415px',
                height: '61px',
                fontFamily: 'Aeroport, sans-serif',
                fontWeight: 400,
                fontSize: '50px',
                lineHeight: '50px',
              }}
            >
              Попробовать бесплатно
            </span>
          </Link>
        </div>

        {/* Три карточки внизу */}
        {/* Frame 142 - Первая карточка (синяя) */}
        <div 
          className="absolute bg-[#005BFF] rounded-[50px]"
          style={{
            width: '465px',
            height: '572px',
            left: '0px',
            top: '476px',
          }}
        >
          <div 
            className="absolute text-white flex items-center"
            style={{
              width: '387px',
              height: '120px',
              left: '26px',
              top: '64px',
              fontFamily: 'Aeroport, sans-serif',
              fontWeight: 300,
              fontSize: '20px',
              lineHeight: '20px',
            }}
          >
            Хочется заниматься спортом и быть среди единомышленников,
            но одному тяжело: не хватает мотивации, страшно идти в новое место и знакомиться с незнакомыми людьми.
          </div>
          <div 
            className="absolute text-white flex items-center"
            style={{
              width: '426px',
              height: '100px',
              left: '20px',
              top: '448px',
              fontFamily: 'Aeroport, sans-serif',
              fontWeight: 500,
              fontSize: '200px',
              lineHeight: '100px',
            }}
          >
            01
          </div>
        </div>

        {/* Frame 141 - Вторая карточка (светло-синяя) */}
        <div 
          className="absolute bg-[#4587FF] rounded-[50px]"
          style={{
            width: '465px',
            height: '572px',
            left: '485px',
            top: '476px',
          }}
        >
          <div 
            className="absolute text-white flex items-center"
            style={{
              width: '387px',
              height: '80px',
              left: '26px',
              top: '59px',
              fontFamily: 'Aeroport, sans-serif',
              fontWeight: 300,
              fontSize: '20px',
              lineHeight: '20px',
            }}
          >
            Ты приходишь не знакомиться, а заниматься спортом.
            Общение возникает само — без неловкости и давления.
          </div>
          <div 
            className="absolute text-white flex items-center"
            style={{
              width: '400px',
              height: '100px',
              left: '33px',
              top: '448px',
              fontFamily: 'Aeroport, sans-serif',
              fontWeight: 500,
              fontSize: '200px',
              lineHeight: '100px',
            }}
          >
            02
          </div>
        </div>

        {/* Изображение справа - 3e2858295bd1e922d43e35c8756d9fcf */}
        <div 
          className="absolute rounded-[50px] bg-cover bg-center"
          style={{
            width: '572px',
            height: '626px',
            left: '970px',
            top: '476px',
            backgroundImage: 'url(https://images.unsplash.com/photo-1518611012118-696072aa579a?w=572&h=626&fit=crop&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'rotate(-90deg)',
          }}
        />
      </div>
    </div>
  )
}
