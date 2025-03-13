"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { ChevronDown, ChevronLeft, ChevronRight, Sun, Sunrise, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function BookAppointment() {
  const [selectedDate, setSelectedDate] = useState(0)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("9:30 AM")
  const [appointmentType, setAppointmentType] = useState("video")
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedInstitute, setSelectedInstitute] = useState("MedicareHeart Institute, Okhla Road")
  const dateSliderRef = useRef(null)

  // Extended dates array for scrolling
  const dates = [
    { day: "Thu", date: "22", month: "Dec" },
    { day: "Fri", date: "23", month: "Dec" },
    { day: "Sat", date: "24", month: "Dec" },
    { day: "Sun", date: "25", month: "Dec" },
    { day: "Mon", date: "26", month: "Dec" },
    { day: "Tue", date: "27", month: "Dec" },
    { day: "Wed", date: "28", month: "Dec" },
    { day: "Thu", date: "29", month: "Dec" },
    { day: "Fri", date: "30", month: "Dec" },
    { day: "Sat", date: "31", month: "Dec" },
    { day: "Sun", date: "1", month: "Jan" },
    { day: "Mon", date: "2", month: "Jan" },
    { day: "Tue", date: "3", month: "Jan" },
    { day: "Wed", date: "4", month: "Jan" },
  ]

  const institutes = [
    "MedicareHeart Institute, Okhla Road",
    "City Medical Center, Connaught Place",
    "Apollo Hospital, Sarita Vihar",
    "Max Healthcare, Saket"
  ]

  const morningSlots = [
    { time: "9:00 AM", available: true },
    { time: "9:30 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "10:30 AM", available: true },
    { time: "11:00 AM", available: true },
    { time: "11:30 AM", available: true },
    { time: "12:00 PM", available: true },
    { time: "12:30 PM", available: true },
  ]

  const afternoonSlots = [
    { time: "1:00 PM", available: true },
    { time: "1:30 PM", available: true },
    { time: "2:00 PM", available: true },
    { time: "2:30 PM", available: true },
    { time: "3:00 PM", available: true },
    { time: "3:30 PM", available: true },
    { time: "4:00 PM", available: true },
    { time: "4:30 PM", available: true },
  ]

  const scrollRight = () => {
    if (dateSliderRef.current) {
      (dateSliderRef.current as HTMLElement).scrollBy({ left: 200, behavior: 'smooth' });
    }
  }

  const selectInstitute = (institute: string) => {
    setSelectedInstitute(institute);
    setShowDropdown(false);
  }

  return (
    <div className="h-screen bg-gray-50 h-full">
      <div className="grid md:grid-cols-2 h-full">
        {/* Left Column */}
        <div className="relative flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-primary text-white">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl mb-6">Book Your Next Doctor Visit in Seconds.</h1>
            <p className="text-lg mb-6">
              CareMate helps you find the best healthcare provider by specialty, location, and more, ensuring you get
              the care you need.
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="relative flex items-center justify-center p-6 md:p-8">
          <div className="absolute inset-0">
            <Image
              src="/book.png" // Replace with your actual image path
              alt="Doctor Consultation"
              layout="fill"
              objectFit="cover"
              quality={90}
              priority // Loads faster
            />
          </div>
          <div className="w-full z-10 p-6 bg-white rounded-lg shadow-lg">
            <div className="grid grid-cols-2 gap-4 mb-4 items-center">
              <h2 className="text-xl text-gray-500 mb-4">Schedule Appointment</h2>
              <button className="py-2 mb-4 text-white rounded-md bg-primary hover:bg-primary/90">
                Book Appointment
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                className={`py-2 rounded-md ${
                  appointmentType === "video" ? "text-white bg-primary" : "text-primary bg-white border border-gray-300"
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

            {/* Dropdown for Institute Selection */}
            <div className="mb-4 relative">
              <div 
                className="flex items-center justify-between p-3 border rounded-md cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span>{selectedInstitute}</span>
                <ChevronDown className="w-5 h-5" />
              </div>
              
              {showDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg">
                  {institutes.map((institute, index) => (
                    <div 
                      key={index} 
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectInstitute(institute)}
                    >
                      {institute}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <button className="p-1">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-medium">December 2022</span>
              <button className="p-1">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Horizontal scrollable date picker with right arrow */}
            <div className="relative mb-6">
              <div 
                ref={dateSliderRef}
                className="flex overflow-x-auto pb-1 hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex space-x-2">
                  {dates.map((item, index) => (
                    <button
                      key={index}
                      className={`flex-shrink-0 flex flex-col items-center justify-center p-2 w-16 h-20 text-sm rounded-md ${
                        selectedDate === index ? "bg-primary text-white" : "border"
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
              
              {/* Right arrow button */}
              <button 
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-1"
                onClick={scrollRight}
              >
                <ArrowRight className="w-5 h-5 text-primary" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5" />
                  <span className="font-medium">Morning</span>
                </div>
                <span className="text-sm text-gray-500">2 Slots</span>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {morningSlots.map((slot, index) => (
                  <button
                    key={index}
                    className={`py-2 text-sm rounded-md ${
                      selectedTimeSlot === slot.time ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setSelectedTimeSlot(slot.time)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sunrise className="w-5 h-5" />
                  <span className="font-medium">Afternoon</span>
                </div>
                <span className="text-sm text-gray-500">3 Slots</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {afternoonSlots.map((slot, index) => (
                  <button
                    key={index}
                    className={`py-2 text-sm rounded-md ${
                      selectedTimeSlot === slot.time ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setSelectedTimeSlot(slot.time)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>

            <Link
              href="/appointments/confirm"
              className="block w-full py-3 text-center text-white rounded-md bg-primary hover:bg-primary/90"
            >
              Next
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { ChevronLeft, ChevronRight, Sun, Sunrise, RotateCw, ArrowRightCircle } from "lucide-react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// export default function BookAppointment() {
//   const [selectedDate, setSelectedDate] = useState(0)
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState("9:30 AM")
//   const [appointmentType, setAppointmentType] = useState("video")
//   const [currentDatePage, setCurrentDatePage] = useState(0)
//   const datesPerPage = 5

//   const locations = [
//     "MedicareHeart Institute, Okhla Road",
//     "MedCare Clinic, Connaught Place",
//     "Health Plus Center, Nehru Place",
//     "City Hospital, Karol Bagh",
//   ]

//   const dates = [
//     { day: "Thu", date: "22", month: "Dec" },
//     { day: "Fri", date: "23", month: "Dec" },
//     { day: "Sat", date: "24", month: "Dec" },
//     { day: "Sun", date: "25", month: "Dec" },
//     { day: "Mon", date: "26", month: "Dec" },
//     { day: "Tue", date: "27", month: "Dec" },
//     { day: "Wed", date: "28", month: "Dec" },
//     { day: "Thu", date: "29", month: "Dec" },
//     { day: "Fri", date: "30", month: "Dec" },
//     { day: "Sat", date: "31", month: "Dec" },
//   ]

//   const morningSlots = [
//     { time: "9:00 AM", available: true },
//     { time: "9:30 AM", available: true },
//     { time: "10:00 AM", available: true },
//     { time: "10:30 AM", available: true },
//     { time: "11:00 AM", available: true },
//     { time: "11:30 AM", available: true },
//     { time: "12:00 PM", available: true },
//     { time: "12:30 PM", available: true },
//   ]

//   const afternoonSlots = [
//     { time: "1:00 PM", available: true },
//     { time: "1:30 PM", available: true },
//     { time: "2:00 PM", available: true },
//     { time: "2:30 PM", available: true },
//     { time: "3:00 PM", available: true },
//     { time: "3:30 PM", available: true },
//     { time: "4:00 PM", available: true },
//     { time: "4:30 PM", available: true },
//   ]

//   const nextDatePage = () => {
//     if ((currentDatePage + 1) * datesPerPage < dates.length) {
//       setCurrentDatePage(currentDatePage + 1)
//     } else {
//       setCurrentDatePage(0)
//     }
//   }

//   const visibleDates = dates.slice(
//     currentDatePage * datesPerPage,
//     (currentDatePage * datesPerPage) + datesPerPage
//   )

//   return (
//     <div className="h-screen bg-gray-50">
//       <div className="grid md:grid-cols-2 h-full">
//         {/* Left Column */}
//         <div className="flex flex-col justify-center p-8 md:p-12 bg-primary text-white">
//           <div>
//             <h1 className="text-4xl font-bold md:text-5xl mb-6">Book Your Next Doctor Visit in Seconds.</h1>
//             <p className="text-lg mb-6">
//               CareMate helps you find the best healthcare provider by specialty, location, and more, ensuring you get
//               the care you need.
//             </p>
//           </div>
//         </div>

//         {/* Right Column */}
//         <div className="flex items-center justify-center p-6 md:p-8">
          
//           <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
//             <div className="grid grid-cols-2 gap-4 mb-4 items-center">
//               <h2 className="text-xl text-gray-500 mb-4">Schedule Appointment</h2>
//               <button className="py-2 mb-4 text-white rounded-md bg-primary hover:bg-primary/90">
//                 Book Appointment
//               </button>
//             </div>

//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <button
//                 className={`py-2 rounded-md ${
//                   appointmentType === "video" ? "text-white bg-primary" : "text-primary bg-white border border-gray-300"
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

//             <div className="mb-4">
//               <Select>
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Select location" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {locations.map((location) => (
//                     <SelectItem key={location} value={location}>
//                       {location}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="flex items-center justify-center gap-4 mb-4">
//               <button className="p-1 hover:bg-gray-100 rounded-full">
//                 <ChevronLeft className="w-5 h-5" />
//               </button>
//               <span className="font-medium">December 2022</span>
//               <button className="p-1 hover:bg-gray-100 rounded-full">
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="relative mb-6">
              
//               <div className="flex items-center justify-between gap-2">
//                 <div className="flex flex-1 justify-between">
//                   {visibleDates.map((item, index) => (
//                     <button
//                       key={index}
//                       className={`flex flex-col items-center justify-center p-2 text-sm rounded-md ${
//                         selectedDate === index + (currentDatePage * datesPerPage) 
//                           ? "bg-primary text-white" 
//                           : "border hover:border-primary"
//                       }`}
//                       onClick={() => setSelectedDate(index + (currentDatePage * datesPerPage))}
//                     >
//                       <span>{item.day}</span>
//                       <span className="text-lg font-semibold">{item.date}</span>
//                       <span>{item.month}</span>
//                     </button>
//                   ))}
//                 </div>
//                 <button 
//                   className="p-2   hover:border-primary"
//                   onClick={nextDatePage}
//                 >
//                   <ArrowRightCircle className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>

//             <div className="mb-6">
//               <div className="flex items-center justify-between mb-2">
//                 <div className="flex items-center gap-2">
//                   <Sun className="w-5 h-5" />
//                   <span className="font-medium">Morning</span>
//                 </div>
//                 <span className="text-sm text-gray-500">2 Slots</span>
//               </div>

//               <div className="grid grid-cols-4 gap-2 mb-4">
//                 {morningSlots.map((slot, index) => (
//                   <button
//                     key={index}
//                     className={`py-2 text-sm rounded-md ${
//                       selectedTimeSlot === slot.time ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
//                     }`}
//                     onClick={() => setSelectedTimeSlot(slot.time)}
//                   >
//                     {slot.time}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="mb-6">
//               <div className="flex items-center justify-between mb-2">
//                 <div className="flex items-center gap-2">
//                   <Sunrise className="w-5 h-5" />
//                   <span className="font-medium">Afternoon</span>
//                 </div>
//                 <span className="text-sm text-gray-500">3 Slots</span>
//               </div>

//               <div className="grid grid-cols-4 gap-2">
//                 {afternoonSlots.map((slot, index) => (
//                   <button
//                     key={index}
//                     className={`py-2 text-sm rounded-md ${
//                       selectedTimeSlot === slot.time ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
//                     }`}
//                     onClick={() => setSelectedTimeSlot(slot.time)}
//                   >
//                     {slot.time}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <Link
//               href="/appointments/confirm"
//               className="block w-full py-3 text-center text-white rounded-md bg-primary hover:bg-primary/90"
//             >
//               Next
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }