// app/api/doctors/top/route.js
import { prisma } from '@/lib/db'; // Ensure Prisma client is correctly imported

export async function GET() {
  try {
    const topDoctors = await prisma.doctor.findMany({
      where: { isAvailable: true }, // Fix the field name here
      select: {
        id: true,
        degree: true,
        experienceYears: true, // Fix field name
        avgRating: true, // Fix field name
        user: {
          select: { name: true, profile: { select: { profilePicture: true } } } // Fix field name
        },
        specialty: { select: { name: true } }
      },
      orderBy: [{ avgRating: 'desc' }, { reviewCount: 'desc' }], // Fix field names
      take: 6
    });

    return Response.json({
      doctors: topDoctors.map(doctor => ({
        id: doctor.id,
        degree: doctor.degree,
        experienceYears: doctor.experienceYears, // Fix field name
        avgRating: doctor.avgRating, // Fix field name
        name: doctor.user.name,
        specialtyName: doctor.specialty?.name || null,
        profilePicture: doctor.user.profile?.profilePicture || null // Fix field name
      }))
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
