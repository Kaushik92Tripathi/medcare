import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    // const auth = await verifyAuth(request);
    
    // if (!auth) {
    //   return Response.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const appointments = await prisma.appointment.findMany({
      where: {
        // patientId: auth.id,
        patientId: 2,
      },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            },
            specialty: true,
          }
        },
        timeSlot: true,
      },
      orderBy: {
        appointmentDate: 'desc'
      }
    });

    return Response.json({ appointments });
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
} 