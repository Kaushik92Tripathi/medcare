"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sun,
  Sunrise,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface DateSlot {
  date: string;
  day: string;
  month: string;
  fullDate: string;
  timeSlots: TimeSlot[];
}

interface DoctorDetails {
  id: number;
  name: string;
  specialty_name: string;
  location_name: string;
  consultation_fee: string;
}

interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  fullAddress: string;
}

export default function BookAppointment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);
  const [appointmentType, setAppointmentType] = useState("video");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dates, setDates] = useState<DateSlot[]>([]);
  const [doctorDetails, setDoctorDetails] = useState<DoctorDetails | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  
  const dateSliderRef = useRef(null);

  // Define all possible time slots
  const allMorningSlots = [
    { time: "9:00 AM" },
    { time: "9:30 AM" },
    { time: "10:00 AM" },
    { time: "10:30 AM" },
    { time: "11:00 AM" },
    { time: "11:30 AM" },
    { time: "12:00 PM" },
    { time: "12:30 PM" },
  ];

  const allAfternoonSlots = [
    { time: "1:00 PM" },
    { time: "1:30 PM" },
    { time: "2:00 PM" },
    { time: "2:30 PM" },
    { time: "3:00 PM" },
    { time: "3:30 PM" },
    { time: "4:00 PM" },
    { time: "4:30 PM" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Doctor ID is required");
        setLoading(false);
        return;
      }

      try {
        // Fetch doctor details
        const doctorResponse = await fetch(`/api/doctors/${id}`);
        const doctorData = await doctorResponse.json();

        if (!doctorResponse.ok) {
          throw new Error(doctorData.error || "Failed to fetch doctor details");
        }

        setDoctorDetails(doctorData.doctor);

        // Fetch doctor's locations
        const locationsResponse = await fetch(`/api/locations?doctorId=${id}`);
        const locationsData = await locationsResponse.json();

        if (!locationsResponse.ok) {
          throw new Error(locationsData.error || "Failed to fetch locations");
        }

        setLocations(locationsData.locations);
        if (locationsData.locations.length > 0) {
          setSelectedLocation(locationsData.locations[0]);
        }

        // Fetch availability
        const today = new Date();
        const availabilityResponse = await fetch(
          `/api/doctors/${id}/availability?date=${format(today, 'yyyy-MM-dd')}`
        );
        const availabilityData = await availabilityResponse.json();

        if (!availabilityResponse.ok) {
          throw new Error(availabilityData.error || "Failed to fetch availability");
        }

        setDates(availabilityData.dates);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    // Reset selected time slot when date changes
    setSelectedTimeSlot(null);
  }, [selectedDate]);

  const scrollRight = () => {
    if (dateSliderRef.current) {
      (dateSliderRef.current as HTMLElement).scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  const selectLocation = (location: Location) => {
    setSelectedLocation(location);
    setShowDropdown(false);
  };

  // Get current selected date's time slots
  const currentTimeSlots = dates[selectedDate]?.timeSlots || [];

  // Map the available slots to our fixed slot UI format
  const morningSlots = allMorningSlots.map(slot => {
    const matchingSlot = currentTimeSlots.find(ts => ts.startTime === slot.time);
    return {
      id: matchingSlot?.id || -1,
      startTime: slot.time,
      endTime: matchingSlot?.endTime || slot.time,
      isAvailable: matchingSlot ? matchingSlot.isAvailable : false
    };
  });

  const afternoonSlots = allAfternoonSlots.map(slot => {
    const matchingSlot = currentTimeSlots.find(ts => ts.startTime === slot.time);
    return {
      id: matchingSlot?.id || -1,
      startTime: slot.time,
      endTime: matchingSlot?.endTime || slot.time,
      isAvailable: matchingSlot ? matchingSlot.isAvailable : false
    };
  });

  const handleContinue = () => {
    if (!selectedTimeSlot || !doctorDetails || !selectedLocation) {
      setError("Please select a time slot and location");
      return;
    }

    // Instead of making API call, navigate to confirmation page with query params
    const appointmentParams = new URLSearchParams({
      doctorId: doctorDetails.id.toString(),
      doctorName: doctorDetails.name,
      specialty: doctorDetails.specialty_name,
      date: dates[selectedDate].fullDate,
      time: currentTimeSlots.find(slot => slot.id === selectedTimeSlot)?.startTime || "",
      timeSlotId: selectedTimeSlot.toString(),
      appointmentType: appointmentType,
      locationId: selectedLocation.id.toString(),
      locationName: selectedLocation.name,
      locationAddress: selectedLocation.fullAddress
    });

    router.push(`/appointments/confirm?${appointmentParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 h-full">
      <div className="grid md:grid-cols-2 h-full">
        {/* Left Column */}
        <div className="relative flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-primary text-white">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl mb-6">
              Book Your Next Doctor Visit in Seconds.
            </h1>
            <p className="text-lg mb-6">
              CareMate helps you find the best healthcare provider by specialty,
              location, and more, ensuring you get the care you need.
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="relative flex items-center justify-center p-6 md:p-8">
          <div className="absolute inset-0">
            <Image
              src="/book.png"
              alt="Doctor Consultation"
              layout="fill"
              objectFit="cover"
              quality={90}
              priority
            />
          </div>
          <div className="w-full z-10 p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-gray-500">Schedule Appointment</h2>
              {doctorDetails && (
                <div className="text-sm text-gray-500">
                  Dr. {doctorDetails.name} - {doctorDetails.specialty_name}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                className={`py-2 rounded-md ${
                  appointmentType === "video"
                    ? "text-white bg-primary"
                    : "text-primary bg-white border border-gray-300"
                }`}
                onClick={() => setAppointmentType("video")}
              >
                Book Video Consult
              </button>
              <button
                className={`py-2 rounded-md ${
                  appointmentType === "hospital"
                    ? "text-white bg-primary"
                    : "text-primary bg-white border border-gray-300"
                }`}
                onClick={() => setAppointmentType("hospital")}
              >
                Book Hospital Visit
              </button>
            </div>

            {/* Location Dropdown */}
            {locations.length > 0 && (
              <div className="mb-4 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div
                  className="flex items-center justify-between p-3 border rounded-md cursor-pointer"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span>{selectedLocation?.fullAddress || "Select a location"}</span>
                  <ChevronDown className="w-5 h-5" />
                </div>

                {showDropdown && (
                  <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg">
                    {locations.map((location) => (
                      <div
                        key={location.id}
                        className="p-3 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectLocation(location)}
                      >
                        {location.fullAddress}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <button className="p-1">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-medium">
                {dates[selectedDate]?.month} {new Date().getFullYear()}
              </span>
              <button className="p-1">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Horizontal scrollable date picker */}
            <div className="relative mb-6">
              <div
                ref={dateSliderRef}
                className="flex overflow-x-auto pb-1 hide-scrollbar"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <div className="flex space-x-2">
                  {dates.map((item, index) => (
                    <button
                      key={index}
                      className={`flex-shrink-0 flex flex-col items-center justify-center p-2 w-16 h-20 text-sm rounded-md ${
                        selectedDate === index
                          ? "bg-primary text-white"
                          : "border"
                      }`}
                      onClick={() => setSelectedDate(index)}
                    >
                      <span>{item.day}</span>
                      <span className="text-lg font-bold">{item.date}</span>
                      <span>{item.month}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-1"
                onClick={scrollRight}
              >
                <ArrowRight className="w-5 h-5 text-primary" />
              </button>
            </div>

            {/* Morning slots */}
            {morningSlots.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sun className="w-5 h-5" />
                    <span className="font-medium">Morning</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {morningSlots.filter(slot => slot.isAvailable).length} Slots Available
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  {morningSlots.map((slot) => (
                    <button
                      key={`morning-${slot.startTime}`}
                      className={`py-2 text-sm rounded-md ${
                        selectedTimeSlot === slot.id
                          ? "bg-primary text-white"
                          : slot.isAvailable
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={() => slot.isAvailable && setSelectedTimeSlot(slot.id)}
                      disabled={!slot.isAvailable}
                    >
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Afternoon slots */}
            {afternoonSlots.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sunrise className="w-5 h-5" />
                    <span className="font-medium">Afternoon</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {afternoonSlots.filter(slot => slot.isAvailable).length} Slots Available
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {afternoonSlots.map((slot) => (
                    <button
                      key={`afternoon-${slot.startTime}`}
                      className={`py-2 text-sm rounded-md ${
                        selectedTimeSlot === slot.id
                          ? "bg-primary text-white"
                          : slot.isAvailable
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
    : "bg-gray-100 text-gray-400 cursor-not-allowed"
}`}
                      onClick={() => slot.isAvailable && setSelectedTimeSlot(slot.id)}
                      disabled={!slot.isAvailable}
                    >
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleContinue}
              disabled={!selectedTimeSlot}
              className={`block w-full py-3 text-center rounded-md ${
                selectedTimeSlot
                  ? "text-white bg-primary hover:bg-primary/90"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import {
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   Sun,
//   Sunrise,
//   ArrowRight,
// } from "lucide-react";
// import Image from "next/image";
// import { format } from "date-fns";

// interface TimeSlot {
//   id: number;
//   startTime: string;
//   endTime: string;
//   isAvailable: boolean;
// }

// interface DateSlot {
//   date: string;
//   day: string;
//   month: string;
//   fullDate: string;
//   timeSlots: TimeSlot[];
// }

// interface DoctorDetails {
//   id: number;
//   name: string;
//   specialty_name: string;
//   location_name: string;
//   consultation_fee: string;
// }

// interface Location {
//   id: number;
//   name: string;
//   address: string;
//   city: string;
//   fullAddress: string;
// }

// export default function BookAppointment() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const id = searchParams.get("id");
  
//   const [selectedDate, setSelectedDate] = useState(0);
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);
//   const [appointmentType, setAppointmentType] = useState("video");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [dates, setDates] = useState<DateSlot[]>([]);
//   const [doctorDetails, setDoctorDetails] = useState<DoctorDetails | null>(null);
//   const [locations, setLocations] = useState<Location[]>([]);
  
//   const dateSliderRef = useRef(null);

//   // Define all possible time slots
//   const allMorningSlots = [
//     { time: "9:00 AM" },
//     { time: "9:30 AM" },
//     { time: "10:00 AM" },
//     { time: "10:30 AM" },
//     { time: "11:00 AM" },
//     { time: "11:30 AM" },
//     { time: "12:00 PM" },
//     { time: "12:30 PM" },
//   ];

//   const allAfternoonSlots = [
//     { time: "1:00 PM" },
//     { time: "1:30 PM" },
//     { time: "2:00 PM" },
//     { time: "2:30 PM" },
//     { time: "3:00 PM" },
//     { time: "3:30 PM" },
//     { time: "4:00 PM" },
//     { time: "4:30 PM" },
//   ];

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!id) {
//         setError("Doctor ID is required");
//         setLoading(false);
//         return;
//       }

//       try {
//         // Fetch doctor details
//         const doctorResponse = await fetch(`/api/doctors/${id}`);
//         const doctorData = await doctorResponse.json();

//         if (!doctorResponse.ok) {
//           throw new Error(doctorData.error || "Failed to fetch doctor details");
//         }

//         setDoctorDetails(doctorData.doctor);

//         // Fetch doctor's locations
//         const locationsResponse = await fetch(`/api/locations?doctorId=${id}`);
//         const locationsData = await locationsResponse.json();

//         if (!locationsResponse.ok) {
//           throw new Error(locationsData.error || "Failed to fetch locations");
//         }

//         setLocations(locationsData.locations);
//         if (locationsData.locations.length > 0) {
//           setSelectedLocation(locationsData.locations[0]);
//         }

//         // Fetch availability
//         const today = new Date();
//         const availabilityResponse = await fetch(
//           `/api/doctors/${id}/availability?date=${format(today, 'yyyy-MM-dd')}`
//         );
//         const availabilityData = await availabilityResponse.json();

//         if (!availabilityResponse.ok) {
//           throw new Error(availabilityData.error || "Failed to fetch availability");
//         }

//         setDates(availabilityData.dates);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Failed to fetch data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   useEffect(() => {
//     // Reset selected time slot when date changes
//     setSelectedTimeSlot(null);
//   }, [selectedDate]);

//   const scrollRight = () => {
//     if (dateSliderRef.current) {
//       (dateSliderRef.current as HTMLElement).scrollBy({
//         left: 200,
//         behavior: "smooth",
//       });
//     }
//   };

//   const selectLocation = (location: Location) => {
//     setSelectedLocation(location);
//     setShowDropdown(false);
//   };

//   // Get current selected date's time slots
//   const currentTimeSlots = dates[selectedDate]?.timeSlots || [];

//   // Map the available slots to our fixed slot UI format
//   const morningSlots = allMorningSlots.map(slot => {
//     const matchingSlot = currentTimeSlots.find(ts => ts.startTime === slot.time);
//     return {
//       id: matchingSlot?.id || -1,
//       startTime: slot.time,
//       endTime: matchingSlot?.endTime || slot.time,
//       isAvailable: matchingSlot ? matchingSlot.isAvailable : false
//     };
//   });

//   const afternoonSlots = allAfternoonSlots.map(slot => {
//     const matchingSlot = currentTimeSlots.find(ts => ts.startTime === slot.time);
//     return {
//       id: matchingSlot?.id || -1,
//       startTime: slot.time,
//       endTime: matchingSlot?.endTime || slot.time,
//       isAvailable: matchingSlot ? matchingSlot.isAvailable : false
//     };
//   });

//   const handleBooking = async () => {
//     if (!selectedTimeSlot || !doctorDetails || !selectedLocation) {
//       setError("Please select a time slot and location");
//       return;
//     }

//     try {
//       const response = await fetch('/api/appointments', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           doctorId: doctorDetails.id,
//           date: dates[selectedDate].fullDate, // Use the full date format
//           timeSlotId: selectedTimeSlot,
//           appointmentType: appointmentType,
//           locationId: selectedLocation.id
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to book appointment');
//       }

//       // Redirect to confirmation page
//       router.push(`/appointments/confirmation/${data.appointmentId}`);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to book appointment');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">Loading...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center text-red-600">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen bg-gray-50 h-full">
//       <div className="grid md:grid-cols-2 h-full">
//         {/* Left Column */}
//         <div className="relative flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-primary text-white">
//           <div className="max-w-md">
//             <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl mb-6">
//               Book Your Next Doctor Visit in Seconds.
//             </h1>
//             <p className="text-lg mb-6">
//               CareMate helps you find the best healthcare provider by specialty,
//               location, and more, ensuring you get the care you need.
//             </p>
//           </div>
//         </div>

//         {/* Right Column */}
//         <div className="relative flex items-center justify-center p-6 md:p-8">
//           <div className="absolute inset-0">
//             <Image
//               src="/book.png"
//               alt="Doctor Consultation"
//               layout="fill"
//               objectFit="cover"
//               quality={90}
//               priority
//             />
//           </div>
//           <div className="w-full z-10 p-6 bg-white rounded-lg shadow-lg">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl text-gray-500">Schedule Appointment</h2>
//               {doctorDetails && (
//                 <div className="text-sm text-gray-500">
//                   Dr. {doctorDetails.name} - {doctorDetails.specialty_name}
//                 </div>
//               )}
//             </div>

//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <button
//                 className={`py-2 rounded-md ${
//                   appointmentType === "video"
//                     ? "text-white bg-primary"
//                     : "text-primary bg-white border border-gray-300"
//                 }`}
//                 onClick={() => setAppointmentType("video")}
//               >
//                 Book Video Consult
//               </button>
//               <button
//                 className={`py-2 rounded-md ${
//                   appointmentType === "hospital"
//                     ? "text-white bg-primary"
//                     : "text-primary bg-white border border-gray-300"
//                 }`}
//                 onClick={() => setAppointmentType("hospital")}
//               >
//                 Book Hospital Visit
//               </button>
//             </div>

//             {/* Location Dropdown */}
//             {locations.length > 0 && (
//               <div className="mb-4 relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Location
//                 </label>
//                 <div
//                   className="flex items-center justify-between p-3 border rounded-md cursor-pointer"
//                   onClick={() => setShowDropdown(!showDropdown)}
//                 >
//                   <span>{selectedLocation?.fullAddress || "Select a location"}</span>
//                   <ChevronDown className="w-5 h-5" />
//                 </div>

//                 {showDropdown && (
//                   <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg">
//                     {locations.map((location) => (
//                       <div
//                         key={location.id}
//                         className="p-3 hover:bg-gray-100 cursor-pointer"
//                         onClick={() => selectLocation(location)}
//                       >
//                         {location.fullAddress}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             <div className="flex items-center justify-between mb-4">
//               <button className="p-1">
//                 <ChevronLeft className="w-5 h-5" />
//               </button>
//               <span className="font-medium">
//                 {dates[selectedDate]?.month} {new Date().getFullYear()}
//               </span>
//               <button className="p-1">
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Horizontal scrollable date picker */}
//             <div className="relative mb-6">
//               <div
//                 ref={dateSliderRef}
//                 className="flex overflow-x-auto pb-1 hide-scrollbar"
//                 style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//               >
//                 <div className="flex space-x-2">
//                   {dates.map((item, index) => (
//                     <button
//                       key={index}
//                       className={`flex-shrink-0 flex flex-col items-center justify-center p-2 w-16 h-20 text-sm rounded-md ${
//                         selectedDate === index
//                           ? "bg-primary text-white"
//                           : "border"
//                       }`}
//                       onClick={() => setSelectedDate(index)}
//                     >
//                       <span>{item.day}</span>
//                       <span className="text-lg font-bold">{item.date}</span>
//                       <span>{item.month}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <button
//                 className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-1"
//                 onClick={scrollRight}
//               >
//                 <ArrowRight className="w-5 h-5 text-primary" />
//               </button>
//             </div>

//             {/* Morning slots */}
//             {morningSlots.length > 0 && (
//               <div className="mb-6">
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex items-center gap-2">
//                     <Sun className="w-5 h-5" />
//                     <span className="font-medium">Morning</span>
//                   </div>
//                   <span className="text-sm text-gray-500">
//                     {morningSlots.filter(slot => slot.isAvailable).length} Slots Available
//                   </span>
//                 </div>

//                 <div className="grid grid-cols-4 gap-2 mb-4">
//                   {morningSlots.map((slot) => (
//                     <button
//                       key={`morning-${slot.startTime}`}
//                       className={`py-2 text-sm rounded-md ${
//                         selectedTimeSlot === slot.id
//                           ? "bg-primary text-white"
//                           : slot.isAvailable
//                           ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                           : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                       }`}
//                       onClick={() => slot.isAvailable && setSelectedTimeSlot(slot.id)}
//                       disabled={!slot.isAvailable}
//                     >
//                       {slot.startTime}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Afternoon slots */}
//             {afternoonSlots.length > 0 && (
//               <div className="mb-6">
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex items-center gap-2">
//                     <Sunrise className="w-5 h-5" />
//                     <span className="font-medium">Afternoon</span>
//                   </div>
//                   <span className="text-sm text-gray-500">
//                     {afternoonSlots.filter(slot => slot.isAvailable).length} Slots Available
//                   </span>
//                 </div>

//                 <div className="grid grid-cols-4 gap-2">
//                   {afternoonSlots.map((slot) => (
//                     <button
//                       key={`afternoon-${slot.startTime}`}
//                       className={`py-2 text-sm rounded-md ${
//                         selectedTimeSlot === slot.id
//                           ? "bg-primary text-white"
//                           : slot.isAvailable
//                           ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                           : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                       }`}
//                       onClick={() => slot.isAvailable && setSelectedTimeSlot(slot.id)}
//                       disabled={!slot.isAvailable}
//                     >
//                       {slot.startTime}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <button
//               onClick={handleBooking}
//               disabled={!selectedTimeSlot}
//               className={`block w-full py-3 text-center rounded-md ${
//                 selectedTimeSlot
//                   ? "text-white bg-primary hover:bg-primary/90"
//                   : "bg-gray-200 text-gray-500 cursor-not-allowed"
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }