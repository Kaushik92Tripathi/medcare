"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Clock, CheckCircle, XCircle, Plus, Search, MoreHorizontal } from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("appointments")

  // Mock data for appointments
  const appointments = [
    {
      id: 1,
      patient: "John Smith",
      doctor: "Dr. Jane Doe",
      date: "22 Dec 2022",
      time: "9:30 AM",
      type: "Video Consultation",
      status: "Pending",
    },
    {
      id: 2,
      patient: "Sarah Johnson",
      doctor: "Dr. Sam Wilson",
      date: "22 Dec 2022",
      time: "10:30 AM",
      type: "Hospital Visit",
      status: "Confirmed",
    },
    {
      id: 3,
      patient: "Michael Brown",
      doctor: "Dr. Pepper Potts",
      date: "23 Dec 2022",
      time: "11:00 AM",
      type: "Video Consultation",
      status: "Cancelled",
    },
    {
      id: 4,
      patient: "Emily Davis",
      doctor: "Dr. Tony Stark",
      date: "23 Dec 2022",
      time: "2:30 PM",
      type: "Hospital Visit",
      status: "Pending",
    },
    {
      id: 5,
      patient: "David Wilson",
      doctor: "Dr. Meghan",
      date: "24 Dec 2022",
      time: "9:00 AM",
      type: "Video Consultation",
      status: "Confirmed",
    },
  ]

  // Mock data for doctors
  const doctors = [
    {
      id: 1,
      name: "Dr. Jane Doe",
      specialty: "Dentist",
      qualification: "MBBS",
      experience: "5 Years",
      patients: 120,
      rating: 4.8,
    },
    {
      id: 2,
      name: "Dr. Sam Wilson",
      specialty: "Dentist",
      qualification: "BDS",
      experience: "5 Years",
      patients: 98,
      rating: 4.5,
    },
    {
      id: 3,
      name: "Dr. Pepper Potts",
      specialty: "Dentist",
      qualification: "BHMS",
      experience: "2 Years",
      patients: 45,
      rating: 4.7,
    },
    {
      id: 4,
      name: "Dr. Tony Stark",
      specialty: "Dentist",
      qualification: "MDS",
      experience: "4 Years",
      patients: 87,
      rating: 4.9,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-500">Manage appointments and doctors</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full h-10 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary sm:w-64"
                />
              </div>

              <Link
                href="/admin/doctors/create"
                className="flex items-center justify-center h-10 px-4 text-white rounded-md bg-primary hover:bg-primary/90"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Doctor
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 mr-4 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Appointments</p>
                  <p className="text-2xl font-bold">248</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 mr-4 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Confirmed</p>
                  <p className="text-2xl font-bold">182</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 mr-4 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold">42</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 mr-4 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cancelled</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "appointments"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("appointments")}
            >
              Appointments
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "doctors" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("doctors")}
            >
              Doctors
            </button>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm">
            {activeTab === "appointments" ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left bg-gray-50">
                      <th className="p-4 text-sm font-medium text-gray-500">ID</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Patient</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Doctor</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Date</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Time</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Type</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Status</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="p-4 text-sm">#{appointment.id}</td>
                        <td className="p-4 text-sm font-medium">{appointment.patient}</td>
                        <td className="p-4 text-sm">{appointment.doctor}</td>
                        <td className="p-4 text-sm">{appointment.date}</td>
                        <td className="p-4 text-sm">{appointment.time}</td>
                        <td className="p-4 text-sm">{appointment.type}</td>
                        <td className="p-4 text-sm">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              appointment.status === "Confirmed"
                                ? "bg-green-100 text-green-800"
                                : appointment.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm">
                          <button className="p-1 text-gray-500 rounded-full hover:bg-gray-100">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left bg-gray-50">
                      <th className="p-4 text-sm font-medium text-gray-500">ID</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Name</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Specialty</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Qualification</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Experience</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Patients</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Rating</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {doctors.map((doctor) => (
                      <tr key={doctor.id}>
                        <td className="p-4 text-sm">#{doctor.id}</td>
                        <td className="p-4 text-sm font-medium">{doctor.name}</td>
                        <td className="p-4 text-sm">{doctor.specialty}</td>
                        <td className="p-4 text-sm">{doctor.qualification}</td>
                        <td className="p-4 text-sm">{doctor.experience}</td>
                        <td className="p-4 text-sm">{doctor.patients}</td>
                        <td className="p-4 text-sm">{doctor.rating}</td>
                        <td className="p-4 text-sm">
                          <button className="p-1 text-gray-500 rounded-full hover:bg-gray-100">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

