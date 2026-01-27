import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all locations
export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      include: {
        events: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            posts: true,
            events: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(locations)
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}

// POST - Create new location
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, lat, lng, address, cost, rating, image, type } = body

    // Validation
    if (!name || lat === undefined || lng === undefined) {
      return NextResponse.json(
        { error: 'Name, latitude, and longitude are required' },
        { status: 400 }
      )
    }

    const location = await prisma.location.create({
      data: {
        name,
        description: description || null,
        lat,
        lng,
        address: address || null,
        cost: cost || 'Бесплатно',
        rating: rating || 0,
        image: image || null,
        type: type || 'regular',
      },
    })

    return NextResponse.json(location, { status: 201 })
  } catch (error) {
    console.error('Error creating location:', error)
    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 500 }
    )
  }
}
