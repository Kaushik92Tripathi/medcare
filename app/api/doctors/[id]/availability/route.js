import { prisma } from '@/lib/db';
import { format, addDays, startOfDay, endOfDay } from 'date-fns';

export async function GET(request, { params }) {
  try {
    const { id: paramId } =await  params;
    const id = parseInt(paramId);
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    if (isNaN(id)) {
      return Response.json({ error: 'Invalid doctor ID' }, { status: 400 });
    }

    // Get the date to fetch availability for
    const date = dateParam ? new Date(dateParam) : new Date();
    const startDate = startOfDay(date);
    const endDate = startOfDay(addDays(date, 14)); // Get next 14 days

    // Fetch doctor's availability pattern
    const availability = await prisma.doctorAvailability.findMany({
      where: {
        doctorId: id,
        isAvailable: true,
      },
      include: {
        timeSlot: true
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { timeSlot: { startTime: 'asc' } }
      ]
    });

    // Fetch booked appointments for the date range
    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        doctorId: id,
        appointmentDate: {
          gte: startDate,
          lt: endOfDay(endDate),
        },
        status: {
          not: 'cancelled'
        }
      },
      select: {
        appointmentDate: true,
        timeSlotId: true,
      }
    });

    // Create a map of booked slots by date and time slot ID
    const bookedSlots = new Map();
    bookedAppointments.forEach(appointment => {
      const dateKey = format(appointment.appointmentDate, 'yyyy-MM-dd');
      if (!bookedSlots.has(dateKey)) {
        bookedSlots.set(dateKey, new Set());
      }
      bookedSlots.get(dateKey).add(appointment.timeSlotId);
    });

    // Group time slots by day
    const availabilityByDay = availability.reduce((acc, slot) => {
      const day = slot.dayOfWeek;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push({
        id: slot.timeSlot.id,
        startTime: formatTime(slot.timeSlot.startTime),
        endTime: formatTime(slot.timeSlot.endTime),
        isAvailable: true
      });
      return acc;
    }, {});

    // Get all dates in the range with their available slots
    const dates = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      const bookedSlotsForDate = bookedSlots.get(dateKey) || new Set();
      
      // Get available slots for this day and mark them as booked if necessary
      const timeSlots = (availabilityByDay[dayOfWeek] || []).map(slot => ({
        ...slot,
        isAvailable: !bookedSlotsForDate.has(slot.id)
      }));

      dates.push({
        date: format(currentDate, 'dd'),
        day: format(currentDate, 'EEE'),
        month: format(currentDate, 'MMM'),
        fullDate: format(currentDate, 'yyyy-MM-dd'),
        timeSlots
      });

      currentDate = addDays(currentDate, 1);
    }

    return Response.json({ dates });
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    return Response.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}

// Helper function to format time
function formatTime(time) {
  if (!time) return null;
  
  // Ensure time is a proper Date object
  const date = time instanceof Date ? time : new Date(time);
  
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', time);
    return null;
  }
  
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  
  return `${displayHour}:${minutes} ${period}`;
}