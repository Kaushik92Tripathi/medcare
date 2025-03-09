import Link from "next/link"
import { Star, MapPin, Phone, Mail, Calendar, Clock } from "lucide-react"

export default function DoctorProfile({ params }: { params: { slug: string } }) {
  // In a real app, you would fetch doctor data based on the slug
  const doctor = {
    id: 1,
    name: "Dr. Jane Doe",
    qualification: "MBBS, MD",
    specialty: "Dentist",
    experience: "5 Years",
    rating: 4.8,
    reviews: 124,
    about:
      "Dr. Jane Doe is a highly skilled dentist with over 5 years of experience. She specializes in cosmetic dentistry, dental implants, and general dental care. She is known for her gentle approach and commitment to patient comfort.",
    education: [
      { degree: "MBBS", institution: "Harvard Medical School", year: "2012-2018" },
      { degree: "MD in Dentistry", institution: "Johns Hopkins University", year: "2018-2020" },
    ],
    specializations: ["Cosmetic Dentistry", "Dental Implants", "Root Canal Treatment", "Teeth Whitening"],
    location: "MedicareHeart Institute, Okhla Road, New Delhi",
    contact: {
      phone: "+91 98765 43210",
      email: "jane.doe@medcare.com",
    },
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      hours: "9:00 AM - 5:00 PM",
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Doctor Profile Card */}
          <div className="md:col-span-1">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 mb-4 overflow-hidden rounded-full">
                  <img
                    src="/placeholder.svg?height=128&width=128"
                    alt={doctor.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h1 className="mb-1 text-xl font-bold">{doctor.name}</h1>
                <p className="mb-2 text-sm text-gray-500">{doctor.qualification}</p>
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.floor(doctor.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {doctor.rating} ({doctor.reviews} reviews)
                  </span>
                </div>

                <Link
                  href={`/appointments/book?doctor=${params.slug}`}
                  className="w-full py-2 mb-4 text-center text-white rounded-md bg-primary hover:bg-primary/90"
                >
                  Book Appointment
                </Link>

                <div className="w-full pt-4 mt-4 border-t">
                  <div className="flex items-start mb-3">
                    <MapPin className="w-5 h-5 mr-2 text-gray-500 shrink-0" />
                    <p className="text-sm text-gray-600">{doctor.location}</p>
                  </div>
                  <div className="flex items-center mb-3">
                    <Phone className="w-5 h-5 mr-2 text-gray-500" />
                    <p className="text-sm text-gray-600">{doctor.contact.phone}</p>
                  </div>
                  <div className="flex items-center mb-3">
                    <Mail className="w-5 h-5 mr-2 text-gray-500" />
                    <p className="text-sm text-gray-600">{doctor.contact.email}</p>
                  </div>
                  <div className="flex items-center mb-3">
                    <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                    <p className="text-sm text-gray-600">{doctor.availability.days.join(", ")}</p>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gray-500" />
                    <p className="text-sm text-gray-600">{doctor.availability.hours}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Details */}
          <div className="md:col-span-2">
            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-xl font-bold">About</h2>
              <p className="text-gray-600">{doctor.about}</p>
            </div>

            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Education</h2>
              <div className="space-y-3">
                {doctor.education.map((edu, index) => (
                  <div key={index} className="pb-3 border-b last:border-0 last:pb-0">
                    <h3 className="font-medium">{edu.degree}</h3>
                    <p className="text-sm text-gray-500">
                      {edu.institution} • {edu.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Specializations</h2>
              <div className="flex flex-wrap gap-2">
                {doctor.specializations.map((spec, index) => (
                  <span key={index} className="px-3 py-1 text-sm bg-gray-100 rounded-full text-primary">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Patient Reviews</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((review) => (
                  <div key={review} className="pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 mr-3 overflow-hidden rounded-full">
                        <img
                          src={`/placeholder.svg?height=40&width=40&text=P${review}`}
                          alt="Patient"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">Patient {review}</h3>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= 5 - (review % 2) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="ml-auto text-sm text-gray-500">2 weeks ago</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {review === 1
                        ? "Dr. Jane is an excellent dentist. She was very gentle and explained everything clearly. Highly recommend!"
                        : review === 2
                          ? "Great experience with Dr. Jane. She was thorough and professional. The clinic is also very clean and modern."
                          : "Dr. Jane made my dental visit comfortable and stress-free. She has a great bedside manner and is very skilled."}
                    </p>
                  </div>
                ))}
              </div>
              <button className="w-full py-2 mt-4 text-sm text-primary bg-white border border-primary rounded-md hover:bg-primary/5">
                View All Reviews
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

