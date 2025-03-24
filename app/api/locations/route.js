import { prisma } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    
    if (!doctorId || isNaN(parseInt(doctorId))) {
      return Response.json({ error: 'Valid doctor ID is required' }, { status: 400 });
    }

    // Get the doctor with their location
    const doctor = await prisma.doctor.findUnique({
      where: {
        id: parseInt(doctorId)
      },
      include: {
        location: true
      }
    });

    if (!doctor) {
      return Response.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // If doctor has no location, return empty array
    if (!doctor.location) {
      return Response.json({ locations: [] });
    }

    // Return the doctor's location
    return Response.json({ 
      locations: [
        {
          id: doctor.location.id,
          name: doctor.location.name,
          address: doctor.location.address,
          city: doctor.location.city,
          fullAddress: `${doctor.location.name}, ${doctor.location.address}, ${doctor.location.city}`
        }
      ] 
    });
  } catch (error) {
    console.error('Error fetching doctor locations:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}