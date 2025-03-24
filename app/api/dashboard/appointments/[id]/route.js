// app/api/dashboard/appointments/[id]/route.js
import { prisma } from '@/lib/db'; // Ensure Prisma client is correctly imported
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/lib/auth';
import { sendAppointmentStatusUpdate } from '@/lib/email';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();
    
    // const session = await getServerSession(authOptions);
    
    // if (!session || !['doctor', 'admin'].includes(session.user.role)) {
    //   return Response.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Fetch appointment with related doctor and patient
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
      include: {
        doctor: {
          select: {
            id: true,
            user: { select: { id: true, name: true, email: true } }
          }
        },
        patient: { select: { id: true, name: true, email: true } }
      }
    });

    if (!appointment) {
      return Response.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // If doctor, verify they own the appointment
    if (session.user.role === 'doctor' && appointment.doctor.user.id !== session.user.id) {
      return Response.json({ error: 'Not authorized to update this appointment' }, { status: 403 });
    }

    // Update appointment status
    const updatedAppointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status, updatedAt: new Date() },
    });

    // Send status update email
    await sendAppointmentStatusUpdate({
      patient: appointment.patient,
      doctor: appointment.doctor.user,
      appointment: updatedAppointment,
      status
    });

    return Response.json({ appointment: updatedAppointment });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
