import { prisma } from '@/lib/db';
import { sendAppointmentStatusUpdate } from '@/lib/sendgrid';
import { verifyAuth } from '@/lib/auth';

export async function PATCH(request, { params }) {
  try {
    // const auth = await verifyAuth(request);
    
    // if (!auth || (auth.role !== 'admin' && auth.role !== 'doctor')) {
    //   return Response.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { status } = await request.json();
    const appointmentId =await parseInt(params.id);

    // Validate status
    if (!['confirmed', 'cancelled', 'pending'].includes(status)) {
      return Response.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update appointment status
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
      include: {
        patient: true,
        doctor: {
          include: {
            user: true
          }
        },
        timeSlot: true
      }
    });

    // Try to send email notification, but don't fail the request if it fails
    try {
      await sendAppointmentStatusUpdate({
        patient: appointment.patient,
        doctor: appointment.doctor.user,
        appointment: {
          ...appointment,
          timeSlot: appointment.timeSlot
        },
        status
      });
    } catch (emailError) {
      // Log the email error but don't throw it
      console.error('Error sending email notification:', emailError);
    }

    return Response.json({
      success: true,
      message: 'Appointment status updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return Response.json(
      { error: error.message || 'Failed to update appointment status' },
      { status: 500 }
    );
  }
} 