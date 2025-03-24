// app/api/admin/doctors/route.js
import { prisma } from '@/lib/db'; // Ensure prisma client is correctly imported
import bcrypt from 'bcrypt';
// import { verifyAuth } from '@/lib/auth';

export async function POST(request) {
  try {
    // // Verify admin authentication using JWT
    // const auth = await verifyAuth(request);
    
    // if (!auth || auth.role !== 'admin') {
    //   return Response.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Parse request data
    const {
      name,
      email,
      password,
      specialty_id,
      degree,
      experience_years,
      bio,
      location_id,
      consultation_fee,
    } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !specialty_id || !degree || !experience_years) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use Prisma Transaction to create user and doctor together
    const doctor = await prisma.$transaction(async (prisma) => {
      // Create user first
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'doctor',
        },
      });

      // Create doctor profile
      const doctorProfile = await prisma.doctor.create({
        data: {
          userId: user.id,
          specialtyId: parseInt(specialty_id),
          degree,
          experienceYears: parseInt(experience_years),
          bio,
          locationId: location_id ? parseInt(location_id) : null,
          consultationFee: consultation_fee ? parseFloat(consultation_fee) : null,
          isAvailable: true,
          avgRating: 0,
          reviewCount: 0,
        },
      });

      // Fetch all available time slots
      const timeSlots = await prisma.timeSlot.findMany({
        select: { id: true },
      });

      // Create default availability (Mon-Fri, 9AM-5PM)
      const availabilityData = [];
      for (let day = 1; day <= 5; day++) {
        for (const slot of timeSlots) {
          availabilityData.push({
            doctorId: doctorProfile.id,
            dayOfWeek: day,
            timeSlotId: slot.id,
            isAvailable: true,
          });
        }
      }

      await prisma.doctorAvailability.createMany({
        data: availabilityData,
      });

      return doctorProfile;
    });

    return Response.json({
      success: true,
      message: 'Doctor created successfully',
      doctorId: doctor.id,
    });
  } catch (error) {
    console.error('Error creating doctor:', error);
    return Response.json(
      { error: error.message || 'Failed to create doctor' },
      { status: 500 }
    );
  }
}
