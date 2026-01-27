import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SELS - Sports Community',
  description: 'Find sports teams and build community for active life',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isStaging =
    typeof process.env.NEXT_PUBLIC_ENV !== 'undefined' &&
    process.env.NEXT_PUBLIC_ENV === 'staging'

  return (
    <html lang="ru">
      <body>
        {isStaging && (
          <>
            {/* Верхний баннер стейджа */}
            <div className="fixed top-0 inset-x-0 z-[9999] flex items-center justify-center bg-yellow-400 text-black text-xs sm:text-sm font-semibold py-1.5 sm:py-2 shadow-md">
              Вы на стейдж-версии SELS (тестовое окружение)
            </div>

            {/* Небольшой маркер среды внизу справа */}
            <div className="fixed bottom-3 right-3 z-[9999]">
              <div className="px-3 py-1.5 rounded-full bg-black/70 text-[10px] sm:text-xs text-white font-medium shadow-lg border border-white/10">
                STAGE
              </div>
            </div>
          </>
        )}

        <div className={isStaging ? 'pt-8 sm:pt-9' : ''}>{children}</div>
      </body>
    </html>
  )
}
