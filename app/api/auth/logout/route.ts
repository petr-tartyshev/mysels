import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST() {
  const response = NextResponse.json({ success: true })
  
  // Удалить cookies
  response.cookies.delete('userId')
  response.cookies.delete('username')
  
  return response
}
