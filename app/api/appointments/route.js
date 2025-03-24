// app/api/appointments/route.js
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';
// import { sendAppointmentConfirmation } from '@/lib/email';

export async function GET(request) {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        doctor: {
          include: {
            user: true,
            location: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        timeSlot: true,
      },
      orderBy: {
        appointmentDate: 'desc',
      },
    });

    // Get counts for different statuses
    const stats = {
      total: appointments.length,
      confirmed: appointments.filter(app => app.status === 'confirmed').length,
      pending: appointments.filter(app => app.status === 'pending').length,
      cancelled: appointments.filter(app => app.status === 'cancelled').length,
    };

    return Response.json({ appointments, stats });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Get and verify JWT token
    // const authHeader = request.headers.get('authorization');
    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //   return Response.json({ error: 'No token provided' }, { status: 401 });
    // }

    // const token = authHeader.split(' ')[1];
    // let user;
    
    // try {
    //   user = jwt.verify(token, process.env.JWT_SECRET);
    // } catch (err) {
    //   return Response.json({ error: 'Invalid token' }, { status: 401 });
    // }

    // if (!user || !user.id) {
    //   return Response.json({ error: 'Invalid token payload' }, { status: 401 });
    // }

    const userId = 6;

    const {
      doctorId,
      date,
      timeSlotId,
      appointmentType,
      patientProblem,
      patientAge,
      patientGender
    } = await request.json();

    // Convert date to a JavaScript Date object
    const dateObj = new Date(date);
    const formattedDate = dateObj.toISOString();
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday

    // Check if the doctor is available for this time slot and day
    const isAvailable = await prisma.doctorAvailability.findFirst({
      where: {
        doctorId: doctorId,
        dayOfWeek: dayOfWeek,
        timeSlotId: timeSlotId,
        isAvailable: true,
      },
    });

    if (!isAvailable) {
      return Response.json({ error: 'This time slot is not available' }, { status: 400 });
    }

    // Check if the time slot is already booked for this date
    const existingBooking = await prisma.appointment.count({
      where: {
        doctorId: doctorId,
        appointmentDate: formattedDate,
        timeSlotId: timeSlotId,
        NOT: { status: { in: ['cancelled', 'rejected'] } },
      },
    });

    if (existingBooking > 0) {
      return Response.json({ error: 'This time slot is already booked' }, { status: 400 });
    }

    // Book the appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: userId,
        doctorId: doctorId,
        appointmentDate: formattedDate,
        timeSlotId: timeSlotId,
        appointmentType: appointmentType,
        status: 'pending', // Initial status
        patientProblem: patientProblem,
        patientAge: patientAge,
        patientGender: patientGender,
      },
      include: {
        doctor: {
          include: {
            user: true, // Fetch doctor's user info
            location: true, // Fetch location info
          },
        },
        timeSlot: true, // Fetch time slot info
        patient: { select: { name: true, email: true } }, // Fetch patient info
      },
    });

    // Send confirmation email
    // await sendAppointmentConfirmation({
    //   patient: appointment.patient,
    //   doctor: {
    //     name: appointment.doctor.user.name,
    //     email: appointment.doctor.user.email,
    //     consultation_fee: appointment.doctor.consultationFee,
    //     location: appointment.doctor.location?.name,
    //     address: appointment.doctor.location?.address,
    //   },
    //   appointment: {
    //     ...appointment,
    //     start_time: appointment.timeSlot.startTime,
    //     end_time: appointment.timeSlot.endTime,
    //   },
    //   type: appointmentType,
    // });

    return Response.json({ appointment });
  } catch (error) {
    console.error('Error booking appointment:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
