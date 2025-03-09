"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Sun, Sunrise } from "lucide-react"
import Image from "next/image"

export default function BookAppointment() {
  const [selectedDate, setSelectedDate] = useState(0)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("9:30 AM")
  const [appointmentType, setAppointmentType] = useState("video")

  const dates = [
    { day: "Thu", date: "22", month: "Dec" },
    { day: "Fri", date: "23", month: "Dec" },
    { day: "Sat", date: "24", month: "Dec" },
    { day: "Sun", date: "25", month: "Dec" },
    { day: "Mon", date: "26", month: "Dec" },
    { day: "Tue", date: "27", month: "Dec" },
    { day: "Wed", date: "28", month: "Dec" },
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid md:grid-cols-2">
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
              className="rounded-lg"
            />
          </div>
          <div className="w-full z-10  p-6 bg-white rounded-lg shadow-lg">
            <div className="grid grid-cols-2 gap-4 mb-4 items-center">

            <h2 className="text-xl text-gray-500 mb-4 ">Schedule Appointment</h2>

            <button className=" py-2 mb-4 text-white rounded-md bg-primary hover:bg-primary/90">
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

            <div className="mb-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <span>MedicareHeart Institute, Okhla Road</span>
                <ChevronRight className="w-5 h-5" />
              </div>
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

            <div className="grid grid-cols-7 gap-2 mb-6">
              {dates.map((item, index) => (
                <button
                  key={index}
                  className={`flex flex-col items-center justify-center p-2 text-sm rounded-md ${
                    selectedDate === index ? "bg-primary text-white" : "border"
                  }`}
                  onClick={() => setSelectedDate(index)}
                >
                  <span>{item.day}</span>
                  <span>{item.date}</span>
                  <span>{item.month}</span>
                </button>
              ))}
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

