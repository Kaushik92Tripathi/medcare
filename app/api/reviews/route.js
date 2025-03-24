// app/api/dashboard/appointments/[id]/route.js
import { prisma } from '@/lib/db';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/lib/auth';
import { sendAppointmentStatusUpdate } from '@/lib/email';
// import { verifyAuth } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();

    // const session = await getServerSession(authOptions);

    // if (!session || !['doctor', 'admin'].includes(session.user.role)) {
    //   return Response.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Check if the appointment exists
    const appointment = await prisma.appointment.findUnique({
      where: { id: Number(id) },
      include: {
        patient: { select: { name: true, email: true } },
        doctor: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    if (!appointment) {
      return Response.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // If the user is a doctor, ensure they own the appointment
    if (session.user.role === 'doctor' && appointment.doctor.user.id !== session.user.id) {
      return Response.json({ error: 'Not authorized to update this appointment' }, { status: 403 });
    }

    // Update appointment status
    const updatedAppointment = await prisma.appointment.update({
      where: { id: Number(id) },
      data: { status, updatedAt: new Date() },
    });

    // Send email notification
    await sendAppointmentStatusUpdate({
      patient: appointment.patient,
      doctor: appointment.doctor.user,
      appointment: updatedAppointment,
      status,
    });

    return Response.json({ appointment: updatedAppointment });
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Get reviews for a specific doctor
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = parseInt(searchParams.get('doctorId'));

    if (!doctorId) {
      return Response.json({ error: 'Doctor ID is required' }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { doctorId },
      include: {
        patient: {
          select: {
            name: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return Response.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// Add a new review
export async function POST(request) {
  try {
    // const auth = await verifyAuth(request);
    
    // if (!auth) {
    //   return Response.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { doctorId, rating, comment } = await request.json();

    // Validate input
    if (!doctorId || !rating || rating < 1 || rating > 5) {
      return Response.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Check if user has an appointment with this doctor
    const appointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        patientId: 1,
        // patientId: auth.id,
        status: 'completed'
      }
    });

    if (!appointment) {
      return Response.json(
        { error: 'You can only review doctors after completing an appointment' },
        { status: 403 }
      );
    }

    // Check if user has already reviewed this doctor
    const existingReview = await prisma.review.findFirst({
      where: {
        doctorId,
        patientId: auth.id
      }
    });

    if (existingReview) {
      return Response.json(
        { error: 'You have already reviewed this doctor' },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        doctorId,
        patientId: 1,
        // patientId: auth.id,
        rating,
        comment,
      }
    });

    // Update doctor's average rating
    const allReviews = await prisma.review.findMany({
      where: { doctorId }
    });

    const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
    const reviewCount = allReviews.length;

    await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        avgRating,
        reviewCount
      }
    });

    return Response.json({
      success: true,
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    console.error('Error adding review:', error);
    return Response.json(
      { error: error.message || 'Failed to add review' },
      { status: 500 }
    );
  }
}
