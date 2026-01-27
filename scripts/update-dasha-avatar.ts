import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function makeSvgDataUrl(svg: string) {
  // Encode safely for data URL
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

async function main() {
  const email = 'dasha@sels.ru'

  // Minimalist illustration: girl with tennis racket (project blue accents)
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#E8F4FD"/>
      <stop offset="1" stop-color="#F9FAFB"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="64" fill="url(#bg)"/>

  <!-- subtle pattern dots -->
  <g opacity="0.08" fill="#2F80ED">
    <circle cx="38" cy="42" r="2"/><circle cx="210" cy="62" r="2"/>
    <circle cx="64" cy="206" r="2"/><circle cx="200" cy="190" r="2"/>
    <circle cx="128" cy="34" r="1.6"/><circle cx="226" cy="128" r="1.6"/><circle cx="30" cy="128" r="1.6"/>
  </g>

  <!-- Hair -->
  <path d="M92 116c0-28 18-48 44-48s44 20 44 48c0 8-2 14-6 20-6-10-18-18-38-18h-4c-20 0-32 8-38 18-4-6-6-12-6-20z"
        fill="#1F2937"/>

  <!-- Face -->
  <circle cx="136" cy="116" r="30" fill="#F6D7C3"/>

  <!-- Eyes -->
  <circle cx="126" cy="114" r="3" fill="#111827"/>
  <circle cx="148" cy="114" r="3" fill="#111827"/>
  <path d="M128 128c6 6 14 6 20 0" stroke="#111827" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.7"/>

  <!-- Body -->
  <path d="M84 214c6-40 24-60 52-60s46 20 52 60" fill="#2F80ED" opacity="0.18"/>
  <path d="M98 214c4-30 16-44 38-44s34 14 38 44" fill="#2F80ED" opacity="0.22"/>

  <!-- Arm + racket handle -->
  <path d="M160 170c18 6 26 18 34 34" stroke="#111827" stroke-width="10" stroke-linecap="round"/>
  <path d="M190 208l20 20" stroke="#111827" stroke-width="10" stroke-linecap="round"/>

  <!-- Tennis racket -->
  <g transform="translate(206 226) rotate(-35)">
    <ellipse cx="0" cy="-34" rx="22" ry="28" fill="none" stroke="#2F80ED" stroke-width="6"/>
    <g stroke="#2F80ED" stroke-width="1.5" opacity="0.65">
      <path d="M-16 -34H16"/><path d="M-14 -44H14"/><path d="M-14 -24H14"/>
      <path d="M-8 -58V-10"/><path d="M0 -60V-8"/><path d="M8 -58V-10"/>
    </g>
    <rect x="-4" y="-6" width="8" height="36" rx="4" fill="#111827"/>
  </g>

  <!-- Small tennis ball -->
  <circle cx="76" cy="172" r="10" fill="#FDE047" stroke="#2F80ED" stroke-width="3"/>
  <path d="M66 172c6-4 14-4 20 0c-6 4-14 4-20 0z" fill="none" stroke="#2F80ED" stroke-width="2" opacity="0.6"/>
</svg>`.trim()

  const avatar = makeSvgDataUrl(svg)

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.error(`User not found: ${email}`)
    process.exit(1)
  }

  await prisma.user.update({
    where: { email },
    data: { avatar },
  })

  console.log(`✅ Updated avatar for ${email}`)
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

