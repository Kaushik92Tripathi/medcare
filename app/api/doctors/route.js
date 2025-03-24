// app/api/doctors/route.js
import { prisma } from '@/lib/db'; // Ensure Prisma client is correctly imported

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 6;
    const search = searchParams.get('search') || '';
    const specialty = searchParams.get('specialty');
    const minRating = parseFloat(searchParams.get('minRating')) || 0;
    const minExperience = parseInt(searchParams.get('minExperience')) || 0;
    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      AND: [
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { doctor: { specialty: { name: { contains: search, mode: 'insensitive' } } } }
          ]
        },
        { role: 'doctor' },
        { doctor: { 
          AND: [
            { avgRating: { gte: minRating } },
            { experienceYears: { gte: minExperience } },
            specialty ? { specialty: { name: specialty } } : {}
          ]
        } }
      ]
    };

    // Get total count for pagination
    const total = await prisma.user.count({ where });

    // Get doctors with pagination
    const doctors = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        doctor: {
          avgRating: 'desc'
        }
      },
      select: {
        id: true,
        name: true,
        doctor: {
          select: {
            id: true,
            degree: true,
            experienceYears: true,
            bio: true,
            avgRating: true,
            reviewCount: true,
            consultationFee: true,
            specialty: {
              select: {
                id: true,
                name: true
              }
            },
            location: {
              select: {
                id: true,
                name: true,
                city: true
              }
            }
          }
        }
      }
    });

    // Get all specialties for filters
    const specialties = await prisma.specialty.findMany({
      select: {
        id: true,
        name: true
      }
    });

    return Response.json({
      doctors,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      specialties
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return Response.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}
