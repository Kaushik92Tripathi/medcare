"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, User, Phone, Mail, FileText } from "lucide-react"

export default function ConfirmAppointment() {
  const [appointmentDetails, setAppointmentDetails] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    problem: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setAppointmentDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the form data to your backend
    console.log("Appointment details:", appointmentDetails)
    // Redirect to confirmation page
    window.location.href = "/appointments/success"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-2xl mx-auto">
          <Link href="/appointments/book" className="flex items-center mb-6 text-primary hover:underline">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Appointment Booking
          </Link>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h1 className="mb-6 text-2xl font-bold">Confirm Appointment Details</h1>

            <div className="p-4 mb-6 bg-gray-50 rounded-md">
              <h2 className="mb-2 text-lg font-medium">Appointment Summary</h2>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-medium">Dr. Jane Doe, MBBS</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium">Thu, 22 Dec 2022 at 9:30 AM</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Appointment Type</p>
                  <p className="font-medium">Video Consultation</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">MedicareHeart Institute, Okhla Road</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-medium">Patient Information</h2>

              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={appointmentDetails.name}
                    onChange={handleChange}
                    placeholder="Enter patient's full name"
                    className="w-full h-10 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="age" className="text-sm font-medium">
                    Age
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    value={appointmentDetails.age}
                    onChange={handleChange}
                    placeholder="Enter age"
                    className="w-full h-10 px-4 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="gender" className="text-sm font-medium">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={appointmentDetails.gender}
                    onChange={handleChange}
                    className="w-full h-10 px-4 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={appointmentDetails.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full h-10 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={appointmentDetails.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="w-full h-10 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="problem" className="text-sm font-medium">
                  Health Problem (Optional)
                </label>
                <div className="relative">
                  <FileText className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
                  <textarea
                    id="problem"
                    name="problem"
                    value={appointmentDetails.problem}
                    onChange={handleChange}
                    placeholder="Briefly describe your health problem"
                    className="w-full h-24 pl-10 pr-4 pt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="pt-4 mt-4 border-t">
                <button type="submit" className="w-full py-3 text-white rounded-md bg-primary hover:bg-primary/90">
                  Confirm Appointment
                </button>
                <p className="mt-2 text-xs text-center text-gray-500">
                  By confirming this appointment, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

