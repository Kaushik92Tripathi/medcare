"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Upload, User, Mail, Phone, MapPin, GraduationCap, Stethoscope } from "lucide-react"

export default function CreateDoctor() {
  const [doctorDetails, setDoctorDetails] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    qualification: "",
    experience: "",
    address: "",
    bio: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setDoctorDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the form data to your backend
    console.log("Doctor details:", doctorDetails)
    // Redirect to admin dashboard
    window.location.href = "/admin/dashboard"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-3xl mx-auto">
          <Link href="/admin/dashboard" className="flex items-center mb-6 text-primary hover:underline">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </Link>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h1 className="mb-6 text-2xl font-bold">Create New Doctor</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg border-gray-300">
                <div className="w-32 h-32 mb-4 overflow-hidden bg-gray-100 rounded-full">
                  <img
                    src="/placeholder.svg?height=128&width=128&text=Upload"
                    alt="Doctor profile"
                    className="object-cover w-full h-full"
                  />
                </div>
                <button
                  type="button"
                  className="flex items-center px-4 py-2 text-sm text-white rounded-md bg-primary hover:bg-primary/90"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </button>
                <p className="mt-2 text-xs text-gray-500">Recommended: Square JPG, PNG. Max 2MB.</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
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
                      value={doctorDetails.name}
                      onChange={handleChange}
                      placeholder="Enter doctor's full name"
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
                      value={doctorDetails.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="w-full h-10 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
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
                      value={doctorDetails.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full h-10 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="specialty" className="text-sm font-medium">
                    Specialty
                  </label>
                  <div className="relative">
                    <Stethoscope className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <select
                      id="specialty"
                      name="specialty"
                      value={doctorDetails.specialty}
                      onChange={handleChange}
                      className="w-full h-10 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    >
                      <option value="">Select specialty</option>
                      <option value="dentist">Dentist</option>
                      <option value="cardiologist">Cardiologist</option>
                      <option value="dermatologist">Dermatologist</option>
                      <option value="neurologist">Neurologist</option>
                      <option value="orthopedic">Orthopedic</option>
                      <option value="pediatrician">Pediatrician</option>
                      <option value="psychiatrist">Psychiatrist</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="qualification" className="text-sm font-medium">
                    Qualification
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                      id="qualification"
                      name="qualification"
                      type="text"
                      value={doctorDetails.qualification}
                      onChange={handleChange}
                      placeholder="E.g., MBBS, MD, BDS"
                      className="w-full h-10 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="experience" className="text-sm font-medium">
                    Experience (Years)
                  </label>
                  <input
                    id="experience"
                    name="experience"
                    type="number"
                    value={doctorDetails.experience}
                    onChange={handleChange}
                    placeholder="Enter years of experience"
                    className="w-full h-10 px-4 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="address" className="text-sm font-medium">
                  Clinic/Hospital Address
                </label>
                <div className="relative">
                  <MapPin className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={doctorDetails.address}
                    onChange={handleChange}
                    placeholder="Enter clinic or hospital address"
                    className="w-full h-10 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="bio" className="text-sm font-medium">
                  Professional Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={doctorDetails.bio}
                  onChange={handleChange}
                  placeholder="Write a professional bio for the doctor"
                  className="w-full h-32 p-4 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="flex-1 py-2 text-white rounded-md bg-primary hover:bg-primary/90">
                  Create Doctor
                </button>
                <button
                  type="button"
                  className="flex-1 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

