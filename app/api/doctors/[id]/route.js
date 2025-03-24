// app/api/doctors/[id]/route.js
import { prisma } from '@/lib/db'; // Ensure Prisma client is correctly imported

export async function GET(request, { params }) {
  try {
    // Extract params correctly
    const { id: paramId } =await params;
    const id = parseInt(paramId);

    if (isNaN(id)) {
      return Response.json({ error: 'Invalid doctor ID' }, { status: 400 });
    }

    // Fetch doctor details with related data
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                profilePicture: true
              }
            }
          }
        },
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
            address: true,
            city: true,
            state: true
          }
        },
        availability: {
          where: {
            isAvailable: true
          },
          include: {
            timeSlot: {
              select: {
                id: true,
                startTime: true,
                endTime: true
              }
            }
          },
          orderBy: [
            { dayOfWeek: 'asc' },
            { timeSlot: { startTime: 'asc' } }
          ]
        }
      }
    });

    if (!doctor) {
      return Response.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Improved helper function to format time
    const formatTime = (time) => {
      if (!time) return null;
      
      // Convert time to string and ensure proper HH:MM format
      let timeStr = time.toString();
      
      // Handle various time formats that might come from the database
      if (timeStr.includes(':')) {
        // For formats like "09:30:00", extract just the hours and minutes
        const parts = timeStr.split(':');
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
      } else if (timeStr.length <= 2) {
        // For formats that are just hours like "9" or "13"
        return `${timeStr.padStart(2, '0')}:00`;
      } else {
        // Default case - return as is but ensure at least 5 characters (HH:MM)
        return timeStr.slice(0, 5).padStart(5, '0');
      }
    };

    return Response.json({
      doctor: {
        id: doctor.id,
        user_id: doctor.user.id,
        name: doctor.user.name,
        profile_picture: doctor.user.profile?.profilePicture || null,
        degree: doctor.degree,
        experience_years: doctor.experienceYears,
        avg_rating: doctor.avgRating,
        bio: doctor.bio,
        consultation_fee: doctor.consultationFee,
        specialty_id: doctor.specialty?.id || null,
        specialty_name: doctor.specialty?.name || null,
        location_id: doctor.location?.id || null,
        location_name: doctor.location?.name || null,
        address: doctor.location?.address || null,
        city: doctor.location?.city || null,
        state: doctor.location?.state || null
      },
      availability: doctor.availability.map(a => ({
        day_of_week: a.dayOfWeek,
        time_slot_id: a.timeSlot.id,
        start_time: formatTime(a.timeSlot.startTime),
        end_time: formatTime(a.timeSlot.endTime)
      }))
    });
  } catch (error) {
    console.error('Error fetching doctor details:', error);
    return Response.json({ error: 'Failed to fetch doctor details' }, { status: 500 });
  }
}