import Link from "next/link"
import { CheckCircle, Calendar, Clock, MapPin, Video } from "lucide-react"

export default function AppointmentSuccess() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center mb-6">
            <CheckCircle className="w-16 h-16 mb-4 text-green-500" />
            <h1 className="text-2xl font-bold text-center">Appointment Confirmed!</h1>
            <p className="text-center text-gray-500">Your appointment has been successfully booked.</p>
          </div>

          <div className="p-4 mb-6 bg-gray-50 rounded-md">
            <h2 className="mb-4 text-lg font-medium">Appointment Details</h2>

            <div className="space-y-3">
              <div className="flex">
                <Calendar className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">Thursday, 22 December 2022</p>
                </div>
              </div>

              <div className="flex">
                <Clock className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">9:30 AM</p>
                </div>
              </div>

              <div className="flex">
                <Video className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Appointment Type</p>
                  <p className="font-medium">Video Consultation</p>
                </div>
              </div>

              <div className="flex">
                <MapPin className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">MedicareHeart Institute, Okhla Road</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 mb-6 border rounded-md">
            <h2 className="mb-2 text-lg font-medium">Dr. Jane Doe, MBBS</h2>
            <p className="mb-4 text-sm text-gray-500">Dentist • 5 Years Experience</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 mr-3 overflow-hidden rounded-full">
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Dr. Jane Doe"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Patient</p>
                  <p className="text-sm text-gray-500">John Smith</p>
                </div>
              </div>
              <Link href="/doctors/jane-doe" className="text-sm text-primary hover:underline">
                View Profile
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/appointments"
              className="block w-full py-2 text-center text-white rounded-md bg-primary hover:bg-primary/90"
            >
              View My Appointments
            </Link>

            <Link
              href="/"
              className="block w-full py-2 text-center text-primary bg-white border border-primary rounded-md hover:bg-primary/5"
            >
              Back to Home
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">A confirmation email has been sent to your email address.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

