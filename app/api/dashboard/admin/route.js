// app/api/dashboard/appointments/route.js
import { prisma } from '@/lib/db'; // Ensure Prisma client is correctly imported
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['doctor', 'admin'].includes(session.user.role)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    let filters = {};

    if (session.user.role === 'doctor') {
      // Find the doctor's ID
      const doctor = await prisma.doctor.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });

      if (!doctor) {
        return Response.json({ error: 'Doctor profile not found' }, { status: 404 });
      }

      filters.doctorId = doctor.id;
    }

    if (status) {
      filters.status = status;
    }

    if (date) {
      filters.appointmentDate = date;
    }

    // Fetch appointments
    const appointments = await prisma.appointment.findMany({
      where: filters,
      orderBy: [{ appointmentDate: 'asc' }, { timeSlot: { startTime: 'asc' } }],
      select: {
        id: true,
        appointmentDate: true,
        appointmentType: true,
        status: true,
        patientProblem: true,
        timeSlot: {
          select: {
            startTime: true,
            endTime: true,
          },
        },
        patient: {
          select: {
            name: true,
            email: true,
          },
        },
        doctor: {
          select: {
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    return Response.json({ appointments });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
